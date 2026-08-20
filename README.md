# LANDLENS
### Citizen-Centric Land Record Verification & Grievance Resolution Platform

> **Core Principle**: *"AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION."*

Existing government land-record systems remain the authoritative source. LANDLENS provides a citizen-centric verification layer around land-record grievances, bridging citizens, revenue officers, and administration with explainable AI document comparison and transparent SLA tracking.

---

## 🚀 Quick Start & How to Run

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+ (tested on Node v24)
- **npm**: 9+

---

### 2. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy aiosqlite pydantic pydantic-settings python-multipart pypdf
python -m uvicorn backend.main:app --reload --port 8000
```
- **API Docs (Swagger)**: `http://localhost:8000/docs`
- Database tables and seed demo records (including `GL-1024`) are initialized automatically on startup.

---

### 3. Run Frontend (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
- **Web Portal**: `http://localhost:3000`

---

## 🔑 Demo Credentials & Roles

| Role | Name / Title | Phone / Email | Hackathon Demo Access |
| :--- | :--- | :--- | :--- |
| **Citizen** | K. Kumar | `9876543210` / `citizen@demo.landlens` | **Demo OTP**: `123456` |
| **Officer A** | Tahsildar (Ambattur) | `9876543211` / `officer@demo.landlens` | One-click role switcher in Navbar |
| **Officer B** | VAO (Sriperumbudur) | `9876543213` / `officerb@demo.landlens` | Mapped to Kanchipuram jurisdiction |
| **Officer C** | Sub-Registrar (Ponneri) | `9876543214` / `officerc@demo.landlens` | Mapped to Tiruvallur jurisdiction |
| **Admin** | System Admin | `9876543212` / `admin@demo.landlens` | Overview, SLA Breaches & Audit Logs |

---

## 🏆 Primary Hackathon Demonstration Scenario (3–5 Min Walkthrough)

1. **Citizen Portal (`http://localhost:3000/citizen/dashboard`)**:
   - Citizen **K. Kumar** logs in (Demo OTP: `123456`).
   - Clicks **Locate My Land** -> selects **Chennai / Ambattur / Demo Village**.
   - Views Reference Patta Record `PT-10245` (Survey No. `142/3B`, Owner `K Kumar`, `1.25 Acres`).
   - Clicks **Raise Grievance** for Survey No. `142/3B` and attaches registered sale deed (`survey_142_3c_sale_deed.pdf`).
   - System creates Case **`GL-1024`** and routes it automatically to Ambattur Tahsildar (Officer A).

2. **AI Investigation Engine**:
   - Extracts document fields and compares them against the reference record.
   - Flags **High Severity Survey Number Discrepancy**: Reference = `142/3B` vs Submitted = `142/3C`.
   - Generates advisory finding explaining the discrepancy.

3. **Officer Portal (`http://localhost:3000/officer/case/GL-1024`)**:
   - Switch role to **Officer** in top navbar.
   - Inspect 3-Column Review Screen:
     - **Left**: Reference Land Record (`142/3B`)
     - **Center**: Submitted Evidence Document viewer (`142/3C`)
     - **Right**: AI Discrepancy Findings & Officer Decision form.
   - Officer types: *"Please provide the registration document for verification."*
   - Officer clicks **Request Additional Document**.

4. **Citizen Tracking & Notification**:
   - Switch role back to **Citizen**.
   - View updated timeline: **Action Required (Additional Documents Required)**.
   - View officer's remark and upload response form.

5. **Admin Audit Logs (`http://localhost:3000/admin/audit-logs`)**:
   - Switch role to **Admin**.
   - Inspect immutable audit trail recording citizen submission, AI extraction, and officer decision timestamps.

---

## ⚙️ Architecture & Fallbacks

- **Record Reference Abstraction**: Uses `RecordReferenceService` with `DemoRecordProvider` (ready for future authorized govt API provider integration).
- **Gemini AI Fallback**: If `GEMINI_API_KEY` is not present, system uses deterministic OCR/text extraction parsing for guaranteed demo stability.
- **SMS Fallback**: If Twilio is not configured, in-app notifications & toast alerts display updates seamlessly.
- **Map Fallback**: Leaflet map includes manual fallback dropdown selectors for District -> Taluk -> Village jurisdiction routing.
