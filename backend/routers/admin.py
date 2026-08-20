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
