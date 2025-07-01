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
        console.error("[PriceAction V6.0] CRITICAL: METALS_API_KEY is not set. Cannot fetch live prices.");
        return { success: false, error: "API key not configured on server." };
    }

    // CORRECTED: The change key is 'chp' for all single-metal API responses.
    const metalsToFetch = [
        { symbol: 'XAU' as const, name: 'Gold (24K)', priceKey: 'price_gram_24k', changeKey: 'chp' },
        { symbol: 'XAG' as const, name: 'Silver', priceKey: 'price_gram_silver', changeKey: 'chp' },
        { symbol: 'XPT' as const, name: 'Platinum', priceKey: 'price_gram_platinum', changeKey: 'chp' },
    ];
    const currency = 'INR';

    console.log("[PriceAction V6.0] Starting to fetch prices for multiple metals individually.");

    try {
        const pricePromises = metalsToFetch.map(metal => {
            const apiUrl = `https://www.goldapi.io/api/${metal.symbol}/${currency}`;
            console.log(`[PriceAction V6.0] Preparing to fetch URL: ${apiUrl}`);
            return fetch(apiUrl, { headers: { 'x-access-token': apiKey }, next: { revalidate: 0 } })
                .then(response => {
                    // This handles network errors or non-200 responses
                    if (!response.ok) {
                       return response.text().then(text => { // Use .text() in case body is not JSON
                           console.error(`[PriceAction V6.0] GoldAPI HTTP error for ${metal.symbol}:`, response.status, text);
                           return Promise.reject({ metal: metal.symbol, status: response.status, body: text });
                       });
                    }
                    return response.json();
                })
                .then(data => {
                    // CORRECTED: Handle cases where API returns 200 OK but with an error in the body
                    if (data.error) {
                        console.error(`[PriceAction V6.0] GoldAPI body error for ${metal.symbol}:`, data.error);
                        return Promise.reject({ metal: metal.symbol, status: 200, body: data.error });
                    }
                    // Attach config for later use
                    return { ...data, metalConfig: metal };
                });
        });

        const results = await Promise.allSettled(pricePromises);
        
        const operations = [];
        const errors: string[] = [];
        const now = new Date();

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const data = result.value;
                const metalConfig = data.metalConfig;
                console.log(`[PriceAction V6.0] Successful response for ${metalConfig.symbol}:`, JSON.stringify(data));
                
                const pricePerGram = data[metalConfig.priceKey];
                const changePercent = data[metalConfig.changeKey]; // Corrected key
                
                if (pricePerGram !== undefined && pricePerGram !== null) {
                    const priceDoc: Omit<StoredMetalPrice, '_id'> = {
                        symbol: metalConfig.symbol,
                        name: metalConfig.name,
                        price: pricePerGram * 10,
                        currency: currency,
                        changePercent: changePercent ?? 0, // Use corrected key
                        updatedAt: now,
                    };
                    operations.push({
                        updateOne: {
                            filter: { symbol: metalConfig.symbol },
                            update: { $set: priceDoc },
                            upsert: true
                        }
                    });
                    console.log(`[PriceAction V6.0] Successfully processed price for ${metalConfig.symbol}: ${pricePerGram}`);
                } else {
                    const errorMsg = `Price key '${metalConfig.priceKey}' not found in API response for ${metalConfig.symbol}. This may indicate a plan limitation.`;
                    console.warn(`[PriceAction V6.0] ${errorMsg} Response keys:`, Object.keys(data));
                    errors.push(errorMsg);
                }
            } else {
                const errorMsg = `Failed to fetch data for metal. Reason: ${JSON.stringify(result.reason)}`;
                console.error(`[PriceAction V6.0] ${errorMsg}`);
                errors.push(errorMsg);
            }
        });
        
        if (operations.length > 0) {
            const collection = await getMetalPricesCollection();
            await collection.bulkWrite(operations);
            const successMessage = `Updated ${operations.length} prices.`;
            console.log(`[PriceAction V6.0] ${successMessage}`);

            if (errors.length > 0) {
                return { success: true, message: successMessage, warning: `However, failed to process ${errors.length} metals. Errors: ${errors.join('; ')}` };
            }
            
            return { success: true, message: successMessage };
        } else {
            const finalError = `No valid price data was processed from any API call. Errors: ${errors.join('; ')}`;
            console.error("[PriceAction V6.0] " + finalError);
            return { success: false, error: finalError };
        }

    } catch (error) {
        console.error("[PriceAction V6.0] A critical error occurred during the fetch process:", error);
        return { success: false, error: (error as Error).message };
    }
}
