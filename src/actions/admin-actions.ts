// src/actions/admin-actions.ts
'use server';

import { getAdminsCollection } from '@/lib/mongodb';
import type { Admin, NewAdminInput } from '@/types/goldsmith';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logAuditEvent } from './audit-log-actions';

const SALT_ROUNDS = 10;

/**
 * Creates the default admin user if one doesn't exist, using credentials from environment variables.
 * This is a self-seeding mechanism to ensure there's always an admin account.
 */
async function seedDefaultAdmin(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('[Admin Actions] ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set. Cannot seed default admin.');
    return;
  }

  try {
    const collection = await getAdminsCollection();
    const existingAdmin = await collection.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`[Admin Actions] No default admin found with email ${adminEmail}. Creating one...`);
      const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

      const newAdmin: Omit<Admin, '_id'> = {
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date(),
      };

      await collection.insertOne(newAdmin);
      console.log('[Admin Actions] Default admin user has been successfully created.');
      
      logAuditEvent('Default admin account seeded', { type: 'system', id: 'init' }, { email: adminEmail });

    } else {
        console.log('[Admin Actions] Default admin user already exists. Seed unnecessary.');
    }
  } catch (error) {
    console.error('[Admin Actions] Error seeding default admin:', error);
  }
}

/**
 * Authenticates an admin user against the database.
 * @param credentials An object containing the admin's email and password.
 * @returns An object indicating success, a message, and optionally the admin data.
 */
export async function loginAdmin(credentials: Pick<NewAdminInput, 'email' | 'password'>): Promise<{ success: boolean; message: string; admin?: Omit<Admin, 'password'> }> {
  console.log(`[Admin Actions] Attempting admin login for email: ${credentials.email}`);
  
  // Ensure the seed function has run, creating the admin if it's the first time.
  await seedDefaultAdmin();

  try {
    const collection = await getAdminsCollection();
    const adminUser = await collection.findOne({ email: credentials.email });

    if (!adminUser) {
      console.warn(`[Admin Actions] Login failed: No admin found with email ${credentials.email}.`);
      return { success: false, message: 'Invalid email or password.' };
    }

    if (!adminUser.password) {
      console.error(`[Admin Actions] Security Alert: Admin user ${credentials.email} has no password set.`);
      return { success: false, message: 'Invalid account configuration. Please contact support.' };
    }

    const passwordMatch = await bcrypt.compare(credentials.password, adminUser.password);

    if (passwordMatch) {
      console.log(`[Admin Actions] Admin login successful for ${credentials.email}.`);
      logAuditEvent('Admin successful login', { type: 'admin', id: adminUser.id }, { email: adminUser.email });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...adminDataToReturn } = adminUser;
      return { success: true, message: 'Login successful!', admin: adminDataToReturn };
    } else {
      console.warn(`[Admin Actions] Login failed: Password mismatch for ${credentials.email}.`);
      return { success: false, message: 'Invalid email or password.' };
    }

  } catch (error) {
    console.error('[Admin Actions] Error during admin login:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}