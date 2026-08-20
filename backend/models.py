import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
import enum
from backend.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"

class GrievanceStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    ASSIGNED = "ASSIGNED"
    UNDER_REVIEW = "UNDER_REVIEW"
    AI_ANALYSIS_COMPLETED = "AI_ANALYSIS_COMPLETED"
    ADDITIONAL_DOCUMENTS_REQUIRED = "ADDITIONAL_DOCUMENTS_REQUIRED"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"

class GrievanceCategory(str, enum.Enum):
    OWNER_NAME_MISMATCH = "Owner/Name mismatch"
    SURVEY_NUMBER_MISMATCH = "Survey number mismatch"
    EXTENT_AREA_MISMATCH = "Extent/area mismatch"
    MISSING_INFORMATION = "Missing information"
    RECORD_NOT_UPDATED = "Record not updated"
    DOCUMENT_UNCLEAR = "Document unclear"
    OTHER = "Other"

class PriorityLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class OfficerActionType(str, enum.Enum):
    RESOLVE = "RESOLVE"
    REQUEST_ADDITIONAL_DOCUMENTS = "REQUEST_ADDITIONAL_DOCUMENTS"
    ESCALATE = "ESCALATE"
    ADD_REMARK = "ADD_REMARK"

class NotificationChannel(str, enum.Enum):
    SMS = "SMS"
    IN_APP = "IN_APP"
    BOTH = "BOTH"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.CITIZEN, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    officer_profile = relationship("Officer", back_populates="user", uselist=False)
    grievances = relationship("Grievance", back_populates="citizen")
    notifications = relationship("Notification", back_populates="user")

class Officer(Base):
    __tablename__ = "officers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    employee_code = Column(String(50), unique=True, nullable=False)
    designation = Column(String(100), nullable=False) # e.g. "Tahsildar", "Village Administrative Officer"
    department = Column(String(100), default="Revenue Department")
    
    user = relationship("User", back_populates="officer_profile")
    jurisdictions = relationship("Jurisdiction", back_populates="officer")
    actions = relationship("OfficerAction", back_populates="officer")

class Jurisdiction(Base):
    __tablename__ = "jurisdictions"
    
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(100), nullable=False, index=True)
    taluk = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    officer_id = Column(Integer, ForeignKey("officers.id"), nullable=True)
    bounds_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    officer = relationship("Officer", back_populates="jurisdictions")
    land_records = relationship("LandRecord", back_populates="jurisdiction")
    grievances = relationship("Grievance", back_populates="jurisdiction")

class LandRecord(Base):
    __tablename__ = "land_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patta_number = Column(String(50), index=True, nullable=False)
    survey_number = Column(String(50), index=True, nullable=False)
    owner_name = Column(String(200), nullable=False)
    extent_acres = Column(Float, nullable=False)
    village = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    jurisdiction_id = Column(Integer, ForeignKey("jurisdictions.id"), nullable=True)
    is_demo_record = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    jurisdiction = relationship("Jurisdiction", back_populates="land_records")
    grievances = relationship("Grievance", back_populates="land_record")

class Grievance(Base):
    __tablename__ = "grievances"
    
    id = Column(Integer, primary_key=True, index=True)
    case_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. GL-1024
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    land_record_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    jurisdiction_id = Column(Integer, ForeignKey("jurisdictions.id"), nullable=False)
    category = Column(SQLEnum(GrievanceCategory), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(GrievanceStatus), default=GrievanceStatus.SUBMITTED, nullable=False)
    priority = Column(SQLEnum(PriorityLevel), default=PriorityLevel.MEDIUM, nullable=False)
    sla_hours = Column(Integer, default=48)
    sla_deadline = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    citizen = relationship("User", back_populates="grievances")
    land_record = relationship("LandRecord", back_populates="grievances")
    jurisdiction = relationship("Jurisdiction", back_populates="grievances")
    documents = relationship("Document", back_populates="grievance", cascade="all, delete-orphan")
    ai_findings = relationship("AIFinding", back_populates="grievance", cascade="all, delete-orphan")
    officer_actions = relationship("OfficerAction", back_populates="grievance", cascade="all, delete-orphan")
    status_history = relationship("CaseStatusHistory", back_populates="grievance", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    grievance = relationship("Grievance", back_populates="documents")
    ai_findings = relationship("AIFinding", back_populates="document")

class AIFinding(Base):
    __tablename__ = "ai_findings"
    
    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    status = Column(String(50), default="COMPLETED")
    confidence_summary = Column(String(100), default="HIGH_CONFIDENCE_DETECTION")
    summary_text = Column(Text, nullable=False)
    raw_extraction_json = Column(JSON, nullable=True)
    discrepancies_json = Column(JSON, nullable=False) # List of dicts with field, reference, submitted, severity, reason
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    grievance = relationship("Grievance", back_populates="ai_findings")
    document = relationship("Document", back_populates="ai_findings")

class OfficerAction(Base):
    __tablename__ = "officer_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False)
    officer_id = Column(Integer, ForeignKey("officers.id"), nullable=False)
    action = Column(SQLEnum(OfficerActionType), nullable=False)
    remarks = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    grievance = relationship("Grievance", back_populates="officer_actions")
    officer = relationship("Officer", back_populates="actions")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(SQLEnum(NotificationChannel), default=NotificationChannel.BOTH)
    is_read = Column(Boolean, default=False)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, nullable=True)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(150), nullable=False)
    case_code = Column(String(50), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class CaseStatusHistory(Base):
    __tablename__ = "case_status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False)
    previous_status = Column(SQLEnum(GrievanceStatus), nullable=True)
    new_status = Column(SQLEnum(GrievanceStatus), nullable=False)
    changed_by_name = Column(String(150), nullable=False)
    changed_by_role = Column(String(50), nullable=False)
    remarks = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    grievance = relationship("Grievance", back_populates="status_history")
