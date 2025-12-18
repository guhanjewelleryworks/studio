// src/lib/mongodb.ts
import type { Collection, Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { Goldsmith, OrderRequest, Customer, StoredMetalPrice, PlatformSettings, AuditLog, AdminNotification, ContactSubmission, Admin } from '@/types/goldsmith'; // Ensure Goldsmith type is correctly imported

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI environment variable is not defined.");
}
if (!DB_NAME) {
    console.error("CRITICAL: DB_NAME environment variable is not defined.");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Ensures that all necessary indexes are created for the collections.
 * This function is idempotent and can be called on every DB connection.
 */
async function createIndexes(db: Db) {
    try {
        console.log('[MongoDB] Checking and creating indexes...');
        // Index for sorting orders by date efficiently
        const orderRequests = db.collection('orderRequests');
        await orderRequests.createIndex({ requestedAt: -1 });
        
        // Add other indexes here as needed in the future
        
        console.log('[MongoDB] Index creation check complete.');
    } catch (error) {
        console.error('[MongoDB] Error creating indexes:', error);
    }
}


if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    console.log("Development: Creating new MongoDB client connection.");
    if (!MONGODB_URI) {
        // This rejection will be caught by getDb and thrown.
        clientPromise = Promise.reject(new Error("MONGODB_URI environment variable must be defined."));
    } else {
        client = new MongoClient(MONGODB_URI);
        global._mongoClientPromise = client.connect();
        clientPromise = global._mongoClientPromise;
    }
  } else {
    console.log("Development: Reusing existing MongoDB client promise.");
    clientPromise = global._mongoClientPromise;
  }
} else {
  console.log("Production: Creating new MongoDB client connection.");
   if (!MONGODB_URI) {
        clientPromise = Promise.reject(new Error("MONGODB_URI environment variable must be defined."));
    } else {
        client = new MongoClient(MONGODB_URI);
        clientPromise = client.connect();
    }
}

export async function getDb(): Promise<Db> {
  // Centralized check for environment variables.
  if (!MONGODB_URI) {
      throw new Error("CRITICAL: MONGODB_URI environment variable is not configured.");
  }
  if (!DB_NAME) {
      throw new Error("CRITICAL: DB_NAME environment variable is not configured.");
  }
  
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    await createIndexes(db); // Fire-and-forget index creation
    return db;
  } catch (error: any) {
    console.error("Error getting database instance from clientPromise:", error);
    // Re-throw a more user-friendly error for common issues
    if (error.name === 'MongoServerError' && (error.code === 18 || error.message.includes('auth'))) {
      throw new Error("MongoDB Authentication failed. Please check your MONGODB_URI credentials.");
    } else if (error.name === 'MongoServerSelectionError') {
      throw new Error("Could not connect to MongoDB. Please ensure your server's IP is whitelisted in MongoDB Atlas.");
    }
    throw error; // Re-throw other errors
  }
}

export async function getGoldsmithsCollection(): Promise<Collection<Goldsmith>> {
  const db = await getDb();
  return db.collection<Goldsmith>('goldsmiths');
}

export async function getOrderRequestsCollection(): Promise<Collection<OrderRequest>> {
  const db = await getDb();
  return db.collection<OrderRequest>('orderRequests');
}

export async function getCustomersCollection(): Promise<Collection<Customer>> {
  const db = await getDb();
  return db.collection<Customer>('customers');
}

export async function getAdminsCollection(): Promise<Collection<Admin>> {
  const db = await getDb();
  return db.collection<Admin>('admins');
}

export async function getMetalPricesCollection(): Promise<Collection<StoredMetalPrice>> {
  const db = await getDb();
  return db.collection<StoredMetalPrice>('metalPrices');
}

export async function getSettingsCollection(): Promise<Collection<PlatformSettings>> {
  const db = await getDb();
  return db.collection<PlatformSettings>('settings');
}

export async function getAuditLogsCollection(): Promise<Collection<AuditLog>> {
  const db = await getDb();
  return db.collection<AuditLog>('auditLogs');
}

export async function getNotificationsCollection(): Promise<Collection<AdminNotification>> {
  const db = await getDb();
  return db.collection<AdminNotification>('notifications');
}

export async function getContactSubmissionsCollection(): Promise<Collection<ContactSubmission>> {
    const db = await getDb();
    return db.collection<ContactSubmission>('contactSubmissions');
}


export default clientPromise;
