import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.database import engine, Base
from backend.routers import auth, lands, grievances, documents, ai, officer, admin, notifications
from backend.seed import seed_demo_data

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="LANDLENS: Citizen-Centric Land Record Verification & Grievance Resolution Platform API",
    openapi_url="/api/openapi.json",
    docs_url="/docs"
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded document files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(lands.router, prefix=settings.API_PREFIX)
app.include_router(grievances.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(officer.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
async def startup_event():
    """Initializes database tables and seeds demo dataset on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Run seed script
    await seed_demo_data()

@app.get("/")
async def root():
    return {
        "platform": "LANDLENS",
        "tagline": "Citizen-Centric Land Record Verification & Grievance Resolution Platform",
        "version": settings.VERSION,
        "docs": "/docs",
        "reference_case": "GL-1024 (Survey No 142/3B vs 142/3C)"
    }
