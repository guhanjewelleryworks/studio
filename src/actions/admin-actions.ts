// src/actions/admin-actions.ts
'use server';

import { getAdminsCollection } from '@/lib/mongodb';
import type { Admin, NewAdminInput, Permission, UpdateAdminInput } from '@/types/goldsmith';
import { validPermissions } from '@/types/goldsmith';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logAuditEvent } from './audit-log-actions';
import { revalidatePath } from 'next/cache';
import { type WithId } from 'mongodb';

const SALT_ROUNDS = 10;

/**
 * Creates the default admin user if one doesn't exist, using credentials from environment variables.
 * This function should only be called when an admin user is confirmed not to exist.
 */
async function seedDefaultAdmin(credentials: Pick<NewAdminInput, 'email' | 'password'>): Promise<Admin | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('[Admin Actions] ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set. Cannot seed default admin.');
    return null;
  }
  
  // Extra safeguard: Only seed if the provided credentials match the environment variables
  if (credentials.email !== adminEmail || credentials.password !== adminPassword) {
      console.log("[Admin Actions] Credentials do not match .env, seeding skipped.");
      return null;
  }

  try {
    const collection = await getAdminsCollection();
    // Double-check existence inside the function to be safe
    const existingAdmin = await collection.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`[Admin Actions] No default admin found with email ${adminEmail}. Creating one...`);
      const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

      const newAdmin: Omit<Admin, '_id'> = {
        id: uuidv4(),
        name: 'Super Admin', // Default name for the seeded admin
        email: adminEmail,
        password: hashedPassword,
        role: 'superadmin',
        permissions: [...validPermissions], // Superadmin gets all permissions
        createdAt: new Date(),
      };

      await collection.insertOne(newAdmin);
      console.log('[Admin Actions] Default admin user has been successfully created.');
      
      await logAuditEvent('Default admin account seeded', { type: 'system', id: 'init' }, { email: adminEmail });
      
      // Return the newly created admin document by fetching it again
      const createdAdmin = await collection.findOne({ email: adminEmail });
      return createdAdmin as Admin | null;
    }
  } catch (error) {
    console.error('[Admin Actions] Error seeding default admin:', error);
  }
  // Return null if it already existed or an error occurred
  return null;
}

/**
 * Authenticates an admin user against the database.
 * @param credentials An object containing the admin's email and password.
 * @returns An object indicating success, a message, and optionally the admin data.
 */
export async function loginAdmin(credentials: Pick<NewAdminInput, 'email' | 'password'>): Promise<{ success: boolean; message: string; admin?: Omit<Admin, 'password'> }> {
  // CRITICAL: Revalidate the path to prevent server-side caching of this action's result.
  revalidatePath('/admin/login');
  console.log(`[Admin Actions] Attempting admin login for email: ${credentials.email}`);
  const collection = await getAdminsCollection();

  try {
    let adminUser = await collection.findOne({ email: credentials.email });

    // If the admin user does not exist, try to seed it.
    // This will only succeed if the credentials match the .env variables.
    if (!adminUser) {
        console.log(`[Admin Actions] Admin not found for ${credentials.email}. Attempting to seed.`);
        // The seed function has its own check against .env variables.
        adminUser = await seedDefaultAdmin(credentials);
    }
    
    // If after attempting to find or seed, the user still doesn't exist, fail the login.
    if (!adminUser) {
      console.warn(`[Admin Actions] Login failed: No admin found with email ${credentials.email} and seeding was not applicable.`);
      return { success: false, message: 'Invalid email or password.' };
    }

    // From this point, we have a valid adminUser object from the database.
    // Now, we must always perform the password check.
    if (!adminUser.password) {
      console.error(`[Admin Actions] Security Alert: Admin user ${credentials.email} has no password set.`);
      return { success: false, message: 'Invalid account configuration. Please contact support.' };
    }

    const passwordMatch = await bcrypt.compare(credentials.password, adminUser.password);

    if (passwordMatch) {
      console.log(`[Admin Actions] Admin login successful for ${credentials.email}.`);
      await logAuditEvent('Admin successful login', { type: 'admin', id: adminUser.id }, { email: adminUser.email });

      // FIX: Ensure superadmins always have all permissions
      let finalPermissions = adminUser.permissions || [];
      if (adminUser.role === 'superadmin') {
          finalPermissions = [...validPermissions];
          // Good practice: update the DB record if it's incorrect
          if (adminUser.permissions.length !== validPermissions.length) {
              console.log(`[Admin Actions] Correcting permissions for superadmin ${adminUser.email} in database.`);
              await collection.updateOne({ _id: adminUser._id }, { $set: { permissions: finalPermissions } });
          }
      }

      // Manually create a plain object to avoid serialization errors
      const adminDataToReturn = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        permissions: finalPermissions, // Use the corrected permissions
        createdAt: adminUser.createdAt instanceof Date ? adminUser.createdAt.toISOString() : adminUser.createdAt,
      };

      return { success: true, message: 'Login successful!', admin: adminDataToReturn as any };
    } else {
      console.warn(`[Admin Actions] Login failed: Password mismatch for ${credentials.email}.`);
      return { success: false, message: 'Invalid email or password.' };
    }

  } catch (error) {
    console.error('[Admin Actions] Error during admin login:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}

/**
 * Creates a new standard administrator.
 */
export async function createAdmin(data: NewAdminInput): Promise<{ success: boolean, error?: string }> {
    console.log('[Admin Actions] Attempting to create new admin:', data.email);
    try {
        const collection = await getAdminsCollection();
        const existingAdmin = await collection.findOne({ email: data.email });

        if (existingAdmin) {
            return { success: false, error: 'An admin with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        let finalPermissions = data.permissions;
        const role = data.permissions.includes('canManageAdmins') ? 'superadmin' : 'admin';
        
        // If the role is superadmin, ensure they get all permissions
        if (role === 'superadmin') {
            finalPermissions = [...validPermissions];
        }

        const newAdmin: Omit<Admin, '_id'> = {
            id: uuidv4(),
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: role,
            permissions: finalPermissions,
            createdAt: new Date(),
        };

        await collection.insertOne(newAdmin);
        
        await logAuditEvent('Admin account created', { type: 'admin', id: 'superadmin_user' }, { newAdminEmail: newAdmin.email, role: newAdmin.role });
        revalidatePath('/admin/admins'); // Revalidate the page to show the new admin
        return { success: true };
    } catch (error) {
        console.error('[Admin Actions] Error creating admin:', error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}

/**
 * Updates an existing administrator's name and permissions.
 */
export async function updateAdmin(data: UpdateAdminInput): Promise<{ success: boolean, error?: string }> {
    console.log('[Admin Actions] Attempting to update admin:', data.id);
    try {
        if (!data.id || !data.name || !data.permissions) {
            return { success: false, error: 'Incomplete data provided for update.' };
        }

        const collection = await getAdminsCollection();
        const adminToUpdate = await collection.findOne({ id: data.id });

        if (!adminToUpdate) {
            return { success: false, error: 'Admin not found.' };
        }
        
        // Prevent a superadmin from being demoted by this action
        if (adminToUpdate.role === 'superadmin') {
            return { success: false, error: 'Cannot modify a superadmin account from this action.' };
        }

        // Determine role based on new permissions
        const newRole = data.permissions.includes('canManageAdmins') ? 'superadmin' : 'admin';
        
        const result = await collection.updateOne(
            { id: data.id },
            { $set: { name: data.name, permissions: data.permissions, role: newRole } }
        );

        if (result.modifiedCount > 0) {
            await logAuditEvent('Admin account updated', { type: 'admin', id: 'superadmin_user' }, { updatedAdminEmail: adminToUpdate.email });
            revalidatePath('/admin/admins');
            return { success: true };
        }
        
        return { success: false, error: 'Failed to update admin. Data may be the same.' };

    } catch (error) {
        console.error('[Admin Actions] Error updating admin:', error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}


/**
 * Fetches all administrators.
 */
export async function fetchAllAdmins(): Promise<Omit<Admin, 'password'>[]> {
    console.log('[Admin Actions] Fetching all administrators.');
    try {
        const collection = await getAdminsCollection();
        const adminsCursor = collection.find({}).sort({ createdAt: -1 });
        const adminsArray: WithId<Admin>[] = await adminsCursor.toArray();
        
        return adminsArray.map(admin => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, password, ...adminData } = admin;
            
            // Retroactively apply full permissions for display if superadmin, mimicking login logic
            let displayPermissions = adminData.permissions || [];
            if (adminData.role === 'superadmin') {
                displayPermissions = [...validPermissions];
            }

            return {
                ...adminData,
                permissions: displayPermissions,
            } as Omit<Admin, 'password'>;
        });
    } catch (error) {
        console.error('[Admin Actions] Error fetching admins:', error);
        return [];
    }
}

/**
 * Deletes an administrator by their ID.
 */
export async function deleteAdmin(id: string): Promise<{ success: boolean, error?: string }> {
    console.log('[Admin Actions] Attempting to delete admin ID:', id);
    try {
        const collection = await getAdminsCollection();
        const adminToDelete = await collection.findOne({ id });

        if (!adminToDelete) {
            return { success: false, error: 'Admin not found.' };
        }

        if (adminToDelete.role === 'superadmin') {
            return { success: false, error: 'Superadmin account cannot be deleted.' };
        }

        const result = await collection.deleteOne({ id });

        if (result.deletedCount === 1) {
             await logAuditEvent('Admin account deleted', { type: 'admin', id: 'superadmin_user' }, { deletedAdminEmail: adminToDelete.email });
             revalidatePath('/admin/admins');
             return { success: true };
        }
        
        return { success: false, error: 'Failed to delete admin.' };
    } catch (error) {
        console.error('[Admin Actions] Error deleting admin:', error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}
