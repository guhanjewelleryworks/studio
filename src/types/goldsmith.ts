// src/types/goldsmith.ts
import type { Location } from '@/services/geolocation';
import type { ObjectId } from 'mongodb';

export interface Goldsmith {
  _id?: ObjectId | string; // MongoDB ID
  id: string; // Your application-specific ID
  name: string;
  state: string; // Replaced address with state
  district: string; // Replaced address with district
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
  password?: string; 
  portfolioLink?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  registeredAt: Date; // Added for tracking registration time
  lastLoginAt?: Date; // Added for tracking login time
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
  | 'portfolioImages' 
  | 'certifications'
  | 'ordersCompleted'
  | 'status'
  | 'registeredAt' // Exclude from input, will be set by server
  | 'lastLoginAt'
>;

// New Types for Orders and Inquiries

export type OrderRequestStatus = 
  | 'new' 
  | 'pending_goldsmith_review' 
  | 'in_progress' 
  | 'artwork_completed' // Goldsmith has finished the piece
  | 'customer_review_requested' // Goldsmith requests customer feedback on the piece
  | 'shipped' // Order is out for delivery
  | 'completed' 
  | 'cancelled';

export interface OrderRequest {
  _id?: ObjectId | string;
  id: string; // UUID
  goldsmithId: string;
  customerId?: string; // Link to Customer ID
  customerName: string; 
  customerEmail: string;
  customerPhone?: string;
  itemDescription: string;
  details: string;
  referenceImage?: string; 
  status: OrderRequestStatus;
  requestedAt: Date;
  updatedAt: Date;
}

export type NewOrderRequestInput = Omit<OrderRequest, '_id' | 'id' | 'status' | 'requestedAt' | 'updatedAt'>;


// --- Customer Types ---
export interface Customer {
  _id?: ObjectId | string; // MongoDB ID
  id: string; // Application-specific UUID
  name: string;
  email: string;
  password?: string; // For app-specific auth, hashed in DB
  registeredAt: Date;
  lastLoginAt?: Date;
  // Add other customer-specific fields as needed, e.g.,
  // shippingAddress: string;
  // orderHistory: string[]; // Array of Order IDs
}

export type NewCustomerInput = Omit<Customer, '_id' | 'id' | 'registeredAt' | 'lastLoginAt'>;

// --- New Type for Stored Metal Prices ---
export interface StoredMetalPrice {
  _id?: ObjectId | string;
  symbol: 'XAU' | 'XAG' | 'XPT'; // Gold, Silver, Platinum
  name: string;
  price: number; // Stored as number for calculations (e.g., price per 10g)
  currency: string; // e.g., 'INR'
  changePercent: number; // The percentage change
  updatedAt: Date;
}

// --- New Type for Platform Settings ---
export interface PlatformSettings {
  _id?: ObjectId | string;
  key: 'platform_main'; // A fixed key to ensure only one settings document
  announcementText: string;
  isAnnouncementVisible: boolean;
}

// --- New Type for Audit Logs ---
export interface AuditLog {
  id?: string;
  _id?: ObjectId | string;
  timestamp: Date;
  actor: {
    type: 'admin' | 'customer' | 'goldsmith' | 'system';
    id: string; // Could be 'SYSTEM' or a user/goldsmith UUID
  };
  action: string; // e.g., "Updated goldsmith status", "Generated user activity report"
  details?: Record<string, any>; // e.g., { goldsmithId: '...', newStatus: 'verified' }
}
