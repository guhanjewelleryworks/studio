// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  try {
    const collection = await getGoldsmithsCollection();

    // Basic validation
    if (!data.name || !data.email || !data.password) {
        return { success: false, error: 'Workshop name, email, and password are required.' };
    }

    // Password length validation
    if (data.password.trim().length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const safeNameSeed = (data.name && data.name.trim() !== "")
      ? data.name.trim().replace(/\s+/g, '-').toLowerCase()
      : `goldsmith-${uuidv4().substring(0, 8)}`;

    const workshopNameOrDefault = data.name && data.name.trim() !== "" ? data.name.trim() : "Artisan";

    const specialtyText = (Array.isArray(data.specialty) && data.specialty.length > 0)
        ? data.specialty.join(', ')
        : 'fine jewelry';

    const newGoldsmith: Goldsmith = {
      name: data.name.trim(),
      contactPerson: data.contactPerson?.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim(),
      address: data.address.trim(),
      specialty: Array.isArray(data.specialty) ? data.specialty.map(s => s.trim()) : data.specialty.trim(),
      portfolioLink: data.portfolioLink?.trim(),
      password: data.password.trim(), // Store trimmed password
      id: uuidv4(),
      rating: 0,
      imageUrl: `https://picsum.photos/seed/${safeNameSeed}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${safeNameSeed}-profile/120/120`,
      location: defaultLocation, // Default location for now
      shortBio: `Specializing in ${specialtyText}.`,
      tagline: `Bespoke creations by ${workshopNameOrDefault}`,
      bio: `Discover the craftsmanship of ${workshopNameOrDefault}. This artisan brings years of dedication and a passion for unique jewelry to every piece, ensuring meticulous attention to detail and a personal touch. From initial design to final polish, experience the art of bespoke jewelry.`,
      yearsExperience: data.yearsExperience || 0, // Default to 0 if not provided
      responseTime: data.responseTime || "Varies",
      ordersCompleted: data.ordersCompleted || 0,
      status: 'pending_verification', // Default status for new registrations
    };

    const result = await collection.insertOne(newGoldsmith);

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      if (insertedDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...goldsmithWithoutMongoId } = insertedDoc;
        return { success: true, data: goldsmithWithoutMongoId as Goldsmith };
      }
      return { success: true, data: undefined }; 
    } else {
      return { success: false, error: 'Failed to insert goldsmith data.' };
    }
  } catch (error) {
    console.error('Error saving goldsmith:', error);
    let errorMessage = 'An unknown error occurred while saving goldsmith data.';
    if (error instanceof Error) {
        errorMessage = error.message;
         if ((error as any).code === 11000) { // MongoDB duplicate key error
            errorMessage = 'An account with this email already exists.';
        }
    }
    return { success: false, error: `Failed to save goldsmith: ${errorMessage}` };
  }
}

export async function fetchAllGoldsmiths(): Promise<Goldsmith[]> {
  try {
    const collection = await getGoldsmithsCollection();
    // Only fetch verified goldsmiths for public display
    const goldsmiths = await collection.find({ status: 'verified' }).toArray(); 
    return goldsmiths.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; // Exclude MongoDB's _id AND password for public listings
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...goldsmith } = goldsmithDoc; // Exclude password for public profile view
      return goldsmith as Goldsmith;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

// Fetches goldsmith by email for login, including the password
export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    // Ensure the email query is also lowercased to match the stored format
    const goldsmithDoc = await collection.findOne({ email: email.toLowerCase().trim() });
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmith } = goldsmithDoc; // We need the password field from the doc
      return goldsmith as Goldsmith; 
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by email ${email} for login:`, error);
    return null;
  }
}
