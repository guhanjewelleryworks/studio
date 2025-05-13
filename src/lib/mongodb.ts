// src/lib/mongodb.ts
import type { Collection, Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { Goldsmith } from '@/types/goldsmith'; // Ensure Goldsmith type is correctly imported

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME_FROM_URI = MONGODB_URI?.split('/')?.pop()?.split('?')?.[0];
const DB_NAME = process.env.DB_NAME || DB_NAME_FROM_URI || 'goldsmithconnect';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env or .env.local'
  );
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
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const mongoClient = await clientPromise;
  return mongoClient.db(DB_NAME);
}

export async function getGoldsmithsCollection(): Promise<Collection<Goldsmith>> {
  const db = await getDb();
  return db.collection<Goldsmith>('goldsmiths');
}

// Example for other collections if needed in the future
// export async function getUsersCollection(): Promise<Collection<User>> {
//   const db = await getDb();
//   return db.collection<User>('users');
// }

export default clientPromise;
