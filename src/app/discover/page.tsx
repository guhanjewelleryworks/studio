'use client';

import type { Location } from '@/services/geolocation';
import type { Goldsmith } from '@/types/goldsmith';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MapPin, List, Search, Star, Loader2, SlidersHorizontal, Palette } from 'lucide-react';
import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import { fetchAllGoldsmiths } from '@/actions/goldsmith-actions';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';


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
  const [allGoldsmiths, setAllGoldsmiths] = useState<Goldsmith[]>([]); 
  const [displayedGoldsmiths, setDisplayedGoldsmiths] = useState<Goldsmith[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    rating: 0, // 0 for any
  });

  // Initial data fetch
  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc: Location = { lat: latitude, lng: longitude };
        setCurrentLocation(loc);
      },
      (err) => {
        console.error("Error getting location:", err.message);
        setError("Could not access your location. Please enable location services or search manually.");
      }
    );

    const loadGoldsmiths = async () => {
      try {
        const fetchedGoldsmiths = await fetchAllGoldsmiths();
        setAllGoldsmiths(fetchedGoldsmiths);
      } catch (e) {
        console.error("Error fetching goldsmiths from database", e);
        setError("Failed to load goldsmiths. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGoldsmiths();
  }, []);

  // Memoize unique specialties to avoid recalculating on every render
  const uniqueSpecialties = useMemo(() => {
    if (!allGoldsmiths) return [];
    const specialtiesSet = new Set<string>();
    allGoldsmiths.forEach(g => {
        if (Array.isArray(g.specialty)) {
            g.specialty.forEach(s => s && specialtiesSet.add(s));
        } else if (typeof g.specialty === 'string' && g.specialty) {
            specialtiesSet.add(g.specialty);
        }
    });
    return Array.from(specialtiesSet).sort();
  }, [allGoldsmiths]);

  // Combined filtering logic
  useEffect(() => {
    let filtered = allGoldsmiths;

    // 1. Filter by search term
    if (searchTerm.trim()) {
        filtered = filtered.filter(g => {
            const searchTermLower = searchTerm.toLowerCase();
            const nameMatch = g.name.toLowerCase().includes(searchTermLower);
            const specialtyMatch = Array.isArray(g.specialty) 
                ? g.specialty.some(s => s.toLowerCase().includes(searchTermLower))
                : typeof g.specialty === 'string' 
                    ? g.specialty.toLowerCase().includes(searchTermLower) 
                    : false;
            const locationMatch = `${g.district}, ${g.state}`.toLowerCase().includes(searchTermLower);
            return nameMatch || specialtyMatch || locationMatch;
        });
    }

    // 2. Filter by selected specialties
    if (filters.specialties.length > 0) {
        filtered = filtered.filter(g => {
            const goldsmithSpecs = Array.isArray(g.specialty) ? g.specialty : [g.specialty];
            return filters.specialties.every(filterSpec => goldsmithSpecs.includes(filterSpec));
        });
    }

    // 3. Filter by rating
    if (filters.rating > 0) {
        filtered = filtered.filter(g => g.rating >= filters.rating);
    }
    
    setDisplayedGoldsmiths(filtered);
    
    if (filtered.length === 0 && (searchTerm.trim() || filters.specialties.length > 0 || filters.rating > 0)) {
        setError(`No goldsmiths found matching your criteria. Try adjusting your search or filters.`);
    } else {
        setError(null);
    }

  }, [searchTerm, filters, allGoldsmiths]);


  const handleClearFilters = () => {
    setFilters({
        specialties: [],
        rating: 0,
    });
  };

  const goldsmithLocations = displayedGoldsmiths.map(g => g.location).filter(loc => loc !== undefined) as Location[];


  return (
    <div className="container max-w-screen-xl py-6 px-4 md:px-6 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-heading text-accent tracking-tight">Find a Goldsmith</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} aria-label="List View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <List className="mr-1.5 h-4 w-4" /> List
          </Button>
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} onClick={() => setViewMode('map')} aria-label="Map View" className="rounded-lg px-4 py-2 text-sm shadow-md">
            <MapPin className="mr-1.5 h-4 w-4" /> Map
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-2.5 items-center">
        <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, specialty, or location..."
              className="w-full rounded-lg text-sm px-4 py-2 shadow-md border-border focus:ring-primary focus:border-primary text-foreground pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto rounded-lg shadow-md border-border hover:bg-secondary/30">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" /> Filters
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-accent">Filter Artisans</SheetTitle>
                    <SheetDescription>
                        Refine your search to find the perfect goldsmith.
                    </SheetDescription>
                </SheetHeader>
                <Separator className="my-3"/>
                <div className="flex-grow overflow-y-auto pr-4 space-y-6">
                    {/* Rating Filter */}
                    <div>
                        <Label className="text-base font-semibold text-foreground">Rating</Label>
                        <RadioGroup
                            value={String(filters.rating)}
                            onValueChange={(value) => setFilters(prev => ({...prev, rating: Number(value)}))}
                            className="mt-2 space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="r-any" />
                                <Label htmlFor="r-any" className="font-normal">Any Rating</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4" id="r-4" />
                                <Label htmlFor="r-4" className="font-normal">4 stars & up</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="r-3" />
                                <Label htmlFor="r-3" className="font-normal">3 stars & up</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    <Separator />

                    {/* Specialty Filter */}
                    {uniqueSpecialties.length > 0 && (
                        <div>
                            <Label className="text-base font-semibold text-foreground">Specialties</Label>
                            <div className="mt-2 space-y-2">
                                {uniqueSpecialties.map(spec => (
                                    <div key={spec} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`spec-${spec}`}
                                            checked={filters.specialties.includes(spec)}
                                            onCheckedChange={(checked) => {
                                                const newSpecs = checked
                                                    ? [...filters.specialties, spec]
                                                    : filters.specialties.filter(s => s !== spec);
                                                setFilters(prev => ({...prev, specialties: newSpecs}));
                                            }}
                                        />
                                        <Label htmlFor={`spec-${spec}`} className="font-normal capitalize">{spec}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <Separator className="my-3"/>
                <SheetFooter>
                    <Button variant="outline" onClick={handleClearFilters}>Clear All</Button>
                    <SheetClose asChild>
                        <Button type="button">Done</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
      </div>

       {error && <p className="text-destructive text-center mb-3 text-sm">{error}</p>}

      <div className={`grid gap-3 ${viewMode === 'map' ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : ''}`}>
        <div className={`${viewMode === 'map' ? 'hidden md:block' : ''} ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : 'overflow-y-auto max-h-[calc(100vh-18rem)] pr-1.5 space-y-2.5'}`}>
          {isLoading ? (
             Array.from({ length: viewMode === 'list' ? 8 : 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-card h-[280px] rounded-xl shadow-md border-border"></Card> 
             ))
          ) : displayedGoldsmiths.length > 0 ? (
             displayedGoldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-card border-primary/15 flex flex-col rounded-xl overflow-hidden group">
                <CardHeader className="p-0 relative">
                  <Image
                    src={goldsmith.imageUrl || 'https://picsum.photos/seed/default-goldsmith/400/300'}
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
                <CardContent className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <CardTitle className="font-heading text-md text-accent mb-0.5 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mb-0.5 line-clamp-1">
                      <MapPin className="inline-block h-3 w-3 mr-0.5" /> {goldsmith.district}, {goldsmith.state}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center capitalize">
                      <Palette className="inline-block h-3 w-3 mr-0.5 text-primary"/>Specialty: {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : goldsmith.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mb-2">{goldsmith.shortBio}</p>
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
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-6 text-sm">No goldsmiths found based on your criteria.</p>
          )}
        </div>

        {viewMode === 'map' && (
          <div className="md:col-span-1">
            {isLoading && !currentLocation ? (
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
