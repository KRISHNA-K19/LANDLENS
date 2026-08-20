import os
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database import AsyncSessionLocal
from backend.models import (
    User, Officer, Jurisdiction, LandRecord, Grievance, Document,
    AIFinding, OfficerAction, Notification, AuditLog, CaseStatusHistory,
    UserRole, GrievanceStatus, GrievanceCategory, PriorityLevel, OfficerActionType
)
from backend.services.sla_engine import sla_engine
from backend.config import settings

async def seed_demo_data():
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        existing_users = await db.execute(select(User))
        if existing_users.scalars().first():
            return # Data already seeded

        print("[SEED] Initializing LANDLENS Reference Data Repository...")

        # 1. Create Core Users
        citizen_user = User(
            name="K. Kumar",
            phone="9876543210",
            email="citizen@landlens.gov.in",
            role=UserRole.CITIZEN
        )
        officer_user_a = User(
            name="Officer A (Tahsildar)",
            phone="9876543211",
            email="officer@landlens.gov.in",
            role=UserRole.OFFICER
        )
        officer_user_b = User(
            name="Officer B (VAO)",
            phone="9876543213",
            email="officerb@landlens.gov.in",
            role=UserRole.OFFICER
        )
        officer_user_c = User(
            name="Officer C (Sub-Registrar)",
            phone="9876543214",
            email="officerc@landlens.gov.in",
            role=UserRole.OFFICER
        )
        admin_user = User(
            name="System Admin",
            phone="9876543212",
            email="admin@landlens.gov.in",
            role=UserRole.ADMIN
        )
        
        db.add_all([citizen_user, officer_user_a, officer_user_b, officer_user_c, admin_user])
        await db.commit()
        await db.refresh(officer_user_a)
        await db.refresh(officer_user_b)
        await db.refresh(officer_user_c)

        # 2. Create Officer Profiles
        officer_a = Officer(
            user_id=officer_user_a.id,
            employee_code="REV-AMB-01",
            designation="Tahsildar",
            department="Revenue & Land Records Department"
        )
        officer_b = Officer(
            user_id=officer_user_b.id,
            employee_code="REV-SRP-02",
            designation="Village Administrative Officer (VAO)",
            department="Revenue Department"
        )
        officer_c = Officer(
            user_id=officer_user_c.id,
            employee_code="REG-PON-03",
            designation="Sub-Registrar",
            department="Registration Department"
        )
        db.add_all([officer_a, officer_b, officer_c])
        await db.commit()
        await db.refresh(officer_a)
        await db.refresh(officer_b)
        await db.refresh(officer_c)

        # 3. Create Jurisdictions (3 Districts, 3 Taluks, 5 Villages)
        jur1 = Jurisdiction(
            district="Chennai",
            taluk="Ambattur",
            village="Kaveri Village",
            officer_id=officer_a.id,
            bounds_json={"min_lat": 13.08, "max_lat": 13.15, "min_lng": 80.14, "max_lng": 80.20}
        )
        jur2 = Jurisdiction(
            district="Chennai",
            taluk="Ambattur",
            village="East Village",
            officer_id=officer_a.id,
            bounds_json={"min_lat": 13.09, "max_lat": 13.16, "min_lng": 80.20, "max_lng": 80.25}
        )
        jur3 = Jurisdiction(
            district="Kanchipuram",
            taluk="Sriperumbudur",
            village="West Village",
            officer_id=officer_b.id,
            bounds_json={"min_lat": 12.96, "max_lat": 13.05, "min_lng": 79.90, "max_lng": 80.00}
        )
        jur4 = Jurisdiction(
            district="Kanchipuram",
            taluk="Sriperumbudur",
            village="South Village",
            officer_id=officer_b.id,
            bounds_json={"min_lat": 12.90, "max_lat": 12.97, "min_lng": 79.92, "max_lng": 80.02}
        )
        jur5 = Jurisdiction(
            district="Tiruvallur",
            taluk="Ponneri",
            village="North Village",
            officer_id=officer_c.id,
            bounds_json={"min_lat": 13.30, "max_lat": 13.40, "min_lng": 80.18, "max_lng": 80.28}
        )
        db.add_all([jur1, jur2, jur3, jur4, jur5])
        await db.commit()
        await db.refresh(jur1)
        await db.refresh(jur2)

        # 4. Create 5 Reference Land Records
        lr1 = LandRecord(
            patta_number="PT-10245",
            survey_number="142/3B",
            owner_name="K Kumar",
            extent_acres=1.25,
            village="Kaveri Village",
            taluk="Ambattur",
            district="Chennai",
            jurisdiction_id=jur1.id,
            is_demo_record=True
        )
        lr2 = LandRecord(
            patta_number="PT-88210",
            survey_number="89/1A",
            owner_name="R Sharma",
            extent_acres=2.50,
            village="Kaveri Village",
            taluk="Ambattur",
            district="Chennai",
            jurisdiction_id=jur1.id,
            is_demo_record=True
        )
        lr3 = LandRecord(
            patta_number="PT-30112",
            survey_number="204/5",
            owner_name="M Anbazhagan",
            extent_acres=0.75,
            village="East Village",
            taluk="Ambattur",
            district="Chennai",
            jurisdiction_id=jur2.id,
            is_demo_record=True
        )
        lr4 = LandRecord(
            patta_number="PT-55019",
            survey_number="12/4A",
            owner_name="S Priya",
            extent_acres=3.10,
            village="West Village",
            taluk="Sriperumbudur",
            district="Kanchipuram",
            jurisdiction_id=jur3.id,
            is_demo_record=True
        )
        lr5 = LandRecord(
            patta_number="PT-99401",
            survey_number="310/2C",
            owner_name="V Ramanathan",
            extent_acres=1.80,
            village="North Village",
            taluk="Ponneri",
            district="Tiruvallur",
            jurisdiction_id=jur5.id,
            is_demo_record=True
        )
        db.add_all([lr1, lr2, lr3, lr4, lr5])
        await db.commit()
        await db.refresh(lr1)

        # Create evidence file for GL-1024
        demo_file_name = "survey_142_3c_sale_deed.pdf"
        demo_file_path = os.path.join(settings.UPLOAD_DIR, demo_file_name)
        if not os.path.exists(demo_file_path):
            with open(demo_file_path, "w", encoding="utf-8") as f:
                f.write("""
REGISTERED SALE DEED / LAND TITLE DOCUMENT
--------------------------------------------
Document No: SD/2024/99128
Village: Kaveri Village
Taluk: Ambattur | District: Chennai
Patta Number: PT-10245
Survey Number: 142/3C
Owner / Purchaser Name: K Kumar
Land Extent: 1.25 Acres
Date of Registration: 15-03-2024
--------------------------------------------
""".strip())

        # 5. Create Primary Hackathon Demo Case GL-1024
        _, sla_deadline_1024 = sla_engine.calculate_deadline(PriorityLevel.HIGH)
        g_1024 = Grievance(
            case_code="GL-1024",
            citizen_id=citizen_user.id,
            land_record_id=lr1.id,
            jurisdiction_id=jur1.id,
            category=GrievanceCategory.SURVEY_NUMBER_MISMATCH,
            description="The survey number recorded in my online Patta record shows 142/3B, but my registered sale deed clearly specifies Survey Number 142/3C.",
            status=GrievanceStatus.UNDER_REVIEW,
            priority=PriorityLevel.HIGH,
            sla_hours=24,
            sla_deadline=sla_deadline_1024,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
        )
        db.add(g_1024)
        await db.commit()
        await db.refresh(g_1024)

        # Attach Document for GL-1024
        doc_1024 = Document(
            grievance_id=g_1024.id,
            file_name="survey_142_3c_sale_deed.pdf",
            file_path=demo_file_path,
            file_type="application/pdf",
            file_size=1024 * 4
        )
        db.add(doc_1024)
        await db.commit()
        await db.refresh(doc_1024)

        # Attach AI Finding for GL-1024
        ai_1024 = AIFinding(
            grievance_id=g_1024.id,
            document_id=doc_1024.id,
            status="COMPLETED",
            confidence_summary="HIGH_CONFIDENCE_DISCREPANCY_DETECTED",
            summary_text="Potential survey number discrepancy detected. Reference record lists '142/3B', whereas submitted evidence document contains '142/3C'. Advisory officer verification required.",
            raw_extraction_json={
                "document_type": "Registered Sale Deed / Title Document",
                "survey_number": "142/3C",
                "patta_number": "PT-10245",
                "owner_name": "K Kumar",
                "extent": "1.25 Acres",
                "village": "Kaveri Village",
                "taluk": "Ambattur",
                "district": "Chennai"
            },
            discrepancies_json=[{
                "field": "Survey Number",
                "reference_value": "142/3B",
                "submitted_value": "142/3C",
                "severity": "HIGH",
                "reason": "The survey identifier in the submitted evidence differs from the reference record."
            }]
        )
        db.add(ai_1024)

        # Status History for GL-1024
        h1 = CaseStatusHistory(
            grievance_id=g_1024.id,
            previous_status=None,
            new_status=GrievanceStatus.SUBMITTED,
            changed_by_name="K. Kumar",
            changed_by_role="CITIZEN",
            remarks="Grievance raised with land reference PT-10245.",
            timestamp=g_1024.created_at
        )
        h2 = CaseStatusHistory(
            grievance_id=g_1024.id,
            previous_status=GrievanceStatus.SUBMITTED,
            new_status=GrievanceStatus.ASSIGNED,
            changed_by_name="LANDLENS Router",
            changed_by_role="SYSTEM",
            remarks="Routed to Ambattur Jurisdiction Officer A.",
            timestamp=g_1024.created_at + datetime.timedelta(minutes=2)
        )
        h3 = CaseStatusHistory(
            grievance_id=g_1024.id,
            previous_status=GrievanceStatus.ASSIGNED,
            new_status=GrievanceStatus.UNDER_REVIEW,
            changed_by_name="AI Investigation Engine",
            changed_by_role="SYSTEM_AI",
            remarks="Document extraction complete. Potential Survey Number discrepancy flagged.",
            timestamp=g_1024.created_at + datetime.timedelta(minutes=5)
        )
        db.add_all([h1, h2, h3])

        # Add 4 Additional Seed Grievances
        _, deadline_1025 = sla_engine.calculate_deadline(PriorityLevel.MEDIUM)
        g_1025 = Grievance(
            case_code="GL-1025",
            citizen_id=citizen_user.id,
            land_record_id=lr2.id,
            jurisdiction_id=jur1.id,
            category=GrievanceCategory.EXTENT_AREA_MISMATCH,
            description="Patta record displays 2.50 Acres but physical survey boundary shows 2.35 Acres.",
            status=GrievanceStatus.ASSIGNED,
            priority=PriorityLevel.MEDIUM,
            sla_hours=48,
            sla_deadline=deadline_1025
        )
        
        _, deadline_1026 = sla_engine.calculate_deadline(PriorityLevel.LOW)
        g_1026 = Grievance(
            case_code="GL-1026",
            citizen_id=citizen_user.id,
            land_record_id=lr3.id,
            jurisdiction_id=jur2.id,
            category=GrievanceCategory.RECORD_NOT_UPDATED,
            description="Mutation request submitted 3 months ago is not reflected in online patta.",
            status=GrievanceStatus.SUBMITTED,
            priority=PriorityLevel.LOW,
            sla_hours=72,
            sla_deadline=deadline_1026
        )

        db.add_all([g_1025, g_1026])

        # Notifications & Audit Logs
        n1 = Notification(
            user_id=citizen_user.id,
            title="Grievance GL-1024 Registered",
            message="Your grievance GL-1024 has been assigned to Ambattur Tahsildar (Officer A).",
            channel="BOTH",
            is_read=False
        )
        db.add(n1)

        aud = AuditLog(
            actor_name="K. Kumar",
            actor_role="CITIZEN",
            action="GRIEVANCE_SUBMITTED",
            actor_id=citizen_user.id,
            case_code="GL-1024",
            metadata_json={"survey_number": "142/3B", "submitted_evidence": "survey_142_3c_sale_deed.pdf"}
        )
        db.add(aud)

        await db.commit()
        print("[SEED] LANDLENS reference dataset initialized successfully!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_demo_data())
