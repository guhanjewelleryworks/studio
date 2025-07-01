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


export type InquiryStatus = 'new' | 'admin_review' | 'forwarded_to_goldsmith' | 'goldsmith_replied' | 'closed';

export interface Inquiry {
  _id?: ObjectId | string;
  id: string; // UUID
  goldsmithId: string;
  customerId?: string; // Link to Customer ID
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  referenceImage?: string; 
  status: InquiryStatus;
  requestedAt: Date;
  updatedAt: Date;
}

export type NewInquiryInput = Omit<Inquiry, '_id' | 'id' | 'status' | 'requestedAt' | 'updatedAt'>;


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
