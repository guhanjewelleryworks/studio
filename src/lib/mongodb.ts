
// src/lib/mongodb.ts
import type { Collection, Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { Goldsmith, OrderRequest, Customer, StoredMetalPrice, PlatformSettings, AuditLog, AdminNotification, ContactSubmission } from '@/types/goldsmith'; // Ensure Goldsmith type is correctly imported

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI environment variable is not defined.");
  // In a real production app, you might want to throw an error here to prevent startup
  // For now, we log, and the app might fail later when DB operations are attempted.
  // throw new Error('Please define the MONGODB_URI environment variable inside .env or .env.local');
} else {
  console.log("MONGODB_URI found in environment. Attempting to connect...");
  // Mask password for logging
  const maskedUri = MONGODB_URI.replace(/:([^:@]*)(?=@)/, ':********');
  console.log("Full MONGODB_URI being used (password masked):", maskedUri);
}

// Attempt to parse the database name from the URI
let DB_NAME: string;
if (MONGODB_URI) {
  try {
      const url = new URL(MONGODB_URI);
      // The database name is the first part of the pathname, after the initial '/'
      const pathnameParts = url.pathname.split('/');
      if (pathnameParts.length > 1 && pathnameParts[1]) {
          DB_NAME = pathnameParts[1];
          console.log(`Database name parsed from MONGODB_URI: ${DB_NAME}`);
      } else {
          DB_NAME = process.env.DB_NAME || 'goldsmithconnect'; // Fallback DB name
          console.warn(`Database name not found in MONGODB_URI path, using default or DB_NAME env var: ${DB_NAME}`);
      }
  } catch (error) {
      console.warn("Could not parse MONGODB_URI to extract database name. Using default or DB_NAME env var.", error);
      DB_NAME = process.env.DB_NAME || 'goldsmithconnect'; // Fallback DB name
      console.log(`Using database name: ${DB_NAME}`);
  }
} else {
  DB_NAME = process.env.DB_NAME || 'goldsmithconnect'; // Fallback if MONGODB_URI is missing
  console.warn(`MONGODB_URI is not defined. Using default database name: ${DB_NAME}`);
}


let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    console.log("Development: Creating new MongoDB client connection.");
    if (!MONGODB_URI) {
      console.error("Development: MONGODB_URI is missing, cannot create client promise.");
      // Create a dummy promise to avoid crashing, but operations will fail
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
  // In production mode, it's best to not use a global variable.
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
    return mongoClient.db(DB_NAME);
  } catch (error) {
    console.error("Error getting database instance from clientPromise:", error);
    // Log the URI again here in case of failure for easier debugging
    if (MONGODB_URI) {
      const maskedUri = MONGODB_URI.replace(/:([^:@]*)(?=@)/, ':********');
      console.error("Failed to connect with MONGODB_URI (password masked):", maskedUri);
    } else {
      console.error("Failed to connect because MONGODB_URI was not defined.");
    }
    throw error; // Re-throw the error to be caught by the caller
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


// Optional: Export the client promise for specific use cases, though getDb is preferred
export default clientPromise;
