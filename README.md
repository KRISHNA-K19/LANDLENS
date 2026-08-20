<div align="center">

# 🛡️ LANDLENS
### **Citizen-Centric Land Record Verification & Grievance Resolution Platform**

![Hackathon Status](https://img.shields.io/badge/Hackathon-Winning_MVP-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js 14](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B5?style=for-the-badge&logo=googlegemini&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<p align="center">
  <b>Transforming unstructured land record complaints and registered deeds into structured, explainable verification cases for revenue officers.</b>
</p>

[Quick Start](#-quick-start) •
[Demo Scenario (GL-1024)](#-primary-hackathon-demo-scenario) •
[Architecture](#-system-architecture) •
[Demo Credentials](#-demo-credentials) •
[Core Features](#-core-features)

</div>

---

## 📌 Executive Summary & Vision

In traditional land record management systems, resolving discrepancy complaints (such as survey number mismatches, boundary extent variances, or patta holder name mismatches) often involves opaque, slow, manual paperwork.

**LANDLENS** introduces a citizen-centric verification and resolution layer around government land records. It allows citizens to reference land records, upload supporting title deeds, receive instant advisory AI discrepancy analysis, and track case progress transparently via interactive timelines and SMS notifications.

> ⚖️ **CORE GOVERNANCE PRINCIPLE**:  
> *"AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION."*  
> LANDLENS never allows AI to make legal ownership decisions automatically. All AI findings serve strictly as advisory evidence for authorized jurisdiction revenue officers.

---

## 🏛️ Authoritative Data Source & Production Architecture

> [!NOTE]  
> **Government Database Constraint**: LANDLENS is architected **not** to replace or scrape government databases. Government databases remain the sole authoritative source of truth.  
> LANDLENS uses a `RecordReferenceService` abstraction backed by a `DemoRecordProvider` for hackathon evaluation, designed for seamless replacement by authorized state APIs (such as e-Services / Tamil Nadu Land Records API) in production.

---

## ✨ Core Features

### 👤 Citizen Portal
- **Interactive Land Locator & Map**: Map-based boundary identification with district/taluk/village filters and automated jurisdiction routing.
- **Record-Linked Grievance Submission**: Reference official patta numbers and select discrepancy categories (*Survey Mismatch, Owner Mismatch, Extent Mismatch, Unclear Document*).
- **Evidence Upload**: Drag-and-drop support for registered sale deeds, title deeds, and patta copies (PDF, PNG, JPG).
- **Real-Time Status Tracking**: Stage-by-stage status timeline (*Submitted → Assigned → Under Review → AI Analysis → Officer Review → Action Required / Resolved*).

### 👮 Revenue Officer Portal
- **Assigned Jurisdiction Queue**: Filterable case queue with priority badges (`HIGH`, `MEDIUM`, `LOW`) and live SLA countdown timers.
- **3-Column Evidence Investigation Screen**:
  - **Left**: Reference Land Record (Authoritative record holder, survey no, patta no, extent).
  - **Center**: Submitted Evidence Document viewer & OCR text extraction preview.
  - **Right**: Explainable AI Discrepancy Findings & Officer Decision Console.
- **Officer Actions**: `[ Request Additional Document ]`, `[ Resolve Case ]`, `[ Escalate ]`.

### 🛡️ Administration & Governance
- **SLA Engine**: Automated SLA tracking (24h/48h/72h deadlines) and breach alerts.
- **Jurisdiction Mapping**: Workload distribution across Tahsildars, Village Administrative Officers (VAO), and Sub-Registrars.
- **Immutable Audit Trail**: Tamper-proof log tracking every citizen submission, AI extraction, and officer decision timestamp.

---

## 🏗️ System Architecture

```
                      +----------------------------------+
                      | CITIZEN / OFFICER / ADMIN PORTAL |
                      |    Next.js 14 + Tailwind CSS     |
                      +----------------------------------+
                                       |
                                       v
                      +----------------------------------+
                      |         FASTAPI BACKEND          |
                      |   Python 3.10+ REST API Engine   |
                      +----------------------------------+
                                       |
         +-----------------+-----------+-----------+-----------------+
         |                 |                       |                 |
         v                 v                       v                 v
+-----------------+ +--------------+     +------------------+ +--------------+
| Record Service  | | Case Mgmt    |     |  AI Engine &     | | Notification |
| (Reference DB)  | | SLA Engine   |     | Rule Discrepancy | | Service      |
+-----------------+ +--------------+     +------------------+ +--------------+
         |                 |                       |                 |
         v                 v                       v                 v
+----------------------------------+     +------------------+ +--------------+
| SQLite / PostgreSQL Database     |     | Gemini 1.5/3.6   | | Twilio /     |
| SQLAlchemy Async ORM             |     | Deterministic    | | In-App Toast |
+----------------------------------+     +------------------+ +--------------+
```

---

## 🏆 Primary Hackathon Demo Scenario

The application is seeded with a primary demonstration scenario engineered for hackathon judges (**3–5 Minute Walkthrough**):

```
REFERENCE RECORD (Government Patta PT-10245)
├── Location: Chennai | Ambattur | Demo Village
├── Owner Name: K. Kumar
├── Extent: 1.25 Acres
└── Survey Number: 142/3B

CITIZEN SUBMITTED EVIDENCE (Registered Sale Deed PDF)
├── Document No: SD/2024/99128
├── Stated Owner: K. Kumar
├── Stated Extent: 1.25 Acres
└── Survey Number: 142/3C

AI DISCREPANCY FINDING DETECTED
├── Field: Survey Number
├── Reference Value: 142/3B
├── Submitted Value: 142/3C
├── Severity: HIGH
└── Explanation: "The survey identifier in the submitted evidence document (142/3C) differs from the reference patta record (142/3B)."
```

### 📋 Walkthrough Steps for Judges:
1. **Citizen View**: Log in at `http://localhost:3000` with Phone `9876543210` and Demo OTP **`123456`**.
2. **Locate Land**: Go to **Locate My Land** → Select **Chennai / Ambattur / Demo Village** → View Reference Patta `PT-10245`.
3. **Raise Grievance**: Select Survey `142/3B` → Upload evidence deed (`survey_142_3c_sale_deed.pdf`) → Submit (creates Case **`GL-1024`**).
4. **Officer Review**: Switch role to **Officer** in navbar → Open **Case Review (GL-1024)** at `/officer/case/GL-1024`.
5. **Inspect 3-Column Console**: Inspect AI Discrepancy Badge highlighting `142/3B` vs `142/3C`.
6. **Officer Decision**: Type remark *"Please provide the registration document for verification."* → Click **Request Additional Document**.
7. **Citizen Tracking**: Switch back to **Citizen** → View updated timeline status: **Action Required** with upload response form.
8. **Audit Log**: Switch to **Admin** → View immutable audit entry for `GL-1024`.

---

## 🔑 Demo Credentials

| Role | User Name & Designation | Phone / Email | Demo Access Credentials |
| :--- | :--- | :--- | :--- |
| **Citizen** | K. Kumar | `9876543210` / `citizen@demo.landlens` | **Demo OTP**: `123456` |
| **Officer A** | Tahsildar (Ambattur) | `9876543211` / `officer@demo.landlens` | Navbar Role Switcher → **Officer** |
| **Officer B** | VAO (Sriperumbudur) | `9876543213` / `officerb@demo.landlens` | Mapped to Kanchipuram |
| **Officer C** | Sub-Registrar (Ponneri) | `9876543214` / `officerc@demo.landlens` | Mapped to Tiruvallur |
| **Admin** | System Admin | `9876543212` / `admin@demo.landlens` | Navbar Role Switcher → **Admin** |

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

---

### 1. Clone & Setup Environment
```bash
git clone https://github.com/KRISHNA-K19/LANDLENS.git
cd LANDLENS
cp .env.example .env
```

---

### 2. Start Backend Server (FastAPI)
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic pydantic-settings python-multipart pypdf

# Launch FastAPI application
python -m uvicorn backend.main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`

---

### 3. Start Frontend Portal (Next.js 14)
```bash
# In a new terminal window:
cd frontend

# Install Node dependencies
npm install

# Run development server
npm run dev
```
- **Web Application Portal**: `http://localhost:3000`

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript | High-performance civic web application |
| **Styling & UI** | Tailwind CSS, Lucide Icons | Clean, professional, trustworthy civic design system |
| **Backend** | Python 3.10+, FastAPI | High-throughput asynchronous REST API |
| **Database** | SQLite (Async SQLAlchemy ORM) / PostgreSQL | Relational data persistence & audit trail |
| **AI Investigation** | Gemini API + Python Rule Comparison Engine | Explainable OCR extraction & advisory discrepancy detection |
| **Maps** | Leaflet Maps | Interactive boundary visualization & jurisdiction mapping |
| **Notifications** | Twilio SMS API + In-App Toast Fallback | Multi-channel citizen notifications |

---

## 📂 Project Directory Structure

```
LANDLENS/
├── backend/
│   ├── main.py                     # FastAPI entrypoint & router assembly
│   ├── config.py                   # Pydantic configuration & env secrets
│   ├── database.py                 # Async SQLAlchemy engine & session factory
│   ├── models.py                   # Database schema (User, Grievance, AI, OfficerAction, etc.)
│   ├── schemas.py                  # Pydantic request/response validation schemas
│   ├── seed.py                     # Hackathon demo dataset seeder
│   ├── test_flow.py                # End-to-end automated workflow verification script
│   ├── routers/                    # Modular API route controllers
│   │   ├── auth.py                 # OTP authentication router
│   │   ├── grievances.py           # Citizen grievance submission & detail endpoints
│   │   ├── officer.py              # Officer queue & investigation decision endpoints
│   │   ├── admin.py                # System metrics & audit logs
│   │   └── lands.py                # Land reference search & location router
│   └── services/                   # Business logic & AI processing modules
│       ├── ai_engine.py            # Gemini 1.5/3.6 AI document field extraction
│       ├── discrepancy_engine.py   # Pure Python field comparison & severity classification
│       ├── jurisdiction_router.py  # Location-to-Officer mapping service
│       ├── sla_engine.py           # Priority-based SLA deadline calculator
│       ├── notification_service.py # Twilio SMS & in-app alert dispatcher
│       └── audit_service.py        # Immutable audit logging service
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root app layout & global navbar/footer wrap
│   │   ├── page.tsx                # Landing / Hero page
│   │   ├── citizen/
│   │   │   ├── dashboard/          # Citizen grievances list & SLA status
│   │   │   ├── locate/             # Interactive map & jurisdiction router
│   │   │   ├── raise-grievance/    # Discrepancy reporting & file upload form
│   │   │   └── case/[id]/          # Citizen status timeline & document tracking
│   │   ├── officer/
│   │   │   ├── dashboard/          # Assigned queue & SLA metrics console
│   │   │   └── case/[id]/          # 3-Column case review & decision screen
│   │   └── admin/
│   │       ├── dashboard/          # Admin metrics & jurisdiction workload
│   │       └── audit-logs/         # Immutable system audit trail viewer
│   ├── components/                 # Reusable UI components
│   │   ├── Navbar.tsx              # Civic brand header & live role switcher
│   │   ├── Footer.tsx              # Authoritative source disclaimers
│   │   ├── MapComponent.tsx        # Leaflet map container
│   │   ├── AIFindingBadge.tsx      # Explainable AI discrepancy card
│   │   └── StatusTimeline.tsx      # Case progress line & history feed
│   └── lib/
│       └── api.ts                  # Axios API client & TypeScript interfaces
├── .env.example                    # Sample environment variables
└── README.md                       # Comprehensive platform documentation
```

---

## 📜 License & Compliance

Developed for hackathon evaluation under the **MIT License**.  
All demo datasets are synthetically generated for demonstration purposes.

---

<div align="center">
  <b>LANDLENS — Turning unstructured citizen complaints into structured, explainable verification cases.</b>
</div>
