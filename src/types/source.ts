import { Profile } from './profile';

export interface ClusterItem {
  type: 'single' | 'cluster';
  x: number;
  y: number;
  profiles: Profile[]; // For single: array with 1 profile, for cluster: array with multiple profiles
}

// Keep backward compatibility
export type SourceItem = ClusterItem;
export type DestinationItem = ClusterItem;