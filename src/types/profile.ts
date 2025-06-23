export type ProfileType = 'person' | 'company';

export type CompanyType = 'SaaS' | 'Agency' | 'Retail' | 'Royalties' | 'Newsletter' | 'Other';

export interface Profile {
  id: string; // UUIDv4
  name: string;
  createdAt: number; // timestamp
  image: string;
  description: string;
  currentMrr?: number;
  autoCalculateMrr?: boolean;
  targetMrr: number;
  type: ProfileType;
  companyType?: CompanyType; // optional, only if type is "company"
}