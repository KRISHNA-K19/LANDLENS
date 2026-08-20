from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from backend.models import Jurisdiction, Officer, User

class JurisdictionRouter:
    async def route_by_administrative_unit(
        self, db: AsyncSession, district: str, taluk: str, village: str
    ) -> Optional[Jurisdiction]:
        """
        Locates jurisdiction by District, Taluk, Village administrative hierarchy.
        """
        stmt = (
            select(Jurisdiction)
            .options(selectinload(Jurisdiction.officer).selectinload(Officer.user))
            .where(
                Jurisdiction.district.ilike(f"%{district.strip()}%"),
                Jurisdiction.taluk.ilike(f"%{taluk.strip()}%"),
                Jurisdiction.village.ilike(f"%{village.strip()}%")
            )
        )
        result = await db.execute(stmt)
        jur = result.scalars().first()
        
        # Fallback to District & Taluk level if exact village match not found
        if not jur:
            stmt_fallback = (
                select(Jurisdiction)
                .options(selectinload(Jurisdiction.officer).selectinload(Officer.user))
                .where(
                    Jurisdiction.district.ilike(f"%{district.strip()}%"),
                    Jurisdiction.taluk.ilike(f"%{taluk.strip()}%")
                )
            )
            res_fallback = await db.execute(stmt_fallback)
            jur = res_fallback.scalars().first()
            
        return jur

    async def route_by_coordinates(
        self, db: AsyncSession, lat: float, lng: float
    ) -> Optional[Jurisdiction]:
        """
        Locates jurisdiction from spatial coordinates (with demo bounding boxes or fallback to default primary jurisdiction).
        """
        # Search all jurisdictions and check if lat/lng is inside bounds
        stmt = select(Jurisdiction).options(selectinload(Jurisdiction.officer).selectinload(Officer.user))
        result = await db.execute(stmt)
        jurisdictions = result.scalars().all()
        
        for jur in jurisdictions:
            if jur.bounds_json:
                min_lat = jur.bounds_json.get("min_lat", -90)
                max_lat = jur.bounds_json.get("max_lat", 90)
                min_lng = jur.bounds_json.get("min_lng", -180)
                max_lng = jur.bounds_json.get("max_lng", 180)
                if min_lat <= lat <= max_lat and min_lng <= lng <= max_lng:
                    return jur

        # Fallback to first available jurisdiction if coordinate lookup is generic
        return jurisdictions[0] if jurisdictions else None

jurisdiction_router = JurisdictionRouter()
