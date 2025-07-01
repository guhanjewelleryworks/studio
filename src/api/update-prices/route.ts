// src/api/update-prices/route.ts
import { NextResponse } from 'next/server';
import { fetchAndStoreLiveMetalPrices } from '@/actions/price-actions';

/**
 * Protected API endpoint to be called by a scheduled task (cron job).
 * This triggers the fetch from GoldAPI.io and updates the database.
 */
export async function GET(request: Request) {
  console.log('[API /update-prices] Received a request.');
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("[API /update-prices] CRITICAL: CRON_SECRET is not set in environment variables.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn(`[API /update-prices] Unauthorized access attempt. Provided token: ${authHeader}`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log('[API /update-prices] Authorization successful. Proceeding to fetch prices.');

  try {
    const result = await fetchAndStoreLiveMetalPrices();
    if (result.success) {
      return NextResponse.json({ message: result.message || 'Metal prices updated successfully.' });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to update prices.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
