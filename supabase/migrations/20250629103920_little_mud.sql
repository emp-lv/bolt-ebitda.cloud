/*
  # Initial Database Schema for My Earnings Platform

  1. New Tables
    - `users` - User accounts and authentication data
    - `profiles` - Revenue stream profiles (personal/company)
    - `connections` - Revenue connections between profiles
    - `profile_views` - Analytics for profile views
    - `notifications` - User notifications system
    - `api_keys` - API access keys for integrations
    - `audit_logs` - System audit trail

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for public profile visibility

  3. Indexes
    - Performance indexes for common queries
    - Full-text search indexes

  4. Functions
    - Revenue calculation functions
    - Analytics aggregation functions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = supabase_id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = supabase_id);

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

CREATE POLICY "Users can create profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

CREATE POLICY "Users can update own profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

CREATE POLICY "Users can delete own profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

-- Connections policies
CREATE POLICY "Public connections are viewable by everyone"
  ON connections FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Users can view connections involving their profiles"
  ON connections FOR SELECT
  TO authenticated
  USING (
    source_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
    OR destination_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

CREATE POLICY "Users can create connections from their profiles"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (
    initiated_by IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

CREATE POLICY "Users can update connections involving their profiles"
  ON connections FOR UPDATE
  TO authenticated
  USING (
    source_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
    OR destination_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

CREATE POLICY "Users can delete connections involving their profiles"
  ON connections FOR DELETE
  TO authenticated
  USING (
    source_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
    OR destination_profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

-- Profile views policies
CREATE POLICY "Anyone can create profile views"
  ON profile_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view analytics for their profiles"
  ON profile_views FOR SELECT
  TO authenticated
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()))
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

-- API keys policies
CREATE POLICY "Users can manage own API keys"
  ON api_keys FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

-- Audit logs policies
CREATE POLICY "Users can view audit logs for their actions"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()));

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

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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

-- Function to get profile analytics
CREATE OR REPLACE FUNCTION get_profile_analytics(profile_uuid uuid)
RETURNS TABLE(
  total_revenue integer,
  monthly_revenue integer,
  connection_count integer,
  view_count integer,
  revenue_growth numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    calculate_profile_revenue(profile_uuid) as total_revenue,
    COALESCE(
      (SELECT SUM(net) 
       FROM connections 
       WHERE destination_profile_id = profile_uuid 
       AND status = 'approved'
       AND created_at >= date_trunc('month', now())),
      0
    )::integer as monthly_revenue,
    (SELECT COUNT(*)::integer 
     FROM connections 
     WHERE (source_profile_id = profile_uuid OR destination_profile_id = profile_uuid)
     AND status = 'approved') as connection_count,
    (SELECT p.view_count 
     FROM profiles p 
     WHERE p.id = profile_uuid) as view_count,
    COALESCE(
      (SELECT 
        CASE 
          WHEN prev_month.revenue = 0 THEN 0
          ELSE ((curr_month.revenue - prev_month.revenue)::numeric / prev_month.revenue) * 100
        END
       FROM 
        (SELECT COALESCE(SUM(net), 0) as revenue
         FROM connections 
         WHERE destination_profile_id = profile_uuid 
         AND status = 'approved'
         AND created_at >= date_trunc('month', now())) curr_month,
        (SELECT COALESCE(SUM(net), 0) as revenue
         FROM connections 
         WHERE destination_profile_id = profile_uuid 
         AND status = 'approved'
         AND created_at >= date_trunc('month', now() - interval '1 month')
         AND created_at < date_trunc('month', now())) prev_month),
      0
    ) as revenue_growth;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;