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
  password?: string; // Password is now optional at the type level if managed by Firebase Auth
  portfolioLink?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
}

// Input type for new goldsmith registration
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
  | 'portfolioImages' // Keep these for potential future use during registration
  | 'certifications'
  | 'status'
  // Password is provided by the form, but might not be directly stored if using Firebase Auth primarily
>;

// New Types for Orders and Inquiries

export type OrderRequestStatus = 'new' | 'pending_goldsmith_review' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderRequest {
  _id?: ObjectId | string;
  id: string; // UUID
  goldsmithId: string;
  customerName: string; // For now, as customer accounts are not fully integrated
  customerEmail: string;
  customerPhone?: string;
  itemDescription: string;
  details: string;
  referenceImage?: string; // URL to an uploaded image, or data URI if handled that way
  status: OrderRequestStatus;
  requestedAt: Date;
  updatedAt: Date;
}

export type NewOrderRequestInput = Omit<OrderRequest, '_id' | 'id' | 'status' | 'requestedAt' | 'updatedAt'>;


export type InquiryStatus = 'new' | 'admin_review' | 'forwarded_to_goldsmith' | 'goldsmith_replied' | 'closed';

export interface Inquiry {
  _id?: ObjectId | string;
  id: string; // UUID
  goldsmithId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  referenceImage?: string; // URL to an uploaded image, or data URI
  status: InquiryStatus;
  requestedAt: Date;
  updatedAt: Date;
}

export type NewInquiryInput = Omit<Inquiry, '_id' | 'id' | 'status' | 'requestedAt' | 'updatedAt'>;
