// src/actions/contact-actions.ts
'use server';

import { getContactSubmissionsCollection } from '@/lib/mongodb';
import type { ContactSubmission, NewContactSubmission } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import { createAdminNotification } from './notification-actions';
import { logAuditEvent } from './audit-log-actions';
import { type WithId } from 'mongodb';

export async function saveContactSubmission(data: NewContactSubmission): Promise<{ success: boolean; error?: string }> {
  console.log('[Action: saveContactSubmission] Received data:', JSON.stringify(data));
  try {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: 'All fields are required.' };
    }

    const collection = await getContactSubmissionsCollection();
    const newSubmission: ContactSubmission = {
      id: uuidv4(),
      ...data,
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
      logAuditEvent('Contact form submitted', { type: 'system', id: 'public_form' }, { email: newSubmission.email, subject: newSubmission.subject });
      return { success: true };
    }

    return { success: false, error: 'Failed to save submission.' };
  } catch (error) {
    console.error('[Action: saveContactSubmission] Error:', error);
    return { success: false, error: 'A server error occurred.' };
  }
}


export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  console.log('[Action: fetchContactSubmissions] Attempting to fetch contact submissions.');
  try {
    const collection = await getContactSubmissionsCollection();
    const submissionsCursor = collection.find({ isArchived: false }).sort({ submittedAt: -1 });
    const submissionsArray: WithId<ContactSubmission>[] = await submissionsCursor.toArray();
    
    console.log(`[Action: fetchContactSubmissions] Found ${submissionsArray.length} submissions.`);
    return submissionsArray.map(s => {
      const { _id, ...submissionData } = s;
      return submissionData as ContactSubmission;
    });
  } catch (error) {
    console.error('[Action: fetchContactSubmissions] Error fetching submissions:', error);
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
            return { success: true };
        }
        
        return { success: false, error: 'Submission not found or not updated.' };

    } catch (error) {
        console.error(`[Action: archiveContactSubmission] Error archiving submission ${id}:`, error);
        return { success: false, error: 'Failed to archive due to a server error.' };
    }
}
