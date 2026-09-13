// User Roles
export type UserRole = 'admin' | 'officer' | 'investigator' | 'complainant' | 'legal_reviewer' | 'decision_maker' | 'analyst';

// Case Status
export type CaseStatus = 'registered' | 'screening' | 'classification' | 'assigned' | 'investigation' | 'evidence_pending' | 'legal_review' | 'decision_pending' | 'decided' | 'implementation' | 'closed' | 'reopened' | 'appealed';

// Complaint Types
export type ComplaintType = 'ownership_dispute' | 'boundary_issue' | 'illegal_occupancy' | 'document_issue' | 'lease_dispute' | 'compensation' | 'replacement_land' | 'construction_permit' | 'site_plan' | 'land_transfer' | 'service_delay' | 'previous_decision_non_implementation' | 'other';

// Land Use
export type LandUse = 'residential' | 'commercial' | 'industrial' | 'institutional' | 'religious' | 'government' | 'mixed' | 'other';

// Evidence Type
export type EvidenceType = 'photo' | 'video' | 'audio' | 'document' | 'gps_location' | 'other';

// User
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  region?: string;
  zone?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Parcel
export interface Parcel {
  id: string;
  parcel_id: string;
  location_address: string;
  region?: string;
  zone?: string;
  city?: string;
  woreda?: string;
  kebele?: string;
  land_use?: LandUse;
  area_sqm?: number;
  latitude?: number;
  longitude?: number;
  boundary_description?: string;
  map_reference?: string;
  created_at: string;
  updated_at: string;
}

// Case
export interface Case {
  id: string;
  case_id: string;
  parcel_id?: string;
  holding_id?: string;
  complaint_type: ComplaintType;
  complaint_subject: string;
  complaint_description: string;
  complainant_name: string;
  complainant_phone?: string;
  complainant_email?: string;
  complainant_address?: string;
  respondent_name?: string;
  respondent_phone?: string;
  respondent_address?: string;
  status: CaseStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to?: string;
  assigned_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  previous_case_id?: string;
}

// Evidence
export interface Evidence {
  id: string;
  evidence_id: string;
  case_id: string;
  investigation_id?: string;
  evidence_type: EvidenceType;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  description?: string;
  uploaded_by: string;
  upload_date: string;
  is_shared: boolean;
  shared_with?: string[];
  is_deleted: boolean;
  deleted_by?: string;
  deleted_at?: string;
  created_at: string;
}

// Investigation
export interface Investigation {
  id: string;
  case_id: string;
  investigator_id: string;
  investigation_status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  file_review?: string;
  document_verification?: string;
  field_inspection_date?: string;
  field_inspection_notes?: string;
  gis_verification?: string;
  interview_notes?: Record<string, any>;
  findings?: string;
  recommendation?: string;
  investigation_report_url?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Legal Review
export interface LegalReview {
  id: string;
  case_id: string;
  legal_reviewer_id: string;
  review_status: 'pending' | 'in_progress' | 'completed';
  applicable_law?: string;
  law_temporal_applicability?: string;
  tenure_legal_status?: string;
  lease_status?: string;
  compensation_issue?: string;
  replacement_land?: string;
  construction_permit?: string;
  decision_implementation?: string;
  other_legal_issues?: string;
  legal_opinion?: string;
  legal_recommendation?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Decision
export interface Decision {
  id: string;
  decision_id: string;
  case_id: string;
  decision_maker_id: string;
  decision_date: string;
  decision_content: string;
  decision_document_url?: string;
  decision_status: 'pending' | 'approved' | 'rejected' | 'returned_for_investigation';
  implementation_responsible_body?: string;
  implementation_deadline?: string;
  implementation_status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  implementation_notes?: string;
  created_at: string;
  updated_at: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'insert' | 'update' | 'delete';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_by: string;
  change_reason?: string;
  approved_by?: string;
  change_timestamp: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  case_id?: string;
  notification_type: 'case_assigned' | 'status_update' | 'evidence_uploaded' | 'decision_made' | 'implementation_update' | 'appeal_filed' | 'other';
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}
