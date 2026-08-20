import logging
from sqlalchemy.ext.asyncio import AsyncSession
from backend.config import settings
from backend.models import Notification, NotificationChannel

logger = logging.getLogger("notification_service")

class NotificationService:
    async def send_notification(
        self,
        db: AsyncSession,
        user_id: int,
        phone: str,
        title: str,
        message: str
    ) -> Notification:
        """
        Sends SMS via Twilio if available, and unconditionally stores in-app notification feed item.
        """
        sms_sent = False

        # Attempt Twilio SMS delivery if credentials exist
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                from twilio.rest import Client
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                from_number = settings.TWILIO_PHONE_NUMBER or "+18449912899"
                
                # Format phone number for international format if needed
                formatted_phone = phone if phone.startswith("+") else f"+91{phone}"
                
                client.messages.create(
                    body=f"LANDLENS Alert: {title}\n{message}",
                    from_=from_number,
                    to=formatted_phone
                )
                sms_sent = True
                logger.info(f"Twilio SMS sent to {formatted_phone}")
            except Exception as e:
                logger.warning(f"Twilio SMS sending failed for {phone}: {e}. Falling back to In-App Notification.")

        channel = NotificationChannel.BOTH if sms_sent else NotificationChannel.IN_APP

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            channel=channel,
            is_read=False
        )
        db.add(notification)
        await db.commit()
        await db.refresh(notification)

        return notification

notification_service = NotificationService()
