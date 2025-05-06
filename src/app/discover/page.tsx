'use client'; // Required for map integration later

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MapPin, List, Search, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getNearbyLocations, type Location } from '@/services/geolocation'; 
import { cn } from '@/lib/utils';

// Placeholder for Map Component
const MapPlaceholder = ({ locations }: { locations: Location[] }) => (
  <div className="w-full h-[350px] md:h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground"> {/* Reduced height */}
    <MapPin className="h-10 w-10 mr-2" /> {/* Slightly smaller icon */}
    Map View Placeholder (Locations: {locations.length})
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
}

export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockGoldsmiths: Goldsmith[] = [
    { id: 'artisan-1', name: 'Artisan Jewelers 1', address: '123 Main St, Cityville', specialty: 'Engagement Rings', rating: 4.8, imageUrl: 'https://picsum.photos/seed/goldsmith1/300/200', location: { lat: 34.0522, lng: -118.2437 } },
    { id: 'artisan-2', name: 'Golden Touch Crafters', address: '456 Oak Ave, Townsville', specialty: 'Custom Pendants', rating: 4.5, imageUrl: 'https://picsum.photos/seed/goldsmith2/300/200', location: { lat: 34.0530, lng: -118.2445 } },
    { id: 'artisan-3', name: 'Precious Metalsmith', address: '789 Pine Ln, Villagetown', specialty: 'Restoration', rating: 4.9, imageUrl: 'https://picsum.photos/seed/goldsmith3/300/200', location: { lat: 34.0515, lng: -118.2430 } },
     { id: 'artisan-4', name: 'Elegance Gems', address: '101 Maple Rd, Hamlet City', specialty: 'Necklaces & Bracelets', rating: 4.7, imageUrl: 'https://picsum.photos/seed/goldsmith4/300/200', location: { lat: 34.0540, lng: -118.2450 } },
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
        setError("Could not get your location. Please enable location services or search manually.");
         setIsLoading(true);
        setTimeout(() => { 
           setGoldsmiths(mockGoldsmiths); 
           setIsLoading(false);
         }, 1000);
      }
    );
  }, []); 


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Searching for:", searchTerm, "near", currentLocation);
    setTimeout(() => { 
       const filtered = mockGoldsmiths.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.address.toLowerCase().includes(searchTerm.toLowerCase())
       );
       setGoldsmiths(filtered);
       setIsLoading(false);
       if (filtered.length === 0) {
         setError(`No goldsmiths found matching "${searchTerm}".`);
       }
     }, 500);
  };

  const goldsmithLocations = goldsmiths.map(g => g.location);

  return (
    <div className="container py-6 px-4 md:px-6"> {/* Reduced py */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6"> {/* Reduced gap, mb */}
        <h1 className="text-3xl font-bold text-primary-foreground">Find a Goldsmith</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View">
            <List className="mr-2 h-4 w-4" /> List {/* Adjusted icon size */}
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View">
            <MapPin className="mr-2 h-4 w-4" /> Map {/* Adjusted icon size */}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2"> {/* Reduced mb */}
        <Input
          type="search"
          placeholder="Search by name, specialty, or location..."
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </form>

       {error && <p className="text-destructive text-center mb-3">{error}</p>} {/* Reduced mb */}

      <div className={`grid gap-6 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[1fr_2fr]' : ''}`}> {/* Reduced gap */}
        {/* List View */}
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'overflow-y-auto max-h-[500px] pr-3 space-y-3'}`}> {/* Reduced gap, max-h, pr, space-y */}
          {isLoading ? (
             Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-muted h-[300px]"></Card> // Reduced height
             ))
          ) : goldsmiths.length > 0 ? (
             goldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-primary/20 flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={goldsmith.imageUrl}
                    alt={goldsmith.name}
                    width={300}
                    height={180} // Adjusted height for a slightly different aspect ratio
                    className="rounded-t-lg object-cover w-full aspect-[5/3]" // Adjusted aspect ratio
                    data-ai-hint="goldsmith jewelry store"
                  />
                </CardHeader>
                <CardContent className="p-3 flex-grow flex flex-col justify-between"> {/* Reduced p */}
                  <div>
                    <CardTitle className="text-lg text-primary-foreground mb-1">{goldsmith.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-1"> {/* Reduced mb */}
                      <MapPin className="inline-block h-4 w-4 mr-1" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-sm text-foreground mb-1">Specialty: {goldsmith.specialty}</p> {/* Reduced mb */}
                    <div className="flex items-center text-sm text-amber-500 mb-2"> {/* Reduced mb */}
                      <Star className="h-4 w-4 mr-1 fill-current" /> {goldsmith.rating.toFixed(1)}
                    </div>
                  </div>
                  <Link
                    href={`/goldsmith/${goldsmith.id}`}
                    className={cn(
                       buttonVariants({ variant: "outline", size: "sm" }),
                       'text-accent border-accent hover:bg-accent/10 mt-2' // Reduced mt
                    )}
                  >
                    <span>View Profile</span>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground">No goldsmiths found.</p>
          )}
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation ? (
                <div className="w-full h-[350px] md:h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground"> {/* Reduced height */}
                    <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading Map...
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
