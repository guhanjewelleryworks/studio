// src/types/goldsmith.ts
import type { Location } from '@/services/geolocation';

export interface Goldsmith {
  id: string;
  name: string;
  address: string;
  specialty: string | string[]; // Can be a single string or an array of strings
  rating: number;
  imageUrl?: string; // Optional: for list view
  profileImageUrl?: string; // Optional: for profile view
  location: Location;
  shortBio?: string; // Optional: for list view
  tagline?: string; // Optional: for profile view
  bio?: string; // Optional: for profile view
  portfolioImages?: string[]; // Optional: for profile view
  yearsExperience?: number; // Optional: for profile view
  certifications?: string[]; // Optional: for profile view
  responseTime?: string; // Optional: for profile view
  ordersCompleted?: number; // Optional: for profile view
}
