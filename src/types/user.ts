export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  isSponsor: boolean;
  sponsorSince?: number;
  avatarUrl?: string;
  // Supabase auth fields
  supabaseId?: string;
  emailVerified?: boolean;
  lastSignIn?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserProfile extends Profile {
  userId: string; // Links to User.id
  isOwned: boolean; // Always true for user profiles
  lastUpdated: number;
}

// Re-export Profile type for convenience
export type { Profile } from './profile';