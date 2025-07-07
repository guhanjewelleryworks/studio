// src/actions/audit-log-actions.ts
'use server';

import { getAuditLogsCollection } from '@/lib/mongodb';
import type { AuditLog } from '@/types/goldsmith';
import { type WithId } from 'mongodb';

/**
 * Logs a significant event to the audit trail.
 * This is a "fire-and-forget" call from other actions.
 * @param action - A human-readable description of the action.
 * @param actor - Who performed the action.
 * @param details - Optional object with relevant IDs or data.
 */
export async function logAuditEvent(
  action: string,
  actor: { type: 'admin' | 'customer' | 'goldsmith' | 'system'; id: string },
  details?: Record<string, any>
) {
  try {
    const auditLogs = await getAuditLogsCollection();
    const logEntry: Omit<AuditLog, '_id'> = {
      timestamp: new Date(),
      actor,
      action,
      details,
    };
    await auditLogs.insertOne(logEntry);
  } catch (error) {
    console.error("Failed to write to audit log:", error);
    // We don't re-throw the error, as failing to log shouldn't crash the primary action.
  }
}

/**
 * Fetches all audit logs from the database, sorted with the most recent first.
 * @returns A promise that resolves to an array of AuditLog objects.
 */
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  console.log('[Action: fetchAuditLogs] Attempting to fetch audit logs.');
  try {
    const collection = await getAuditLogsCollection();
    // Fetch the last 100 logs for performance, sorted by timestamp descending
    const logsCursor = collection.find({}).sort({ timestamp: -1 }).limit(100);
    const logsArray: WithId<AuditLog>[] = await logsCursor.toArray();
    console.log(`[Action: fetchAuditLogs] Found ${logsArray.length} log entries.`);
    
    return logsArray.map(log => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...logData } = log;
      return {
          ...logData,
          id: _id.toString(), // Add string ID for React keys
      } as AuditLog;
    });
  } catch (error) {
    console.error('[Action: fetchAuditLogs] Error fetching audit logs:', error);
    return [];
  }
}
