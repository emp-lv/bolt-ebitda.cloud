import { Connection } from "../types/connection";

// Mock connections data
export const connections: Connection[] = [
  // sources
  {
    id: "550e8400-e29b-41d4-a712-446655440001",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    initiatedBy: "550e8400-e29b-41d4-a716-446655440001",
    sourceProfileId: "550e8400-e29b-41d4-a716-446655440002",
    destinationProfileId: "550e8400-e29b-41d4-a716-446655440001",
    type: "partner",
    status: "approved",
    net: 1600 / 3,
    public: true,
    showNet: true,
  },
  {
    id: "550e8400-e29b-41d4-a712-446655440002",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    initiatedBy: "550e8400-e29b-41d4-a716-446655440001",
    sourceProfileId: "550e8400-e29b-41d4-a716-446655440004",
    destinationProfileId: "550e8400-e29b-41d4-a716-446655440001",
    type: "partner",
    status: "approved",
    net: 1000 / 3,
    public: true,
    showNet: true,
  },
  // destinations
  {
    id: "550e8400-e29b-41d4-a712-446655440003",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    initiatedBy: "550e8400-e29b-41d4-a716-446655440001",
    sourceProfileId: "550e8400-e29b-41d4-a716-446655440001",
    destinationProfileId: "550e8400-e29b-41d4-a716-446655440005",
    type: 'other',
    status: "approved",
    net: 200,
    public: true,
    showNet: false,
  },
  {
    id: "550e8400-e29b-41d4-a712-446655440004",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    initiatedBy: "550e8400-e29b-41d4-a716-446655440001",
    sourceProfileId: "550e8400-e29b-41d4-a716-446655440001",
    destinationProfileId: "550e8400-e29b-41d4-a716-446655440006",
    type: 'other',
    status: "approved",
    net: 60,
    public: true,
    showNet: true,
  },
];

export const getConnectionsByProfile = (profileId: string): Connection[] => {
  return connections.filter(
    (conn) =>
      conn.sourceProfileId === profileId ||
      conn.destinationProfileId === profileId
  );
};

export const getSourceConnections = (profileId: string): Connection[] => {
  return connections.filter((conn) => conn.destinationProfileId === profileId);
};

export const getDestinationConnections = (profileId: string): Connection[] => {
  return connections.filter((conn) => conn.sourceProfileId === profileId);
};
