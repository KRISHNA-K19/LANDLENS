from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from backend.database import get_db
from backend.schemas import LandRecordSchema, JurisdictionSchema
from backend.services.record_service import record_service
from backend.services.jurisdiction_router import jurisdiction_router

router = APIRouter(prefix="/lands", tags=["Land Reference Data"])

@router.get("", response_model=List[LandRecordSchema])
async def list_lands(
    q: Optional[str] = Query(None, description="Search by Survey No, Patta No, Owner, or Village"),
    district: Optional[str] = Query(None),
    taluk: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves demo reference land records.
    """
    if district and taluk and village:
        records = await record_service.get_records_by_location(db, district, taluk, village)
    elif q:
        records = await record_service.search_records(db, q)
    else:
        records = await record_service.search_records(db, "")
        
    return [LandRecordSchema.model_validate(r) for r in records]

@router.get("/{id}", response_model=LandRecordSchema)
async def get_land_detail(id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieves specific reference land record by ID.
    """
    record = await record_service.get_record_by_id(db, id)
    if not record:
        raise HTTPException(status_code=404, detail="Land record reference not found.")
    return LandRecordSchema.model_validate(record)

@router.get("/locate/by-location")
async def locate_land_and_jurisdiction(
    district: str = Query(...),
    taluk: str = Query(...),
    village: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Locates reference land records and identifies assigned Jurisdiction Officer for location.
    """
    records = await record_service.get_records_by_location(db, district, taluk, village)
    jur = await jurisdiction_router.route_by_administrative_unit(db, district, taluk, village)
    
    officer_name = jur.officer.user.name if (jur and jur.officer and jur.officer.user) else "Unassigned / General Officer"
    officer_designation = jur.officer.designation if (jur and jur.officer) else "Revenue Officer"
    
    return {
        "notice": "State land registries maintain final legal authority. LANDLENS operates as an intelligent civil verification layer.",
        "district": district,
        "taluk": taluk,
        "village": village,
        "jurisdiction": {
            "id": jur.id if jur else None,
            "district": jur.district if jur else district,
            "taluk": jur.taluk if jur else taluk,
            "village": jur.village if jur else village,
            "officer_name": officer_name,
            "officer_designation": officer_designation
        },
        "land_records": [LandRecordSchema.model_validate(r) for r in records]
    }
