
// src/actions/notification-actions.ts
'use server';

import { getNotificationsCollection } from '@/lib/mongodb';
import type { AdminNotification } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new admin notification.
 * This is a "fire-and-forget" call from other server actions.
 */
export async function createAdminNotification(data: Omit<AdminNotification, 'id' | 'isRead' | 'createdAt' | '_id'>) {
    try {
        const collection = await getNotificationsCollection();
        const newNotification: AdminNotification = {
            ...data,
            id: uuidv4(),
            isRead: false,
            createdAt: new Date(),
        };
        await collection.insertOne(newNotification);
        revalidatePath('/admin/dashboard'); // Revalidate dashboard to update bell icon
    } catch (error) {
        console.error("Failed to create admin notification:", error);
        // Don't re-throw, as notification failure shouldn't crash the main action
    }
}

/**
 * Fetches all unread admin notifications, up to a limit of 10.
 */
export async function fetchUnreadAdminNotifications(): Promise<AdminNotification[]> {
    try {
        const collection = await getNotificationsCollection();
        const notificationsCursor = collection.find({ isRead: false }).sort({ createdAt: -1 }).limit(10);
        const notificationsArray = await notificationsCursor.toArray();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return notificationsArray.map(({ _id, ...n }) => n as AdminNotification);
    } catch (error) {
        console.error("Failed to fetch admin notifications:", error);
        return [];
    }
}

/**
 * Marks all unread admin notifications as read.
 */
export async function markAllAdminNotificationsAsRead(): Promise<{ success: boolean }> {
    try {
        const collection = await getNotificationsCollection();
        const result = await collection.updateMany({ isRead: false }, { $set: { isRead: true } });
        if(result.modifiedCount > 0) {
            revalidatePath('/admin/dashboard'); // Revalidate to clear count
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        return { success: false };
    }
}
