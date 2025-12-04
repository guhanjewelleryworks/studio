'use client';

import type { Goldsmith } from '@/types/goldsmith';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, Star, Loader2, SlidersHorizontal, Palette, ShieldCheck, MapPin, Sparkles, Award } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { Switch } from '@/components/ui/switch';

const experienceRanges = [
  "0-5 years",
  "5-10 years",
  "10+ years",
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allGoldsmiths, setAllGoldsmiths] = useState<Goldsmith[]>([]);
  const [displayedGoldsmiths, setDisplayedGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    states: [] as string[],
    districts: [] as string[],
    experience: [] as string[],
    isNew: false,
  });

  // Initial data fetch
  useEffect(() => {
    setIsLoading(true);
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

  // Memoize unique values to avoid recalculating on every render
  const { uniqueSpecialties, uniqueStates, uniqueDistricts } = useMemo(() => {
    if (!allGoldsmiths) return { uniqueSpecialties: [], uniqueStates: [], uniqueDistricts: [] };
    const specialtiesSet = new Set<string>();
    const statesSet = new Set<string>();
    const districtsSet = new Set<string>();
    allGoldsmiths.forEach(g => {
        if (Array.isArray(g.specialty)) {
            g.specialty.forEach(s => s && specialtiesSet.add(s));
        } else if (typeof g.specialty === 'string' && g.specialty) {
            specialtiesSet.add(g.specialty);
        }
        if (g.state) {
            statesSet.add(g.state);
        }
        if (g.district) {
            districtsSet.add(g.district);
        }
    });
    return { 
        uniqueSpecialties: Array.from(specialtiesSet).sort(),
        uniqueStates: Array.from(statesSet).sort(),
        uniqueDistricts: Array.from(districtsSet).sort(),
    };
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

    // 2. Filter by "Newly Joined"
    if (filters.isNew) {
        filtered = filtered.filter(g => g.registeredAt && differenceInDays(new Date(), new Date(g.registeredAt)) <= 30);
    }
    
    // 3. Filter by selected experience ranges
    if (filters.experience.length > 0) {
        filtered = filtered.filter(g => {
            const years = g.yearsExperience || 0;
            return filters.experience.some(range => {
                if (range === '0-5 years') return years >= 0 && years <= 5;
                if (range === '5-10 years') return years > 5 && years <= 10;
                if (range === '10+ years') return years > 10;
                return false;
            });
        });
    }

    // 4. Filter by selected states
    if (filters.states.length > 0) {
        filtered = filtered.filter(g => filters.states.includes(g.state));
    }
    
    // 5. Filter by selected districts
    if (filters.districts.length > 0) {
        filtered = filtered.filter(g => filters.districts.includes(g.district));
    }

    // 6. Filter by selected specialties
    if (filters.specialties.length > 0) {
        filtered = filtered.filter(g => {
            const goldsmithSpecs = Array.isArray(g.specialty) ? g.specialty : [g.specialty];
            return filters.specialties.every(filterSpec => goldsmithSpecs.includes(filterSpec));
        });
    }
    
    setDisplayedGoldsmiths(filtered);
    
    const noMatches = filtered.length === 0 && (
        searchTerm.trim() ||
        filters.isNew ||
        filters.experience.length > 0 ||
        filters.states.length > 0 ||
        filters.districts.length > 0 ||
        filters.specialties.length > 0
    );

    if (noMatches) {
        setError(`No goldsmiths found matching your criteria. Try adjusting your search or filters.`);
    } else {
        setError(null);
    }

  }, [searchTerm, filters, allGoldsmiths]);


  const handleClearFilters = () => {
    setFilters({
        specialties: [],
        states: [],
        districts: [],
        experience: [],
        isNew: false,
    });
  };

  return (
    <div className="container max-w-7xl py-6 px-4 md:px-6 min-h-[calc(100vh-8rem)] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-heading text-accent tracking-tight">Find a Goldsmith</h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-2.5 items-center">
        <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, specialty, or location..."
              className="w-full rounded-lg text-sm px-4 py-2 shadow-md border-border focus:ring-primary focus:border-primary text-foreground pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto rounded-lg shadow-md border-border hover:bg-secondary/30 h-10">
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
                    
                     {/* Newly Joined Filter */}
                    <div>
                        <Label className="text-base font-semibold text-foreground">Quick Filters</Label>
                        <div className="mt-2 flex items-center space-x-2 p-2 rounded-md border border-border/50">
                            <Switch 
                                id="newly-joined-filter"
                                checked={filters.isNew}
                                onCheckedChange={(checked) => setFilters(prev => ({...prev, isNew: checked}))}
                            />
                            <Label htmlFor="newly-joined-filter" className="font-normal flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" /> Newly Joined
                            </Label>
                        </div>
                    </div>

                    <Separator />

                    {/* Experience Filter */}
                    <div>
                        <Label className="text-base font-semibold text-foreground">Years of Experience</Label>
                        <div className="mt-2 space-y-2">
                            {experienceRanges.map(range => (
                                <div key={range} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`exp-${range}`}
                                        checked={filters.experience.includes(range)}
                                        onCheckedChange={(checked) => {
                                            const newExp = checked
                                                ? [...filters.experience, range]
                                                : filters.experience.filter(e => e !== range);
                                            setFilters(prev => ({...prev, experience: newExp}));
                                        }}
                                    />
                                    <Label htmlFor={`exp-${range}`} className="font-normal capitalize flex items-center gap-2">
                                        <Award className="h-4 w-4 text-muted-foreground" /> {range}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Location Filters */}
                    <div>
                        <Label className="text-base font-semibold text-foreground">Location</Label>
                        <div className="mt-2 space-y-4">
                            {uniqueStates.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1.5 text-foreground/80">State</h4>
                                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                        {uniqueStates.map(state => (
                                            <div key={state} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`state-${state}`}
                                                    checked={filters.states.includes(state)}
                                                    onCheckedChange={(checked) => {
                                                        const newStates = checked
                                                            ? [...filters.states, state]
                                                            : filters.states.filter(s => s !== state);
                                                        setFilters(prev => ({...prev, states: newStates}));
                                                    }}
                                                />
                                                <Label htmlFor={`state-${state}`} className="font-normal capitalize">{state}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                             {uniqueDistricts.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1.5 text-foreground/80">District / City</h4>
                                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                        {uniqueDistricts.map(district => (
                                            <div key={district} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`district-${district}`}
                                                    checked={filters.districts.includes(district)}
                                                    onCheckedChange={(checked) => {
                                                        const newDistricts = checked
                                                            ? [...filters.districts, district]
                                                            : filters.districts.filter(d => d !== district);
                                                        setFilters(prev => ({...prev, districts: newDistricts}));
                                                    }}
                                                />
                                                <Label htmlFor={`district-${district}`} className="font-normal capitalize">{district}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
             Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-card h-[320px] rounded-xl shadow-md border-border"></Card> 
             ))
          ) : displayedGoldsmiths.length > 0 ? (
             displayedGoldsmiths.map((goldsmith) => {
                const isNew = goldsmith.registeredAt && differenceInDays(new Date(), new Date(goldsmith.registeredAt)) <= 30;
                return (
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
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                         {isNew && (
                            <Badge variant="default" className="animate-pulse flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              New
                            </Badge>
                         )}
                         {goldsmith.rating > 0 && (
                            <div className="bg-background/80 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center shadow-md">
                              <Star className="h-3 w-3 mr-0.5 fill-current text-yellow-400" /> {goldsmith.rating.toFixed(1)}
                            </div>
                         )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <CardTitle className="font-heading text-lg text-accent group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span className="truncate">{goldsmith.name}</span>
                          {goldsmith.status === 'verified' && (
                            <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" title="Verified Goldsmith" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" /> <span className="line-clamp-1">{goldsmith.district || 'Location'}, {goldsmith.state || 'N/A'}</span>
                        </CardDescription>
                        <p className="text-xs text-muted-foreground font-medium flex items-center capitalize">
                          <Palette className="h-3.5 w-3.5 mr-1.5 shrink-0 text-primary"/>
                          <span className="line-clamp-1">
                            {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : goldsmith.specialty}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug line-clamp-2 !mt-2.5">{goldsmith.shortBio}</p>
                      </div>
                      <NextLink
                        href={`/goldsmith/${goldsmith.id}`}
                        className={cn(
                           buttonVariants({ variant: "outline", size: "sm" }),
                           'text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground mt-4 w-full rounded-full text-xs py-1.5 shadow-sm'
                        )}
                      >
                        <LinkIcon className="mr-1.5 h-3.5 w-3.5"/>View Profile & Connect
                      </NextLink>
                    </CardContent>
                  </Card>
                );
             })
          ) : (
             !isLoading && !error && <p className="col-span-full text-center text-muted-foreground py-6 text-sm">No goldsmiths found based on your criteria.</p>
          )}
        </div>
    </div>
  );
}
