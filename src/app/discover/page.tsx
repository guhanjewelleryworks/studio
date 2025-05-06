// src/app/discover/page.tsx
'use client';

import type { Location } from '@/services/geolocation';
import { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MapPin, List, Search, Star, Loader2, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Placeholder for Map Component
const MapPlaceholder = ({ locations }: { locations: Location[] }) => (
  <div className="w-full h-[350px] md:h-full bg-muted/50 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner">
    <MapPin className="h-10 w-10 mr-2 text-primary/70 mb-2" />
    <p className="text-lg font-medium">Map View Placeholder</p>
    <p className="text-sm">(Displaying {locations.length} locations)</p>
  </div>
);

interface Goldsmith {
  id: string;
  name: string;
  address: string;
  specialty: string;
  rating: number;
  imageUrl: string;
  location: Location;
  shortBio: string;
}

export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockGoldsmiths: Goldsmith[] = [
    { id: 'artisan-1', name: 'Lumière Jewels', address: '123 Diamond St, Cityville', specialty: 'Engagement Rings', rating: 4.9, imageUrl: 'https://picsum.photos/seed/lumiere/400/300', location: { lat: 34.0522, lng: -118.2437 }, shortBio: 'Crafting timeless elegance with ethically sourced diamonds and gemstones.' },
    { id: 'artisan-2', name: 'Aura & Gold', address: '456 Sapphire Ave, Townsville', specialty: 'Custom Pendants', rating: 4.7, imageUrl: 'https://picsum.photos/seed/aura/400/300', location: { lat: 34.0530, lng: -118.2445 }, shortBio: 'Unique, handcrafted pendants that tell your personal story with artistry.' },
    { id: 'artisan-3', name: 'Heritage Metalsmiths', address: '789 Ruby Ln, Villagetown', specialty: 'Antique Restoration', rating: 4.8, imageUrl: 'https://picsum.photos/seed/heritage/400/300', location: { lat: 34.0515, lng: -118.2430 }, shortBio: 'Preserving history through expert restoration of antique and heirloom jewelry.' },
    { id: 'artisan-4', name: 'Elysian Gems', address: '101 Emerald Rd, Hamlet City', specialty: 'Necklaces & Bracelets', rating: 4.6, imageUrl: 'https://picsum.photos/seed/elysian/400/300', location: { lat: 34.0540, lng: -118.2450 }, shortBio: 'Elegant necklaces and bracelets designed to adorn and inspire.' },
  ];


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { lat: latitude, lng: longitude };
        setCurrentLocation(loc);
        setIsLoading(true);
         setTimeout(() => { 
           setGoldsmiths(mockGoldsmiths);
           setIsLoading(false);
         }, 1000); 
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not access your location. Please enable location services or search manually.");
        setIsLoading(true);
        setTimeout(() => { 
           setGoldsmiths(mockGoldsmiths); 
           setIsLoading(false);
         }, 1000);
      }
    );
  }, []); 


  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => { 
       const filtered = mockGoldsmiths.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.address.toLowerCase().includes(searchTerm.toLowerCase())
       );
       setGoldsmiths(filtered);
       setIsLoading(false);
       if (filtered.length === 0) {
         setError(`No goldsmiths found matching "${searchTerm}". Try a different term.`);
       }
     }, 600);
  };

  const goldsmithLocations = goldsmiths.map(g => g.location);

  return (
    <div className="container py-6 px-4 md:px-6 min-h-[calc(100vh-8rem)]"> {/* Reduced vertical padding */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6"> {/* Reduced gap and margin */}
        <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">Find a Goldsmith</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View" className="rounded-full px-5 py-2.5 text-sm">
            <List className="mr-2 h-4 w-4" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View" className="rounded-full px-5 py-2.5 text-sm">
            <MapPin className="mr-2 h-4 w-4" /> Map
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-2.5 items-center"> {/* Reduced gap and margin */}
        <Input
          type="search"
          placeholder="Search by name, specialty, or location..."
          className="flex-grow rounded-full text-sm px-4 py-2.5 shadow-sm" /* Reduced padding and text size */
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" variant="ghost" size="icon" className="sm:ml-1.5 hidden sm:inline-flex"> {/* Reduced margin */}
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Filters</span>
        </Button>
        <Button type="submit" disabled={isLoading} size="default" className="rounded-full px-6 py-2.5 text-sm w-full sm:w-auto"> {/* Reduced padding and text size */}
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </form>

       {error && <p className="text-destructive text-center mb-4 text-sm">{error}</p>} {/* Reduced margin */}

      <div className={`grid gap-6 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}`}> {/* Reduced gap */}
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'overflow-y-auto max-h-[calc(100vh-18rem)] pr-3 space-y-4'}`}> {/* Reduced gap, padding, and space */}
          {isLoading ? (
             Array.from({ length: viewMode === 'list' ? 4 : 2 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-muted/70 h-[350px] rounded-xl shadow-md"></Card> /* Reduced height */
             ))
          ) : goldsmiths.length > 0 ? (
             goldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-primary/10 flex flex-col rounded-xl overflow-hidden group">
                <CardHeader className="p-0 relative">
                  <Image
                    src={goldsmith.imageUrl}
                    alt={goldsmith.name}
                    width={400}
                    height={240} /* Reduced height */
                    className="rounded-t-xl object-cover w-full aspect-[4/2.4] group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="fine jewelry piece"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-primary/80 backdrop-blur-sm text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center"> {/* Adjusted padding and position */}
                     <Star className="h-3 w-3 mr-1 fill-current" /> {goldsmith.rating.toFixed(1)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between"> {/* Reduced padding */}
                  <div>
                    <CardTitle className="text-lg text-primary-foreground mb-1 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle> {/* Reduced font size */}
                    <CardDescription className="text-xs text-muted-foreground mb-1 line-clamp-1"> {/* Reduced font size */}
                      <MapPin className="inline-block h-3.5 w-3.5 mr-1" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-xs text-foreground/80 mb-1.5 font-medium">Specialty: {goldsmith.specialty}</p> {/* Reduced font size and margin */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">{goldsmith.shortBio}</p> {/* Reduced margin */}
                    
                  </div>
                  <Link
                    href={`/goldsmith/${goldsmith.id}`}
                    className={cn(
                       buttonVariants({ variant: "outline", size: "sm" }), // Using sm size
                       'text-accent border-accent hover:bg-accent/10 mt-2 w-full rounded-full text-xs py-2' // Reduced padding, margin, text size
                    )}
                  >
                    <span>View Profile & Connect</span>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-8">No goldsmiths found based on your criteria.</p>
          )}
        </div>

        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation ? (
                <div className="w-full h-[350px] md:h-full bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-inner">
                    <Loader2 className="h-8 w-8 animate-spin mr-2.5 text-primary" /> Loading Map Data...
                </div>
            ) : (
                 <MapPlaceholder locations={goldsmithLocations} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
