// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const defaultLocation = { lat: 34.0522, lng: -118.2437 };

// NewGoldsmithInput now doesn't expect firebaseUID
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
      ...data,
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
      status: 'pending_verification', // Default status
      // Removed firebaseUID field
    };

    const result = await collection.insertOne(newGoldsmith);

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      return { success: true, data: insertedDoc ? { ...insertedDoc, _id: insertedDoc._id.toString(), id: insertedDoc.id } as Goldsmith : undefined };
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
    const goldsmiths = await collection.find({}).toArray();
    return goldsmiths.map(g => ({ ...g, _id: g._id?.toString() })) as Goldsmith[];
  } catch (error) {
    console.error('Error fetching all goldsmiths:', error);
    return [];
  }
}

export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmith = await collection.findOne({ id: id });
    if (goldsmith) {
      return { ...goldsmith, _id: goldsmith._id?.toString() } as Goldsmith;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

// This function is no longer relevant as Firebase Auth is removed.
// It can be deleted or commented out.
// export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
//   try {
//     const collection = await getGoldsmithsCollection();
//     const goldsmith = await collection.findOne({ email: email.toLowerCase() });
//     if (goldsmith) {
//       return { ...goldsmith, _id: goldsmith._id?.toString() } as Goldsmith;
//     }
//     return null;
//   } catch (error) {
//     console.error(`Error fetching goldsmith by email ${email}:`, error);
//     return null;
//   }
// }
