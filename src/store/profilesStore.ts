import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';
import { Connection } from '../types/connection';
import { profiles as initialProfiles } from '../data/profiles';
import { connections as initialConnections } from '../data/connections';

// Get supabase URL for checking if properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';

interface ProfilesStore {
  // State
  profiles: Profile[];
  connections: Connection[];
  isLoading: boolean;
  error: string | null;
  
  // Cache management
  lastFetched: Record<string, number>;
  
  // Actions
  fetchProfile: (profileId: string) => Promise<{ success: boolean; error?: string }>;
  fetchProfileConnections: (profileId: string) => Promise<{ success: boolean; error?: string }>;
  searchProfiles: (query: string, filters?: { type?: 'person' | 'company'; companyType?: string }) => Profile[];
  
  // Getters
  getProfileById: (profileId: string) => Profile | undefined;
  getConnectionsByProfile: (profileId: string) => Connection[];
  getSourceConnections: (profileId: string) => Connection[];
  getDestinationConnections: (profileId: string) => Connection[];
  getPublicProfiles: () => Profile[];
  getFeaturedProfiles: () => Profile[];
  
  // Cache management
  isProfileCached: (profileId: string) => boolean;
  shouldRefreshProfile: (profileId: string) => boolean;
  
  // Internal actions
  addProfile: (profile: Profile) => void;
  addConnection: (connection: Connection) => void;
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfilesStore = create<ProfilesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profiles: initialProfiles,
      connections: initialConnections,
      isLoading: false,
      error: null,
      lastFetched: {},

      // Actions
      fetchProfile: async (profileId) => {
        const { isProfileCached, shouldRefreshProfile } = get();
        
        if (isProfileCached(profileId) && !shouldRefreshProfile(profileId)) {
          return { success: true };
        }

        set({ isLoading: true, error: null });
        
        try {
          // Check if Supabase is properly configured
          if (supabaseUrl === 'https://placeholder.supabase.co') {
            // Use existing mock data
            const existingProfile = get().profiles.find(p => p.id === profileId);
            if (existingProfile) {
              set(state => ({
                lastFetched: { ...state.lastFetched, [profileId]: Date.now() },
                isLoading: false
              }));
              return { success: true };
            }
            
            set({ isLoading: false, error: 'Profile not found' });
            return { success: false, error: 'Profile not found' };
          }
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .eq('is_public', true)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              set({ isLoading: false, error: 'Profile not found' });
              return { success: false, error: 'Profile not found' };
            }
            throw error;
          }

          const profile: Profile = {
            id: data.id,
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
            profiles: state.profiles.some(p => p.id === profileId)
              ? state.profiles.map(p => p.id === profileId ? profile : p)
              : [...state.profiles, profile],
            lastFetched: { ...state.lastFetched, [profileId]: Date.now() },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      fetchProfileConnections: async (profileId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`source_profile_id.eq.${profileId},destination_profile_id.eq.${profileId}`)
            .eq('is_public', true)
            .eq('status', 'approved');

          if (error) throw error;

          const connections: Connection[] = (data || []).map(conn => ({
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

          set(state => ({
            connections: [
              ...state.connections.filter(c => 
                c.sourceProfileId !== profileId && c.destinationProfileId !== profileId
              ),
              ...connections
            ],
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch connections';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      searchProfiles: (query, filters) => {
        const { profiles } = get();
        
        return profiles.filter(profile => {
          // Text search
          const matchesQuery = query === '' || 
            profile.name.toLowerCase().includes(query.toLowerCase()) ||
            profile.description.toLowerCase().includes(query.toLowerCase());
          
          // Type filter
          const matchesType = !filters?.type || profile.type === filters.type;
          
          // Company type filter
          const matchesCompanyType = !filters?.companyType || 
            profile.companyType === filters.companyType;
          
          return matchesQuery && matchesType && matchesCompanyType;
        });
      },

      // Getters
      getProfileById: (profileId) => {
        return get().profiles.find(profile => profile.id === profileId);
      },

      getConnectionsByProfile: (profileId) => {
        return get().connections.filter(
          conn => conn.sourceProfileId === profileId || conn.destinationProfileId === profileId
        );
      },

      getSourceConnections: (profileId) => {
        return get().connections.filter(conn => conn.destinationProfileId === profileId);
      },

      getDestinationConnections: (profileId) => {
        return get().connections.filter(conn => conn.sourceProfileId === profileId);
      },

      getPublicProfiles: () => {
        return get().profiles;
      },

      getFeaturedProfiles: () => {
        // Return top profiles by target MRR or other criteria
        return get().profiles
          .sort((a, b) => b.targetMrr - a.targetMrr)
          .slice(0, 6);
      },

      // Cache management
      isProfileCached: (profileId) => {
        const { profiles, lastFetched } = get();
        return profiles.some(p => p.id === profileId) && !!lastFetched[profileId];
      },

      shouldRefreshProfile: (profileId) => {
        const { lastFetched } = get();
        const lastFetch = lastFetched[profileId];
        return !lastFetch || (Date.now() - lastFetch) > CACHE_DURATION;
      },

      // Internal actions
      addProfile: (profile) => {
        set(state => ({
          profiles: state.profiles.some(p => p.id === profile.id)
            ? state.profiles.map(p => p.id === profile.id ? profile : p)
            : [...state.profiles, profile],
          lastFetched: { ...state.lastFetched, [profile.id]: Date.now() }
        }));
      },

      addConnection: (connection) => {
        set(state => ({
          connections: state.connections.some(c => c.id === connection.id)
            ? state.connections.map(c => c.id === connection.id ? connection : c)
            : [...state.connections, connection]
        }));
      },

      updateProfile: (profileId, updates) => {
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === profileId ? { ...profile, ...updates } : profile
          ),
          lastFetched: { ...state.lastFetched, [profileId]: Date.now() }
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'profiles-store',
      partialize: (state) => ({
        profiles: state.profiles,
        connections: state.connections,
        lastFetched: state.lastFetched,
      }),
    }
  )
);