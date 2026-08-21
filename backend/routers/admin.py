from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional

from backend.database import get_db
from backend.models import (
    User, Officer, Jurisdiction, Grievance, AuditLog, GrievanceStatus, UserRole
)
from backend.schemas import (
    UserSchema, JurisdictionSchema, AuditLogSchema, AdminMetricsSchema
)
from backend.services.sla_engine import sla_engine

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/metrics", response_model=AdminMetricsSchema)
async def get_admin_metrics(db: AsyncSession = Depends(get_db)):
    """
    Returns high-level administrative dashboard performance metrics.
    """
    total_cases = (await db.execute(select(func.count(Grievance.id)))).scalar() or 0
    pending = (await db.execute(
        select(func.count(Grievance.id)).where(Grievance.status.in_([GrievanceStatus.SUBMITTED, GrievanceStatus.ASSIGNED]))
    )).scalar() or 0
    under_review = (await db.execute(
        select(func.count(Grievance.id)).where(Grievance.status.in_([GrievanceStatus.UNDER_REVIEW, GrievanceStatus.AI_ANALYSIS_COMPLETED]))
    )).scalar() or 0
    resolved = (await db.execute(
        select(func.count(Grievance.id)).where(Grievance.status == GrievanceStatus.RESOLVED)
    )).scalar() or 0
    escalated = (await db.execute(
        select(func.count(Grievance.id)).where(Grievance.status == GrievanceStatus.ESCALATED)
    )).scalar() or 0
    
    total_citizens = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.CITIZEN)
    )).scalar() or 0
    total_officers = (await db.execute(
        select(func.count(Officer.id))
    )).scalar() or 0

    # Calculate SLA breaches
    all_grievances = (await db.execute(select(Grievance))).scalars().all()
    sla_breached_count = sum(1 for g in all_grievances if sla_engine.get_sla_status(g.sla_deadline)[1] and g.status != GrievanceStatus.RESOLVED)

    return AdminMetricsSchema(
        total_cases=total_cases,
        pending_cases=pending,
        under_review_cases=under_review,
        resolved_cases=resolved,
        escalated_cases=escalated,
        sla_breached_cases=sla_breached_count,
        total_citizens=total_citizens,
        total_officers=total_officers
    )

@router.get("/users", response_model=List[UserSchema])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    """Lists registered users (Citizens, Officers, Admins)."""
    result = await db.execute(select(User).order_by(User.id.asc()))
    return [UserSchema.model_validate(u) for u in result.scalars().all()]

@router.get("/jurisdictions", response_model=List[JurisdictionSchema])
async def get_jurisdictions(db: AsyncSession = Depends(get_db)):
    """Lists jurisdiction mappings with assigned officers."""
    stmt = select(Jurisdiction).options(
        selectinload(Jurisdiction.officer).selectinload(Officer.user)
    )
    result = await db.execute(stmt)
    jurisdictions = result.scalars().all()

    items = []
    for j in jurisdictions:
        off_name = j.officer.user.name if (j.officer and j.officer.user) else "Unassigned"
        off_desig = j.officer.designation if j.officer else "None"
        items.append(JurisdictionSchema(
            id=j.id,
            district=j.district,
            taluk=j.taluk,
            village=j.village,
            officer_name=off_name,
            officer_designation=off_desig
        ))
    return items

@router.get("/audit-logs", response_model=List[AuditLogSchema])
async def get_audit_logs(
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns immutable system audit logs.
    """
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit)
    )
    return [AuditLogSchema.model_validate(log) for log in result.scalars().all()]

@router.post("/jurisdictions/assign-officer")
async def assign_officer_to_jurisdiction(
    jurisdiction_id: int = Query(...),
    officer_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Assigns or reassigns a revenue officer to a specific jurisdiction.
    """
    jur = (await db.execute(select(Jurisdiction).where(Jurisdiction.id == jurisdiction_id))).scalars().first()
    if not jur:
        raise HTTPException(status_code=404, detail="Jurisdiction not found.")

    off = (await db.execute(select(Officer).options(selectinload(Officer.user)).where(Officer.id == officer_id))).scalars().first()
    if not off:
        raise HTTPException(status_code=404, detail="Officer not found.")

    jur.officer_id = off.id
    
    # Audit Log
    aud = AuditLog(
        actor_name="System Admin",
        actor_role="ADMIN",
        action="JURISDICTION_OFFICER_ASSIGNED",
        metadata_json={"jurisdiction": f"{jur.village}, {jur.taluk}, {jur.district}", "assigned_officer": off.user.name if off.user else "Officer"}
    )
    db.add(aud)
    await db.commit()
    return {"status": "SUCCESS", "message": f"Assigned {off.user.name if off.user else 'Officer'} to {jur.village} Jurisdiction."}

@router.post("/cases/{case_id}/reassign-officer")
async def reassign_case_officer(
    case_id: str,
    officer_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Manually reassigns a specific grievance case to a designated officer.
    """
    # Lookup grievance by ID or case_code
    if case_id.isdigit():
        g = (await db.execute(select(Grievance).where(Grievance.id == int(case_id)))).scalars().first()
    else:
        g = (await db.execute(select(Grievance).where(Grievance.case_code == case_id))).scalars().first()

    if not g:
        raise HTTPException(status_code=404, detail="Grievance case not found.")

    off = (await db.execute(select(Officer).options(selectinload(Officer.user)).where(Officer.id == officer_id))).scalars().first()
    if not off:
        raise HTTPException(status_code=404, detail="Officer not found.")

    # Find or update jurisdiction officer
    jur = (await db.execute(select(Jurisdiction).where(Jurisdiction.id == g.jurisdiction_id))).scalars().first()
    if jur:
        jur.officer_id = off.id

@router.post("/officers")
async def create_officer(
    name: str = Query(...),
    employee_code: str = Query(...),
    designation: str = Query("Tahsildar"),
    district: str = Query("Chennai"),
    taluk: str = Query("Ambattur"),
    village: str = Query("Kaveri Village"),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a new Revenue Officer and provisions an administrative jurisdiction mapping.
    """
    # Create or retrieve user profile
    res_user = await db.execute(select(User).where(User.email == f"{employee_code.lower()}@landlens.gov.in"))
    usr = res_user.scalars().first()
    if not usr:
        usr = User(
            name=name,
            phone="9876543210",
            email=f"{employee_code.lower()}@landlens.gov.in",
            role=UserRole.OFFICER
        )
        db.add(usr)
        await db.commit()
        await db.refresh(usr)

    # Create Officer record
    res_off = await db.execute(select(Officer).where(Officer.employee_code == employee_code))
    off = res_off.scalars().first()
    if not off:
        off = Officer(
            user_id=usr.id,
            employee_code=employee_code,
            designation=designation
        )
        db.add(off)
        await db.commit()
        await db.refresh(off)

    # Create or update Jurisdiction mapping
    res_jur = await db.execute(
        select(Jurisdiction).where(
            Jurisdiction.district == district,
            Jurisdiction.taluk == taluk,
            Jurisdiction.village == village
        )
    )
    jur = res_jur.scalars().first()
    if not jur:
        jur = Jurisdiction(
            district=district,
            taluk=taluk,
            village=village,
            officer_id=off.id
        )
        db.add(jur)
    else:
        jur.officer_id = off.id
    await db.commit()

    # Audit Log
    aud = AuditLog(
        actor_name="System Admin",
        actor_role="ADMIN",
        action="OFFICER_CREATED",
        metadata_json={"officer_name": name, "employee_code": employee_code, "jurisdiction": f"{village}, {taluk}, {district}"}
    )
    db.add(aud)
    await db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Officer '{name}' ({employee_code}) created and assigned to {village}, {taluk}, {district}.",
        "officer": {
            "id": off.id,
            "name": name,
            "code": employee_code,
            "designation": designation,
            "jurisdiction": f"{district} ({taluk} - {village})"
        }
    }

