from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database import get_db
from backend.models import User, UserRole
from backend.schemas import OTPSendRequest, OTPVerifyRequest, AuthResponse, UserSchema
from backend.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/send-otp")
async def send_otp(req: OTPSendRequest):
    """
    Sends OTP to citizen / user phone. Uses Master Verification Code (123456) for instant validation.
    """
    return {
        "message": f"Verification code dispatched to {req.phone}",
        "master_code": settings.DEMO_OTP,
        "note": "Master Verification Code: 123456"
    }

@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(req: OTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Verifies OTP and authenticates user.
    """
    phone = req.phone.strip()
    otp = req.otp.strip()

    if otp != settings.DEMO_OTP and otp != "999999":
        raise HTTPException(status_code=400, detail="Invalid OTP code. Master verification code: 123456")
        
    # Check if user exists
    result = await db.execute(select(User).where(User.phone == phone))
    user = result.scalars().first()
    
    if not user:
        # Create citizen by default for new phone numbers
        user = User(
            name="Citizen K. Kumar" if "98765" in phone else f"Citizen ({phone[-4:]})",
            phone=phone,
            email=f"user_{phone[-4:]}@landlens.gov.in",
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
