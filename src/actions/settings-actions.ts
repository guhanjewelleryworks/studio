// src/actions/settings-actions.ts
'use server';

import { getSettingsCollection } from '@/lib/mongodb';
import type { PlatformSettings } from '@/types/goldsmith';
import { revalidatePath } from 'next/cache';
import { logAuditEvent } from './audit-log-actions';
import { cookies } from 'next/headers';

const defaultSettings: PlatformSettings = {
    key: 'platform_main',
    announcementText: '',
    isAnnouncementVisible: false,
    customerPremiumPriceMonthly: 19,
    customerPremiumPriceAnnual: 199,
    goldsmithPartnerPriceMonthly: 49,
    goldsmithPartnerPriceAnnual: 499,
    isMaintenanceModeEnabled: false,
    allowCustomerRegistration: true, // Default to true
    allowGoldsmithRegistration: true, // Default to true
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
      // Ensure all fields from defaultSettings are present
      return { ...defaultSettings, ...settingsData } as Omit<PlatformSettings, '_id'>;
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
    
    // --- THIS IS THE CORRECTED COOKIE HANDLING LOGIC ---
    if (data.isMaintenanceModeEnabled === true) {
      cookies().set('maintenance_mode', 'true', { path: '/', httpOnly: true });
      console.log('[Action: updatePlatformSettings] Maintenance mode enabled, setting cookie.');
    } else if (data.isMaintenanceModeEnabled === false) {
      // To delete a cookie, we set it with an expiry date in the past.
      // The .delete() method is not available on the server-side cookies() store in this context.
      cookies().set('maintenance_mode', '', { path: '/', expires: new Date(0) });
      console.log('[Action: updatePlatformSettings] Maintenance mode disabled, deleting cookie.');
    }
    
    if (result) {
        logAuditEvent(
          'Updated platform settings',
          { type: 'admin', id: 'admin_user' }, // Placeholder admin ID
          { changes: data }
        );
        // Revalidate paths that use these settings
        revalidatePath('/');
        revalidatePath('/pricing');
        revalidatePath('/signup');
        revalidatePath('/goldsmith-portal/register');
        revalidatePath('/admin/settings');
        return { success: true, data: { ...defaultSettings, ...result } as Omit<PlatformSettings, '_id'> };
    } else {
        return { success: false, error: 'Settings not found or not updated.' };
    }
  } catch (error) {
    console.error('[Action: updatePlatformSettings] Error updating settings:', error);
    return { success: false, error: 'Failed to update settings due to a server error.' };
  }
}
