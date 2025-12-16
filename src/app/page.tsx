'use client';

import type { Goldsmith } from '@/types/goldsmith';
import type { SVGProps } from 'react';
import Link from 'next/link';
import NextLink from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShieldCheck, Gift, MapPin, User, Handshake, Gem, Loader2, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fetchAllGoldsmiths } from '@/actions/goldsmith-actions';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// --- Icons for the hero stats section ---

const CustomerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const VerifiedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19.4 12.6c0-4.2.9-7.6 2.6-10.6-1.6.4-3.5 1-5 2.1-1.2 1-2.2 2.3-2.8 3.8-1.5-.2-3.2-.3-4.9-.3-5.2 0-8.3 3.5-9.3 8.1.5-3.3 3.2-5.7 6.7-5.7 1.4 0 2.7.3 3.9.8.3 1.1.7 2.1 1.2 3.1 2.4 4.5 5.6 7.8 9.8 9.9-2.7-.4-5.2-1.5-7.3-3.4-2-1.8-3.4-4.2-4-6.8-1.7.2-3.3.5-4.8.9.5-6.2 4.6-10.4 10.8-10.4 2.3 0 4.5.6 6.3 1.6z"/></svg>
);
const LocationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const GovtIdIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
// --- End Icons ---


export default function Home() {
  const [featuredGoldsmiths, setFeaturedGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedGoldsmiths = async () => {
      setIsLoadingFeatured(true);
      setErrorFeatured(null);
      try {
        const allVerifiedGoldsmiths = await fetchAllGoldsmiths();
        
        // Removed the random shuffle to prevent hydration errors.
        // Simply take the first 4 results. For more variety, the server-side
        // fetch could be made to randomize, but this is safest for hydration.
        setFeaturedGoldsmiths(allVerifiedGoldsmiths.slice(0, 4));

      } catch (err) {
        console.error("Error fetching featured goldsmiths:", err);
        setErrorFeatured("Could not load featured artisans. Please try again later.");
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedGoldsmiths();
  }, []);


  const howItWorksSteps = [
    { icon: Search, title: "1. Discover & Inquire", description: "Browse verified goldsmith profiles. Submit an introduction or custom order request through our elegant platform." },
    { icon: ShieldCheck, title: "2. Verified Introduction", description: "Our team reviews your request, ensuring a secure and smooth process. We facilitate introductions and order details." },
    { icon: Gift, title: "3. Create & Cherish", description: "Collaborate with your chosen artisan. They craft your piece with passion, and you receive your dream jewelry." },
  ];

  const heroStats = [
    { icon: VerifiedIcon, value: "100% Verified", label: "Artisans" },
    { icon: GovtIdIcon, value: "Govt ID Verified", label: "Goldsmiths" },
  ];

  return (
    <>
      <div className="flex flex-col bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative w-full h-[75vh] min-h-[560px] max-h-[800px] flex items-center text-white overflow-hidden">
          {/* full-bleed image / overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero_image.png"
              alt="A skilled goldsmith meticulously crafting a piece of jewelry."
              fill
              className="object-cover w-full h-full"
              priority
              data-ai-hint="goldsmith artisan jewelry"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>

          {/* constrained content — consistent gutters */}
          <div className="relative z-10 site-inner">
            <div className="max-w-2xl text-left">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 text-shadow-md max-w-xl">
                Discover Local Goldsmiths, Craft Your Dreams.
              </h1>
              <p className="text-base md:text-lg text-gray-200 max-w-lg mb-6 text-shadow-sm font-poppins">
                Connect with skilled local artisans through a secure, mediated process. Let's bring your custom jewelry vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/discover"
                  className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-lg hover:shadow-xl transition-shadow rounded-full px-8 py-3 text-base")}
                >
                  <span>Find a Goldsmith</span>
                </Link>
                <Link
                  href="/goldsmith-portal"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    "shadow-lg hover:shadow-xl transition-shadow bg-white/90 text-primary border-transparent hover:bg-white rounded-full px-8 py-3 text-base"
                  )}
                >
                  <span>Join as a Goldsmith</span>
                </Link>
              </div>

              <div className="mt-10 flex gap-8 text-center">
                {heroStats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center justify-center">
                    <stat.icon className="w-6 h-6 mb-1 text-primary-foreground/80"/>
                    <p className="text-sm font-bold text-primary-foreground leading-none">{stat.value}</p>
                    <p className="text-xs text-primary-foreground/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-10 md:py-12 bg-background">
          <div className="site-inner">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8 md:mb-10">
              <div className="space-y-1.5">
                <div className="inline-block rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm font-poppins">How It Works</div>
                <h2 className="font-heading text-accent text-2xl sm:text-3xl">Your Secure Path to Custom Jewelry</h2>
                <p className="max-w-[800px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                  We connect you with talented goldsmiths through a secure and verified process, ensuring quality and trust.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:gap-6 lg:grid-cols-3 lg:max-w-none pt-4 md:pt-6">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="grid gap-1.5 text-center group p-4 rounded-xl bg-card hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 border border-transparent hover:border-primary/20">
                  <div className="flex justify-center items-center mb-2">
                    <div className="p-2.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-md">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-md font-heading text-accent">{step.title}</h3>
                  <p className="text-xs text-foreground/85 leading-relaxed font-poppins">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Goldsmiths Section */}
        <section className="w-full py-10 md:py-12 bg-gradient-to-b from-secondary/20 to-background">
          <div className="site-inner">
            <div className="space-y-2 mb-6 md:mb-8 text-center">
              <h2 className="font-heading text-accent text-2xl sm:text-3xl">Meet Our Talented Artisans</h2>
              <p className="max-w-[600px] mx-auto text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                Discover skilled goldsmiths ready to craft your next masterpiece.
              </p>
            </div>
            {isLoadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 pt-4 md:pt-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="bg-card border-border/10 rounded-xl overflow-hidden shadow-lg">
                    <Skeleton className="w-full aspect-[4/3]" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-9 w-full rounded-full mt-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : errorFeatured ? (
              <p className="text-destructive text-center">{errorFeatured}</p>
            ) : featuredGoldsmiths.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 pt-4 md:pt-5">
                {featuredGoldsmiths.map((goldsmith) => {
                  const isNew = goldsmith.registeredAt && differenceInDays(new Date(), new Date(goldsmith.registeredAt)) <= 15;
                  return (
                    <Card key={goldsmith.id} className="shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 bg-card border-primary/20 overflow-hidden group rounded-xl flex flex-col">
                      <CardHeader className="p-0 relative">
                        <Image
                          src={goldsmith.profileImageUrl || `https://placehold.co/400x300.png`}
                          alt={goldsmith.name || 'Featured Goldsmith'}
                          width={400}
                          height={300}
                          className="object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint="goldsmith artisan jewelry"
                        />
                         <div className="absolute top-2 right-2 flex items-center gap-1.5">
                           {isNew && (
                              <Badge variant="default" className="animate-pulse flex items-center gap-1 bg-primary text-primary-foreground">
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
                      <CardContent className="p-4 text-left space-y-1.5 flex-grow flex flex-col justify-between">
                        <div>
                          <CardTitle className="text-lg font-heading text-accent mb-1 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle>
                          <p className="flex items-center text-foreground/90 text-xs font-poppins mb-1.5">
                            <Gem className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : goldsmith.specialty}
                          </p>
                          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 font-poppins mb-2.5">
                            {goldsmith.shortBio || `A master of timeless designs and intricate details, located in ${goldsmith.state || 'their workshop'}.`}
                          </p>
                        </div>
                        <NextLink
                          href={`/goldsmith/${goldsmith.id}`}
                          className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary text-primary-foreground hover:bg-primary/90 mt-auto w-full rounded-full text-sm py-2 shadow-md hover:shadow-lg")}
                        >
                          <span>View Profile & Connect</span>
                        </NextLink>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
               <p className="text-muted-foreground font-poppins py-8 text-center">No featured artisans available at the moment. Please check back soon!</p>
            )}
            <div className="mt-8 md:mt-10 text-center">
              <Link
                href="/discover"
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground shadow-lg hover:shadow-xl transition-shadow rounded-full px-8 py-3 text-base")}
              >
                <span>Explore All Goldsmiths</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-10 md:py-12 border-t border-border/10 bg-background">
          <div className="site-inner">
            <div className="container mx-auto grid items-center justify-center gap-2 px-4 text-center md:px-6">
              <div className="space-y-2 mb-3 md:mb-4">
                 <Handshake className="h-8 w-8 mx-auto text-primary mb-1" />
                <h2 className="font-heading text-accent text-2xl sm:text-3xl">
                  Ready to Create or Connect?
                </h2>
                <p className="mx-auto max-w-[600px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                  Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-1">
                <Link
                  href="/discover"
                  className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm")}
                >
                  <span>Start Your Search <Search className="ml-1.5 h-4 w-4 inline" /></span>
                </Link>
                <Link
                  href="/goldsmith-portal/register"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2 text-sm")}
                >
                   <span>Register as a Goldsmith <User className="ml-1.5 h-4 w-4 inline" /></span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
