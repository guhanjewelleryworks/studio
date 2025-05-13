// src/lib/mongodb.ts
import type { Collection, Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { Goldsmith } from '@/types/goldsmith'; // Ensure Goldsmith type is correctly imported

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined.");
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env or .env.local'
  );
}

// Attempt to parse the database name from the URI
let DB_NAME: string;
try {
    const url = new URL(MONGODB_URI);
    // The database name is the first part of the pathname, after the initial '/'
    const pathnameParts = url.pathname.split('/');
    if (pathnameParts.length > 1 && pathnameParts[1]) {
        DB_NAME = pathnameParts[1];
        console.log(`Database name parsed from MONGODB_URI: ${DB_NAME}`);
    } else {
        DB_NAME = process.env.DB_NAME || 'goldsmithconnect';
        console.log(`Database name not found in MONGODB_URI, using default/DB_NAME env var: ${DB_NAME}`);
    }
} catch (error) {
    console.warn("Could not parse MONGODB_URI to extract database name. Using default or DB_NAME env var.", error);
    DB_NAME = process.env.DB_NAME || 'goldsmithconnect';
    console.log(`Using database name: ${DB_NAME}`);
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
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  } else {
    console.log("Development: Reusing existing MongoDB client promise.");
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  console.log("Production: Creating new MongoDB client connection.");
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  try {
    const mongoClient = await clientPromise;
    console.log(`Successfully connected to MongoDB and accessing database: ${DB_NAME}`);
    return mongoClient.db(DB_NAME);
  } catch (error) {
    console.error("Error getting database instance:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

export async function getGoldsmithsCollection(): Promise<Collection<Goldsmith>> {
  const db = await getDb();
  return db.collection<Goldsmith>('goldsmiths');
}

export default clientPromise;
