import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LANDLENS Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database Settings
    # SQLite async default for zero-config hackathon demo, configurable for Postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./landlens.db")
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "landlens_hackathon_secret_key_2026_super_secure")
    DEMO_OTP: str = "123456"
    
    # External APIs
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    MAPBOX_ACCESS_TOKEN: str = os.getenv("MAPBOX_ACCESS_TOKEN", "")
    
    # Uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", "uploads")
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set = {".pdf", ".png", ".jpg", ".jpeg"}

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
