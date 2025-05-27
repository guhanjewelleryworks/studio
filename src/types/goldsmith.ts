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
  email: string; // Keep email as it's a primary identifier
  phone?: string;
  portfolioLink?: string;
  // Removed: firebaseUID: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  // Password is not stored in this type, it was for simulation earlier
}

// Input type for new goldsmith registration
// Removed firebaseUID from Omit as it's removed from Goldsmith type
export type NewGoldsmithInput = Omit<Goldsmith, '_id' | 'id' | 'rating' | 'imageUrl' | 'profileImageUrl' | 'location' | 'shortBio' | 'tagline' | 'bio' | 'yearsExperience' | 'responseTime' | 'ordersCompleted' | 'status'>;
