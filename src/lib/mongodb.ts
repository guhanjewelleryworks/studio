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

// Extract database name from URI if present, otherwise use a default
// Example URI: mongodb+srv://user:pass@cluster/myDatabase?retryWrites=true
// If your URI doesn't include the database name before the query params,
// you'll need to specify it.
let dbName: string | undefined;
try {
  const url = new URL(uri);
  // Pathname is like /myDatabase or just / if no DB is in URI path
  if (url.pathname && url.pathname !== '/') {
    dbName = url.pathname.substring(1); // Remove leading slash
  }
} catch (e) {
  console.warn("Could not parse MONGODB_URI to extract database name. Ensure it's correctly formatted or specify dbName in mongoClient.db().");
}


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
  // Use the extracted dbName if available, otherwise let MongoDB driver use default from URI
  // or you can hardcode a default fallback like "goldsmith_connect_db" if not in URI.
  // For the provided URI, it seems the database name is not explicitly in the path.
  // If your MongoDB setup requires a specific database name and it's not in the URI path,
  // you MUST provide it here. E.g., mongoClient.db("yourActualDatabaseName")
  // If 'appName' in the URI implies the DB, MongoDB driver might handle it.
  // For robustness, it's good to be explicit if there's any ambiguity.
  // Let's assume the 'appName' or the default behavior of the driver handles the DB selection if not in path.
  // If issues persist, you may need to specify: return mongoClient.db("your_db_name_here");
  return mongoClient.db(dbName);
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
