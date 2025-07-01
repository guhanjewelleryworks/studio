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
        console.error("[PriceAction V5] CRITICAL: METALS_API_KEY is not set. Cannot fetch live prices.");
        return { success: false, error: "API key not configured on server." };
    }

    const metalsToFetch = [
        { symbol: 'XAU' as const, name: 'Gold (24K)', priceKey: 'price_gram_24k', changeKey: 'chp_xau_inr' },
        { symbol: 'XAG' as const, name: 'Silver', priceKey: 'price_gram_silver', changeKey: 'chp_xag_inr' },
        { symbol: 'XPT' as const, name: 'Platinum', priceKey: 'price_gram_platinum', changeKey: 'chp_xpt_inr' },
    ];
    const currency = 'INR';

    console.log("[PriceAction V5] Starting to fetch prices for multiple metals individually.");

    try {
        const pricePromises = metalsToFetch.map(metal => {
            const apiUrl = `https://www.goldapi.io/api/${metal.symbol}/${currency}`;
            console.log(`[PriceAction V5] Preparing to fetch URL: ${apiUrl}`);
            return fetch(apiUrl, { headers: { 'x-access-token': apiKey }, next: { revalidate: 0 } })
                .then(response => {
                    if (!response.ok) {
                        // Try to parse error json, but don't fail if it's not json
                        return response.json().then(err => {
                           console.error(`[PriceAction V5] GoldAPI error for ${metal.symbol}:`, response.status, err);
                           return Promise.reject({ metal: metal.symbol, status: response.status, body: err });
                        }).catch(() => {
                           console.error(`[PriceAction V5] GoldAPI non-JSON error for ${metal.symbol}:`, response.status, response.statusText);
                           return Promise.reject({ metal: metal.symbol, status: response.status, body: { error: response.statusText } });
                        });
                    }
                    return response.json();
                })
                .then(data => ({ ...data, metalConfig: metal })); // Pass metal config along
        });

        const results = await Promise.allSettled(pricePromises);
        
        const operations = [];
        const now = new Date();

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const data = result.value;
                const metalConfig = data.metalConfig;
                const pricePerGram = data[metalConfig.priceKey];
                
                if (pricePerGram !== undefined && pricePerGram !== null) {
                    const priceDoc: Omit<StoredMetalPrice, '_id'> = {
                        symbol: metalConfig.symbol,
                        name: metalConfig.name,
                        price: pricePerGram * 10, // Convert to price per 10g
                        currency: currency,
                        changePercent: data[metalConfig.changeKey] ?? 0,
                        updatedAt: now,
                    };
                    operations.push({
                        updateOne: {
                            filter: { symbol: metalConfig.symbol },
                            update: { $set: priceDoc },
                            upsert: true
                        }
                    });
                    console.log(`[PriceAction V5] Successfully processed price for ${metalConfig.symbol}: ${pricePerGram}`);
                } else {
                    console.warn(`[PriceAction V5] Price key '${metalConfig.priceKey}' not found in response for ${metalConfig.symbol}. Response keys:`, Object.keys(data));
                }
            } else {
                // Log rejected promises from Promise.allSettled
                console.error(`[PriceAction V5] Failed to fetch data for metal. Reason:`, result.reason);
            }
        });
        
        if (operations.length > 0) {
            const collection = await getMetalPricesCollection();
            await collection.bulkWrite(operations);
            console.log(`[PriceAction V5] Successfully stored ${operations.length} metal prices.`);
            return { success: true, message: `Updated ${operations.length} prices.` };
        } else {
            console.warn("[PriceAction V5] No valid price data was processed from any API call.");
            return { success: false, error: "No valid price data received from API." };
        }

    } catch (error) {
        console.error("[PriceAction V5] A critical error occurred during the fetch process:", error);
        return { success: false, error: (error as Error).message };
    }
}


/**
 * Retrieves the most recently stored metal prices from the database.
 */
export async function getLatestStoredPrices(): Promise<StoredMetalPrice[]> {
  try {
    const collection = await getMetalPricesCollection();
    
    const prices = await collection.aggregate([
      { $sort: { updatedAt: -1 } }, 
      { $group: { 
          _id: "$symbol", 
          latest: { $first: "$$ROOT" }
      }},
      { $replaceRoot: { newRoot: "$latest" } }
    ]).toArray();

    const typedPrices = prices as StoredMetalPrice[];
    const symbolOrder = ['XAU', 'XAG', 'XPT'];
    return typedPrices.sort((a, b) => symbolOrder.indexOf(a.symbol) - symbolOrder.indexOf(b.symbol));

  } catch (error) {
    console.error("[PriceAction] Failed to get latest stored prices from DB:", error);
    return [];
  }
}
