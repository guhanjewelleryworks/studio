// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import type { Collection, Filter, ObjectId } from 'mongodb';

const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  try {
    const collection: Collection<Goldsmith> = await getGoldsmithsCollection();

    // Basic validation
    if (!data.name || !data.email || !data.password) {
        return { success: false, error: 'Workshop name, email, and password are required.' };
    }
    // Password length validation
    if (data.password.trim().length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    // Check if email already exists
    const existingGoldsmith = await collection.findOne({ email: data.email.toLowerCase().trim() });
    if (existingGoldsmith) {
        return { success: false, error: 'An account with this email already exists.' };
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
      contactPerson: data.contactPerson?.trim() || '',
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      specialty: Array.isArray(data.specialty) ? data.specialty.map(s => s.trim()).filter(s => s) : (data.specialty?.trim() || ''),
      portfolioLink: data.portfolioLink?.trim() || '',
      password: data.password.trim(), // Storing plain text for simulation - **NEVER DO THIS IN PRODUCTION**
      id: uuidv4(),
      rating: 0,
      imageUrl: `https://picsum.photos/seed/${safeNameSeed}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${safeNameSeed}-profile/120/120`,
      location: defaultLocation, // Default location for now
      shortBio: `Specializing in ${specialtyText}.`,
      tagline: `Bespoke creations by ${workshopNameOrDefault}`,
      bio: `Discover the craftsmanship of ${workshopNameOrDefault}. This artisan brings years of dedication and a passion for unique jewelry to every piece, ensuring meticulous attention to detail and a personal touch. From initial design to final polish, experience the art of bespoke jewelry.`,
      yearsExperience: data.yearsExperience || 0,
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
         if ((error as any).code === 11000) { 
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
    const goldsmithsCursor = collection.find({ status: 'verified' } as Filter<Goldsmith>); 
    const goldsmithsArray = await goldsmithsCursor.toArray();
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; 
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('Error fetching all verified goldsmiths:', error);
    return [];
  }
}

// New function to fetch goldsmiths for the admin panel
export async function fetchAdminGoldsmiths(): Promise<Goldsmith[]> {
  try {
    const collection = await getGoldsmithsCollection();
    // Fetch all goldsmiths or filter as needed by admin (e.g., by status)
    // For now, let's fetch all and include the status
    const goldsmithsCursor = collection.find({});
    const goldsmithsArray = await goldsmithsCursor.toArray();
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; // Exclude password for admin view too for security
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('Error fetching goldsmiths for admin:', error);
    return [];
  }
}

// New function to update a goldsmith's status
export async function updateGoldsmithStatus(id: string, newStatus: Goldsmith['status']): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id || !newStatus) {
      return { success: false, error: 'Goldsmith ID and new status are required.' };
    }
    const validStatuses: Goldsmith['status'][] = ['pending_verification', 'verified', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status provided.' };
    }

    const collection = await getGoldsmithsCollection();
    const result = await collection.updateOne(
      { id: id },
      { $set: { status: newStatus } }
    );

    if (result.modifiedCount === 1) {
      return { success: true };
    } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
      return { success: true, error: 'Goldsmith status is already set to the new status.' };
    } else {
      return { success: false, error: 'Goldsmith not found or status not updated.' };
    }
  } catch (error) {
    console.error('Error updating goldsmith status:', error);
    let errorMessage = 'An unknown error occurred while updating status.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Failed to update status: ${errorMessage}` };
  }
}


export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ id: id });
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...goldsmith } = goldsmithDoc; 
      return goldsmith as Goldsmith;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ email: email.toLowerCase().trim() });
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmith } = goldsmithDoc; 
      return goldsmith as Goldsmith; 
    }
    return null;
  } catch (error) {
    console.error(`Error fetching goldsmith by email ${email} for login:`, error);
    return null;
  }
}
