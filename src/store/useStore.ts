// Legacy store - kept for backward compatibility
// New code should use the specific stores: useUserStore, useUserProfilesStore, useProfilesStore

import { useUserStore } from './userStore';
import { useUserProfilesStore } from './userProfilesStore';
import { useProfilesStore } from './profilesStore';

// Re-export the new stores for easy access
export { useUserStore, useUserProfilesStore, useProfilesStore };

// Legacy compatibility layer
export const useStore = () => {
  const userStore = useUserStore();
  const userProfilesStore = useUserProfilesStore();
  const profilesStore = useProfilesStore();

  return {
    // User data
    currentUser: userStore.currentUser,
    
    // Profiles data (combines user profiles and global profiles)
    profiles: [...userProfilesStore.userProfiles, ...profilesStore.profiles],
    
    // Connections data (combines user connections and global connections)
    connections: [...userProfilesStore.userConnections, ...profilesStore.connections],
    
    // Legacy actions (delegate to appropriate stores)
    setCurrentUser: userStore.setUser,
    updateProfile: (profileId: string, updates: any) => {
      // Try user profiles first, then global profiles
      const userProfile = userProfilesStore.getProfileById(profileId);
      if (userProfile) {
        return userProfilesStore.updateProfile(profileId, updates);
      } else {
        profilesStore.updateProfile(profileId, updates);
        return Promise.resolve({ success: true });
      }
    },
    addConnection: userProfilesStore.addConnection,
    updateConnection: userProfilesStore.updateConnection,
    deleteConnection: userProfilesStore.deleteConnection,
    getProfileById: (id: string) => {
      return userProfilesStore.getProfileById(id) || profilesStore.getProfileById(id);
    },
    getConnectionsByProfile: (profileId: string) => {
      return [
        ...userProfilesStore.getConnectionsByProfile(profileId),
        ...profilesStore.getConnectionsByProfile(profileId)
      ];
    },
    getSourceConnections: (profileId: string) => {
      return [
        ...userProfilesStore.getSourceConnections(profileId),
        ...profilesStore.getSourceConnections(profileId)
      ];
    },
    getDestinationConnections: (profileId: string) => {
      return [
        ...userProfilesStore.getDestinationConnections(profileId),
        ...profilesStore.getDestinationConnections(profileId)
      ];
    },
  };
};