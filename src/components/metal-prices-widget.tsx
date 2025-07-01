// src/components/metal-prices-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Gem, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { StoredMetalPrice } from '@/types/goldsmith'; // Import the new type

interface FormattedMetalPrice {
  name: string;
  price: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

// Client-side function to fetch from our OWN API
async function fetchPricesFromApi(): Promise<StoredMetalPrice[]> {
    // This fetch goes to our own backend, which reads from our database.
    // It's fast and doesn't use any external API credits.
    const response = await fetch('/api/metal-prices', { next: { revalidate: 60 } }); // Revalidate client-side cache every 60s
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch prices from server:", response.status, errorData);
        throw new Error('Failed to fetch prices from server');
    }
    return response.json();
}

export const MetalPricesWidget: React.FC = () => {
  const [metalPrices, setMetalPrices] = useState<FormattedMetalPrice[]>([]);
  const [lastUpdated, setLastUpdated] =useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUpdateTimeMessage, setNextUpdateTimeMessage] = useState<string>('');

  useEffect(() => {
    const loadAndFormatPrices = async () => {
      setIsLoading(true);
      try {
        const storedPrices = await fetchPricesFromApi();
        if (storedPrices.length > 0) {
            const formatted = storedPrices.map(p => {
              const changeValue = p.changePercent;
              return {
                name: p.name,
                price: `₹${p.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/10g`,
                change: `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}%`,
                changeType: changeValue > 0.05 ? 'up' : changeValue < -0.05 ? 'down' : 'neutral',
                icon: Gem,
              };
            });
            setMetalPrices(formatted);

            // Set the last updated time from the first record (they should all be the same)
            const date = new Date(storedPrices[0].updatedAt);
            const dateTimeOptions: Intl.DateTimeFormatOptions = {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Asia/Kolkata',
            };
            setLastUpdated(`As of ${date.toLocaleString('en-IN', dateTimeOptions)} IST`);
        } else {
          // If no prices are in the DB, show a message
          setLastUpdated("Price data not yet available.");
        }
      } catch (error) {
        console.error("Failed to load metal prices for widget:", error);
        setLastUpdated("Could not load prices.");
        setMetalPrices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const calculateNextUpdate = () => {
        const scheduleUTC = [5.5, 10.5, 15.5]; // 5:30, 10:30, 15:30 UTC
        const now = new Date();
        const currentUTCHour = now.getUTCHours() + now.getUTCMinutes() / 60;
    
        let nextUpdateUTCHour = scheduleUTC.find(time => time > currentUTCHour);
        
        const nextUpdateDate = new Date();
        nextUpdateDate.setSeconds(0, 0);
    
        if (nextUpdateUTCHour !== undefined) {
          // Next update is today
          const hours = Math.floor(nextUpdateUTCHour);
          const minutes = Math.round((nextUpdateUTCHour - hours) * 60);
          nextUpdateDate.setUTCHours(hours, minutes);
        } else {
          // Next update is tomorrow, first slot
          nextUpdateDate.setUTCDate(now.getUTCDate() + 1);
          const hours = Math.floor(scheduleUTC[0]);
          const minutes = Math.round((scheduleUTC[0] - hours) * 60);
          nextUpdateDate.setUTCHours(hours, minutes);
        }
    
        const nextUpdateIST = nextUpdateDate.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
        setNextUpdateTimeMessage(`Next update around ${nextUpdateIST}.`);
    };

    loadAndFormatPrices();
    calculateNextUpdate();

    // Optional: Refresh client-side every few minutes in case the cron job ran
    const intervalId = setInterval(() => {
        loadAndFormatPrices();
        calculateNextUpdate();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-md hover:shadow-lg transition-shadow rounded-lg w-full max-w-xs">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-xs font-semibold text-accent uppercase tracking-wider text-center">
          {isLoading ? 'Loading prices...' : lastUpdated}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-2 pt-1 space-y-1.5">
        {isLoading && metalPrices.length === 0 ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center text-xs animate-pulse">
              <div className="flex items-center">
                <Gem className="h-3.5 w-3.5 text-primary/50 mr-1.5" />
                <span className="bg-muted/50 h-3 w-20 rounded"></span>
              </div>
              <div className='text-right'>
                <span className="bg-muted/50 h-3 w-16 rounded inline-block"></span>
                <span className="ml-1.5 bg-muted/50 h-2 w-8 rounded inline-block"></span>
              </div>
            </div>
          ))
        ) : metalPrices.length > 0 ? (
          metalPrices.map(metal => (
            <div key={metal.name} className="flex justify-between items-center text-xs">
              <div className="flex items-center">
                <metal.icon className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="text-foreground/80">{metal.name}:</span>
              </div>
              <div className='text-right flex items-center'>
                <span className="font-semibold text-foreground">{metal.price}</span>
                <span className={`ml-1.5 text-[0.65rem] flex items-center ${
                  metal.changeType === 'up' ? 'text-green-500' : 
                  metal.changeType === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {metal.changeType === 'up' && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                  {metal.changeType === 'down' && <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {metal.changeType === 'neutral' && <Minus className="h-2.5 w-2.5 mr-0.5" />}
                  {metal.change}
                </span>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-xs text-muted-foreground text-center">Price data currently unavailable.</p>
        )}
      </CardContent>
       <CardFooter className="pt-0 pb-2 px-4">
        <p className="text-[0.65rem] text-muted-foreground text-center w-full flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            {nextUpdateTimeMessage}
        </p>
      </CardFooter>
    </Card>
  );
};
