from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
import datetime

from backend.database import get_db
from backend.models import (
    Grievance, Officer, OfficerAction, OfficerActionType, GrievanceStatus,
    CaseStatusHistory, User, Jurisdiction
)
from backend.schemas import (
    GrievanceSummarySchema, GrievanceDetailSchema, OfficerActionCreateRequest,
    OfficerActionSchema
)
from backend.routers.grievances import format_grievance_detail
from backend.services.sla_engine import sla_engine
from backend.services.notification_service import notification_service
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/officer", tags=["Officer Portal"])

@router.get("/cases", response_model=List[GrievanceSummarySchema])
async def get_officer_cases(
    officer_id: Optional[int] = Query(1, description="Officer ID"),
    status: Optional[GrievanceStatus] = Query(None),
    priority: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves officer's assigned case queue with status and priority filtering.
    """
    stmt = select(Grievance).options(
        selectinload(Grievance.citizen),
        selectinload(Grievance.land_record),
        selectinload(Grievance.jurisdiction)
    )
    
    if officer_id:
        stmt = stmt.join(Jurisdiction).where(Jurisdiction.officer_id == officer_id)
        
    if status:
        stmt = stmt.where(Grievance.status == status)
    if priority:
        stmt = stmt.where(Grievance.priority == priority)

    stmt = stmt.order_by(Grievance.updated_at.desc())
    result = await db.execute(stmt)
    cases = result.scalars().all()

    summaries = []
    for g in cases:
        delta, is_breached, _ = sla_engine.get_sla_status(g.sla_deadline)
        summaries.append(GrievanceSummarySchema(
            id=g.id,
            case_code=g.case_code,
            citizen_name=g.citizen.name if g.citizen else "Citizen",
            citizen_phone=g.citizen.phone if g.citizen else "",
            village=g.land_record.village if g.land_record else "",
            taluk=g.land_record.taluk if g.land_record else "",
            district=g.land_record.district if g.land_record else "",
            survey_number=g.land_record.survey_number if g.land_record else "",
            patta_number=g.land_record.patta_number if g.land_record else "",
            category=g.category,
            status=g.status,
            priority=g.priority,
            sla_remaining_seconds=delta,
            is_sla_breached=is_breached,
            created_at=g.created_at
        ))
    return summaries

@router.get("/cases/{id}", response_model=GrievanceDetailSchema)
async def get_officer_case_detail(id: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieves 3-column case review details for an assigned officer.
    """
    stmt = select(Grievance).options(
        selectinload(Grievance.citizen),
        selectinload(Grievance.land_record),
        selectinload(Grievance.jurisdiction).selectinload(Jurisdiction.officer).selectinload(Officer.user),
        selectinload(Grievance.documents),
        selectinload(Grievance.ai_findings),
        selectinload(Grievance.officer_actions).selectinload(OfficerAction.officer).selectinload(Officer.user),
        selectinload(Grievance.status_history)
    )
    if str(id).isdigit():
        stmt = stmt.where(Grievance.id == int(id))
    else:
        stmt = stmt.where(Grievance.case_code == str(id))

    result = await db.execute(stmt)
    g = result.scalars().first()
    if not g:
        raise HTTPException(status_code=404, detail="Case not found.")

    return await format_grievance_detail(g)

@router.post("/cases/{id}/action", response_model=GrievanceDetailSchema)
async def submit_officer_action(
    id: str,
    payload: OfficerActionCreateRequest,
    officer_id: int = Query(1, description="Officer ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Records Officer investigation decision (RESOLVE, REQUEST_ADDITIONAL_DOCUMENTS, ESCALATE).
    Updates case status, notifies citizen, and appends audit record.
    """
    stmt = select(Grievance).options(
        selectinload(Grievance.citizen),
        selectinload(Grievance.land_record),
        selectinload(Grievance.jurisdiction).selectinload(Jurisdiction.officer).selectinload(Officer.user),
        selectinload(Grievance.documents),
        selectinload(Grievance.ai_findings),
        selectinload(Grievance.officer_actions),
        selectinload(Grievance.status_history)
    )
    if str(id).isdigit():
        stmt = stmt.where(Grievance.id == int(id))
    else:
        stmt = stmt.where(Grievance.case_code == str(id))
    
    result = await db.execute(stmt)
    grievance = result.scalars().first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance case not found.")

    officer = await db.get(Officer, officer_id)
    if not officer:
        res_off = await db.execute(select(Officer).options(selectinload(Officer.user)))
        officer = res_off.scalars().first()

    # Determine new status from action
    old_status = grievance.status
    if payload.action == OfficerActionType.RESOLVE:
        new_status = GrievanceStatus.RESOLVED
        notification_title = f"Grievance Resolved ({grievance.case_code})"
        notification_msg = f"Your grievance {grievance.case_code} has been marked as RESOLVED by the Jurisdiction Officer. Remarks: {payload.remarks}"
    elif payload.action == OfficerActionType.REQUEST_ADDITIONAL_DOCUMENTS:
        new_status = GrievanceStatus.ADDITIONAL_DOCUMENTS_REQUIRED
        notification_title = f"Action Required ({grievance.case_code})"
        notification_msg = f"LANDLENS: Your grievance {grievance.case_code} requires additional documentation. Officer Remarks: {payload.remarks}"
    elif payload.action == OfficerActionType.ESCALATE:
        new_status = GrievanceStatus.ESCALATED
        notification_title = f"Case Escalated ({grievance.case_code})"
        notification_msg = f"Your grievance {grievance.case_code} has been escalated to District Revenue Authorities for specialized review."
    else:
        new_status = old_status
        notification_title = f"Officer Update ({grievance.case_code})"
        notification_msg = f"Officer remark added to case {grievance.case_code}: {payload.remarks}"

    grievance.status = new_status
    grievance.updated_at = datetime.datetime.utcnow()

    # Record Officer Action
    act = OfficerAction(
        grievance_id=grievance.id,
        officer_id=officer.id if officer else 1,
        action=payload.action,
        remarks=payload.remarks
    )
    db.add(act)

    # Record Status History
    hist = CaseStatusHistory(
        grievance_id=grievance.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by_name=officer.user.name if (officer and officer.user) else "Officer A",
        changed_by_role="OFFICER",
        remarks=payload.remarks
    )
    db.add(hist)
    
    await db.commit()

    # Send Notification to Citizen
    if grievance.citizen:
        await notification_service.send_notification(
            db,
            user_id=grievance.citizen.id,
            phone=grievance.citizen.phone,
            title=notification_title,
            message=notification_msg
        )

    # Log Immutable Audit Trail
    await audit_service.log_event(
        db,
        actor_name=officer.user.name if (officer and officer.user) else "Officer A",
        actor_role="OFFICER",
        action=f"OFFICER_ACTION_{payload.action.value}",
        actor_id=officer.user_id if officer else 2,
        case_code=grievance.case_code,
        metadata={"action": payload.action.value, "remarks": payload.remarks}
    )

    return await format_grievance_detail(grievance)
