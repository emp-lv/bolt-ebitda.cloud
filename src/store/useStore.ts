import { create } from 'zustand';
import { Profile } from '../types/profile';
import { Connection } from '../types/connection';
import { profiles as initialProfiles } from '../data/profiles';
import { connections as initialConnections } from '../data/connections';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface AppState {
  // User state
  currentUser: User | null;
  
  // Profiles state
  profiles: Profile[];
  
  // Connections state
  connections: Connection[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  updateConnection: (connectionId: string, updates: Partial<Connection>) => void;
  deleteConnection: (connectionId: string) => void;
  getProfileById: (id: string) => Profile | undefined;
  getConnectionsByProfile: (profileId: string) => Connection[];
  getSourceConnections: (profileId: string) => Connection[];
  getDestinationConnections: (profileId: string) => Connection[];
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: {
    id: 'user-001',
    email: 'user@example.com',
    name: 'Current User',
    createdAt: Date.now() - 86400000 * 365, // 1 year ago
  },
  profiles: initialProfiles,
  connections: initialConnections,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),

  updateProfile: (profileId, updates) =>
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === profileId ? { ...profile, ...updates } : profile
      ),
    })),

  addConnection: (connectionData) =>
    set((state) => ({
      connections: [
        ...state.connections,
        {
          ...connectionData,
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),

  updateConnection: (connectionId, updates) =>
    set((state) => ({
      connections: state.connections.map((connection) =>
        connection.id === connectionId ? { ...connection, ...updates } : connection
      ),
    })),

  deleteConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((connection) => connection.id !== connectionId),
    })),

  getProfileById: (id) => get().profiles.find((profile) => profile.id === id),

  getConnectionsByProfile: (profileId) =>
    get().connections.filter(
      (conn) => conn.sourceProfileId === profileId || conn.destinationProfileId === profileId
    ),

  getSourceConnections: (profileId) =>
    get().connections.filter((conn) => conn.destinationProfileId === profileId),

  getDestinationConnections: (profileId) =>
    get().connections.filter((conn) => conn.sourceProfileId === profileId),
}));