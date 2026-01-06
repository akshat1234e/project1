-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#00F2FF',
    accent_color TEXT DEFAULT '#7000FF',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add organization_id to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" 
ON organizations FOR SELECT 
USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Update RLS Policies for other tables to include organization isolation
-- (Assuming existing policies exist, we would add organization_id checks)

-- Example for reports:
-- CREATE POLICY "Users can view reports in their organization"
-- ON reports FOR SELECT
-- USING (
--     organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
-- );
