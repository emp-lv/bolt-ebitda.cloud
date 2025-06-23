import { Connection } from '../types/connection';

// Mock connections data
export const connections: Connection[] = [
  {
    id: 'conn-001',
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    initiatedBy: '550e8400-e29b-41d4-a716-446655440001',
    sourceProfileId: '550e8400-e29b-41d4-a716-446655440002',
    destinationProfileId: '550e8400-e29b-41d4-a716-446655440001',
    type: 'affiliate',
    status: 'approved',
    net: 2500,
    public: true,
    showNet: false
  },
  {
    id: 'conn-002',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    initiatedBy: '550e8400-e29b-41d4-a716-446655440001',
    sourceProfileId: '550e8400-e29b-41d4-a716-446655440003',
    destinationProfileId: '550e8400-e29b-41d4-a716-446655440001',
    type: 'partner',
    status: 'pending',
    net: 1200,
    public: false,
    showNet: true
  }
];

export const getConnectionsByProfile = (profileId: string): Connection[] => {
  return connections.filter(
    conn => conn.sourceProfileId === profileId || conn.destinationProfileId === profileId
  );
};

export const getSourceConnections = (profileId: string): Connection[] => {
  return connections.filter(conn => conn.destinationProfileId === profileId);
};

export const getDestinationConnections = (profileId: string): Connection[] => {
  return connections.filter(conn => conn.sourceProfileId === profileId);
};