import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getCurrentUser, getUserProfile, createUserProfile, supabaseUrl } from '../lib/supabase';
import { User, AuthState } from '../types/user';

interface UserStore extends AuthState {
  currentUser: User | null;
  
  // Auth actions
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // User actions
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  upgradeToSponsor: () => Promise<{ success: boolean; error?: string }>;
  cancelSponsorship: () => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  
  // Internal actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Auth actions
      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if Supabase is properly configured
          if (supabaseUrl === 'https://placeholder.supabase.co') {
            // Fallback to mock data for development
            const mockUser: User = {
              id: `user-${Date.now()}`,
              email,
              name,
              createdAt: Date.now(),
              isSponsor: false,
              supabaseId: `supabase-${Date.now()}`,
              emailVerified: false,
            };

            set({ 
              currentUser: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            });

            return { success: true };
          }

          // Sign up with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('No user returned from signup');

          // Create user profile in our users table
          const userProfile = await createUserProfile(authData.user, name);

          const user: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            createdAt: new Date(userProfile.created_at).getTime(),
            isSponsor: userProfile.is_sponsor,
            sponsorSince: userProfile.sponsor_since ? new Date(userProfile.sponsor_since).getTime() : undefined,
            avatarUrl: userProfile.avatar_url,
            supabaseId: userProfile.supabase_id,
            emailVerified: userProfile.email_verified,
            lastSignIn: userProfile.last_sign_in ? new Date(userProfile.last_sign_in).getTime() : undefined,
          };

          set({ 
            currentUser: user, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if Supabase is properly configured
          if (supabaseUrl === 'https://placeholder.supabase.co') {
            // Fallback to mock data for development
            const mockUser: User = {
              id: 'user-001',
              email,
              name: 'Demo User',
              createdAt: Date.now() - 86400000 * 30, // 30 days ago
              isSponsor: false,
              supabaseId: 'supabase-demo',
              emailVerified: true,
              lastSignIn: Date.now(),
            };

            set({ 
              currentUser: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            });

            return { success: true };
          }

          // Sign in with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('No user returned from signin');

          // Get user profile from our users table
          let userProfile = await getUserProfile(authData.user.id);
          
          // If user doesn't exist in our table, create them
          if (!userProfile) {
            userProfile = await createUserProfile(authData.user, authData.user.user_metadata?.name || 'User');
          }

          // Update last sign in
          await supabase
            .from('users')
            .update({ last_sign_in: new Date().toISOString() })
            .eq('supabase_id', authData.user.id);

          const user: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            createdAt: new Date(userProfile.created_at).getTime(),
            isSponsor: userProfile.is_sponsor,
            sponsorSince: userProfile.sponsor_since ? new Date(userProfile.sponsor_since).getTime() : undefined,
            avatarUrl: userProfile.avatar_url,
            supabaseId: userProfile.supabase_id,
            emailVerified: userProfile.email_verified,
            lastSignIn: new Date().getTime(),
          };

          set({ 
            currentUser: user, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        try {
          await supabase.auth.signOut();
          set({ 
            currentUser: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Sign out error:', error);
          set({ isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // User actions
      updateUser: async (updates: Partial<User>) => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        
        try {
          // Update in Supabase
          const { data, error } = await supabase
            .from('users')
            .update({
              name: updates.name,
              avatar_url: updates.avatarUrl,
            })
            .eq('id', currentUser.id)
            .select()
            .single();

          if (error) throw error;

          const updatedUser: User = {
            ...currentUser,
            ...updates,
            name: data.name,
            avatarUrl: data.avatar_url,
          };

          set({ currentUser: updatedUser, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      upgradeToSponsor: async () => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('users')
            .update({ 
              is_sponsor: true, 
              sponsor_since: new Date().toISOString() 
            })
            .eq('id', currentUser.id)
            .select()
            .single();

          if (error) throw error;

          const updatedUser: User = { 
            ...currentUser, 
            isSponsor: data.is_sponsor,
            sponsorSince: new Date(data.sponsor_since).getTime()
          };

          set({ currentUser: updatedUser, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upgrade failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      cancelSponsorship: async () => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('users')
            .update({ 
              is_sponsor: false, 
              sponsor_since: null 
            })
            .eq('id', currentUser.id)
            .select()
            .single();

          if (error) throw error;

          const updatedUser: User = { 
            ...currentUser, 
            isSponsor: data.is_sponsor,
            sponsorSince: undefined
          };

          set({ currentUser: updatedUser, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Cancellation failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      deleteAccount: async () => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        
        try {
          // Delete user data from our tables (cascading will handle related data)
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', currentUser.id);

          if (deleteError) throw deleteError;

          // Delete from Supabase Auth
          const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.supabaseId!);
          if (authError) console.warn('Auth deletion failed:', authError);

          set({ 
            currentUser: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Account deletion failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Internal actions
      setUser: (user: User | null) => {
        set({ 
          currentUser: user, 
          isAuthenticated: !!user,
          error: null 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        
        try {
          // Check if Supabase is properly configured
          if (supabaseUrl === 'https://placeholder.supabase.co') {
            // Skip Supabase initialization in development
            set({ isLoading: false });
            return;
          }

          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (session?.user) {
            // Get user profile from our users table
            const userProfile = await getUserProfile(session.user.id);
            
            if (userProfile) {
              const user: User = {
                id: userProfile.id,
                email: userProfile.email,
                name: userProfile.name,
                createdAt: new Date(userProfile.created_at).getTime(),
                isSponsor: userProfile.is_sponsor,
                sponsorSince: userProfile.sponsor_since ? new Date(userProfile.sponsor_since).getTime() : undefined,
                avatarUrl: userProfile.avatar_url,
                supabaseId: userProfile.supabase_id,
                emailVerified: userProfile.email_verified,
                lastSignIn: userProfile.last_sign_in ? new Date(userProfile.last_sign_in).getTime() : undefined,
              };

              set({ currentUser: user, isAuthenticated: true });
            }
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
              set({ currentUser: null, isAuthenticated: false });
            } else if (event === 'SIGNED_IN' && session.user) {
              const userProfile = await getUserProfile(session.user.id);
              if (userProfile) {
                const user: User = {
                  id: userProfile.id,
                  email: userProfile.email,
                  name: userProfile.name,
                  createdAt: new Date(userProfile.created_at).getTime(),
                  isSponsor: userProfile.is_sponsor,
                  sponsorSince: userProfile.sponsor_since ? new Date(userProfile.sponsor_since).getTime() : undefined,
                  avatarUrl: userProfile.avatar_url,
                  supabaseId: userProfile.supabase_id,
                  emailVerified: userProfile.email_verified,
                  lastSignIn: userProfile.last_sign_in ? new Date(userProfile.last_sign_in).getTime() : undefined,
                };

                set({ currentUser: user, isAuthenticated: true });
              }
            }
          });
        } catch (error) {
          console.error('Auth initialization failed:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        // Don't persist auth state - let Supabase handle it
      }),
    }
  )
);