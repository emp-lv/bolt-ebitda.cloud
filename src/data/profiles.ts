import { Profile } from "../types/profile";

export const profiles: Profile[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    slug: "emplv",
    name: "Emīls Pļavenieks",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image: "https://avatars.githubusercontent.com/u/16500803?v=4",
    description: "Full-stack developer building innovative web applications",
    targetMrr: 44000,
    currentMrr: 15000,
    type: "person",
    sponsor: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Vidyly",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image:
      "https://avatars.githubusercontent.com/u/150893289?s=400&u=aaa0e43c059339a3dfa1fa303de6f8d4f86089fb&v=4",
    description: "SaaS platform for digitalization of business processes",
    targetMrr: 30000,
    currentMrr: 1600,
    type: "company",
    companyType: "SaaS",
    sponsor: true,
    slug: "vidyly",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "ProductionLine.io",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image: "https://demo.productionline.io/assets/logo.png",
    description: "Digitalize factory processes with trackable tasks",
    targetMrr: 10000,
    currentMrr: 1000,
    type: "company",
    companyType: "SaaS",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Stripe",
    slug: "stripe",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image: "https://thetribe.io/wp-content/uploads/Logo-Stripe-1080x675-1.jpg",
    description: "Payment processing for online businesses",
    type: "company",
    companyType: "Other",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Hetzner",
    slug: "hetzner",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    image: "https://www.svgrepo.com/show/331425/hetzner.svg",
    description: "Cloud hosting provider",
    type: "company",
    companyType: "Other",
  },
];

export const getProfileById = (id: string): Profile | undefined => {
  return profiles.find((profile) => profile.id === id);
};

export const getProfileByName = (name: string): Profile | undefined => {
  return profiles.find(
    (profile) =>
      profile.name.toLowerCase().replace(/\s+/g, "-") === name.toLowerCase()
  );
};
