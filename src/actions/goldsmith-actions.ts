// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const defaultLocation = { lat: 34.0522, lng: -118.2437 };

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  try {
    const collection = await getGoldsmithsCollection();

    const safeNameSeed = (data.name && data.name.trim() !== "")
      ? data.name.trim().replace(/\s+/g, '-').toLowerCase()
      : `goldsmith-${uuidv4().substring(0, 8)}`;

    const workshopNameOrDefault = data.name && data.name.trim() !== "" ? data.name.trim() : "Artisan";

    const specialtyText = (Array.isArray(data.specialty) && data.specialty.length > 0)
        ? data.specialty.join(', ')
        : 'fine jewelry';

    const newGoldsmith: Goldsmith = {
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email.toLowerCase(),
      phone: data.phone,
      address: data.address,
      specialty: data.specialty,
      portfolioLink: data.portfolioLink,
      password: data.password, // Storing plain-text password (for simulation only!)
      id: uuidv4(),
      rating: 0,
      imageUrl: `https://picsum.photos/seed/${safeNameSeed}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${safeNameSeed}-profile/120/120`,
      location: defaultLocation,
      shortBio: `Specializing in ${specialtyText}.`,
      tagline: `Bespoke creations by ${workshopNameOrDefault}`,
      bio: `Discover the craftsmanship of ${workshopNameOrDefault}.`,
      yearsExperience: 0,
      responseTime: "Varies",
      ordersCompleted: 0,
      status: 'pending_verification',
    };

    const result = await collection.insertOne(newGoldsmith);

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      // Ensure the returned object matches the Goldsmith type structure, removing _id if necessary before casting
      if (insertedDoc) {
        const { _id, ...goldsmithWithoutMongoId } = insertedDoc;
        return { success: true, data: goldsmithWithoutMongoId as Goldsmith };
      }
      return { success: true, data: undefined }; // Or handle as an error if doc not found post-insert
    } else {
      return { success: false, error: 'Failed to insert goldsmith data.' };
    }
  } catch (error) {
    console.error('Error saving goldsmith:', error);
    let errorMessage = 'An unknown error occurred while saving goldsmith data.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Failed to save goldsmith: ${errorMessage}` };
  }
}

export async function fetchAllGoldsmiths(): Promise<Goldsmith[]> {
  try {
    const collection = await getGoldsmithsCollection();
    // Fetch only verified goldsmiths for the discover page
    const goldsmiths = await collection.find({ status: 'verified' }).toArray();
    return goldsmiths.map(g => {
      const { _id, ...rest } = g; // Exclude MongoDB's _id
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('Error fetching all verified goldsmiths:', error);
    return [];
  }
}

export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ id: id });
    if (goldsmithDoc) {
      const { _id, ...goldsmith } = goldsmithDoc;
      return goldsmith as Goldsmith;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

// New function to fetch goldsmith by email for login, including the password
export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ email: email.toLowerCase() });
    if (goldsmithDoc) {
      // For login, we need the password, so we don't exclude it here.
      // Still, it's good practice to transform away the MongoDB _id if not needed by the caller.
      const { _id, ...goldsmith } = goldsmithDoc;
      return goldsmith as Goldsmith; // This will include the password field
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by email ${email} for login:`, error);
    return null;
  }
}
