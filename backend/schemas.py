from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
import datetime
from backend.models import UserRole, GrievanceStatus, GrievanceCategory, PriorityLevel, OfficerActionType, NotificationChannel

# Auth Schemas
class OTPSendRequest(BaseModel):
    phone: str = Field(..., example="9876543210")

class OTPVerifyRequest(BaseModel):
    phone: str = Field(..., example="9876543210")
    otp: str = Field(..., example="123456")

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserSchema"

# User Schemas
class UserSchema(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    role: UserRole
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Land Record Schemas
class LandRecordSchema(BaseModel):
    id: int
    patta_number: str
    survey_number: str
    owner_name: str
    extent_acres: float
    village: str
    taluk: str
    district: str
    jurisdiction_id: Optional[int] = None
    is_demo_record: bool = True

    class Config:
        from_attributes = True

# Jurisdiction Schemas
class JurisdictionSchema(BaseModel):
    id: int
    district: str
    taluk: str
    village: str
    officer_name: Optional[str] = None
    officer_designation: Optional[str] = None

    class Config:
        from_attributes = True

# Grievance Submission Request
class GrievanceCreateRequest(BaseModel):
    land_record_id: int
    category: GrievanceCategory
    description: str

# Document Schema
class DocumentSchema(BaseModel):
    id: int
    grievance_id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    uploaded_at: datetime.datetime

    class Config:
        from_attributes = True

# AI Finding Schema
class DiscrepancyItem(BaseModel):
    field: str
    reference_value: str
    submitted_value: str
    severity: str
    reason: str

class AIFindingSchema(BaseModel):
    id: int
    grievance_id: int
    document_id: Optional[int] = None
    status: str
    confidence_summary: str
    summary_text: str
    raw_extraction_json: Optional[Dict[str, Any]] = None
    discrepancies_json: List[DiscrepancyItem]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Officer Action Request & Schema
class OfficerActionCreateRequest(BaseModel):
    action: OfficerActionType
    remarks: str

class OfficerActionSchema(BaseModel):
    id: int
    grievance_id: int
    officer_id: int
    officer_name: Optional[str] = None
    officer_designation: Optional[str] = None
    action: OfficerActionType
    remarks: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# Case Status History Schema
class CaseStatusHistorySchema(BaseModel):
    id: int
    previous_status: Optional[GrievanceStatus] = None
    new_status: GrievanceStatus
    changed_by_name: str
    changed_by_role: str
    remarks: Optional[str] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# Grievance Detail Schema
class GrievanceDetailSchema(BaseModel):
    id: int
    case_code: str
    citizen: UserSchema
    land_record: LandRecordSchema
    jurisdiction: JurisdictionSchema
    category: GrievanceCategory
    description: str
    status: GrievanceStatus
    priority: PriorityLevel
    sla_hours: int
    sla_deadline: datetime.datetime
    sla_remaining_seconds: float
    is_sla_breached: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime
    documents: List[DocumentSchema] = []
    ai_findings: List[AIFindingSchema] = []
    officer_actions: List[OfficerActionSchema] = []
    status_history: List[CaseStatusHistorySchema] = []

    class Config:
        from_attributes = True

# Grievance Summary Schema (for lists & queue)
class GrievanceSummarySchema(BaseModel):
    id: int
    case_code: str
    citizen_name: str
    citizen_phone: str
    village: str
    taluk: str
    district: str
    survey_number: str
    patta_number: str
    category: GrievanceCategory
    status: GrievanceStatus
    priority: PriorityLevel
    sla_remaining_seconds: float
    is_sla_breached: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Notification Schema
class NotificationSchema(BaseModel):
    id: int
    title: str
    message: str
    channel: NotificationChannel
    is_read: bool
    sent_at: datetime.datetime

    class Config:
        from_attributes = True

# Audit Log Schema
class AuditLogSchema(BaseModel):
    id: int
    actor_name: str
    actor_role: str
    action: str
    case_code: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# Admin Metrics Schema
class AdminMetricsSchema(BaseModel):
    total_cases: int
    pending_cases: int
    under_review_cases: int
    resolved_cases: int
    escalated_cases: int
    sla_breached_cases: int
    total_citizens: int
    total_officers: int
