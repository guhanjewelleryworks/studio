
// src/lib/mongodb.ts
import type { Collection, Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { Goldsmith, OrderRequest, Customer, StoredMetalPrice, PlatformSettings, AuditLog, AdminNotification, ContactSubmission, Admin } from '@/types/goldsmith'; // Ensure Goldsmith type is correctly imported

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI environment variable is not defined.");
} else {
  console.log("MONGODB_URI found in environment. Attempting to connect...");
  const maskedUri = MONGODB_URI.replace(/:([^:@]*)(?=@)/, ':********');
  console.log("Full MONGODB_URI being used (password masked):", maskedUri);
}

let DB_NAME: string;
if (MONGODB_URI) {
  try {
      const url = new URL(MONGODB_URI);
      const pathnameParts = url.pathname.split('/');
      if (pathnameParts.length > 1 && pathnameParts[1]) {
          DB_NAME = pathnameParts[1];
          console.log(`Database name parsed from MONGODB_URI: ${DB_NAME}`);
      } else {
          DB_NAME = process.env.DB_NAME || 'goldsmithconnect';
          console.warn(`Database name not found in MONGODB_URI path, using default or DB_NAME env var: ${DB_NAME}`);
      }
  } catch (error) {
      console.warn("Could not parse MONGODB_URI to extract database name. Using default or DB_NAME env var.", error);
      DB_NAME = process.env.DB_NAME || 'goldsmithconnect';
      console.log(`Using database name: ${DB_NAME}`);
  }
} else {
  DB_NAME = process.env.DB_NAME || 'goldsmithconnect';
  console.warn(`MONGODB_URI is not defined. Using default database name: ${DB_NAME}`);
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
      console.error("Development: MONGODB_URI is missing, cannot create client promise.");
      clientPromise = Promise.reject(new Error("MONGODB_URI is not defined in development."));
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
      console.error("Production: MONGODB_URI is missing, cannot create client promise.");
      clientPromise = Promise.reject(new Error("MONGODB_URI is not defined in production."));
    } else {
      client = new MongoClient(MONGODB_URI);
      clientPromise = client.connect();
    }
}

export async function getDb(): Promise<Db> {
  if (!MONGODB_URI) {
    console.error("getDb called but MONGODB_URI is not defined. Database operations will fail.");
    throw new Error("MONGODB_URI is not configured, cannot get database instance.");
  }
  try {
    const mongoClient = await clientPromise;
    console.log(`Successfully connected to MongoDB. Accessing database: ${DB_NAME}`);
    const db = mongoClient.db(DB_NAME);
    // Ensure indexes are created after connecting.
    await createIndexes(db);
    return db;
  } catch (error) {
    console.error("Error getting database instance from clientPromise:", error);
    if (MONGODB_URI) {
      const maskedUri = MONGODB_URI.replace(/:([^:@]*)(?=@)/, ':********');
      console.error("Failed to connect with MONGODB_URI (password masked):", maskedUri);
    }
    throw error;
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
