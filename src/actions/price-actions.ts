// src/actions/price-actions.ts
'use server';

import { getMetalPricesCollection } from '@/lib/mongodb';
import type { StoredMetalPrice } from '@/types/goldsmith';

/**
 * Fetches live metal prices from GoldAPI.io and stores them in the database.
 * This function should be called by a protected, scheduled job.
 */
export async function fetchAndStoreLiveMetalPrices() {
    const apiKey = process.env.METALS_API_KEY;
    if (!apiKey) {
        console.error("CRITICAL: METALS_API_KEY is not set. Cannot fetch live prices.");
        return { success: false, error: "API key not configured on server." };
    }

    const metals = 'XAU-XAG-XPT'; // Gold, Silver, Platinum (Corrected separator to hyphen)
    const currency = 'INR';
    const apiUrl = `https://www.goldapi.io/api/${metals}/${currency}`;
    console.log(`[PriceAction] Fetching live prices from GoldAPI for ${metals}`);

    try {
        const response = await fetch(apiUrl, {
            headers: { 'x-access-token': apiKey },
            next: { revalidate: 0 } // Ensure fresh data is fetched every time
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response from GoldAPI' }));
            console.error('[PriceAction] GoldAPI responded with an error:', response.status, errorBody);
            throw new Error(`GoldAPI error: ${errorBody.error || response.statusText}`);
        }

        const data = await response.json();
        // --- DEBUG LOGGING ADDED ---
        console.log('[PriceAction] Received data from GoldAPI:', JSON.stringify(data, null, 2));
        // --- END DEBUG LOGGING ---
        
        const collection = await getMetalPricesCollection();
        const now = new Date();

        // Use a bulk write operation for efficiency
        const operations = [];

        if (data.price_gram_24k) {
            const goldPrice: Omit<StoredMetalPrice, '_id'> = {
                symbol: 'XAU',
                name: 'Gold (24K)',
                price: data.price_gram_24k * 10, // Convert to price per 10g
                currency: currency,
                changePercent: data.chp_xau_inr ?? 0,
                updatedAt: now,
            };
            operations.push({ updateOne: { filter: { symbol: 'XAU' }, update: { $set: goldPrice }, upsert: true } });
        }

        if (data.price_gram_silver) {
            const silverPrice: Omit<StoredMetalPrice, '_id'> = {
                symbol: 'XAG',
                name: 'Silver',
                price: data.price_gram_silver * 10, // Convert to price per 10g
                currency: currency,
                changePercent: data.chp_xag_inr ?? 0,
                updatedAt: now,
            };
            operations.push({ updateOne: { filter: { symbol: 'XAG' }, update: { $set: silverPrice }, upsert: true } });
        }
        
        if (data.price_gram_platinum) {
            const platinumPrice: Omit<StoredMetalPrice, '_id'> = {
                symbol: 'XPT',
                name: 'Platinum',
                price: data.price_gram_platinum * 10, // Convert to price per 10g
                currency: currency,
                changePercent: data.chp_xpt_inr ?? 0,
                updatedAt: now,
            };
            operations.push({ updateOne: { filter: { symbol: 'XPT' }, update: { $set: platinumPrice }, upsert: true } });
        }

        if (operations.length > 0) {
            await collection.bulkWrite(operations);
            console.log(`[PriceAction] Successfully stored ${operations.length} metal prices.`);
            return { success: true, message: `Updated ${operations.length} prices.` };
        } else {
             console.warn("[PriceAction] GoldAPI response did not contain any valid price data to store.");
            return { success: false, error: "No valid price data received from API." };
        }

    } catch (error) {
        console.error("[PriceAction] Failed to fetch or store live metal prices:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Retrieves the most recently stored metal prices from the database.
 */
export async function getLatestStoredPrices(): Promise<StoredMetalPrice[]> {
  try {
    const collection = await getMetalPricesCollection();
    
    // Using an aggregation pipeline to get the latest document for each symbol
    const prices = await collection.aggregate([
      { $sort: { updatedAt: -1 } }, // Sort by date descending
      { $group: { 
          _id: "$symbol", // Group by metal symbol
          latest: { $first: "$$ROOT" } // Get the first document in each group (which is the latest)
      }},
      { $replaceRoot: { newRoot: "$latest" } } // Promote the latest document to the root
    ]).toArray();

    // Map to ensure the correct type is returned and sort consistently
    const typedPrices = prices as StoredMetalPrice[];
    const symbolOrder = ['XAU', 'XAG', 'XPT'];
    return typedPrices.sort((a, b) => symbolOrder.indexOf(a.symbol) - symbolOrder.indexOf(b.symbol));

  } catch (error) {
    console.error("[PriceAction] Failed to get latest stored prices from DB:", error);
    return [];
  }
}