-- =====================================================
-- COMPLETE DATABASE SETUP AND DATA POPULATION
-- Copy and paste this entire script into Supabase SQL Editor
-- This will create all tables and populate them with mocked data
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_sponsor boolean DEFAULT false,
  sponsor_since timestamptz,
  avatar_url text,
  supabase_id uuid UNIQUE NOT NULL,
  email_verified boolean DEFAULT false,
  last_sign_in timestamptz
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  image text NOT NULL,
  description text NOT NULL,
  current_mrr integer DEFAULT 0,
  auto_calculate_mrr boolean DEFAULT false,
  target_mrr integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('person', 'company')),
  company_type text,
  is_public boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  last_activity timestamptz
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  initiated_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  destination_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('owner', 'affiliate', 'partner', 'other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  net integer NOT NULL DEFAULT 0,
  is_public boolean DEFAULT true,
  show_net boolean DEFAULT false,
  notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id),
  
  -- Prevent self-connections
  CONSTRAINT no_self_connection CHECK (source_profile_id != destination_profile_id),
  -- Prevent duplicate connections
  UNIQUE(source_profile_id, destination_profile_id)
);

-- Profile views table for analytics
CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_ip inet,
  viewer_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now(),
  referrer text,
  user_agent text
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('connection_request', 'connection_approved', 'profile_mention', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- API keys table for integrations
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  permissions text[] DEFAULT '{}',
  last_used timestamptz,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_connections_source_profile ON connections(source_profile_id);
CREATE INDEX IF NOT EXISTS idx_connections_destination_profile ON connections(destination_profile_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_created_at ON connections(created_at);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(to_tsvector('english', name || ' ' || description));

-- =====================================================
-- 3. CREATE FUNCTIONS
-- =====================================================

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connections_updated_at ON connections;
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate profile revenue
CREATE OR REPLACE FUNCTION calculate_profile_revenue(profile_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(net) 
     FROM connections 
     WHERE destination_profile_id = profile_uuid 
     AND status = 'approved'),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile view count
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET view_count = view_count + 1,
      last_activity = now()
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. POPULATE WITH MOCKED DATA
-- =====================================================

-- Insert placeholder user
INSERT INTO users (
  id, 
  supabase_id, 
  email, 
  name, 
  email_verified, 
  created_at
) VALUES (
  '6c3ccd93-7f8b-4093-a119-12a054e771bc', 
  '6c3ccd93-7f8b-4093-a119-12a054e771bc'::uuid, 
  'emils@plavenieks.lv', 
  'Emīls Pļavenieks', 
  true, 
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  email_verified = EXCLUDED.email_verified;

-- Insert profiles from mocked data
INSERT INTO profiles (
  id,
  user_id,
  name,
  email,
  image,
  description,
  target_mrr,
  current_mrr,
  type,
  company_type,
  is_public,
  is_featured,
  view_count,
  created_at
) VALUES
  -- Emīls Pļavenieks (person, sponsored)
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '6c3ccd93-7f8b-4093-a119-12a054e771bc',
    'Emīls Pļavenieks',
    'emils@plavenieks.lv',
    'https://avatars.githubusercontent.com/u/16500803?v=4',
    'Full-stack developer building innovative web applications',
    44000,
    15000,
    'person',
    null,
    true,
    true,
    0,
    now() - interval '15 days'
  ),
  -- Vidyly (SaaS company, sponsored)
  (
    '550e8400-e29b-41d4-a716-446655440002',
    null,
    'Vidyly',
    null,
    'https://avatars.githubusercontent.com/u/150893289?s=400&u=aaa0e43c059339a3dfa1fa303de6f8d4f86089fb&v=4',
    'SaaS platform for digitalization of business processes',
    30000,
    1600,
    'company',
    'SaaS',
    true,
    true,
    0,
    now() - interval '15 days'
  ),
  -- ProductionLine.io (SaaS company)
  (
    '550e8400-e29b-41d4-a716-446655440004',
    null,
    'ProductionLine.io',
    null,
    'https://demo.productionline.io/assets/logo.png',
    'Digitalize factory processes with trackable tasks',
    10000,
    1000,
    'company',
    'SaaS',
    true,
    false,
    0,
    now() - interval '15 days'
  ),
  -- Stripe (Other company)
  (
    '550e8400-e29b-41d4-a716-446655440005',
    null,
    'Stripe',
    null,
    'https://thetribe.io/wp-content/uploads/Logo-Stripe-1080x675-1.jpg',
    'Payment processing for online businesses',
    0,
    0,
    'company',
    'Other',
    true,
    false,
    0,
    now() - interval '15 days'
  ),
  -- Hetzner (Other company)
  (
    '550e8400-e29b-41d4-a716-446655440006',
    null,
    'Hetzner',
    null,
    'https://www.svgrepo.com/show/331425/hetzner.svg',
    'Cloud hosting provider',
    0,
    0,
    'company',
    'Other',
    true,
    false,
    0,
    now() - interval '15 days'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  target_mrr = EXCLUDED.target_mrr,
  current_mrr = EXCLUDED.current_mrr,
  type = EXCLUDED.type,
  company_type = EXCLUDED.company_type;

-- Insert connections from mocked data
INSERT INTO connections (
  id,
  initiated_by,
  source_profile_id,
  destination_profile_id,
  type,
  status,
  net,
  is_public,
  show_net,
  created_at,
  approved_at,
  approved_by
) VALUES
  -- Vidyly → Emīls (source connection)
  (
    '550e8400-e29b-41d4-a712-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'partner',
    'approved',
    533, -- 1600 / 3 rounded
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  -- ProductionLine.io → Emīls (source connection)
  (
    '550e8400-e29b-41d4-a712-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    'partner',
    'approved',
    333, -- 1000 / 3 rounded
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  -- Emīls → Stripe (destination connection)
  (
    '550e8400-e29b-41d4-a712-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440005',
    'other',
    'approved',
    200,
    true,
    false,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440005'
  ),
  -- Emīls → Hetzner (destination connection)
  (
    '550e8400-e29b-41d4-a712-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440006',
    'other',
    'approved',
    60,
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440006'
  )
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  net = EXCLUDED.net,
  is_public = EXCLUDED.is_public,
  show_net = EXCLUDED.show_net;

-- Insert sample profile views for analytics testing
INSERT INTO profile_views (profile_id, viewer_ip, viewed_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.1', now() - interval '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.2', now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.3', now() - interval '1 day'),
  ('550e8400-e29b-41d4-a716-446655440002', '192.168.1.4', now() - interval '3 hours'),
  ('550e8400-e29b-41d4-a716-446655440002', '192.168.1.5', now() - interval '1 day'),
  ('550e8400-e29b-41d4-a716-446655440004', '192.168.1.6', now() - interval '30 minutes'),
  ('550e8400-e29b-41d4-a716-446655440005', '192.168.1.7', now() - interval '4 hours'),
  ('550e8400-e29b-41d4-a716-446655440006', '192.168.1.8', now() - interval '6 hours');

-- Update profile view counts based on sample data
UPDATE profiles SET view_count = (
  SELECT COUNT(*) FROM profile_views WHERE profile_views.profile_id = profiles.id
);

-- Insert sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', 'connection_request', 'New Connection Request', 'Vidyly wants to connect with you', '{"connection_id": "550e8400-e29b-41d4-a712-446655440001", "profile_name": "Vidyly"}', now() - interval '10 days'),
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', 'connection_approved', 'Connection Approved', 'Your connection with ProductionLine.io has been approved', '{"connection_id": "550e8400-e29b-41d4-a712-446655440002", "profile_name": "ProductionLine.io"}', now() - interval '9 days');

-- =====================================================
-- 5. VERIFICATION
-- =====================================================

-- Verify the data was created correctly
SELECT 'Database setup completed!' as status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as connection_count FROM connections;
SELECT COUNT(*) as profile_view_count FROM profile_views;
SELECT COUNT(*) as notification_count FROM notifications;

-- Show sample data
SELECT 'Sample profiles:' as info;
SELECT id, name, type, current_mrr, target_mrr FROM profiles ORDER BY created_at;

SELECT 'Sample connections:' as info;
SELECT id, source_profile_id, destination_profile_id, type, status, net FROM connections ORDER BY created_at; 