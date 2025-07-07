'use server';

import { getSettingsCollection } from '@/lib/mongodb';
import type { PlatformSettings } from '@/types/goldsmith';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from './audit-log-actions';

const defaultSettings: PlatformSettings = {
    key: 'platform_main',
    announcementText: '',
    isAnnouncementVisible: false,
};

/**
 * Fetches the current platform settings document.
 * If no settings exist, it returns a default object.
 */
export async function fetchPlatformSettings(): Promise<Omit<PlatformSettings, '_id'>> {
  console.log('[Action: fetchPlatformSettings] Attempting to fetch platform settings.');
  try {
    const collection = await getSettingsCollection();
    const settings = await collection.findOne({ key: 'platform_main' });
    if (settings) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...settingsData } = settings;
      return settingsData as Omit<PlatformSettings, '_id'>;
    }
    return defaultSettings;
  } catch (error) {
    console.error('[Action: fetchPlatformSettings] Error fetching settings:', error);
    return defaultSettings;
  }
}

/**
 * Updates the platform settings. Creates the document if it doesn't exist.
 */
export async function updatePlatformSettings(data: Partial<Omit<PlatformSettings, 'key' | '_id'>>): Promise<{ success: boolean; data?: Omit<PlatformSettings, '_id'>; error?: string }> {
  console.log('[Action: updatePlatformSettings] Updating settings with data:', data);
  try {
    const collection = await getSettingsCollection();
    const result = await collection.findOneAndUpdate(
      { key: 'platform_main' },
      { $set: data },
      { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
    );
    
    if (result) {
        logAuditEvent(
          'Updated platform settings',
          { type: 'admin', id: 'admin_user' }, // Placeholder admin ID
          { changes: data }
        );
        // Revalidate the homepage path to show the new announcement immediately
        revalidatePath('/');
        return { success: true, data: result as Omit<PlatformSettings, '_id'> };
    } else {
        return { success: false, error: 'Settings not found or not updated.' };
    }
  } catch (error) {
    console.error('[Action: updatePlatformSettings] Error updating settings:', error);
    return { success: false, error: 'Failed to update settings due to a server error.' };
  }
}
