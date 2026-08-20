import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models import AuditLog

logger = logging.getLogger("audit_service")

class AuditService:
    async def log_event(
        self,
        db: AsyncSession,
        actor_name: str,
        actor_role: str,
        action: str,
        actor_id: Optional[int] = None,
        case_code: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        """
        Creates an immutable audit log entry for security and regulatory compliance.
        """
        log_entry = AuditLog(
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=action,
            case_code=case_code,
            metadata_json=metadata or {}
        )
        db.add(log_entry)
        await db.commit()
        await db.refresh(log_entry)
        
        logger.info(f"[AUDIT LOG] {actor_role} ({actor_name}) executed: '{action}' on case: {case_code or 'N/A'}")
        return log_entry

audit_service = AuditService()
