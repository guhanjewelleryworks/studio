// src/lib/mongodb.ts
import { MongoClient, type Db, type Collection, type MongoClientOptions } from 'mongodb';
import type { Goldsmith } from '@/types/goldsmith';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MongoDB URI is not defined. Please set MONGODB_URI in your .env file.");
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Basic check if the password placeholder is still there
if (uri.includes("<db_password>") || uri.includes("YOUR_MONGODB_PASSWORD_HERE")) {
  console.warn("WARNING: MongoDB URI in .env file appears to contain a placeholder password ('<db_password>' or 'YOUR_MONGODB_PASSWORD_HERE'). Please replace it with your actual database password.");
  // In a production environment, you might want to throw an error or prevent startup.
  // For development, a warning might suffice, but connection will likely fail.
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Use globalThis for better compatibility across environments
interface CustomGlobal extends Global {
    _mongoClientPromise?: Promise<MongoClient>;
}

const options: MongoClientOptions = {
  // appName is already in the URI, but can be set here if needed
  // appName: "GoldsmithConnectApp", 
};

let parsedDbNameFromUri: string | undefined;
try {
  const url = new URL(uri);
  // MongoDB SRV URIs don't typically put the DB name in the path before options.
  // e.g., mongodb+srv://user:pass@cluster.host.mongodb.net/MY_DB?retryWrites=true
  // If MY_DB is present, url.pathname will be /MY_DB
  if (url.pathname && url.pathname !== '/') {
    parsedDbNameFromUri = url.pathname.substring(1); // Remove leading slash
    console.log(`Successfully parsed database name from MONGODB_URI path: '${parsedDbNameFromUri}'`);
  } else {
    console.log("Database name not found in MONGODB_URI path. Will use default or fallback.");
  }
} catch (e) {
  console.warn("Could not parse MONGODB_URI to extract database name. This is expected if the database name is not in the URI path. Error:", e instanceof Error ? e.message : String(e));
}

// Fallback database name, aligns with appName in the provided example URI
const DBNAME_FALLBACK = "goldsmithconnect"; 

if (process.env.NODE_ENV === 'development') {
  const g = globalThis as CustomGlobal;
  if (!g._mongoClientPromise) {
    console.log("MongoDB (Development): No existing client promise. Creating new client and attempting to connect...");
    client = new MongoClient(uri, options);
    g._mongoClientPromise = client.connect()
      .then(connectedClient => {
        console.log("MongoDB (Development): Client connected successfully.");
        return connectedClient;
      })
      .catch(err => {
        console.error("MongoDB (Development): Failed to connect to MongoDB.", err);
        // Ensure the error is propagated, so the application knows connection failed.
        // This might cause the app to crash on startup in dev, which is good for immediate feedback.
        throw err; 
      });
  } else {
    console.log("MongoDB (Development): Reusing existing client promise.");
  }
  clientPromise = g._mongoClientPromise;
} else {
  // In production, create a new client for each server instance.
  console.log("MongoDB (Production): Creating new client and attempting to connect...");
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then(connectedClient => {
      console.log("MongoDB (Production): Client connected successfully.");
      return connectedClient;
    })
    .catch(err => {
      console.error("MongoDB (Production): Failed to connect to MongoDB.", err);
      throw err; // Propagate error
    });
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    // This case should ideally not be reached if initialization logic above is sound.
    console.error("MongoDB Error: clientPromise is not initialized. This indicates an issue in the MongoDB setup logic.");
    throw new Error("MongoDB client promise not initialized");
  }
  
  console.log("MongoDB: Awaiting clientPromise to resolve...");
  const mongoClient = await clientPromise;
  console.log("MongoDB: clientPromise resolved.");

  const databaseToUse = parsedDbNameFromUri || DBNAME_FALLBACK;
  console.log(`MongoDB: Attempting to use database: '${databaseToUse}'`);
  
  return mongoClient.db(databaseToUse);
}

export async function getGoldsmithsCollection(): Promise<Collection<Goldsmith>> {
  const db = await getDb();
  console.log(`MongoDB: Getting 'goldsmiths' collection from database '${db.databaseName}'.`);
  return db.collection<Goldsmith>('goldsmiths');
}

// Example for a users collection (if you decide to store user profiles beyond Firebase Auth)
// import type { User } from '@/types/user'; // Create this type definition
// export async function getUsersCollection(): Promise<Collection<User>> {
//   const db = await getDb();
//   console.log(`MongoDB: Getting 'users' collection from database '${db.databaseName}'.`);
//   return db.collection<User>('users');
// }

export default clientPromise;