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
  <div className="w-full h-[300px] md:h-full bg-card/70 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner">
    <MapPin className="h-16 w-16 text-primary/70 mb-4" />
    <p className="text-xl font-semibold text-foreground">Interactive Map View</p>
    <p className="text-base mt-1 text-muted-foreground">(Displaying {locations.length} locations)</p>
  </div>
);


export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [allGoldsmiths, setAllGoldsmiths] = useState<Goldsmith[]>([]); // Holds combined mock and localStorage goldsmiths
  const [displayedGoldsmiths, setDisplayedGoldsmiths] = useState<Goldsmith[]>([]); // Holds goldsmiths to display after filtering
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockGoldsmiths: Goldsmith[] = [
    { id: 'artisan-1', name: 'Lumière Jewels', address: '123 Diamond St, Cityville', specialty: ['Engagement Rings'], rating: 4.9, imageUrl: 'https://picsum.photos/seed/lumiere-discover/400/300', location: { lat: 34.0522, lng: -118.2437 }, shortBio: 'Crafting timeless elegance with ethically sourced diamonds and gemstones.' },
    { id: 'artisan-2', name: 'Aura & Gold', address: '456 Sapphire Ave, Townsville', specialty: ['Custom Pendants'], rating: 4.7, imageUrl: 'https://picsum.photos/seed/aura-discover/400/300', location: { lat: 34.0530, lng: -118.2445 }, shortBio: 'Unique, handcrafted pendants that tell your personal story with artistry.' },
    { id: 'artisan-3', name: 'Heritage Metalsmiths', address: '789 Ruby Ln, Villagetown', specialty: ['Antique Restoration'], rating: 4.8, imageUrl: 'https://picsum.photos/seed/heritage-discover/400/300', location: { lat: 34.0515, lng: -118.2430 }, shortBio: 'Preserving history through expert restoration of antique and heirloom jewelry.' },
    { id: 'artisan-4', name: 'Elysian Gems', address: '101 Emerald Rd, Hamlet City', specialty: ['Necklaces & Bracelets'], rating: 4.6, imageUrl: 'https://picsum.photos/seed/elysian-discover/400/300', location: { lat: 34.0540, lng: -118.2450 }, shortBio: 'Elegant necklaces and bracelets designed to adorn and inspire.' },
  ];


  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc: Location = { lat: latitude, lng: longitude };
        setCurrentLocation(loc);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not access your location. Please enable location services or search manually.");
      }
    );

    // Load goldsmiths from localStorage
    let storedGoldsmiths: Goldsmith[] = [];
    const storedData = localStorage.getItem('goldsmiths-data');
    if (storedData) {
      try {
        storedGoldsmiths = JSON.parse(storedData);
      } catch (e) {
        console.error("Error parsing goldsmiths from localStorage", e);
      }
    }
    
    // Combine mock and stored goldsmiths, ensuring no duplicates by ID
    const combinedGoldsmiths = [...mockGoldsmiths];
    storedGoldsmiths.forEach(sg => {
      if (!mockGoldsmiths.find(mg => mg.id === sg.id)) {
        combinedGoldsmiths.push(sg);
      }
    });

    setAllGoldsmiths(combinedGoldsmiths);
    setDisplayedGoldsmiths(combinedGoldsmiths); // Initially display all
    setIsLoading(false);

  }, []);


  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
       const filtered = allGoldsmiths.filter(g => {
         const searchTermLower = searchTerm.toLowerCase();
         const nameMatch = g.name.toLowerCase().includes(searchTermLower);
         const specialtyMatch = Array.isArray(g.specialty) 
           ? g.specialty.some(s => s.toLowerCase().includes(searchTermLower))
           : typeof g.specialty === 'string' 
             ? g.specialty.toLowerCase().includes(searchTermLower) 
             : false;
         const addressMatch = g.address.toLowerCase().includes(searchTermLower);
         return nameMatch || specialtyMatch || addressMatch;
       });
       setDisplayedGoldsmiths(filtered);
       setIsLoading(false);
       if (filtered.length === 0) {
         setError(`No goldsmiths found matching "${searchTerm}". Try a different term.`);
       }
     }, 500);
  };

  const goldsmithLocations = displayedGoldsmiths.map(g => g.location);

  return (
    <div className="container py-6 px-4 md:px-6 min-h-[calc(100vh-8rem)]"> {/* Reduced py */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6"> {/* Reduced gap and mb */}
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Find a Goldsmith</h1> {/* Changed to text-foreground */}
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <List className="mr-1.5 h-4 w-4" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <MapPin className="mr-1.5 h-4 w-4" /> Map
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-2.5 items-center"> {/* Reduced mb and gap */}
        <Input
          type="search"
          placeholder="Search by name, specialty, or location..."
          className="flex-grow rounded-lg text-sm px-4 py-2 shadow-md border-border focus:ring-primary focus:border-primary text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" variant="outline" size="icon" className="sm:ml-2 hidden sm:inline-flex p-2.5 rounded-lg shadow-md border-border hover:bg-secondary/30">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Filters</span>
        </Button>
        <Button type="submit" disabled={isLoading} size="default" className="rounded-lg px-6 py-2 text-sm w-full sm:w-auto shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && displayedGoldsmiths.length === 0 ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
          Search
        </Button>
      </form>

       {error && <p className="text-destructive text-center mb-3 text-sm">{error}</p>} {/* Reduced mb */}

      <div className={`grid gap-3 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}`}> {/* Reduced gap */}
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'overflow-y-auto max-h-[calc(100vh-18rem)] pr-1.5 space-y-2.5'}`}> {/* Reduced gap, pr, and space-y */}
          {isLoading && displayedGoldsmiths.length === 0 ? (
             Array.from({ length: viewMode === 'list' ? 8 : 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-card h-[280px] rounded-xl shadow-md border-border"></Card> 
             ))
          ) : displayedGoldsmiths.length > 0 ? (
             displayedGoldsmiths.map((goldsmith) => (
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
                     <Star className="h-3 w-3 mr-0.5 fill-current" /> {goldsmith.rating > 0 ? goldsmith.rating.toFixed(1) : 'New'}
                  </div>
                </CardHeader>
                <CardContent className="p-3 flex-grow flex flex-col justify-between"> {/* Reduced p */}
                  <div>
                    <CardTitle className="font-heading text-md text-accent mb-0.5 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle> {/* Use text-accent */}
                    <CardDescription className="text-xs text-muted-foreground mb-0.5 line-clamp-1">
                      <MapPin className="inline-block h-3 w-3 mr-0.5" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center">
                      <Palette className="inline-block h-3 w-3 mr-0.5 text-primary"/>Specialty: {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : goldsmith.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mb-2">{goldsmith.shortBio}</p> {/* Reduced mb */}
                  </div>
                  <NextLink
                    href={`/goldsmith/${goldsmith.id}`}
                    className={cn(
                       buttonVariants({ variant: "outline", size: "xs" }),
                       'text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground mt-1.5 w-full rounded-lg text-xs py-1.5 shadow-md'
                    )}
                  >
                    <LinkIcon className="mr-1 h-3 w-3"/>View Profile & Connect
                  </NextLink>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-6 text-sm">No goldsmiths found based on your criteria.</p> /* Reduced py and text size */
          )}
        </div>

        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation && displayedGoldsmiths.length === 0 ? (
                <div className="w-full h-[300px] md:h-full bg-card/80 rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-inner">
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
