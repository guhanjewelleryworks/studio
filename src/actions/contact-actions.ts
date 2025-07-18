// src/actions/contact-actions.ts
'use server';

import { getContactSubmissionsCollection } from '@/lib/mongodb';
import type { ContactSubmission, NewContactSubmission } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import { createAdminNotification } from './notification-actions';
import { logAuditEvent } from './audit-log-actions';
import { type WithId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function saveContactSubmission(data: NewContactSubmission): Promise<{ success: boolean; error?: string }> {
  console.log('[Action: saveContactSubmission] Received data:', JSON.stringify(data));
  try {
    if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
      return { success: false, error: 'All fields are required.' };
    }
    
    if (data.phone.trim().length !== 10 || !/^[0-9]+$/.test(data.phone.trim())) {
      return { success: false, error: 'Phone number must be exactly 10 digits.' };
    }

    const collection = await getContactSubmissionsCollection();
    const newSubmission: ContactSubmission = {
      id: uuidv4(),
      ...data,
      phone: data.phone.trim(),
      submittedAt: new Date(),
      isArchived: false,
    };

    const result = await collection.insertOne(newSubmission);

    if (result.insertedId) {
      // Create admin notification
      await createAdminNotification({
        type: 'new_contact_message',
        message: `New contact message from '${newSubmission.name}' regarding "${newSubmission.subject.substring(0, 25)}..."`,
        link: '/admin/communications',
      });
      // Log audit event
      logAuditEvent('Contact form submitted', { type: 'system', id: 'public_form' }, { email: newSubmission.email, phone: newSubmission.phone, subject: newSubmission.subject });
      revalidatePath('/admin/dashboard'); // Revalidate dashboard to update count
      revalidatePath('/admin/communications');
      return { success: true };
    }

    return { success: false, error: 'Failed to save submission.' };
  } catch (error) {
    console.error('[Action: saveContactSubmission] Error:', error);
    return { success: false, error: 'A server error occurred.' };
  }
}


export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  console.log('[Action: fetchContactSubmissions] Attempting to fetch unarchived contact submissions.');
  try {
    const collection = await getContactSubmissionsCollection();
    const submissionsCursor = collection.find({ isArchived: false }).sort({ submittedAt: -1 });
    const submissionsArray: WithId<ContactSubmission>[] = await submissionsCursor.toArray();
    
    console.log(`[Action: fetchContactSubmissions] Found ${submissionsArray.length} unarchived submissions.`);
    return submissionsArray.map(s => {
      const { _id, ...submissionData } = s;
      return submissionData as ContactSubmission;
    });
  } catch (error) {
    console.error('[Action: fetchContactSubmissions] Error fetching unarchived submissions:', error);
    return [];
  }
}

export async function fetchArchivedContactSubmissions(): Promise<ContactSubmission[]> {
  console.log('[Action: fetchArchivedContactSubmissions] Attempting to fetch archived contact submissions.');
  try {
    const collection = await getContactSubmissionsCollection();
    const submissionsCursor = collection.find({ isArchived: true }).sort({ submittedAt: -1 });
    const submissionsArray: WithId<ContactSubmission>[] = await submissionsCursor.toArray();
    
    console.log(`[Action: fetchArchivedContactSubmissions] Found ${submissionsArray.length} archived submissions.`);
    return submissionsArray.map(s => {
      const { _id, ...submissionData } = s;
      return submissionData as ContactSubmission;
    });
  } catch (error) {
    console.error('[Action: fetchArchivedContactSubmissions] Error fetching archived submissions:', error);
    return [];
  }
}


export async function archiveContactSubmission(id: string): Promise<{ success: boolean; error?: string }> {
    console.log(`[Action: archiveContactSubmission] Archiving submission ID ${id}.`);
    try {
        if (!id) {
            return { success: false, error: 'Submission ID is required.' };
        }
        const collection = await getContactSubmissionsCollection();
        const result = await collection.updateOne(
            { id: id },
            { $set: { isArchived: true } }
        );

        if (result.modifiedCount === 1) {
            logAuditEvent('Archived contact submission', { type: 'admin', id: 'admin_user' }, { submissionId: id });
            revalidatePath('/admin/dashboard'); // Revalidate dashboard to update count
            revalidatePath('/admin/communications');
            return { success: true };
        }
        
        return { success: false, error: 'Submission not found or not updated.' };

    } catch (error) {
        console.error(`[Action: archiveContactSubmission] Error archiving submission ${id}:`, error);
        return { success: false, error: 'Failed to archive due to a server error.' };
    }
}

export async function unarchiveContactSubmission(id: string): Promise<{ success: boolean; error?: string }> {
    console.log(`[Action: unarchiveContactSubmission] Unarchiving submission ID ${id}.`);
    try {
        if (!id) {
            return { success: false, error: 'Submission ID is required.' };
        }
        const collection = await getContactSubmissionsCollection();
        const result = await collection.updateOne(
            { id: id },
            { $set: { isArchived: false } }
        );

        if (result.modifiedCount === 1) {
            logAuditEvent('Unarchived contact submission', { type: 'admin', id: 'admin_user' }, { submissionId: id });
            revalidatePath('/admin/dashboard');
            revalidatePath('/admin/communications');
            return { success: true };
        }
        
        return { success: false, error: 'Submission not found or not updated.' };

    } catch (error) {
        console.error(`[Action: unarchiveContactSubmission] Error unarchiving submission ${id}:`, error);
        return { success: false, error: 'Failed to unarchive due to a server error.' };
    }
}

export async function getUnarchivedContactSubmissionsCount(): Promise<number> {
  console.log('[Action: getUnarchivedContactSubmissionsCount] Fetching count of unarchived submissions.');
  try {
    const collection = await getContactSubmissionsCollection();
    const count = await collection.countDocuments({ isArchived: false });
    console.log(`[Action: getUnarchivedContactSubmissionsCount] Found ${count} unarchived submissions.`);
    return count;
  } catch (error) {
    console.error(`[Action: getUnarchivedContactSubmissionsCount] Error fetching count:`, error);
    return 0;
  }
}
