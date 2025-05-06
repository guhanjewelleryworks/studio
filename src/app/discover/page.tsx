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
  <div className="w-full h-[400px] md:h-full bg-muted/50 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner">
    <MapPin className="h-12 w-12 mr-2 text-primary/70 mb-3" />
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
         }, 1200); // Slightly longer for effect
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not access your location. Please enable location services or search manually.");
        setIsLoading(true);
        setTimeout(() => { 
           setGoldsmiths(mockGoldsmiths); 
           setIsLoading(false);
         }, 1200);
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
     }, 700);
  };

  const goldsmithLocations = goldsmiths.map(g => g.location);

  return (
    <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">Find a Goldsmith</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View" className="rounded-full px-5 py-2.5">
            <List className="mr-2 h-5 w-5" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View" className="rounded-full px-5 py-2.5">
            <MapPin className="mr-2 h-5 w-5" /> Map
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3 items-center">
        <Input
          type="search"
          placeholder="Search by name, specialty, or location..."
          className="flex-grow rounded-full text-base px-5 py-3 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" variant="ghost" size="icon" className="sm:ml-2 hidden sm:inline-flex">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Filters</span>
        </Button>
        <Button type="submit" disabled={isLoading} size="lg" className="rounded-full px-8 py-3 w-full sm:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
          Search
        </Button>
      </form>

       {error && <p className="text-destructive text-center mb-6 text-sm">{error}</p>}

      <div className={`grid gap-8 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}`}>
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'overflow-y-auto max-h-[calc(100vh-20rem)] pr-4 space-y-5'}`}>
          {isLoading ? (
             Array.from({ length: viewMode === 'list' ? 4 : 2 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-muted/70 h-[380px] rounded-xl shadow-md"></Card>
             ))
          ) : goldsmiths.length > 0 ? (
             goldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-primary/10 flex flex-col rounded-xl overflow-hidden group">
                <CardHeader className="p-0 relative">
                  <Image
                    src={goldsmith.imageUrl}
                    alt={goldsmith.name}
                    width={400}
                    height={260}
                    className="rounded-t-xl object-cover w-full aspect-[4/2.6] group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="fine jewelry piece"
                  />
                  <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center">
                     <Star className="h-3.5 w-3.5 mr-1 fill-current" /> {goldsmith.rating.toFixed(1)}
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary-foreground mb-1.5 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-1 line-clamp-1">
                      <MapPin className="inline-block h-4 w-4 mr-1.5" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-sm text-foreground/80 mb-2 font-medium">Specialty: {goldsmith.specialty}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{goldsmith.shortBio}</p>
                    
                  </div>
                  <Link
                    href={`/goldsmith/${goldsmith.id}`}
                    className={cn(
                       buttonVariants({ variant: "outline", size: "default" }), // Changed to default size
                       'text-accent border-accent hover:bg-accent/10 mt-3 w-full rounded-full text-sm py-2.5'
                    )}
                  >
                    <span>View Profile & Connect</span>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-10">No goldsmiths found based on your criteria.</p>
          )}
        </div>

        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation ? (
                <div className="w-full h-[400px] md:h-full bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-inner">
                    <Loader2 className="h-10 w-10 animate-spin mr-3 text-primary" /> Loading Map Data...
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
