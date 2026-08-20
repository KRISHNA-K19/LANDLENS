# 🗄️ LANDLENS Database Architecture & Implementation Guide

This guide provides a comprehensive overview of the relational database architecture, entity relationships, SQL schemas, Supabase Row-Level Security (RLS) policies, and data processing lifecycles for **LANDLENS** (*Citizen-Centric Land Record Verification & Grievance Resolution Platform*).

---

## 📌 1. Core Database Philosophy

- **Authoritative Data Layer Abstraction**: LANDLENS stores citizen grievances, uploaded evidence, AI discrepancy findings, and officer audit histories. It references land records via the `land_records` table without mutating authoritative government databases.
- **Relational Integrity**: Built on PostgreSQL (Supabase) using strict Foreign Key constraints, ENUM types, cascade deletes for case artifacts, and indexing on lookup fields (`case_code`, `patta_number`, `survey_number`, `phone`).
- **Auditability**: Every status update and officer intervention appends immutable records to `case_status_history` and `audit_logs`.

---

## 📊 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| OFFICERS : "has profile"
    USERS ||--o{ GRIEVANCES : "submits"
    USERS ||--o{ NOTIFICATIONS : "receives"
    
    OFFICERS ||--o{ JURISDICTIONS : "assigned to"
    OFFICERS ||--o{ OFFICER_ACTIONS : "executes"
    
    JURISDICTIONS ||--o{ LAND_RECORDS : "contains"
    JURISDICTIONS ||--o{ GRIEVANCES : "routes to"
    
    LAND_RECORDS ||--o{ GRIEVANCES : "referenced in"
    
    GRIEVANCES ||--o{ DOCUMENTS : "attaches"
    GRIEVANCES ||--o{ AI_FINDINGS : "generates"
    GRIEVANCES ||--o{ OFFICER_ACTIONS : "receives"
    GRIEVANCES ||--o{ CASE_STATUS_HISTORY : "tracks"
    
    DOCUMENTS ||--o{ AI_FINDINGS : "analyzed by"
```

---

## 🗂️ 3. Comprehensive Database Schema (12 Tables)

### Table Overview

| Table Name | Primary Purpose | Key Foreign Keys |
| :--- | :--- | :--- |
| `users` | Citizen, Officer, and Admin account credentials & roles | None |
| `officers` | Officer employee profiles, designations, and departments | `user_id` → `users.id` |
| `jurisdictions` | District, Taluk, and Village administrative mapping | `officer_id` → `officers.id` |
| `land_records` | Reference land records (Patta, Survey No, Owner, Extent) | `jurisdiction_id` → `jurisdictions.id` |
| `grievances` | Primary complaint records and workflow state | `citizen_id`, `land_record_id`, `jurisdiction_id` |
| `documents` | Uploaded citizen title deeds & evidence files | `grievance_id` → `grievances.id` |
| `ai_findings` | Structured AI document extraction & advisory discrepancies | `grievance_id`, `document_id` |
| `officer_actions` | Official investigation decisions (Resolve, Request, Escalate) | `grievance_id`, `officer_id` |
| `notifications` | Citizen SMS and in-app alerts feed | `user_id` → `users.id` |
| `audit_logs` | Immutable audit trail for all system events | `actor_id` → `users.id` |
| `sla_rules` | Severity-based SLA hours and deadline rules | None |
| `case_status_history` | Historical timeline of status changes | `grievance_id` → `grievances.id` |

---

## 💻 4. Full PostgreSQL DDL Script

```sql
-- Create Enum Types
CREATE TYPE user_role AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN');
CREATE TYPE grievance_status AS ENUM (
    'SUBMITTED', 
    'ASSIGNED', 
    'UNDER_REVIEW', 
    'AI_ANALYSIS_COMPLETED', 
    'ADDITIONAL_DOCUMENTS_REQUIRED', 
    'RESOLVED', 
    'ESCALATED'
);
CREATE TYPE grievance_category AS ENUM (
    'Owner/Name mismatch',
    'Survey number mismatch',
    'Extent/area mismatch',
    'Missing information',
    'Record not updated',
    'Document unclear',
    'Other'
);
CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE officer_action_type AS ENUM ('RESOLVE', 'REQUEST_ADDITIONAL_DOCUMENTS', 'ESCALATE', 'ADD_REMARK');
CREATE TYPE notification_channel AS ENUM ('SMS', 'IN_APP', 'BOTH');

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    role user_role DEFAULT 'CITIZEN' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_phone ON users(phone);

-- 2. Officers Table
CREATE TABLE officers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) DEFAULT 'Revenue Department'
);

-- 3. Jurisdictions Table
CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    officer_id INT REFERENCES officers(id) ON DELETE SET NULL,
    bounds_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_jurisdiction_lookup ON jurisdictions(district, taluk, village);

-- 4. Land Records Table (Reference / Demo)
CREATE TABLE land_records (
    id SERIAL PRIMARY KEY,
    patta_number VARCHAR(50) NOT NULL,
    survey_number VARCHAR(50) NOT NULL,
    owner_name VARCHAR(200) NOT NULL,
    extent_acres FLOAT NOT NULL,
    village VARCHAR(100) NOT NULL,
    taluk VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    jurisdiction_id INT REFERENCES jurisdictions(id),
    is_demo_record BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_land_survey ON land_records(survey_number);
CREATE INDEX idx_land_patta ON land_records(patta_number);

-- 5. Grievances Table
CREATE TABLE grievances (
    id SERIAL PRIMARY KEY,
    case_code VARCHAR(50) UNIQUE NOT NULL,
    citizen_id INT NOT NULL REFERENCES users(id),
    land_record_id INT NOT NULL REFERENCES land_records(id),
    jurisdiction_id INT NOT NULL REFERENCES jurisdictions(id),
    category grievance_category NOT NULL,
    description TEXT NOT NULL,
    status grievance_status DEFAULT 'SUBMITTED' NOT NULL,
    priority priority_level DEFAULT 'MEDIUM' NOT NULL,
    sla_hours INT DEFAULT 48,
    sla_deadline TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_grievances_case_code ON grievances(case_code);
CREATE INDEX idx_grievances_status ON grievances(status);

-- 6. Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    grievance_id INT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI Findings Table
CREATE TABLE ai_findings (
    id SERIAL PRIMARY KEY,
    grievance_id INT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    document_id INT REFERENCES documents(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    confidence_summary VARCHAR(100) DEFAULT 'HIGH_CONFIDENCE_DETECTION',
    summary_text TEXT NOT NULL,
    raw_extraction_json JSONB,
    discrepancies_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Officer Actions Table
CREATE TABLE officer_actions (
    id SERIAL PRIMARY KEY,
    grievance_id INT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    officer_id INT NOT NULL REFERENCES officers(id),
    action officer_action_type NOT NULL,
    remarks TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel DEFAULT 'BOTH',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INT,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(150) NOT NULL,
    case_code VARCHAR(50),
    metadata_json JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Case Status History Table
CREATE TABLE case_status_history (
    id SERIAL PRIMARY KEY,
    grievance_id INT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    previous_status grievance_status,
    new_status grievance_status NOT NULL,
    changed_by_name VARCHAR(150) NOT NULL,
    changed_by_role VARCHAR(50) NOT NULL,
    remarks TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 5. Supabase Row-Level Security (RLS) Policies

To enforce strict backend Role-Based Access Control (RBAC):

```sql
-- Enable RLS on core tables
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_actions ENABLE ROW LEVEL SECURITY;

-- 1. Citizens can view only their own grievances
CREATE POLICY citizen_read_own_grievances ON grievances
    FOR SELECT
    USING (auth.uid()::text = citizen_id::text OR EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('OFFICER', 'ADMIN')
    ));

-- 2. Officers can view cases assigned to their jurisdiction
CREATE POLICY officer_read_jurisdiction_cases ON grievances
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM officers 
            JOIN jurisdictions ON jurisdictions.officer_id = officers.id
            WHERE officers.user_id = auth.uid() 
            AND jurisdictions.id = grievances.jurisdiction_id
        )
    );

-- 3. Only officers can insert officer_actions
CREATE POLICY officer_create_action ON officer_actions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM officers WHERE officers.id = officer_actions.officer_id AND officers.user_id = auth.uid()
        )
    );
```

---

## 🔄 6. Step-by-Step Data Flow Process

### STEP 1: Land Location & Jurisdiction Match
1. Frontend passes `district`, `taluk`, `village`.
2. System queries `jurisdictions` matching `(district, taluk, village)` → returns `officer_id` (e.g. Officer A).
3. System fetches reference `land_records` for that village (e.g. Patta `PT-10245`, Survey `142/3B`).

### STEP 2: Grievance & Document Creation
1. Citizen submits form + file → System inserts record into `grievances` with `case_code = 'GL-1024'`, `status = 'SUBMITTED'`.
2. File saved to `/uploads` → Insert into `documents` table.
3. Automated Router sets `status = 'ASSIGNED'` → appends row to `case_status_history`.

### STEP 3: AI Investigation Engine & Discrepancy Flagging
1. Gemini API / PyPDF extracts document text → returns JSON fields (e.g. Survey `142/3C`).
2. Python `discrepancy_engine` compares `land_records.survey_number ('142/3B')` vs `extracted ('142/3C')`.
3. Inserts findings into `ai_findings` table with `severity = 'HIGH'`.
4. Updates case `status = 'UNDER_REVIEW'`.

### STEP 4: Officer Investigation & Action Execution
1. Officer views 3-column review page (queries `grievances` join `land_records`, `documents`, `ai_findings`).
2. Officer types remarks and selects `REQUEST_ADDITIONAL_DOCUMENTS`.
3. System:
   - Inserts row into `officer_actions`.
   - Updates `grievances.status = 'ADDITIONAL_DOCUMENTS_REQUIRED'`.
   - Inserts row into `case_status_history`.
   - Dispatches row to `notifications` (SMS / In-App feed).
   - Logs event into immutable `audit_logs` table.

---

## 🚀 7. Running & Migrating Database

### Local SQLite Development (Zero-Config)
The project defaults to SQLite via SQLAlchemy async (`sqlite+aiosqlite:///./landlens.db`).  
Tables and initial seed data are auto-created on application startup (`python -m uvicorn backend.main:app --reload`).

### PostgreSQL / Supabase Production Setup
Set `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```
Run `python -m backend.seed` to seed demo dataset into Supabase.
