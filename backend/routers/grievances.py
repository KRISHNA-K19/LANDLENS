from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
import datetime

from backend.database import get_db
from backend.models import (
    Grievance, LandRecord, Jurisdiction, User, GrievanceStatus,
    PriorityLevel, CaseStatusHistory, Officer, OfficerAction
)
from backend.schemas import (
    GrievanceCreateRequest, GrievanceDetailSchema, GrievanceSummarySchema,
    UserSchema, LandRecordSchema, JurisdictionSchema, DocumentSchema,
    AIFindingSchema, OfficerActionSchema, CaseStatusHistorySchema, DiscrepancyItem
)
from backend.services.record_service import record_service
from backend.services.jurisdiction_router import jurisdiction_router
from backend.services.sla_engine import sla_engine
from backend.services.notification_service import notification_service
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/grievances", tags=["Grievances"])

async def format_grievance_detail(g: Grievance) -> GrievanceDetailSchema:
    delta, is_breached, sla_label = sla_engine.get_sla_status(g.sla_deadline)
    
    officer_name = g.jurisdiction.officer.user.name if (g.jurisdiction and g.jurisdiction.officer and g.jurisdiction.officer.user) else "Unassigned Officer"
    officer_desig = g.jurisdiction.officer.designation if (g.jurisdiction and g.jurisdiction.officer) else "Revenue Officer"

    docs = [DocumentSchema.model_validate(d) for d in g.documents]
    
    findings = []
    for f in g.ai_findings:
        discrepancies = [DiscrepancyItem(**item) for item in (f.discrepancies_json or [])]
        findings.append(AIFindingSchema(
            id=f.id,
            grievance_id=f.grievance_id,
            document_id=f.document_id,
            status=f.status,
            confidence_summary=f.confidence_summary,
            summary_text=f.summary_text,
            raw_extraction_json=f.raw_extraction_json,
            discrepancies_json=discrepancies,
            created_at=f.created_at
        ))

    actions = []
    for act in g.officer_actions:
        act_off_name = act.officer.user.name if (act.officer and act.officer.user) else "Jurisdiction Officer"
        act_off_desig = act.officer.designation if act.officer else "Revenue Officer"
        actions.append(OfficerActionSchema(
            id=act.id,
            grievance_id=act.grievance_id,
            officer_id=act.officer_id,
            officer_name=act_off_name,
            officer_designation=act_off_desig,
            action=act.action,
            remarks=act.remarks,
            timestamp=act.timestamp
        ))

    history = [CaseStatusHistorySchema.model_validate(h) for h in g.status_history]

    return GrievanceDetailSchema(
        id=g.id,
        case_code=g.case_code,
        citizen=UserSchema.model_validate(g.citizen),
        land_record=LandRecordSchema.model_validate(g.land_record),
        jurisdiction=JurisdictionSchema(
            id=g.jurisdiction.id,
            district=g.jurisdiction.district,
            taluk=g.jurisdiction.taluk,
            village=g.jurisdiction.village,
            officer_name=officer_name,
            officer_designation=officer_desig
        ),
        category=g.category,
        description=g.description,
        status=g.status,
        priority=g.priority,
        sla_hours=g.sla_hours,
        sla_deadline=g.sla_deadline,
        sla_remaining_seconds=delta,
        is_sla_breached=is_breached,
        created_at=g.created_at,
        updated_at=g.updated_at,
        documents=docs,
        ai_findings=findings,
        officer_actions=actions,
        status_history=history
    )

@router.post("", response_model=GrievanceDetailSchema)
async def submit_grievance(
    payload: GrievanceCreateRequest,
    citizen_id: int = Query(1, description="Citizen User ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits a land record grievance (STEP 7 to 13 of workflow).
    """
    citizen = await db.get(User, citizen_id)
    if not citizen:
        # Default fallback to Citizen K. Kumar
        res = await db.execute(select(User).where(User.role == "CITIZEN"))
        citizen = res.scalars().first()
        if not citizen:
            raise HTTPException(status_code=400, detail="Citizen profile not found.")

    land_record = await record_service.get_record_by_id(db, payload.land_record_id)
    if not land_record:
        raise HTTPException(status_code=404, detail="Selected land reference record not found.")

    # Determine Jurisdiction & Officer
    jur = await jurisdiction_router.route_by_administrative_unit(
        db, land_record.district, land_record.taluk, land_record.village
    )
    if not jur:
        # Create or pick default jurisdiction if needed
        res_jur = await db.execute(select(Jurisdiction))
        jur = res_jur.scalars().first()
        if not jur:
            raise HTTPException(status_code=400, detail="Jurisdiction could not be mapped for this location.")

    # Generate Case ID (e.g. GL-1024 or next increment)
    count_res = await db.execute(select(func.count(Grievance.id)))
    next_num = (count_res.scalar() or 0) + 1024
    case_code = f"GL-{next_num}"

    # Determine Priority based on Category
    if payload.category.value in ["Survey number mismatch", "Owner/Name mismatch"]:
        priority = PriorityLevel.HIGH
    elif payload.category.value in ["Extent/area mismatch", "Record not updated"]:
        priority = PriorityLevel.MEDIUM
    else:
        priority = PriorityLevel.LOW

    sla_hours, sla_deadline = sla_engine.calculate_deadline(priority)

    grievance = Grievance(
        case_code=case_code,
        citizen_id=citizen.id,
        land_record_id=land_record.id,
        jurisdiction_id=jur.id,
        category=payload.category,
        description=payload.description,
        status=GrievanceStatus.SUBMITTED,
        priority=priority,
        sla_hours=sla_hours,
        sla_deadline=sla_deadline
    )
    db.add(grievance)
    await db.commit()
    await db.refresh(grievance)

    # Initial Case History
    hist = CaseStatusHistory(
        grievance_id=grievance.id,
        previous_status=None,
        new_status=GrievanceStatus.SUBMITTED,
        changed_by_name=citizen.name,
        changed_by_role="CITIZEN",
        remarks="Grievance filed by citizen with reference land record."
    )
    db.add(hist)
    await db.commit()

    # Route & Assign Status Update
    grievance.status = GrievanceStatus.ASSIGNED
    hist_assign = CaseStatusHistory(
        grievance_id=grievance.id,
        previous_status=GrievanceStatus.SUBMITTED,
        new_status=GrievanceStatus.ASSIGNED,
        changed_by_name="LANDLENS Jurisdiction Router",
        changed_by_role="SYSTEM",
        remarks=f"Case routed to {jur.district} > {jur.taluk} > {jur.village} jurisdiction officer."
    )
    db.add(hist_assign)
    await db.commit()

    # Send Notification & Audit
    await notification_service.send_notification(
        db,
        user_id=citizen.id,
        phone=citizen.phone,
        title=f"Grievance Submitted ({case_code})",
        message=f"Your grievance {case_code} has been registered and assigned to {jur.village} Jurisdiction Officer."
    )
    
    await audit_service.log_event(
        db,
        actor_name=citizen.name,
        actor_role="CITIZEN",
        action="GRIEVANCE_SUBMITTED",
        actor_id=citizen.id,
        case_code=case_code,
        metadata={"category": payload.category.value, "land_record_id": land_record.id}
    )

    # Fetch full object with relationships
    full_stmt = select(Grievance).options(
        selectinload(Grievance.citizen),
        selectinload(Grievance.land_record),
        selectinload(Grievance.jurisdiction).selectinload(Jurisdiction.officer).selectinload(Officer.user),
        selectinload(Grievance.documents),
        selectinload(Grievance.ai_findings),
        selectinload(Grievance.officer_actions).selectinload(OfficerAction.officer).selectinload(Officer.user),
        selectinload(Grievance.status_history)
    ).where(Grievance.id == grievance.id)
    
    res_full = await db.execute(full_stmt)
    full_g = res_full.scalars().first()

    return await format_grievance_detail(full_g)

@router.get("", response_model=List[GrievanceSummarySchema])
async def list_grievances(
    citizen_id: Optional[int] = Query(None),
    status: Optional[GrievanceStatus] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Lists grievances filtered by citizen or status.
    """
    stmt = select(Grievance).options(
        selectinload(Grievance.citizen),
        selectinload(Grievance.land_record),
        selectinload(Grievance.jurisdiction)
    )
    if citizen_id:
        stmt = stmt.where(Grievance.citizen_id == citizen_id)
    if status:
        stmt = stmt.where(Grievance.status == status)
        
    stmt = stmt.order_by(Grievance.created_at.desc())
    result = await db.execute(stmt)
    items = result.scalars().all()

    summaries = []
    for g in items:
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

@router.get("/{id}", response_model=GrievanceDetailSchema)
async def get_grievance_detail(id: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieves full grievance detail and status timeline by ID or case_code string.
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
        raise HTTPException(status_code=404, detail="Grievance case not found.")

    return await format_grievance_detail(g)
