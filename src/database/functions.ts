// Database functions and utilities for type-safe Supabase operations

import { supabase } from '../lib/supabase';
import type { 
  DatabaseUser, 
  DatabaseProfile, 
  DatabaseConnection,
  DatabaseUserInsert,
  DatabaseUserUpdate,
  DatabaseProfileInsert,
  DatabaseProfileUpdate,
  DatabaseConnectionInsert,
  DatabaseConnectionUpdate,
  ProfileWithStats,
  ConnectionWithProfiles,
  RevenueAnalytics,
  PlatformStats
} from './schema';

// User operations
export const userOperations = {
  async create(userData: DatabaseUserInsert) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getBySupabaseId(supabaseId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_id', supabaseId)
      .single();
    
    return { data, error };
  },

  async update(id: string, updates: DatabaseUserUpdate) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Profile operations
export const profileOperations = {
  async create(profileData: DatabaseProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getPublic(limit?: number) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async getFeatured(limit?: number) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_featured', true)
      .eq('is_public', true)
      .order('view_count', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async search(query: string, filters?: { type?: string; company_type?: string }) {
    let dbQuery = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .textSearch('name,description', query);
    
    if (filters?.type) {
      dbQuery = dbQuery.eq('type', filters.type);
    }
    
    if (filters?.company_type) {
      dbQuery = dbQuery.eq('company_type', filters.company_type);
    }
    
    const { data, error } = await dbQuery
      .order('view_count', { ascending: false })
      .limit(50);
    
    return { data, error };
  },

  async update(id: string, updates: DatabaseProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_profile_views', {
      profile_uuid: id
    });
    
    return { error };
  },

  async getWithStats(id: string): Promise<{ data: ProfileWithStats | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        image,
        description,
        type,
        company_type,
        target_mrr,
        current_mrr,
        view_count,
        is_featured,
        created_at,
        connections:connections!destination_profile_id(count),
        revenue:connections!destination_profile_id(net)
      `)
      .eq('id', id)
      .single();
    
    if (error) return { data: null, error };
    
    // Transform the data to match ProfileWithStats interface
    const profileWithStats: ProfileWithStats = {
      ...data,
      total_connections: data.connections?.[0]?.count || 0,
      total_revenue: data.revenue?.reduce((sum: number, conn: any) => sum + (conn.net || 0), 0) || 0
    };
    
    return { data: profileWithStats, error: null };
  }
};

// Connection operations
export const connectionOperations = {
  async create(connectionData: DatabaseConnectionInsert) {
    const { data, error } = await supabase
      .from('connections')
      .insert(connectionData)
      .select()
      .single();
    
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .or(`source_profile_id.eq.${profileId},destination_profile_id.eq.${profileId}`)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getSourceConnections(profileId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('destination_profile_id', profileId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getDestinationConnections(profileId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('source_profile_id', profileId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getWithProfiles(profileId: string): Promise<{ data: ConnectionWithProfiles[] | null; error: any }> {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        type,
        status,
        net,
        is_public,
        show_net,
        created_at,
        source_profile:profiles!source_profile_id(id, name, image, type),
        destination_profile:profiles!destination_profile_id(id, name, image, type)
      `)
      .or(`source_profile_id.eq.${profileId},destination_profile_id.eq.${profileId}`)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async update(id: string, updates: DatabaseConnectionUpdate) {
    const { data, error } = await supabase
      .from('connections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async approve(id: string, approvedBy: string) {
    const { data, error } = await supabase
      .from('connections')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvedBy
      })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async reject(id: string) {
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Analytics operations
export const analyticsOperations = {
  async getProfileAnalytics(profileId: string): Promise<{ data: RevenueAnalytics | null; error: any }> {
    const { data, error } = await supabase.rpc('get_profile_analytics', {
      profile_uuid: profileId
    });
    
    if (error) return { data: null, error };
    
    // Get top revenue sources
    const { data: topSources } = await supabase
      .from('connections')
      .select(`
        net,
        source_profile:profiles!source_profile_id(id, name)
      `)
      .eq('destination_profile_id', profileId)
      .eq('status', 'approved')
      .order('net', { ascending: false })
      .limit(5);
    
    const analytics: RevenueAnalytics = {
      profile_id: profileId,
      total_revenue: data[0]?.total_revenue || 0,
      monthly_revenue: data[0]?.monthly_revenue || 0,
      revenue_growth: data[0]?.revenue_growth || 0,
      connection_count: data[0]?.connection_count || 0,
      top_sources: topSources?.map(conn => ({
        profile_id: conn.source_profile.id,
        profile_name: conn.source_profile.name,
        revenue: conn.net
      })) || []
    };
    
    return { data: analytics, error: null };
  },

  async getPlatformStats(): Promise<{ data: PlatformStats | null; error: any }> {
    const [usersResult, profilesResult, connectionsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id, target_mrr', { count: 'exact' }),
      supabase.from('connections').select('id, net', { count: 'exact' })
    ]);
    
    if (usersResult.error || profilesResult.error || connectionsResult.error) {
      return { 
        data: null, 
        error: usersResult.error || profilesResult.error || connectionsResult.error 
      };
    }
    
    const totalRevenue = connectionsResult.data?.reduce((sum, conn) => sum + (conn.net || 0), 0) || 0;
    
    const stats: PlatformStats = {
      total_users: usersResult.count || 0,
      total_profiles: profilesResult.count || 0,
      total_connections: connectionsResult.count || 0,
      total_revenue: totalRevenue,
      monthly_growth: 0, // Would need more complex query for actual growth calculation
      active_users_30d: 0 // Would need user activity tracking
    };
    
    return { data: stats, error: null };
  },

  async recordProfileView(profileId: string, viewerData?: { ip?: string; userId?: string; referrer?: string; userAgent?: string }) {
    const { error } = await supabase
      .from('profile_views')
      .insert({
        profile_id: profileId,
        viewer_ip: viewerData?.ip,
        viewer_user_id: viewerData?.userId,
        referrer: viewerData?.referrer,
        user_agent: viewerData?.userAgent
      });
    
    return { error };
  }
};

// Notification operations
export const notificationOperations = {
  async create(userId: string, notification: {
    type: 'connection_request' | 'connection_approved' | 'profile_mention' | 'system';
    title: string;
    message: string;
    data?: Record<string, any>;
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...notification
      })
      .select()
      .single();
    
    return { data, error };
  },

  async getByUserId(userId: string, limit?: number) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    return { error };
  }
};

// Utility functions
export const utilityOperations = {
  async calculateProfileRevenue(profileId: string) {
    const { data, error } = await supabase.rpc('calculate_profile_revenue', {
      profile_uuid: profileId
    });
    
    return { data: data || 0, error };
  },

  async searchProfiles(query: string, options?: {
    limit?: number;
    type?: 'person' | 'company';
    companyType?: string;
  }) {
    let dbQuery = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true);
    
    if (query) {
      dbQuery = dbQuery.textSearch('name,description', query);
    }
    
    if (options?.type) {
      dbQuery = dbQuery.eq('type', options.type);
    }
    
    if (options?.companyType) {
      dbQuery = dbQuery.eq('company_type', options.companyType);
    }
    
    if (options?.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }
    
    const { data, error } = await dbQuery
      .order('view_count', { ascending: false });
    
    return { data, error };
  }
};