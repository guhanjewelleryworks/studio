// src/types/goldsmith.ts
import type { Location } from '@/services/geolocation';
import type { ObjectId } from 'mongodb';

export interface Goldsmith {
  _id?: ObjectId | string; // MongoDB ID
  id: string; // Your application-specific ID
  name: string;
  address: string;
  specialty: string | string[];
  rating: number;
  imageUrl?: string;
  profileImageUrl?: string;
  location: Location;
  shortBio?: string;
  tagline?: string;
  bio?: string;
  portfolioImages?: string[];
  yearsExperience?: number;
  certifications?: string[];
  responseTime?: string;
  ordersCompleted?: number;
  contactPerson?: string;
  email: string;
  phone?: string;
  portfolioLink?: string;
  password: string; // Made password non-optional
  status: 'pending_verification' | 'verified' | 'rejected';
}

// Input type for new goldsmith registration
// Password is now non-optional here as well due to the change in Goldsmith type
export type NewGoldsmithInput = Omit<
  Goldsmith,
  | '_id'
  | 'id'
  | 'rating'
  | 'imageUrl'
  | 'profileImageUrl'
  | 'location'
  | 'shortBio'
  | 'tagline'
  | 'bio'
  | 'yearsExperience'
  | 'responseTime'
  | 'ordersCompleted'
  | 'status'
>;
