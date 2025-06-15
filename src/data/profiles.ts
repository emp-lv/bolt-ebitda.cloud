import { Profile } from '../types/profile';

export const profiles: Profile[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Emīls Pļavenieks',
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Full-stack developer building innovative web applications',
    targetMrr: 44000,
    type: 'person'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'TechFlow Solutions',
    createdAt: Date.now() - 86400000 * 60, // 60 days ago
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cloud-based project management platform for modern teams',
    targetMrr: 50000,
    type: 'company',
    companyType: 'SaaS'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Sarah Rodriguez',
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Digital marketing consultant helping businesses grow online',
    targetMrr: 8000,
    type: 'person'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Creative Studio Pro',
    createdAt: Date.now() - 86400000 * 45, // 45 days ago
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Full-service creative agency specializing in brand identity and digital experiences',
    targetMrr: 35000,
    type: 'company',
    companyType: 'Agency'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'EcoStyle Boutique',
    createdAt: Date.now() - 86400000 * 90, // 90 days ago
    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sustainable fashion retailer with eco-friendly clothing and accessories',
    targetMrr: 25000,
    type: 'company',
    companyType: 'Retail'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'The Growth Newsletter',
    createdAt: Date.now() - 86400000 * 20, // 20 days ago
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Weekly insights on business growth, marketing strategies, and entrepreneurship',
    targetMrr: 12000,
    type: 'company',
    companyType: 'Newsletter'
  }
];

export const getProfileById = (id: string): Profile | undefined => {
  return profiles.find(profile => profile.id === id);
};

export const getProfileByName = (name: string): Profile | undefined => {
  return profiles.find(profile => profile.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase());
};