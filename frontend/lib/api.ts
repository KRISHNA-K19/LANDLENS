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

const MOCK_LAND_RECORDS: LandRecord[] = [
  { id: 1, patta_number: 'PT-10245', survey_number: '142/3B', owner_name: 'K. Kumar', extent_acres: 1.25, village: 'Kaveri Village', taluk: 'Ambattur', district: 'Chennai', is_demo_record: true },
  { id: 2, patta_number: 'PT-88210', survey_number: '89/1A', owner_name: 'R. Sharma', extent_acres: 2.50, village: 'Kaveri Village', taluk: 'Ambattur', district: 'Chennai', is_demo_record: true },
  { id: 3, patta_number: 'PT-30112', survey_number: '204/5', owner_name: 'M. Anbazhagan', extent_acres: 0.75, village: 'East Village', taluk: 'Ambattur', district: 'Chennai', is_demo_record: true },
  { id: 4, patta_number: 'PT-55019', survey_number: '12/4A', owner_name: 'S. Priya', extent_acres: 3.10, village: 'West Village', taluk: 'Sriperumbudur', district: 'Kanchipuram', is_demo_record: true },
  { id: 5, patta_number: 'PT-99401', survey_number: '310/2C', owner_name: 'V. Ramanathan', extent_acres: 1.80, village: 'North Village', taluk: 'Ponneri', district: 'Tiruvallur', is_demo_record: true },
];

export const fetchLandRecords = async (query?: string): Promise<LandRecord[]> => {
  try {
    const res = await apiClient.get('/lands', { params: { q: query } });
    return res.data;
  } catch (err) {
    if (query) {
      const q = query.toLowerCase();
      return MOCK_LAND_RECORDS.filter(r => 
        r.survey_number.toLowerCase().includes(q) ||
        r.patta_number.toLowerCase().includes(q) ||
        r.owner_name.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q)
      );
    }
    return MOCK_LAND_RECORDS;
  }
};

export const locateLandAndJurisdiction = async (district: string, taluk: string, village: string) => {
  try {
    const res = await apiClient.get('/lands/locate/by-location', {
      params: { district, taluk, village }
    });
    return res.data;
  } catch (err) {
    const filtered = MOCK_LAND_RECORDS.filter(r => r.district === district || r.village === village);
    return {
      notice: "State land registries maintain final legal authority. LANDLENS operates as an intelligent civil verification layer.",
      district,
      taluk,
      village,
      jurisdiction: {
        id: 1,
        district,
        taluk,
        village,
        officer_name: "Officer A (Tahsildar)",
        officer_designation: "Tahsildar"
      },
      land_records: filtered.length > 0 ? filtered : MOCK_LAND_RECORDS
    };
  }
};

export const createGrievance = async (formData: FormData): Promise<GrievanceDetail> => {
  try {
    const res = await apiClient.post('/grievances', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    return MOCK_CASE_1024;
  }
};

const MOCK_CASE_1024: GrievanceDetail = {
  id: 1,
  case_code: "GL-1024",
  citizen: { id: 1, name: "K. Kumar", phone: "9876543210", email: "citizen@landlens.gov.in", role: "CITIZEN", created_at: new Date().toISOString() },
  land_record: MOCK_LAND_RECORDS[0],
  jurisdiction: { id: 1, district: "Chennai", taluk: "Ambattur", village: "Kaveri Village", officer_name: "Officer A (Tahsildar)", officer_designation: "Tahsildar" },
  category: "Survey number mismatch",
  description: "Patta record lists 142/3B, whereas registered sale deed specifies Survey Number 142/3C.",
  status: "UNDER_REVIEW",
  priority: "HIGH",
  sla_hours: 24,
  sla_deadline: new Date(Date.now() + 86400000).toISOString(),
  sla_remaining_seconds: 72000,
  is_sla_breached: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  documents: [{ id: 1, grievance_id: 1, file_name: "survey_142_3c_sale_deed.pdf", file_path: "/uploads/survey_142_3c_sale_deed.pdf", file_type: "application/pdf", file_size: 4096, uploaded_at: new Date().toISOString() }],
  ai_findings: [{
    id: 1,
    grievance_id: 1,
    status: "COMPLETED",
    confidence_summary: "HIGH_CONFIDENCE_DISCREPANCY_DETECTED",
    summary_text: "Potential survey number discrepancy detected. Reference record lists '142/3B', whereas submitted evidence contains '142/3C'. Advisory officer verification required.",
    discrepancies_json: [{ field: "Survey Number", reference_value: "142/3B", submitted_value: "142/3C", severity: "HIGH", reason: "The survey identifier in the submitted evidence differs from the reference record." }],
    created_at: new Date().toISOString()
  }],
  officer_actions: [],
  status_history: [
    { id: 1, grievance_id: 1, new_status: "SUBMITTED", changed_by_name: "K. Kumar", changed_by_role: "CITIZEN", remarks: "Grievance raised with land reference PT-10245.", timestamp: new Date().toISOString() },
    { id: 2, grievance_id: 1, previous_status: "SUBMITTED", new_status: "ASSIGNED", changed_by_name: "LANDLENS Router", changed_by_role: "SYSTEM", remarks: "Routed to Ambattur Tahsildar (Officer A).", timestamp: new Date().toISOString() },
    { id: 3, grievance_id: 1, previous_status: "ASSIGNED", new_status: "UNDER_REVIEW", changed_by_name: "AI Investigation Engine", changed_by_role: "SYSTEM_AI", remarks: "Document extraction complete. Potential Survey Number discrepancy flagged.", timestamp: new Date().toISOString() }
  ]
};

export const fetchGrievanceDetail = async (id: string | number): Promise<GrievanceDetail> => {
  try {
    const res = await apiClient.get(`/grievances/${id}`);
    return res.data;
  } catch (err) {
    return MOCK_CASE_1024;
  }
};

export const fetchOfficerCases = async (officerId: number = 1, status?: string): Promise<GrievanceSummary[]> => {
  try {
    const res = await apiClient.get('/officer/cases', {
      params: { officer_id: officerId, status }
    });
    return res.data;
  } catch (err) {
    return [{
      id: 1,
      case_code: "GL-1024",
      citizen_name: "K. Kumar",
      citizen_phone: "9876543210",
      village: "Kaveri Village",
      taluk: "Ambattur",
      district: "Chennai",
      survey_number: "142/3B",
      patta_number: "PT-10245",
      category: "Survey number mismatch",
      status: "UNDER_REVIEW",
      priority: "HIGH",
      sla_remaining_seconds: 72000,
      is_sla_breached: false,
      created_at: new Date().toISOString()
    }];
  }
};

export const submitOfficerAction = async (
  caseId: string | number,
  action: string,
  remarks: string,
  officerId: number = 1
): Promise<GrievanceDetail> => {
  try {
    const res = await apiClient.post(`/officer/cases/${caseId}/action`, { action, remarks }, {
      params: { officer_id: officerId }
    });
    return res.data;
  } catch (err) {
    const updatedStatus = action === 'RESOLVE' ? 'RESOLVED' : action === 'REQUEST_ADDITIONAL_DOCUMENTS' ? 'ADDITIONAL_DOCUMENTS_REQUIRED' : 'ESCALATED';
    return {
      ...MOCK_CASE_1024,
      status: updatedStatus,
      officer_actions: [{
        id: 1,
        grievance_id: 1,
        officer_id: 1,
        officer_name: "Officer A (Tahsildar)",
        officer_designation: "Tahsildar",
        action: action as any,
        remarks: remarks,
        timestamp: new Date().toISOString()
      }]
    };
  }
};

export const fetchAuditLogs = async () => {
  try {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  } catch (err) {
    return [
      { id: 1, actor_name: "K. Kumar", actor_role: "CITIZEN", action: "GRIEVANCE_SUBMITTED", case_code: "GL-1024", timestamp: new Date().toISOString() },
      { id: 2, actor_name: "AI Investigation Engine", actor_role: "SYSTEM_AI", action: "DISCREPANCY_FLAGGED", case_code: "GL-1024", timestamp: new Date().toISOString() }
    ];
  }
};

export const fetchAdminDashboardMetrics = async () => {
  try {
    const res = await apiClient.get('/admin/dashboard-stats');
    return res.data;
  } catch (err) {
    return {
      total_cases: 12,
      pending_cases: 5,
      resolved_cases: 6,
      escalated_cases: 1,
      sla_breached_count: 0
    };
  }
};
