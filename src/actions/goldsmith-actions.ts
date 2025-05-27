// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import type { Collection, Filter } from 'mongodb';

const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  console.log('[Action: saveGoldsmith] Received data for registration:', JSON.stringify(data));
  try {
    const collection: Collection<Goldsmith> = await getGoldsmithsCollection();

    // Basic validation
    if (!data.name || !data.email || !data.password) {
        console.error('[Action: saveGoldsmith] Validation failed: Workshop name, email, and password are required.');
        return { success: false, error: 'Workshop name, email, and password are required.' };
    }
    // Password length validation
    if (data.password.trim().length < 8) {
        console.error('[Action: saveGoldsmith] Validation failed: Password too short.');
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const normalizedPhone = data.phone ? data.phone.trim() : undefined; // Use undefined if phone is not provided

    // Check if email already exists
    const existingGoldsmithByEmail = await collection.findOne({ email: normalizedEmail });
    if (existingGoldsmithByEmail) {
        console.error(`[Action: saveGoldsmith] Validation failed: Email ${normalizedEmail} already exists.`);
        return { success: false, error: 'An account with this email already exists. Please use a different email or log in.' };
    }

    // Check if phone number already exists (only if a non-empty phone is provided)
    if (normalizedPhone && normalizedPhone !== '') {
        const existingGoldsmithByPhone = await collection.findOne({ phone: normalizedPhone });
        if (existingGoldsmithByPhone) {
            console.error(`[Action: saveGoldsmith] Validation failed: Phone number ${normalizedPhone} already exists.`);
            return { success: false, error: 'An account with this phone number already exists. Please use a different phone number.' };
        }
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
      email: normalizedEmail,
      phone: normalizedPhone || '', // Store empty string if phone is undefined, or as per your DB schema preference
      address: data.address?.trim() || '',
      specialty: Array.isArray(data.specialty) ? data.specialty.map(s => s.trim()).filter(s => s) : (data.specialty?.trim() || ''),
      portfolioLink: data.portfolioLink?.trim() || '',
      password: data.password.trim(), 
      id: uuidv4(),
      rating: 0,
      imageUrl: `https://picsum.photos/seed/${safeNameSeed}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${safeNameSeed}-profile/120/120`,
      location: defaultLocation,
      shortBio: `Specializing in ${specialtyText}.`,
      tagline: `Bespoke creations by ${workshopNameOrDefault}`,
      bio: `Discover the craftsmanship of ${workshopNameOrDefault}. This artisan brings years of dedication and a passion for unique jewelry to every piece, ensuring meticulous attention to detail and a personal touch. From initial design to final polish, experience the art of bespoke jewelry.`,
      yearsExperience: data.yearsExperience || 0,
      responseTime: data.responseTime || "Varies",
      ordersCompleted: data.ordersCompleted || 0,
      status: 'pending_verification', // Default status for new registrations
    };
    
    console.log('[Action: saveGoldsmith] Attempting to insert new goldsmith:', JSON.stringify(newGoldsmith));
    const result = await collection.insertOne(newGoldsmith);
    console.log('[Action: saveGoldsmith] MongoDB insert result:', JSON.stringify(result));

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      if (insertedDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...goldsmithWithoutMongoId } = insertedDoc;
        console.log('[Action: saveGoldsmith] Successfully inserted and retrieved doc:', JSON.stringify(goldsmithWithoutMongoId));
        return { success: true, data: goldsmithWithoutMongoId as Goldsmith };
      }
      console.warn('[Action: saveGoldsmith] InsertedId was present, but document not found immediately after insert. ID:', result.insertedId.toString());
      return { success: true, data: undefined }; 
    } else {
      console.error('[Action: saveGoldsmith] Failed to insert goldsmith data. MongoDB result did not contain insertedId.');
      return { success: false, error: 'Failed to insert goldsmith data.' };
    }
  } catch (error) {
    console.error('[Action: saveGoldsmith] Error during goldsmith registration:', error);
    let errorMessage = 'An unknown error occurred while registering goldsmith.';
    if (error instanceof Error) {
        errorMessage = error.message;
         if ((error as any).code === 11000) { 
            errorMessage = 'A duplicate record error occurred. This email or phone number might already be in use.';
        }
    }
    return { success: false, error: `Failed to register goldsmith: ${errorMessage}` };
  }
}

export async function fetchAllGoldsmiths(): Promise<Goldsmith[]> {
  console.log('[Action: fetchAllGoldsmiths] Attempting to fetch verified goldsmiths for discover page.');
  try {
    const collection = await getGoldsmithsCollection();
    // Only fetch verified goldsmiths for public display
    const goldsmithsCursor = collection.find({ status: 'verified' } as Filter<Goldsmith>); 
    const goldsmithsArray = await goldsmithsCursor.toArray();
    console.log(`[Action: fetchAllGoldsmiths] Found ${goldsmithsArray.length} verified goldsmiths.`);
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; 
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('[Action: fetchAllGoldsmiths] Error fetching all verified goldsmiths:', error);
    return [];
  }
}

// New function to fetch goldsmiths for the admin panel
export async function fetchAdminGoldsmiths(): Promise<Goldsmith[]> {
  console.log('[Action: fetchAdminGoldsmiths] Attempting to fetch all goldsmiths for admin panel.');
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithsCursor = collection.find({}); // Fetch all, regardless of status
    const goldsmithsArray = await goldsmithsCursor.toArray();
    console.log(`[Action: fetchAdminGoldsmiths] Found ${goldsmithsArray.length} total goldsmiths for admin panel.`);
    if (goldsmithsArray.length > 0) {
      console.log('[Action: fetchAdminGoldsmiths] First goldsmith fetched for admin (sample):', JSON.stringify(goldsmithsArray[0]));
    }
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; 
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('[Action: fetchAdminGoldsmiths] Error fetching goldsmiths for admin:', error);
    return [];
  }
}

// New function to update a goldsmith's status
export async function updateGoldsmithStatus(id: string, newStatus: Goldsmith['status']): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action: updateGoldsmithStatus] Attempting to update status for goldsmith ID ${id} to ${newStatus}.`);
  try {
    if (!id || !newStatus) {
      console.error('[Action: updateGoldsmithStatus] Validation failed: Goldsmith ID and new status are required.');
      return { success: false, error: 'Goldsmith ID and new status are required.' };
    }
    const validStatuses: Goldsmith['status'][] = ['pending_verification', 'verified', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      console.error(`[Action: updateGoldsmithStatus] Validation failed: Invalid status provided - ${newStatus}.`);
      return { success: false, error: 'Invalid status provided.' };
    }

    const collection = await getGoldsmithsCollection();
    const result = await collection.updateOne(
      { id: id }, // Using the UUID 'id' field
      { $set: { status: newStatus } }
    );
    console.log('[Action: updateGoldsmithStatus] MongoDB update result:', JSON.stringify(result));

    if (result.modifiedCount === 1) {
      console.log(`[Action: updateGoldsmithStatus] Successfully updated status for goldsmith ID ${id}.`);
      return { success: true };
    } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
      console.log(`[Action: updateGoldsmithStatus] Goldsmith ID ${id} found, but status was already ${newStatus}.`);
      return { success: true, error: 'Goldsmith status is already set to the new status.' };
    } else {
      console.warn(`[Action: updateGoldsmithStatus] Goldsmith ID ${id} not found or status not updated. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
      return { success: false, error: 'Goldsmith not found or status not updated.' };
    }
  } catch (error) {
    console.error('[Action: updateGoldsmithStatus] Error updating goldsmith status:', error);
    let errorMessage = 'An unknown error occurred while updating status.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Failed to update status: ${errorMessage}` };
  }
}


export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  console.log(`[Action: fetchGoldsmithById] Attempting to fetch goldsmith by ID ${id}.`);
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ id: id }); // Using the UUID 'id' field
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...goldsmith } = goldsmithDoc; 
      console.log(`[Action: fetchGoldsmithById] Found goldsmith:`, JSON.stringify(goldsmith));
      return goldsmith as Goldsmith;
    }
    console.log(`[Action: fetchGoldsmithById] Goldsmith with ID ${id} not found.`);
    return null;
  } catch (error) {
    console.error(`[Action: fetchGoldsmithById] Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[Action: fetchGoldsmithByEmailForLogin] Attempting to fetch goldsmith by email ${normalizedEmail}.`);
  try {
    const collection = await getGoldsmithsCollection();
    // Fetch the full document including the password for login comparison
    const goldsmithDoc = await collection.findOne({ email: normalizedEmail }); 
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmith } = goldsmithDoc;
      console.log(`[Action: fetchGoldsmithByEmailForLogin] Found goldsmith with matching email.`); // Don't log sensitive data like password
      return goldsmith as Goldsmith; 
    }
    console.log(`[Action: fetchGoldsmithByEmailForLogin] Goldsmith with email ${normalizedEmail} not found.`);
    return null;
  } catch (error) {
    console.error(`[Action: fetchGoldsmithByEmailForLogin] Error fetching goldsmith by email ${normalizedEmail} for login:`, error);
    return null;
  }
}
