// src/app/api/update-prices/route.ts
import { NextResponse } from 'next/server';
import { fetchAndStoreLiveMetalPrices } from '@/actions/price-actions';

/**
 * Protected API endpoint to be called by a scheduled task (cron job).
 * This triggers the fetch from GoldAPI.io and updates the database.
 */
export async function GET(request: Request) {
  // Use the Authorization header for better security than a query parameter
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRITICAL: CRON_SECRET is not set in environment variables.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
