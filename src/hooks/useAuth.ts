import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useUserProfilesStore } from '../store/userProfilesStore';

export const useAuth = () => {
  const userStore = useUserStore();
  const userProfilesStore = useUserProfilesStore();

  // Initialize auth on mount
  useEffect(() => {
    userStore.initializeAuth();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (userStore.isAuthenticated && userStore.currentUser) {
      userProfilesStore.loadUserData(userStore.currentUser.id);
    } else {
      // Clear user data when not authenticated
      userProfilesStore.setLoading(false);
    }
  }, [userStore.isAuthenticated, userStore.currentUser?.id]);

  return {
    // Auth state
    user: userStore.currentUser,
    isAuthenticated: userStore.isAuthenticated,
    isLoading: userStore.isLoading,
    error: userStore.error,
    
    // Auth actions
    signUp: userStore.signUp,
    signIn: userStore.signIn,
    signOut: userStore.signOut,
    resetPassword: userStore.resetPassword,
    
    // User actions
    updateUser: userStore.updateUser,
    upgradeToSponsor: userStore.upgradeToSponsor,
    cancelSponsorship: userStore.cancelSponsorship,
    deleteAccount: userStore.deleteAccount,
  };
};