// src/app/discover/page.tsx
'use client';

import type { Location } from '@/services/geolocation';
import type { Goldsmith } from '@/types/goldsmith'; 
import { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MapPin, List, Search, Star, Loader2, SlidersHorizontal, Palette } from 'lucide-react';
import { Link as LinkIcon } from 'lucide-react'; 
import Image from 'next/image';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

// Placeholder for Map Component
const MapPlaceholder = ({ locations }: { locations: Location[] }) => (
  <div className="w-full h-[300px] md:h-full bg-muted/30 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner">
    <MapPin className="h-16 w-16 text-primary/70 mb-4" />
    <p className="text-xl font-semibold text-foreground">Interactive Map View</p>
    <p className="text-base mt-1 text-muted-foreground">(Displaying {locations.length} locations)</p>
  </div>
);


export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockGoldsmiths: Goldsmith[] = [
    { id: 'artisan-1', name: 'Lumière Jewels', address: '123 Diamond St, Cityville', specialty: 'Engagement Rings', rating: 4.9, imageUrl: 'https://picsum.photos/seed/lumiere-discover/400/300', location: { lat: 34.0522, lng: -118.2437 }, shortBio: 'Crafting timeless elegance with ethically sourced diamonds and gemstones.' },
    { id: 'artisan-2', name: 'Aura & Gold', address: '456 Sapphire Ave, Townsville', specialty: 'Custom Pendants', rating: 4.7, imageUrl: 'https://picsum.photos/seed/aura-discover/400/300', location: { lat: 34.0530, lng: -118.2445 }, shortBio: 'Unique, handcrafted pendants that tell your personal story with artistry.' },
    { id: 'artisan-3', name: 'Heritage Metalsmiths', address: '789 Ruby Ln, Villagetown', specialty: 'Antique Restoration', rating: 4.8, imageUrl: 'https://picsum.photos/seed/heritage-discover/400/300', location: { lat: 34.0515, lng: -118.2430 }, shortBio: 'Preserving history through expert restoration of antique and heirloom jewelry.' },
    { id: 'artisan-4', name: 'Elysian Gems', address: '101 Emerald Rd, Hamlet City', specialty: 'Necklaces & Bracelets', rating: 4.6, imageUrl: 'https://picsum.photos/seed/elysian-discover/400/300', location: { lat: 34.0540, lng: -118.2450 }, shortBio: 'Elegant necklaces and bracelets designed to adorn and inspire.' },
  ];


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc: Location = { lat: latitude, lng: longitude };
        setCurrentLocation(loc);
        setIsLoading(true);
         setTimeout(() => {
           setGoldsmiths(mockGoldsmiths);
           setIsLoading(false);
         }, 700);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not access your location. Please enable location services or search manually.");
        setIsLoading(true);
        setTimeout(() => {
           setGoldsmiths(mockGoldsmiths);
           setIsLoading(false);
         }, 700);
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
     }, 500);
  };

  const goldsmithLocations = goldsmiths.map(g => g.location);

  return (
    <div className="container py-10 md:py-14 px-4 md:px-6 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Find a Goldsmith</h1>
        <div className="flex gap-2.5"> {/* Increased gap slightly */}
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <List className="mr-1.5 h-4 w-4" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <MapPin className="mr-1.5 h-4 w-4" /> Map
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3 items-center"> {/* Increased mb and gap */}
        <Input
          type="search"
          placeholder="Search by name, specialty, or location..."
          className="flex-grow rounded-lg text-sm px-4 py-2.5 shadow-md border-border focus:ring-primary focus:border-primary text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" variant="outline" size="icon" className="sm:ml-2 hidden sm:inline-flex p-2.5 rounded-lg shadow-md border-border hover:bg-muted/50"> {/* Increased ml */}
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Filters</span>
        </Button>
        <Button type="submit" disabled={isLoading} size="default" className="rounded-lg px-6 py-2.5 text-sm w-full sm:w-auto shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
          Search
        </Button>
      </form>

       {error && <p className="text-destructive text-center mb-4 text-sm">{error}</p>}

      <div className={`grid gap-4 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}`}> {/* Increased gap */}
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'overflow-y-auto max-h-[calc(100vh-18rem)] pr-2 space-y-3'}`}> {/* Increased gap and pr */}
          {isLoading ? (
             Array.from({ length: viewMode === 'list' ? 8 : 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-card h-[320px] rounded-xl shadow-md border-border"></Card> /* Increased h */
             ))
          ) : goldsmiths.length > 0 ? (
             goldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-card border-primary/15 flex flex-col rounded-xl overflow-hidden group">
                <CardHeader className="p-0 relative">
                  <Image
                    src={goldsmith.imageUrl!}
                    alt={goldsmith.name}
                    width={400}
                    height={200}
                    className="rounded-t-xl object-cover w-full aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="goldsmith workshop"
                  />
                  <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center shadow-md">
                     <Star className="h-3 w-3 mr-0.5 fill-current" /> {goldsmith.rating.toFixed(1)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between"> {/* Increased p-3 to p-4 */}
                  <div>
                    <CardTitle className="font-heading text-md text-foreground mb-1 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle> {/* Increased mb */}
                    <CardDescription className="text-xs text-muted-foreground mb-1 line-clamp-1"> {/* Increased mb */}
                      <MapPin className="inline-block h-3 w-3 mr-0.5" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-xs text-foreground/80 mb-1.5 font-medium flex items-center"> {/* Increased mb */}
                      <Palette className="inline-block h-3 w-3 mr-0.5 text-accent"/>Specialty: {goldsmith.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mb-2.5">{goldsmith.shortBio}</p> {/* Increased mb */}
                  </div>
                  <NextLink
                    href={`/goldsmith/${goldsmith.id}`}
                    className={cn(
                       buttonVariants({ variant: "outline", size: "xs" }),
                       'text-accent-foreground border-accent hover:bg-accent/20 mt-2 w-full rounded-lg text-xs py-1.5 shadow-md' // Increased mt
                    )}
                  >
                    <LinkIcon className="mr-1 h-3 w-3"/>View Profile & Connect
                  </NextLink>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-8 text-base">No goldsmiths found based on your criteria.</p> /* Increased py and text size */
          )}
        </div>

        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation ? (
                <div className="w-full h-[300px] md:h-full bg-muted/40 rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-inner">
                    <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Loading Map Data...
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
