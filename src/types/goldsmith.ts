// src/types/goldsmith.ts
import type { Location } from '@/services/geolocation';
import type { ObjectId } from 'mongodb';

export interface Goldsmith {
  _id?: ObjectId | string; // MongoDB ID
  id: string; // Your application-specific ID, can be same as _id string or different
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
  contactPerson?: string; // Added from registration form
  email?: string; // Added from registration form
  phone?: string; // Added from registration form
  portfolioLink?: string; // Added from registration form
}
