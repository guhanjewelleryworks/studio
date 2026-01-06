// src/components/metal-prices-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Gem, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { StoredMetalPrice } from '@/types/goldsmith';
import { formatDistanceToNow } from 'date-fns';
import { safeFormatDate } from '@/lib/date';

interface FormattedMetalPrice {
  name: string;
  price: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

// Client-side function to fetch from our OWN API
async function fetchPricesFromApi(): Promise<StoredMetalPrice[]> {
    const response = await fetch('/api/metal-prices', { cache: 'no-store' }); // Use no-store to ensure latest data
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch prices from server:", response.status, errorData);
        throw new Error('Failed to fetch prices from server');
    }
    return response.json();
}

export const MetalPricesWidget: React.FC = () => {
  const [metalPrices, setMetalPrices] = useState<FormattedMetalPrice[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>('loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [nextUpdateTimeMessage, setNextUpdateTimeMessage] = useState<string>('');
  
  const calculateRelativeTime = (date: Date | null) => {
    if (!date) return 'loading...';
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'just now'; // Fallback for invalid date during formatting
    }
  };

  const loadAndFormatPrices = async () => {
    // Prevent refetching if already loading
    if(isLoading && metalPrices.length > 0) return;
    
    setIsLoading(true);
    try {
      const storedPrices = await fetchPricesFromApi();
      if (storedPrices && storedPrices.length > 0) {
          const formatted = storedPrices.map(p => {
            const changeValue = p.changePercent;
            // Explicitly define the type here to satisfy TypeScript
            let type: 'up' | 'down' | 'neutral';
            if (changeValue > 0.05) {
                type = 'up';
            } else if (changeValue < -0.05) {
                type = 'down';
            } else {
                type = 'neutral';
            }
            
            return {
              name: p.name.replace('24K', '22K'),
              price: `₹${p.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/10g`,
              change: `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}%`,
              changeType: type, // Use the strictly typed variable
              icon: Gem,
            };
          });
          setMetalPrices(formatted);
          const updateDate = storedPrices[0]?.updatedAt ? new Date(storedPrices[0].updatedAt) : null;
          setLastUpdated(updateDate);
          setRelativeTime(calculateRelativeTime(updateDate));
      } else {
        setLastUpdated(null);
        setRelativeTime("Price data not yet available.");
      }
    } catch (error) {
      console.error("Failed to load metal prices for widget:", error);
      setLastUpdated(null);
      setRelativeTime("Could not load prices.");
      setMetalPrices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextUpdate = () => {
      const scheduleUTC: [number, number][] = [[5, 0], [10, 0], [15, 0]]; 
      const now = new Date();
      const currentUTCHour = now.getUTCHours();
      const currentUTCMinute = now.getUTCMinutes();

      let nextUpdate = scheduleUTC.find(([hour, minute]) => {
          if (hour > currentUTCHour) return true;
          if (hour === currentUTCHour && minute > currentUTCMinute) return true;
          return false;
      });

      const nextUpdateDate = new Date();
      nextUpdateDate.setSeconds(0, 0);
      
      if (nextUpdate) {
          nextUpdateDate.setUTCHours(nextUpdate[0], nextUpdate[1]);
      } else {
          nextUpdateDate.setUTCDate(now.getUTCDate() + 1);
          nextUpdateDate.setUTCHours(scheduleUTC[0][0], scheduleUTC[0][1]);
      }
      
      const nextUpdateIST = nextUpdateDate.toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
      });
      setNextUpdateTimeMessage(`Next update around ${nextUpdateIST}.`);
  };

  useEffect(() => {
    // Initial load
    loadAndFormatPrices();
    calculateNextUpdate();

    // Interval to refetch data every 5 minutes
    const dataFetchInterval = setInterval(() => {
        loadAndFormatPrices();
        calculateNextUpdate();
    }, 5 * 60 * 1000); 

    // Interval to update the relative time display every minute
    const timeUpdateInterval = setInterval(() => {
        if(lastUpdated) {
           setRelativeTime(calculateRelativeTime(lastUpdated));
        }
    }, 60 * 1000);

    return () => {
        clearInterval(dataFetchInterval);
        clearInterval(timeUpdateInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-md hover:shadow-lg transition-shadow rounded-lg w-full max-w-xs">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle suppressHydrationWarning className="text-xs font-semibold text-accent uppercase tracking-wider text-center">
          {isLoading && !lastUpdated ? 'Loading prices...' : `Updated ${relativeTime}`}
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
        <p suppressHydrationWarning className="text-[0.65rem] text-muted-foreground text-center w-full flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            {nextUpdateTimeMessage}
        </p>
      </CardFooter>
    </Card>
  );
};
