import asyncio
from backend.database import AsyncSessionLocal, engine, Base
from backend.seed import seed_demo_data
from backend.routers.grievances import get_grievance_detail
from backend.routers.officer import get_officer_cases, submit_officer_action
from backend.routers.lands import locate_land_and_jurisdiction
from backend.schemas import OfficerActionCreateRequest, OfficerActionType

async def test_backend():
    print("=== TESTING LANDLENS BACKEND WORKFLOW ===")
    
    # 1. Init DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # 2. Seed Data
    await seed_demo_data()
    print("1. Seed data loaded successfully.")
    
    # 3. Test Land Locate & Jurisdiction Router
    async with AsyncSessionLocal() as db:
        loc_res = await locate_land_and_jurisdiction("Chennai", "Ambattur", "Demo Village", db)
        print(f"2. Located Jurisdiction: {loc_res['jurisdiction']['officer_name']} ({loc_res['jurisdiction']['officer_designation']})")
        assert len(loc_res["land_records"]) > 0, "Land records should not be empty!"
        
        # 4. Fetch GL-1024 Case
        g_detail = await get_grievance_detail("GL-1024", db)
        print(f"3. Fetched Case GL-1024: Status={g_detail.status}, Priority={g_detail.priority}")
        assert g_detail.case_code == "GL-1024"
        assert len(g_detail.ai_findings) > 0, "AI findings should be attached to GL-1024!"
        
        finding = g_detail.ai_findings[0]
        print(f"4. AI Discrepancy Found: {finding.discrepancies_json[0].field} (Ref: {finding.discrepancies_json[0].reference_value} vs Sub: {finding.discrepancies_json[0].submitted_value})")
        
        # 5. Test Officer Action Workflow
        action_req = OfficerActionCreateRequest(
            action=OfficerActionType.REQUEST_ADDITIONAL_DOCUMENTS,
            remarks="Please provide the registration document for verification."
        )
        updated_g = await submit_officer_action(g_detail.id, action_req, officer_id=1, db=db)
        print(f"5. Officer Action Executed: New Status={updated_g.status}")
        assert updated_g.status == "ADDITIONAL_DOCUMENTS_REQUIRED" or updated_g.status == GrievanceStatus.ADDITIONAL_DOCUMENTS_REQUIRED
        assert len(updated_g.officer_actions) > 0

    print("=== ALL BACKEND TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    asyncio.run(test_backend())
