// src/components/metal-prices-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetalPrice {
  metal: string;
  price: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

// Simulated API fetch function - REPLACE THIS WITH YOUR ACTUAL API CALL
async function fetchMetalsData(): Promise<Omit<MetalPrice, 'icon' | 'changeType'>[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 1000));

  // **IMPORTANT**: This is where you would call your chosen precious metals API.
  // You'll need an API key, and the API response structure will vary.
  // Store your API key in an environment variable (e.g., process.env.NEXT_PUBLIC_METALS_API_KEY)
  // and ensure it's available during the build/runtime as needed.

  const apiKey = process.env.NEXT_PUBLIC_METALS_API_KEY; // Example environment variable

  if (apiKey) {
    try {
      // Replace with your actual API endpoint and request structure
      // const response = await fetch(`https://api.examplemetalprovider.com/latest?access_key=${apiKey}&symbols=XAU,XAG,XPT&base=INR`);
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // }
      // const data = await response.json();

      // Example of how you might parse the data (this WILL VARY based on your API)
      // const goldPrice = data.rates.XAU ? (1 / data.rates.XAU * SOME_CONVERSION_FACTOR_TO_10G_INR).toFixed(2) : 'N/A';
      // const silverPrice = data.rates.XAG ? (1 / data.rates.XAG * SOME_CONVERSION_FACTOR_TO_10G_INR).toFixed(2) : 'N/A';
      // const platinumPrice = data.rates.XPT ? (1 / data.rates.XPT * SOME_CONVERSION_FACTOR_TO_10G_INR).toFixed(2) : 'N/A';

      // This is still simulated as I cannot make live API calls here.
      // You would replace these with actual parsed data from your API.
      console.warn("API Key found, but using simulated data for demonstration. Implement actual API call.");
      const simulatedPricesFromApi = [
        { metal: "Gold (24K)", priceRaw: 72050.00 + (Math.random() * 500 - 250), changeRaw: (Math.random() * 0.5 - 0.25) },
        { metal: "Silver", priceRaw: 850.00 + (Math.random() * 20 - 10), changeRaw: (Math.random() * 1.0 - 0.5) },
        { metal: "Platinum", priceRaw: 28500.00 + (Math.random() * 300 - 150), changeRaw: (Math.random() * 0.3 - 0.15) },
      ];
       return simulatedPricesFromApi.map(p => ({
        metal: p.metal,
        price: `₹${(p.priceRaw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/10g`,
        change: `${p.changeRaw >= 0 ? '+' : ''}${p.changeRaw.toFixed(2)}%`,
      }));

    } catch (error) {
      console.error("Failed to fetch real metal prices:", error);
      // Fallback to simulated data if API call fails
    }
  } else {
    console.warn("Metals API key not found. Using simulated data.");
  }

  // Simulated data for Bangalore, India (INR) - prices are illustrative
  // These will be used if API key is missing or API call fails
  const simulatedPrices = [
    { metal: "Gold (24K)", priceRaw: 72000.00 + (Math.random() * 500 - 250), changeRaw: (Math.random() * 0.5 - 0.25) }, // Price per 10g
    { metal: "Silver", priceRaw: 800.00 + (Math.random() * 20 - 10), changeRaw: (Math.random() * 1.0 - 0.5) }, // Price per 10g
    { metal: "Platinum", priceRaw: 28000.00 + (Math.random() * 300 - 150), changeRaw: (Math.random() * 0.3 - 0.15) }, // Price per 10g
  ];

  return simulatedPrices.map(p => ({
    metal: p.metal,
    price: `₹${(p.priceRaw).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/10g`,
    change: `${p.changeRaw >= 0 ? '+' : ''}${p.changeRaw.toFixed(2)}%`,
  }));
}


export const MetalPricesWidget: React.FC = () => {
  const [metalPrices, setMetalPrices] = useState<MetalPrice[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      };
      const formattedDate = now.toLocaleDateString('en-IN', dateOptions);
      const formattedTime = now.toLocaleTimeString('en-IN', timeOptions);
      setCurrentDateTime(`Prices (IST) - ${formattedDate} - ${formattedTime}`);
    };

    const loadMetalPrices = async () => {
      setIsLoading(true);
      try {
        const fetchedData = await fetchMetalsData();
        const formattedPrices: MetalPrice[] = fetchedData.map(p => {
          const changeValue = parseFloat(p.change.replace('%', ''));
          return {
            ...p,
            icon: Gem,
            changeType: changeValue > 0.05 ? 'up' : changeValue < -0.05 ? 'down' : 'neutral',
          };
        });
        setMetalPrices(formattedPrices);
      } catch (error) {
        console.error("Failed to load metal prices for widget:", error);
        setMetalPrices([]); // Set to empty or keep stale data on error
      } finally {
        setIsLoading(false);
      }
    };
    
    updateDateTime();
    loadMetalPrices();

    const intervalId = setInterval(() => {
        loadMetalPrices();
        updateDateTime();
    }, 60000); // Refresh every 1 minute

    return () => clearInterval(intervalId);
  }, []);


  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-md hover:shadow-lg transition-shadow rounded-lg w-full max-w-xs">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-xs font-semibold text-accent uppercase tracking-wider text-center">
          {isLoading && !currentDateTime ? 'Loading prices...' : currentDateTime || 'Fetching latest prices...'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-1 space-y-1.5">
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
            <div key={metal.metal} className="flex justify-between items-center text-xs">
              <div className="flex items-center">
                <metal.icon className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="text-foreground/80">{metal.metal}:</span>
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
          <p className="text-xs text-muted-foreground text-center">Price data currently unavailable.</p>
        )}
      </CardContent>
    </Card>
  );
};