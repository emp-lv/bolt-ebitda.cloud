// Database schema definitions for Supabase
// These types match the SQL schema and can be used for type-safe database operations

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  is_sponsor: boolean;
  sponsor_since: string | null;
  avatar_url: string | null;
  supabase_id: string;
  email_verified: boolean;
  last_sign_in: string | null;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  user_id: string | null; // null for public profiles not owned by any user
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  image: string;
  description: string;
  current_mrr: number | null;
  auto_calculate_mrr: boolean;
  target_mrr: number;
  type: 'person' | 'company';
  company_type: string | null;
  is_public: boolean;
  is_featured: boolean;
  view_count: number;
  last_activity: string | null;
}

export interface DatabaseConnection {
  id: string;
  created_at: string;
  updated_at: string;
  initiated_by: string; // profile_id who initiated
  source_profile_id: string;
  destination_profile_id: string;
  type: 'owner' | 'affiliate' | 'partner' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  net: number;
  is_public: boolean;
  show_net: boolean;
  notes: string | null;
  approved_at: string | null;
  approved_by: string | null;
}

export interface DatabaseProfileView {
  id: string;
  profile_id: string;
  viewer_ip: string | null;
  viewer_user_id: string | null;
  viewed_at: string;
  referrer: string | null;
  user_agent: string | null;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  type: 'connection_request' | 'connection_approved' | 'profile_mention' | 'system';
  title: string;
  message: string;
  data: Record<string, any> | null; // JSON data
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface DatabaseApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  permissions: string[]; // Array of permission strings
  last_used: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAuditLog {
  id: string;
  user_id: string | null;
  profile_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Utility types for database operations
export type DatabaseUserInsert = Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>;
export type DatabaseUserUpdate = Partial<Omit<DatabaseUser, 'id' | 'created_at' | 'supabase_id'>>;

export type DatabaseProfileInsert = Omit<DatabaseProfile, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'last_activity'>;
export type DatabaseProfileUpdate = Partial<Omit<DatabaseProfile, 'id' | 'created_at' | 'user_id'>>;

export type DatabaseConnectionInsert = Omit<DatabaseConnection, 'id' | 'created_at' | 'updated_at' | 'approved_at' | 'approved_by'>;
export type DatabaseConnectionUpdate = Partial<Omit<DatabaseConnection, 'id' | 'created_at' | 'initiated_by' | 'source_profile_id' | 'destination_profile_id'>>;

// View types for complex queries
export interface ProfileWithStats {
  id: string;
  name: string;
  image: string;
  description: string;
  type: 'person' | 'company';
  company_type: string | null;
  target_mrr: number;
  current_mrr: number | null;
  total_connections: number;
  total_revenue: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface ConnectionWithProfiles {
  id: string;
  type: 'owner' | 'affiliate' | 'partner' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  net: number;
  is_public: boolean;
  show_net: boolean;
  created_at: string;
  source_profile: {
    id: string;
    name: string;
    image: string;
    type: 'person' | 'company';
  };
  destination_profile: {
    id: string;
    name: string;
    image: string;
    type: 'person' | 'company';
  };
}

export interface UserWithProfiles {
  id: string;
  email: string;
  name: string;
  is_sponsor: boolean;
  created_at: string;
  profiles: ProfileWithStats[];
  total_revenue: number;
  total_profiles: number;
}

// Database function return types
export interface RevenueAnalytics {
  profile_id: string;
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  connection_count: number;
  top_sources: Array<{
    profile_id: string;
    profile_name: string;
    revenue: number;
  }>;
}

export interface PlatformStats {
  total_users: number;
  total_profiles: number;
  total_connections: number;
  total_revenue: number;
  monthly_growth: number;
  active_users_30d: number;
}