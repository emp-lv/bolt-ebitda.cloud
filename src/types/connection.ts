export type ConnectionType = 'owner' | 'affiliate' | 'partner' | 'other';
export type ConnectionStatus = 'pending' | 'approved';

export interface Connection {
  id: string;
  createdAt: number;
  initiatedBy: string; // Profile ID who initiated the connection
  sourceProfileId: string; // The profile that provides income
  destinationProfileId: string; // The profile that receives income
  type: ConnectionType;
  status: ConnectionStatus;
  net: number; // Currency amount this connection nets for the current profile
  public: boolean;
  showNet: boolean;
}