from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from backend.database import get_db
from backend.models import Notification
from backend.schemas import NotificationSchema

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationSchema])
async def get_user_notifications(
    user_id: int = Query(1, description="User ID"),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves notification feed for a user."""
    stmt = select(Notification).where(Notification.user_id == user_id).order_by(Notification.sent_at.desc())
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    return [NotificationSchema.model_validate(n) for n in notifications]

@router.post("/{id}/read")
async def mark_notification_read(id: int, db: AsyncSession = Depends(get_db)):
    """Marks a notification as read."""
    n = await db.get(Notification, id)
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found.")
    n.is_read = True
    await db.commit()
    return {"message": "Notification marked as read."}
