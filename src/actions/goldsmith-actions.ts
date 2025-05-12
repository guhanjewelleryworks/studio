// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection } from '@/lib/mongodb';
import type { Goldsmith } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Input type for new goldsmith registration (excluding MongoDB _id)
export type NewGoldsmithInput = Omit<Goldsmith, '_id' | 'id' | 'rating' | 'imageUrl' | 'profileImageUrl' | 'location' | 'shortBio' | 'tagline' | 'bio' | 'yearsExperience' | 'responseTime' | 'ordersCompleted'> & { password?: string }; // Password is for auth, not stored directly as-is

const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Default to Los Angeles or use geolocation later

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  try {
    const collection = await getGoldsmithsCollection();
    
    // In a real app, password would be hashed here before storing or handled by an auth system
    // For now, we'll omit it from the Goldsmith document if you're not storing it directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...goldsmithDataToStore } = data;

    const newGoldsmith: Goldsmith = {
      ...goldsmithDataToStore,
      id: uuidv4(), // Generate a unique ID
      rating: 0, // Default rating
      imageUrl: `https://picsum.photos/seed/${goldsmithDataToStore.name.replace(/\s+/g, '-').toLowerCase()}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${goldsmithDataToStore.name.replace(/\s+/g, '-').toLowerCase()}-profile/120/120`,
      location: defaultLocation, // Placeholder, ideally get from address or separate input
      shortBio: `Specializing in ${Array.isArray(data.specialty) ? data.specialty.join(', ') : data.specialty || 'fine jewelry'}.`,
      tagline: `Bespoke creations by ${data.name}`,
      bio: `Discover the craftsmanship of ${data.name}.`,
      yearsExperience: 0, // Default, should be part of form
      responseTime: "Varies", // Default
      ordersCompleted: 0, // Default
    };

    const result = await collection.insertOne(newGoldsmith);
    
    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      // Convert ObjectId to string for the returned data if necessary, or handle in frontend
      return { success: true, data: insertedDoc ? { ...insertedDoc, _id: insertedDoc._id.toString(), id: insertedDoc.id } as Goldsmith : undefined };
    } else {
      return { success: false, error: 'Failed to insert goldsmith data.' };
    }
  } catch (error) {
    console.error('Error saving goldsmith:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function fetchAllGoldsmiths(): Promise<Goldsmith[]> {
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmiths = await collection.find({}).toArray();
    // Convert ObjectId to string for each document
    return goldsmiths.map(g => ({ ...g, _id: g._id?.toString() })) as Goldsmith[];
  } catch (error) {
    console.error('Error fetching all goldsmiths:', error);
    return []; // Return empty array on error
  }
}

export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  try {
    const collection = await getGoldsmithsCollection();
    // Assuming 'id' is your application-specific unique ID, not MongoDB's _id.
    // If 'id' is supposed to be MongoDB's _id, you'd need to convert string id to ObjectId first.
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
