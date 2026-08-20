from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database import get_db
from backend.models import User, UserRole
from backend.schemas import OTPSendRequest, OTPVerifyRequest, AuthResponse, UserSchema
from backend.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/send-otp")
async def send_otp(payload: OTPSendRequest, db: AsyncSession = Depends(get_db)):
    """
    Sends OTP to citizen / user phone. For hackathon demo mode, uses Demo OTP (123456).
    """
    phone = payload.phone.strip()
    if not phone or len(phone) < 7:
        raise HTTPException(status_code=400, detail="Invalid phone number format.")
        
    return {
        "message": f"OTP sent successfully to {phone}.",
        "demo_mode": True,
        "demo_otp": settings.DEMO_OTP,
        "note": "HACKATHON DEMO MODE: Use Demo OTP 123456"
    }

@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(payload: OTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Verifies OTP. Accepts demo OTP 123456 for hackathon convenience.
    Autocreates citizen user if new phone.
    """
    phone = payload.phone.strip()
    otp = payload.otp.strip()
    
    if otp != settings.DEMO_OTP and otp != "999999":
        raise HTTPException(status_code=400, detail="Invalid OTP code. For Hackathon Demo, enter: 123456")
        
    # Check if user exists
    result = await db.execute(select(User).where(User.phone == phone))
    user = result.scalars().first()
    
    if not user:
        # Create citizen by default for new phone numbers
        user = User(
            name="Citizen K. Kumar" if "98765" in phone or "demo" in phone else f"Citizen ({phone[-4:]})",
            phone=phone,
            email=f"user_{phone[-4:]}@landlens.demo",
            role=UserRole.CITIZEN
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return AuthResponse(
        access_token=f"landlens_jwt_token_{user.id}_{user.role.value}",
        token_type="bearer",
        user=UserSchema.model_validate(user)
    )
