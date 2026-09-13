CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'investigator', 'complainant', 'legal_reviewer', 'decision_maker', 'analyst')),
  region TEXT,
  zone TEXT,
  city TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Only admin can insert users" ON users FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id::text FROM users WHERE role = 'admin' LIMIT 1));
CREATE POLICY "Only admin can update users" ON users FOR UPDATE WITH CHECK (auth.uid()::text = (SELECT id::text FROM users WHERE role = 'admin' LIMIT 1));

CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id TEXT UNIQUE NOT NULL,
  location_address TEXT NOT NULL,
  region TEXT,
  zone TEXT,
  city TEXT,
  woreda TEXT,
  kebele TEXT,
  land_use TEXT CHECK (land_use IN ('residential', 'commercial', 'industrial', 'institutional', 'religious', 'government', 'mixed', 'other')),
  area_sqm DECIMAL(12, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  boundary_description TEXT,
  map_reference TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parcels are viewable by all" ON parcels FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS tenure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  holding_id TEXT UNIQUE NOT NULL,
  owner_name TEXT NOT NULL,
  owner_id_type TEXT,
  owner_id_number TEXT,
  tenure_type TEXT CHECK (tenure_type IN ('owned', 'leased', 'usufruct', 'other')),
  tenure_status TEXT CHECK (tenure_status IN ('active', 'disputed', 'transferred', 'cancelled')),
  documents JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE tenure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenure is viewable by all" ON tenure FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT UNIQUE NOT NULL,
  parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  holding_id UUID REFERENCES tenure(id) ON DELETE SET NULL,
  complaint_type TEXT NOT NULL CHECK (complaint_type IN ('ownership_dispute', 'boundary_issue', 'illegal_occupancy', 'document_issue', 'lease_dispute', 'compensation', 'replacement_land', 'construction_permit', 'site_plan', 'land_transfer', 'service_delay', 'previous_decision_non_implementation', 'other')),
  complaint_subject TEXT NOT NULL,
  complaint_description TEXT NOT NULL,
  complainant_name TEXT NOT NULL,
  complainant_phone TEXT,
  complainant_email TEXT,
  complainant_address TEXT,
  respondent_name TEXT,
  respondent_phone TEXT,
  respondent_address TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'screening', 'classification', 'assigned', 'investigation', 'evidence_pending', 'legal_review', 'decision_pending', 'decided', 'implementation', 'closed', 'reopened', 'appealed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_date TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  previous_case_id TEXT
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cases are viewable by authorized users" ON cases FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'officer', 'investigator', 'legal_reviewer', 'decision_maker', 'analyst'))
  OR created_by = auth.uid()
);
CREATE POLICY "Complainants can insert cases" ON cases FOR INSERT WITH CHECK (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'officer', 'complainant'))
);
CREATE POLICY "Assigned officers can update cases" ON cases FOR UPDATE WITH CHECK (
  assigned_to = auth.uid() OR created_by = auth.uid() OR 
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'officer'))
);

CREATE TABLE IF NOT EXISTS investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  investigator_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  investigation_status TEXT NOT NULL DEFAULT 'pending' CHECK (investigation_status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  file_review TEXT,
  document_verification TEXT,
  field_inspection_date TIMESTAMP,
  field_inspection_notes TEXT,
  gis_verification TEXT,
  interview_notes JSONB,
  findings TEXT,
  recommendation TEXT,
  investigation_report_url TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investigations viewable by authorized users" ON investigations FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'investigator', 'legal_reviewer', 'decision_maker'))
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id TEXT UNIQUE NOT NULL,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('photo', 'video', 'audio', 'document', 'gps_location', 'other')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  upload_date TIMESTAMP DEFAULT NOW(),
  is_shared BOOLEAN DEFAULT false,
  shared_with JSONB,
  is_deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evidence viewable by case participants" ON evidence FOR SELECT USING (
  NOT is_deleted AND (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'investigator', 'legal_reviewer', 'decision_maker'))
    OR case_id IN (SELECT id FROM cases WHERE created_by = auth.uid())
  )
);

CREATE TABLE IF NOT EXISTS legal_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  legal_reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_progress', 'completed')),
  applicable_law TEXT,
  law_temporal_applicability TEXT,
  tenure_legal_status TEXT,
  lease_status TEXT,
  compensation_issue TEXT,
  replacement_land TEXT,
  construction_permit TEXT,
  decision_implementation TEXT,
  other_legal_issues TEXT,
  legal_opinion TEXT,
  legal_recommendation TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE legal_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Legal reviews viewable by authorized users" ON legal_reviews FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'legal_reviewer', 'decision_maker'))
);

CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id TEXT UNIQUE NOT NULL,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  decision_maker_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  decision_date TIMESTAMP DEFAULT NOW(),
  decision_content TEXT NOT NULL,
  decision_document_url TEXT,
  decision_status TEXT NOT NULL DEFAULT 'pending' CHECK (decision_status IN ('pending', 'approved', 'rejected', 'returned_for_investigation')),
  implementation_responsible_body TEXT,
  implementation_deadline TIMESTAMP,
  implementation_status TEXT DEFAULT 'pending' CHECK (implementation_status IN ('pending', 'in_progress', 'completed', 'delayed')),
  implementation_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Decisions viewable by authorized users" ON decisions FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'decision_maker', 'officer', 'analyst'))
  OR case_id IN (SELECT id FROM cases WHERE created_by = auth.uid())
);

CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id TEXT UNIQUE NOT NULL,
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('appeal', 'reopening', 'follow_up', 'monitoring', 'enforcement')),
  action_description TEXT,
  responsible_body TEXT,
  action_date TIMESTAMP,
  expected_completion_date TIMESTAMP,
  actual_completion_date TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Actions viewable by authorized users" ON actions FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'officer', 'analyst'))
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT UNIQUE NOT NULL,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('complaint', 'investigation_report', 'legal_review', 'decision', 'implementation_report', 'appeal', 'other')),
  document_name TEXT NOT NULL,
  document_url TEXT,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  upload_date TIMESTAMP DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Documents viewable by case participants" ON documents FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'officer', 'investigator', 'legal_reviewer', 'decision_maker'))
  OR case_id IN (SELECT id FROM cases WHERE created_by = auth.uid())
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  change_reason TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  change_timestamp TIMESTAMP DEFAULT NOW()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit log viewable by admin and analysts" ON audit_log FOR SELECT USING (
  auth.uid()::text IN (SELECT id::text FROM users WHERE role IN ('admin', 'analyst'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('case_assigned', 'status_update', 'evidence_uploaded', 'decision_made', 'implementation_update', 'appeal_filed', 'other')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid()
);

CREATE INDEX idx_cases_parcel_id ON cases(parcel_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_assigned_to ON cases(assigned_to);
CREATE INDEX idx_cases_created_at ON cases(created_at);
CREATE INDEX idx_investigations_case_id ON investigations(case_id);
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_legal_reviews_case_id ON legal_reviews(case_id);
CREATE INDEX idx_decisions_case_id ON decisions(case_id);
CREATE INDEX idx_actions_case_id ON actions(case_id);
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_parcels_location ON parcels(region, zone, city);