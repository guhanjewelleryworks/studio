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
  profileViews?: number;
  contactPerson?: string;
  email: string;
  phone?: string;
  password?: string; 
  status: 'pending_email_verification' | 'pending_verification' | 'verified' | 'rejected';
  registeredAt: Date; // Added for tracking registration time
  lastLoginAt?: Date; // Added for tracking login time
  emailVerified: Date | null;
  verificationToken: string | null;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
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
  | 'profileViews'
  | 'status'
  | 'registeredAt' // Exclude from input, will be set by server
  | 'lastLoginAt'
  | 'emailVerified'
  | 'verificationToken'
  | 'passwordResetToken'
  | 'passwordResetTokenExpires'
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
  customerPhone: string;
  itemDescription: string;
  details: string;
  referenceImage: string; 
  status: OrderRequestStatus;
  requestedAt: Date;
  updatedAt: Date;
  // New field for simulated order price for reports
  simulatedPrice?: number;
}

export type NewOrderRequestInput = Omit<OrderRequest, '_id' | 'id' | 'status' | 'requestedAt' | 'updatedAt' | 'simulatedPrice'>;


// --- Customer Types ---
export interface Customer {
  _id?: ObjectId | string; // MongoDB ID
  id: string; // Application-specific UUID
  name: string;
  email: string;
  image?: string; // Added for next-auth compatibility
  password?: string; // For app-specific auth, hashed in DB
  registeredAt: Date;
  lastLoginAt?: Date;
  emailVerified: Date | null;
  verificationToken: string | null;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  isDeleted?: boolean; // For soft delete
  deletedAt?: Date; // For soft delete
  emailHash?: string; // For preventing re-registration of deleted emails
}

export type NewCustomerInput = Omit<Customer, '_id' | 'id' | 'image' | 'registeredAt' | 'lastLoginAt' | 'emailVerified' | 'verificationToken' | 'passwordResetToken' | 'passwordResetTokenExpires' | 'isDeleted' | 'deletedAt' | 'emailHash'>;


// --- Admin Type ---
export const validPermissions = [
  'canManageAdmins',
  'canManageCustomers',
  'canManageGoldsmiths',
  'canManageOrders',
  'canManageCommunications',
  'canManageSettings',
  'canViewAuditLogs',
  'canGenerateReports',
  'canViewDatabase',
] as const;

export type Permission = typeof validPermissions[number];

export interface Admin {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin';
  permissions: Permission[];
  createdAt: Date;
}

export type NewAdminInput = Omit<Admin, '_id' | 'id' | 'createdAt' | 'role'>;

export type UpdateAdminInput = {
    id: string;
    name: string;
    permissions: Permission[];
};


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
  // Pricing fields
  customerPremiumPriceMonthly: number;
  customerPremiumPriceAnnual: number;
  goldsmithPartnerPriceMonthly: number;
  goldsmithPartnerPriceAnnual: number;
  // Maintenance mode
  isMaintenanceModeEnabled: boolean;
  // Registration control
  allowCustomerRegistration: boolean;
  allowGoldsmithRegistration: boolean;
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

// --- New Type for Admin Notifications ---
export interface AdminNotification {
  _id?: ObjectId | string;
  id: string; // UUID
  type: 'new_goldsmith_registration' | 'new_order_request' | 'new_contact_message' | 'order_status_update';
  message: string;
  link: string; // e.g., /admin/goldsmiths
  isRead: boolean;
  createdAt: Date;
}

// --- New Type for Contact Form Submissions ---
export interface ContactSubmission {
    _id?: ObjectId | string;
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submittedAt: Date;
    isArchived: boolean;
}

export type NewContactSubmission = Omit<ContactSubmission, '_id' | 'id' | 'submittedAt' | 'isArchived'>;
