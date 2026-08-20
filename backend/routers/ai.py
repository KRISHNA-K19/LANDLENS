from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.database import get_db
from backend.models import Grievance, Document, AIFinding, GrievanceStatus, CaseStatusHistory, LandRecord
from backend.schemas import AIFindingSchema, DiscrepancyItem
from backend.services.ai_engine import ai_engine
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/grievances", tags=["AI Investigation Engine"])

@router.post("/{id}/analyze", response_model=AIFindingSchema)
async def analyze_grievance_evidence(
    id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Executes AI Investigation Engine (Document OCR/Extraction + Deterministic Field Comparison + Explainable Findings).
    """
    stmt = select(Grievance).options(
        selectinload(Grievance.land_record),
        selectinload(Grievance.documents)
    ).where(Grievance.id == id)
    
    result = await db.execute(stmt)
    grievance = result.scalars().first()
    
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance case not found.")

    doc = grievance.documents[-1] if grievance.documents else None
    file_path = doc.file_path if doc else ""

    ref_dict = {
        "survey_number": grievance.land_record.survey_number,
        "patta_number": grievance.land_record.patta_number,
        "owner_name": grievance.land_record.owner_name,
        "extent_acres": grievance.land_record.extent_acres,
        "village": grievance.land_record.village,
        "taluk": grievance.land_record.taluk,
        "district": grievance.land_record.district
    }

    # Execute Analysis
    extracted, discrepancies, summary, confidence = ai_engine.analyze_document_with_fallback(
        file_path=file_path,
        reference_record=ref_dict,
        case_code=grievance.case_code
    )

    finding = AIFinding(
        grievance_id=grievance.id,
        document_id=doc.id if doc else None,
        status="COMPLETED",
        confidence_summary=confidence,
        summary_text=summary,
        raw_extraction_json=extracted,
        discrepancies_json=discrepancies
    )
    db.add(finding)
    
    # Update Case Status to AI_ANALYSIS_COMPLETED & UNDER_REVIEW
    old_status = grievance.status
    grievance.status = GrievanceStatus.UNDER_REVIEW
    
    hist = CaseStatusHistory(
        grievance_id=grievance.id,
        previous_status=old_status,
        new_status=GrievanceStatus.UNDER_REVIEW,
        changed_by_name="LANDLENS AI Investigation Engine",
        changed_by_role="AI_ENGINE",
        remarks="AI document extraction and advisory discrepancy analysis completed. Case ready for Officer review."
    )
    db.add(hist)
    
    await db.commit()
    await db.refresh(finding)

    await audit_service.log_event(
        db,
        actor_name="LANDLENS AI Engine",
        actor_role="SYSTEM_AI",
        action="AI_ANALYSIS_COMPLETED",
        case_code=grievance.case_code,
        metadata={"discrepancies_found": len(discrepancies)}
    )

    items = [DiscrepancyItem(**item) for item in discrepancies]
    return AIFindingSchema(
        id=finding.id,
        grievance_id=finding.grievance_id,
        document_id=finding.document_id,
        status=finding.status,
        confidence_summary=finding.confidence_summary,
        summary_text=finding.summary_text,
        raw_extraction_json=finding.raw_extraction_json,
        discrepancies_json=items,
        created_at=finding.created_at
    )
