from abc import ABC, abstractmethod
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models import LandRecord, Jurisdiction

class RecordReferenceService(ABC):
    @abstractmethod
    async def get_record_by_id(self, db: AsyncSession, record_id: int) -> Optional[LandRecord]:
        pass

    @abstractmethod
    async def get_records_by_location(
        self, db: AsyncSession, district: str, taluk: str, village: str
    ) -> List[LandRecord]:
        pass

    @abstractmethod
    async def search_records(
        self, db: AsyncSession, query: str
    ) -> List[LandRecord]:
        pass

class DemoRecordProvider(RecordReferenceService):
    """
    Demo Record Provider serving reference land data for hackathon demonstration.
    Explicitly decoupled to allow swapping with an AuthorizedGovernmentAPIProvider in production.
    """
    async def get_record_by_id(self, db: AsyncSession, record_id: int) -> Optional[LandRecord]:
        result = await db.execute(select(LandRecord).where(LandRecord.id == record_id))
        return result.scalars().first()

    async def get_records_by_location(
        self, db: AsyncSession, district: str, taluk: str, village: str
    ) -> List[LandRecord]:
        result = await db.execute(
            select(LandRecord).where(
                LandRecord.district.ilike(f"%{district}%"),
                LandRecord.taluk.ilike(f"%{taluk}%"),
                LandRecord.village.ilike(f"%{village}%")
            )
        )
        return list(result.scalars().all())

    async def search_records(
        self, db: AsyncSession, query: str
    ) -> List[LandRecord]:
        clean_q = query.strip()
        result = await db.execute(
            select(LandRecord).where(
                (LandRecord.survey_number.ilike(f"%{clean_q}%")) |
                (LandRecord.patta_number.ilike(f"%{clean_q}%")) |
                (LandRecord.owner_name.ilike(f"%{clean_q}%")) |
                (LandRecord.village.ilike(f"%{clean_q}%"))
            )
        )
        return list(result.scalars().all())

# Singleton Service Instance
record_service: RecordReferenceService = DemoRecordProvider()
