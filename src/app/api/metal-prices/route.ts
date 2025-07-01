// src/app/api/metal-prices/route.ts
import { NextResponse } from 'next/server';
import { getLatestStoredPrices } from '@/actions/price-actions';

// This forces the route to be re-evaluated on every request.
// It prevents Next.js from caching the response, ensuring users get the latest
// prices from the database every time they load the widget.
export const dynamic = 'force-dynamic';

/**
 * Public API endpoint for the frontend widget to fetch the latest metal prices
 * from the database. This does NOT call the external GoldAPI.io service.
 */
export async function GET() {
  try {
    const prices = await getLatestStoredPrices();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('/api/metal-prices error:', error);
    return NextResponse.json({ error: 'Failed to fetch prices from database.' }, { status: 500 });
  }
}
