'use client'; // Required for map integration later

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, List, Search, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getNearbyLocations, type Location } from '@/services/geolocation'; // Assuming this service exists

// Placeholder for Map Component
const MapPlaceholder = ({ locations }: { locations: Location[] }) => (
  <div className="w-full h-[400px] md:h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
    <MapPin className="h-12 w-12 mr-2" />
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

   // Mock Goldsmith Data - Replace with API call
  const mockGoldsmiths: Goldsmith[] = [
    { id: 'artisan-1', name: 'Artisan Jewelers 1', address: '123 Main St, Cityville', specialty: 'Engagement Rings', rating: 4.8, imageUrl: 'https://picsum.photos/seed/goldsmith1/400/250', location: { lat: 34.0522, lng: -118.2437 } },
    { id: 'artisan-2', name: 'Golden Touch Crafters', address: '456 Oak Ave, Townsville', specialty: 'Custom Pendants', rating: 4.5, imageUrl: 'https://picsum.photos/seed/goldsmith2/400/250', location: { lat: 34.0530, lng: -118.2445 } },
    { id: 'artisan-3', name: 'Precious Metalsmith', address: '789 Pine Ln, Villagetown', specialty: 'Restoration', rating: 4.9, imageUrl: 'https://picsum.photos/seed/goldsmith3/400/250', location: { lat: 34.0515, lng: -118.2430 } },
     { id: 'artisan-4', name: 'Elegance Gems', address: '101 Maple Rd, Hamlet City', specialty: 'Necklaces & Bracelets', rating: 4.7, imageUrl: 'https://picsum.photos/seed/goldsmith4/400/250', location: { lat: 34.0540, lng: -118.2450 } },
  ];


  useEffect(() => {
    // Get user's current location (basic implementation)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { lat: latitude, lng: longitude };
        setCurrentLocation(loc);
         // Fetch goldsmiths based on location (or mock for now)
        // In a real app, call getNearbyLocations(searchTerm, loc) or similar
        setIsLoading(true);
         setTimeout(() => { // Simulate API delay
           setGoldsmiths(mockGoldsmiths); // Use mock data
           setIsLoading(false);
         }, 1000);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not get your location. Please enable location services or search manually.");
        // Fallback: Fetch general goldsmiths or prompt manual search
         setIsLoading(true);
        setTimeout(() => { // Simulate API delay
           setGoldsmiths(mockGoldsmiths); // Use mock data as fallback
           setIsLoading(false);
         }, 1000);
      }
    );
  }, []); // Run once on mount


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // TODO: Implement actual search logic using an API
    // e.g., getNearbyLocations(searchTerm, currentLocation)
    console.log("Searching for:", searchTerm, "near", currentLocation);
    setTimeout(() => { // Simulate API delay
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
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-primary-foreground">Find a Goldsmith</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View">
            <List className="h-5 w-5 mr-2" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View">
            <MapPin className="h-5 w-5 mr-2" /> Map
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
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

       {error && <p className="text-destructive text-center mb-4">{error}</p>}

      <div className={`grid gap-8 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[1fr_2fr]' : ''}`}>
        {/* List View */}
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'overflow-y-auto max-h-[600px] pr-4 space-y-4'}`}>
          {isLoading ? (
             Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-muted h-[350px]"></Card>
             ))
          ) : goldsmiths.length > 0 ? (
             goldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-primary/20 flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={goldsmith.imageUrl}
                    alt={goldsmith.name}
                    width={400}
                    height={200}
                    className="rounded-t-lg object-cover w-full aspect-video"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <CardTitle className="text-lg text-primary-foreground mb-1">{goldsmith.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      <MapPin className="inline-block h-4 w-4 mr-1" /> {goldsmith.address}
                    </CardDescription>
                    <p className="text-sm text-foreground mb-2">Specialty: {goldsmith.specialty}</p>
                    <div className="flex items-center text-sm text-amber-500 mb-3"> {/* Using amber for rating */}
                      <Star className="h-4 w-4 mr-1 fill-current" /> {goldsmith.rating.toFixed(1)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="mt-auto border-accent text-accent hover:bg-accent/10">
                    <Link href={`/goldsmith/${goldsmith.id}`}>View Profile</Link>
                  </Button>
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
                <div className="w-full h-[400px] md:h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
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
