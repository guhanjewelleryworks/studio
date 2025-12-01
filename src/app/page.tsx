// src/app/page.tsx
'use client'; 

import type { Goldsmith } from '@/types/goldsmith'; 
import type { SVGProps } from 'react';
import Link from 'next/link';
import NextLink from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShieldCheck, Gift, MapPin, UserCheck, Handshake, Gem, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fetchAllGoldsmiths } from '@/actions/goldsmith-actions'; 
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { usePathname } from 'next/navigation';

// Subtle pattern for hero section
const HeroPattern = () => (
  <div className="absolute inset-0 opacity-[0.02] [mask-image:radial-gradient(farthest-side_at_top_left,white,transparent)]">
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern
          id="hero-pattern"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <path d="M0 80L80 0ZM80 80L0 0Z" className="stroke-primary/30 fill-none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-pattern)" />
    </svg>
  </div>
);


export default function Home() {
  const [featuredGoldsmiths, setFeaturedGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadFeaturedGoldsmiths = async () => {
      setIsLoadingFeatured(true);
      setErrorFeatured(null);
      try {
        const allVerifiedGoldsmiths = await fetchAllGoldsmiths();
        
        // --- Shuffle Algorithm (Fisher-Yates) ---
        let currentIndex = allVerifiedGoldsmiths.length;
        let randomIndex;
        const shuffledGoldsmiths = [...allVerifiedGoldsmiths]; // Create a copy to shuffle

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [shuffledGoldsmiths[currentIndex], shuffledGoldsmiths[randomIndex]] = [
            shuffledGoldsmiths[randomIndex], shuffledGoldsmiths[currentIndex]];
        }
        // --- End of Shuffle ---

        setFeaturedGoldsmiths(shuffledGoldsmiths.slice(0, 4));

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
    { icon: ShieldCheck, title: "2. Admin Mediation", description: "Our team reviews your request, ensuring a secure and smooth process. We facilitate introductions and order details." },
    { icon: Gift, title: "3. Create & Cherish", description: "Collaborate with your chosen artisan. They craft your piece with passion, and you receive your dream jewelry." },
  ];

  return (
    <>
      <div className="flex flex-col items-center bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative w-full py-10 md:py-16 lg:py-20 bg-gradient-to-br from-secondary/10 via-background to-background overflow-hidden">
          <HeroPattern />
          <div className="container max-w-screen-xl px-4 md:px-6 relative z-10 mx-auto">
            <div className="grid gap-6 lg:grid-cols-5 lg:gap-12 lg:items-center">
              <div className="lg:col-span-3 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
                
                <div className="space-y-2">
                  <h1 className="font-heading text-accent leading-tight text-3xl sm:text-4xl xl:text-5xl/none">
                    Discover Local Goldsmiths,
                    <br />
                    <span className="text-primary">Craft Your Dreams.</span>
                  </h1>
                  <p className="max-w-[600px] text-foreground/85 md:text-lg leading-relaxed font-poppins">
                    Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
                  <Link
                    href="/discover"
                    className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2.5 text-base")}
                  >
                    <span>Find a Goldsmith <MapPin className="ml-1.5 h-4 w-4 inline" /></span>
                  </Link>
                  <Link
                    href="/goldsmith-portal"
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2.5 text-base")}
                  >
                     <span>Join as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span>
                  </Link>
                </div>
              </div>
             <div className="relative mx-auto aspect-[6/5] w-full lg:col-span-2 group rounded-xl shadow-xl overflow-hidden border-2 border-primary/10">
              <Image
                src="/images/my-hero-image.png"
                alt="Goldsmith at work bench crafting a piece of jewelry"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 550px"
                data-ai-hint="jewelry hero background"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-black/5 to-black/20 pointer-events-none group-hover:bg-black/5 transition-colors"></div>
            </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-10 md:py-16 lg:py-20 bg-background">
          <div className="container max-w-screen-xl px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8 md:mb-10">
              <div className="space-y-1.5">
                <div className="inline-block rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm font-poppins">How It Works</div>
                <h2 className="font-heading text-accent text-2xl sm:text-3xl">Your Secure Path to Custom Jewelry</h2>
                <p className="max-w-[800px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                  We connect you with talented goldsmiths through a verified and mediated process, ensuring quality and trust.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-5 md:gap-6 lg:grid-cols-3 lg:max-w-none pt-4 md:pt-6">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="grid gap-1.5 text-center group p-4 rounded-xl bg-card hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary/20">
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
        <section className="w-full py-10 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container max-w-screen-xl px-4 md:px-6 mx-auto">
            <div className="space-y-2 mb-6 md:mb-8 text-center">
              <h2 className="font-heading text-accent text-2xl sm:text-3xl">Meet Our Talented Artisans</h2>
              <p className="mx-auto max-w-[600px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                Discover skilled goldsmiths ready to craft your next masterpiece.
              </p>
            </div>
            {isLoadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 pt-4 md:pt-5">
                {Array.from({ length: 4 }).map((_, index) => (
                   <Card key={index} className="animate-pulse bg-card/80 rounded-xl shadow-lg border-border h-[420px]"></Card>
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
                          src={goldsmith.imageUrl || `https://placehold.co/400x300.png`}
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
        <section className="w-full pt-12 pb-16 border-t border-border/10 bg-gradient-to-t from-secondary/10 to-background">
          <div className="container max-w-screen-xl grid items-center justify-center gap-2 px-4 text-center md:px-6 mx-auto">
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
                 <span>Register as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
