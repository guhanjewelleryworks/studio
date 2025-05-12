// src/lib/mongodb.ts
import { MongoClient, type Db, type Collection, type MongoClientOptions } from 'mongodb';
import type { Goldsmith } from '@/types/goldsmith';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env or .env.local');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

interface GlobalWithMongo extends NodeJS.Global {
    _mongoClientPromise?: Promise<MongoClient>;
}

const options: MongoClientOptions = {};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the MongoClient instance
  // is not repeatedly created on hot reloads.
  const globalWithMongo = global as GlobalWithMongo;
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MongoDB client promise not initialized");
  }
  const mongoClient = await clientPromise;
  // The database name should be part of your MONGODB_URI
  // If not, you might need to specify it here e.g., mongoClient.db("goldsmith_connect_db")
  // However, it's best practice to include it in the URI.
  // If the DB name is in the URI, mongoClient.db() without args uses that DB.
  return mongoClient.db();
}

export async function getGoldsmithsCollection(): Promise<Collection<Goldsmith>> {
  const db = await getDb();
  return db.collection<Goldsmith>('goldsmiths');
}

// You can add more collection getters here, e.g., for orders, users, inquiries
// export async function getUsersCollection(): Promise<Collection<UserType>> {
//   const db = await getDb();
//   return db.collection<UserType>('users');
// }

export default clientPromise;
