import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';
import { Connection } from '../types/connection';
import { UserProfile } from '../types/user';

interface UserProfilesStore {
  // State
  userProfiles: UserProfile[];
  userConnections: Connection[];
  isLoading: boolean;
  error: string | null;

  // Profile actions
  createProfile: (profileData: Omit<Profile, 'id' | 'createdAt'>) => Promise<{ success: boolean; profileId?: string; error?: string }>;
  updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  deleteProfile: (profileId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Connection actions
  addConnection: (connectionData: Omit<Connection, 'id' | 'createdAt'>) => Promise<{ success: boolean; connectionId?: string; error?: string }>;
  updateConnection: (connectionId: string, updates: Partial<Connection>) => Promise<{ success: boolean; error?: string }>;
  deleteConnection: (connectionId: string) => Promise<{ success: boolean; error?: string }>;
  approveConnection: (connectionId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Getters
  getProfileById: (profileId: string) => UserProfile | undefined;
  getConnectionsByProfile: (profileId: string) => Connection[];
  getSourceConnections: (profileId: string) => Connection[];
  getDestinationConnections: (profileId: string) => Connection[];
  getTotalRevenue: () => number;
  getProfileRevenue: (profileId: string) => number;
  
  // Internal actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadUserData: (userId: string) => Promise<void>;
}

export const useUserProfilesStore = create<UserProfilesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfiles: [],
      userConnections: [],
      isLoading: false,
      error: null,

      // Profile actions
      createProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert({
              name: profileData.name,
              email: profileData.email,
              image: profileData.image,
              description: profileData.description,
              target_mrr: profileData.targetMrr,
              current_mrr: profileData.currentMrr,
              auto_calculate_mrr: profileData.autoCalculateMrr,
              type: profileData.type,
              company_type: profileData.companyType,
            })
            .select()
            .single();

          if (error) throw error;

          const newProfile: UserProfile = {
            id: data.id,
            userId: data.user_id,
            isOwned: true,
            lastUpdated: new Date(data.updated_at).getTime(),
            name: data.name,
            email: data.email,
            createdAt: new Date(data.created_at).getTime(),
            image: data.image,
            description: data.description,
            targetMrr: data.target_mrr,
            currentMrr: data.current_mrr,
            autoCalculateMrr: data.auto_calculate_mrr,
            type: data.type,
            companyType: data.company_type,
          };

          set(state => ({
            userProfiles: [...state.userProfiles, newProfile],
            isLoading: false
          }));

          return { success: true, profileId: newProfile.id };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile creation failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      updateProfile: async (profileId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              name: updates.name,
              email: updates.email,
              image: updates.image,
              description: updates.description,
              target_mrr: updates.targetMrr,
              current_mrr: updates.currentMrr,
              auto_calculate_mrr: updates.autoCalculateMrr,
              type: updates.type,
              company_type: updates.companyType,
            })
            .eq('id', profileId)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            userProfiles: state.userProfiles.map(profile =>
              profile.id === profileId 
                ? { 
                    ...profile, 
                    ...updates, 
                    lastUpdated: new Date(data.updated_at).getTime() 
                  }
                : profile
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      deleteProfile: async (profileId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', profileId);

          if (error) throw error;

          set(state => ({
            userProfiles: state.userProfiles.filter(profile => profile.id !== profileId),
            userConnections: state.userConnections.filter(
              conn => conn.sourceProfileId !== profileId && conn.destinationProfileId !== profileId
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile deletion failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Connection actions
      addConnection: async (connectionData) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('connections')
            .insert({
              initiated_by: connectionData.initiatedBy,
              source_profile_id: connectionData.sourceProfileId,
              destination_profile_id: connectionData.destinationProfileId,
              type: connectionData.type,
              status: connectionData.status,
              net: connectionData.net,
              is_public: connectionData.public,
              show_net: connectionData.showNet,
            })
            .select()
            .single();

          if (error) throw error;

          const newConnection: Connection = {
            id: data.id,
            createdAt: new Date(data.created_at).getTime(),
            initiatedBy: data.initiated_by,
            sourceProfileId: data.source_profile_id,
            destinationProfileId: data.destination_profile_id,
            type: data.type,
            status: data.status,
            net: data.net,
            public: data.is_public,
            showNet: data.show_net,
          };

          set(state => ({
            userConnections: [...state.userConnections, newConnection],
            isLoading: false
          }));

          return { success: true, connectionId: newConnection.id };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Connection creation failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      updateConnection: async (connectionId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('connections')
            .update({
              type: updates.type,
              status: updates.status,
              net: updates.net,
              is_public: updates.public,
              show_net: updates.showNet,
            })
            .eq('id', connectionId)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            userConnections: state.userConnections.map(connection =>
              connection.id === connectionId 
                ? { 
                    ...connection, 
                    type: data.type,
                    status: data.status,
                    net: data.net,
                    public: data.is_public,
                    showNet: data.show_net,
                  }
                : connection
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Connection update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      deleteConnection: async (connectionId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase
            .from('connections')
            .delete()
            .eq('id', connectionId);

          if (error) throw error;

          set(state => ({
            userConnections: state.userConnections.filter(connection => connection.id !== connectionId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Connection deletion failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      approveConnection: async (connectionId) => {
        return get().updateConnection(connectionId, { status: 'approved' });
      },

      // Getters
      getProfileById: (profileId) => {
        return get().userProfiles.find(profile => profile.id === profileId);
      },

      getConnectionsByProfile: (profileId) => {
        return get().userConnections.filter(
          conn => conn.sourceProfileId === profileId || conn.destinationProfileId === profileId
        );
      },

      getSourceConnections: (profileId) => {
        return get().userConnections.filter(conn => conn.destinationProfileId === profileId);
      },

      getDestinationConnections: (profileId) => {
        return get().userConnections.filter(conn => conn.sourceProfileId === profileId);
      },

      getTotalRevenue: () => {
        const { userProfiles, userConnections } = get();
        let totalRevenue = 0;
        
        userProfiles.forEach(profile => {
          const sourceConnections = userConnections.filter(
            conn => conn.destinationProfileId === profile.id && conn.status === 'approved'
          );
          const profileRevenue = sourceConnections.reduce((sum, conn) => sum + conn.net, 0);
          totalRevenue += profileRevenue;
        });
        
        return totalRevenue;
      },

      getProfileRevenue: (profileId) => {
        const sourceConnections = get().getSourceConnections(profileId);
        return sourceConnections
          .filter(conn => conn.status === 'approved')
          .reduce((sum, conn) => sum + conn.net, 0);
      },

      // Internal actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      loadUserData: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if Supabase is properly configured
          if (supabaseUrl === 'https://placeholder.supabase.co') {
            // Use mock data for development
            const mockProfiles: UserProfile[] = [
              {
                id: '550e8400-e29b-41d4-a716-446655440001',
                userId,
                isOwned: true,
                lastUpdated: Date.now(),
                name: 'Emīls Pļavenieks',
                createdAt: Date.now() - 86400000 * 30,
                image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Full-stack developer building innovative web applications',
                targetMrr: 44000,
                type: 'person'
              }
            ];

            const mockConnections: Connection[] = [
              {
                id: 'conn-001',
                createdAt: Date.now() - 86400000 * 10,
                initiatedBy: '550e8400-e29b-41d4-a716-446655440001',
                sourceProfileId: '550e8400-e29b-41d4-a716-446655440002',
                destinationProfileId: '550e8400-e29b-41d4-a716-446655440001',
                type: 'affiliate',
                status: 'approved',
                net: 2500,
                public: true,
                showNet: false
              }
            ];

            set({
              userProfiles: mockProfiles,
              userConnections: mockConnections,
              isLoading: false
            });
            return;
          }

          // Load user's profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId);

          if (profilesError) throw profilesError;

          // Load user's connections
          const profileIds = profilesData?.map(p => p.id) || [];
          let connectionsData: any[] = [];
          
          if (profileIds.length > 0) {
            const { data, error: connectionsError } = await supabase
              .from('connections')
              .select('*')
              .or(`source_profile_id.in.(${profileIds.join(',')}),destination_profile_id.in.(${profileIds.join(',')})`);

            if (connectionsError) throw connectionsError;
            connectionsData = data || [];
          }

          // Transform data
          const userProfiles: UserProfile[] = (profilesData || []).map(profile => ({
            id: profile.id,
            userId: profile.user_id,
            isOwned: true,
            lastUpdated: new Date(profile.updated_at).getTime(),
            name: profile.name,
            email: profile.email,
            createdAt: new Date(profile.created_at).getTime(),
            image: profile.image,
            description: profile.description,
            targetMrr: profile.target_mrr,
            currentMrr: profile.current_mrr,
            autoCalculateMrr: profile.auto_calculate_mrr,
            type: profile.type,
            companyType: profile.company_type,
          }));

          const userConnections: Connection[] = connectionsData.map(conn => ({
            id: conn.id,
            createdAt: new Date(conn.created_at).getTime(),
            initiatedBy: conn.initiated_by,
            sourceProfileId: conn.source_profile_id,
            destinationProfileId: conn.destination_profile_id,
            type: conn.type,
            status: conn.status,
            net: conn.net,
            public: conn.is_public,
            showNet: conn.show_net,
          }));

          set({
            userProfiles,
            userConnections,
            isLoading: false
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load user data';
          set({ error: errorMessage, isLoading: false });
        }
      },
    }),
    {
      name: 'user-profiles-store',
      partialize: (state) => ({
        // Cache user profiles and connections
        userProfiles: state.userProfiles,
        userConnections: state.userConnections,
      }),
    }
  )
);