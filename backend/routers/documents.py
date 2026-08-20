import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models import Grievance, Document
from backend.schemas import DocumentSchema
from backend.config import settings
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/grievances", tags=["Document Uploads"])

@router.post("/{id}/documents", response_model=DocumentSchema)
async def upload_evidence_document(
    id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads supporting evidence document (PDF, PNG, JPG, JPEG) for a grievance.
    """
    grievance = await db.get(Grievance, id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance case not found.")

    # 1. Validate File Extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed extensions: PDF, PNG, JPG, JPEG."
        )

    # 2. Save File
    safe_filename = f"case_{grievance.case_code}_{os.path.basename(file.filename)}"
    dest_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = os.path.getsize(dest_path)
    
    # 3. Check size limit
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        os.remove(dest_path)
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    doc = Document(
        grievance_id=grievance.id,
        file_name=file.filename,
        file_path=dest_path,
        file_type=file.content_type or f"application/{ext.replace('.', '')}",
        file_size=file_size
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    await audit_service.log_event(
        db,
        actor_name=grievance.citizen.name if grievance.citizen else "Citizen",
        actor_role="CITIZEN",
        action="EVIDENCE_DOCUMENT_UPLOADED",
        actor_id=grievance.citizen_id,
        case_code=grievance.case_code,
        metadata={"file_name": file.filename, "file_size": file_size}
    )

    return DocumentSchema.model_validate(doc)
