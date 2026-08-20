import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
  created_at: string;
}

export interface Jurisdiction {
  id: number;
  district: string;
  taluk: string;
  village: string;
  officer_name?: string;
  officer_designation?: string;
}

export interface LandRecord {
  id: number;
  patta_number: string;
  survey_number: string;
  owner_name: string;
  extent_acres: number;
  village: string;
  taluk: string;
  district: string;
  jurisdiction_id?: number;
  is_demo_record: boolean;
}

export interface DiscrepancyItem {
  field: string;
  reference_value: string;
  submitted_value: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}

export interface AIFinding {
  id: number;
  grievance_id: number;
  document_id?: number;
  status: string;
  confidence_summary: string;
  summary_text: string;
  raw_extraction_json?: Record<string, any>;
  discrepancies_json: DiscrepancyItem[];
  created_at: string;
}

export interface DocumentItem {
  id: number;
  grievance_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface OfficerAction {
  id: number;
  grievance_id: number;
  officer_id: number;
  officer_name: string;
  officer_designation: string;
  action: 'RESOLVE' | 'REQUEST_ADDITIONAL_DOCUMENTS' | 'ESCALATE' | 'ADD_REMARK';
  remarks: string;
  timestamp: string;
}

export interface StatusHistoryItem {
  id: number;
  grievance_id: number;
  previous_status?: string;
  new_status: string;
  changed_by_name: string;
  changed_by_role: string;
  remarks?: string;
  timestamp: string;
}

export interface GrievanceSummary {
  id: number;
  case_code: string;
  citizen_name: string;
  citizen_phone: string;
  village: string;
  taluk: string;
  district: string;
  survey_number: string;
  patta_number: string;
  category: string;
  status: string;
  priority: string;
  sla_remaining_seconds: number;
  is_sla_breached: boolean;
  created_at: string;
}

export interface GrievanceDetail {
  id: number;
  case_code: string;
  citizen: User;
  land_record: LandRecord;
  jurisdiction: Jurisdiction;
  category: string;
  description: string;
  status: string;
  priority: string;
  sla_hours: number;
  sla_deadline: string;
  sla_remaining_seconds: number;
  is_sla_breached: boolean;
  created_at: string;
  updated_at: string;
  documents: DocumentItem[];
  ai_findings: AIFinding[];
  officer_actions: OfficerAction[];
  status_history: StatusHistoryItem[];
}

export const fetchLandRecords = async (query?: string): Promise<LandRecord[]> => {
  const res = await apiClient.get('/lands', { params: { query } });
  return res.data;
};

export const locateLandAndJurisdiction = async (district: string, taluk: string, village: string) => {
  const res = await apiClient.get('/lands/locate/search', {
    params: { district, taluk, village }
  });
  return res.data;
};

export const createGrievance = async (formData: FormData): Promise<GrievanceDetail> => {
  const res = await apiClient.post('/grievances', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const fetchGrievanceDetail = async (id: string | number): Promise<GrievanceDetail> => {
  const res = await apiClient.get(`/grievances/${id}`);
  return res.data;
};

export const fetchOfficerCases = async (officerId: number = 1, status?: string): Promise<GrievanceSummary[]> => {
  const res = await apiClient.get('/officer/cases', {
    params: { officer_id: officerId, status }
  });
  return res.data;
};

export const submitOfficerAction = async (
  caseId: string | number,
  action: string,
  remarks: string,
  officerId: number = 1
): Promise<GrievanceDetail> => {
  const res = await apiClient.post(`/officer/cases/${caseId}/action`, { action, remarks }, {
    params: { officer_id: officerId }
  });
  return res.data;
};

export const fetchAuditLogs = async () => {
  const res = await apiClient.get('/admin/audit-logs');
  return res.data;
};

export const fetchAdminDashboardMetrics = async () => {
  const res = await apiClient.get('/admin/dashboard-stats');
  return res.data;
};
