// src/app/page.tsx
'use client'; // Make this a client component to fetch data

import type { Goldsmith } from '@/types/goldsmith'; // Import Goldsmith type
import type { SVGProps } from 'react';
import Link from 'next/link';
import NextLink from 'next/link'; // Ensure NextLink (aliased Link) is imported
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShieldCheck, Gift, MapPin, UserCheck, Handshake, Gem, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MetalPricesWidget } from '@/components/metal-prices-widget';
import { fetchAllGoldsmiths } from '@/actions/goldsmith-actions'; // Import the server action
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const loadFeaturedGoldsmiths = async () => {
      setIsLoadingFeatured(true);
      setErrorFeatured(null);
      try {
        const allVerifiedGoldsmiths = await fetchAllGoldsmiths();
        setFeaturedGoldsmiths(allVerifiedGoldsmiths.slice(0, 3));
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
    <> {/* Changed from React.Fragment to shorthand fragment */}
      <div className="flex flex-col items-center bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative w-full py-10 md:py-12 lg:py-14 bg-gradient-to-br from-secondary/10 via-background to-background overflow-hidden"> {/* Reduced py */}
          <HeroPattern />
          <div className="container max-w-screen-xl px-4 md:px-6 relative z-10">
            <div className="grid gap-4 lg:grid-cols-[1fr_500px] lg:gap-6 xl:grid-cols-[1fr_550px] items-start"> {/* Changed items-center to items-start */}
              <div className="flex flex-col justify-start space-y-4"> {/* Adjusted space-y from 3 to 4 */}
                <div className="self-start lg:self-auto">
                   <MetalPricesWidget />
                </div>
                <div className="space-y-1.5"> {/* Reduced space-y */}
                  <h1 className="font-heading text-accent leading-tight text-3xl sm:text-4xl xl:text-5xl/none"> {/* Use text-accent */}
                    Discover Local Goldsmiths,
                    <br />
                    <span className="text-primary">Craft Your Dreams.</span>
                  </h1>
                  <p className="max-w-[600px] text-foreground/85 md:text-lg leading-relaxed font-poppins"> {/* Adjusted text-foreground/75 to text-foreground/85 and added font-poppins */}
                    Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-1">
                  <Link
                    href="/discover"
                    className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2.5 text-base")}  /* Adjusted text size to base */
                  >
                    <span>Find a Goldsmith <MapPin className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
                  </Link>
                  <Link
                    href="/goldsmith-portal"
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2.5 text-base")}  /* Adjusted text size and hover:text-primary-foreground */
                  >
                     <span>Join as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
                  </Link>
                </div>
              </div>
             <div className="relative mx-auto aspect-[6/5] w-full lg:order-last group rounded-xl shadow-xl overflow-hidden border-2 border-primary/10">
              <Image
                src="/images/my-hero-image.png"
                alt="Placeholder image for hero section jewelry"
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
        <section id="how-it-works" className="w-full py-10 md:py-12 lg:py-14 bg-background"> {/* Reduced py */}
          <div className="container max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6 md:mb-8"> {/* Reduced mb */}
              <div className="space-y-1"> {/* Reduced space-y */}
                <div className="inline-block rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm font-poppins">How It Works</div>
                <h2 className="font-heading text-accent text-2xl sm:text-3xl">Your Secure Path to Custom Jewelry</h2> {/* Use text-accent */}
                <p className="max-w-[800px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins"> {/* Adjusted text size and text-foreground/70 to 85 and added font-poppins */}
                  We connect you with talented goldsmiths through a verified and mediated process, ensuring quality and trust.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-4 md:gap-5 lg:grid-cols-3 lg:max-w-none pt-4 md:pt-6"> {/* Reduced gap and pt */}
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="grid gap-1 text-center group p-3 rounded-xl bg-card hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary/20">
                  <div className="flex justify-center items-center mb-1.5"> {/* Reduced mb */}
                    <div className="p-2 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-md">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-md font-heading text-accent">{step.title}</h3> {/* Use text-accent */}
                  <p className="text-xs text-foreground/85 leading-relaxed font-poppins">{step.description}</p> {/* Adjusted text-foreground/70 to 85 and added font-poppins */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Goldsmiths Section */}
        <section className="w-full py-10 md:py-12 lg:py-14 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container max-w-screen-xl grid items-center justify-center gap-3 px-4 text-center md:px-6">
            <div className="space-y-1.5 mb-4 md:mb-6">
              <h2 className="font-heading text-accent text-2xl sm:text-3xl">Meet Our Talented Artisans</h2>
              <p className="mx-auto max-w-[600px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins">
                Discover skilled goldsmiths ready to craft your next masterpiece.
              </p>
            </div>
            {isLoadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pt-4 md:pt-5"> {/* Adjusted gap and pt */}
                {Array.from({ length: 3 }).map((_, index) => (
                   <Card key={index} className="animate-pulse bg-card/80 rounded-xl shadow-lg border-border h-[420px]"></Card> /* Adjusted height and styling */
                ))}
              </div>
            ) : errorFeatured ? (
              <p className="text-destructive">{errorFeatured}</p>
            ) : featuredGoldsmiths.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pt-4 md:pt-5"> {/* Adjusted gap and pt */}
                {featuredGoldsmiths.map((goldsmith) => (
                  <Card key={goldsmith.id} className="shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 bg-card border-primary/20 overflow-hidden group rounded-xl flex flex-col"> {/* Adjusted border and shadow */}
                    <CardHeader className="p-0 relative">
                      <Image
                        src={goldsmith.imageUrl || `https://placehold.co/400x300.png`} // fallback to placeholder
                        alt={goldsmith.name || 'Featured Goldsmith'} // fallback alt
                        width={400}
                        height={300} // Adjusted for 4:3 ratio
                        className="object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint="goldsmith artisan jewelry" // More generic hint
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"> {/* Adjusted padding */}
                        <h3 className="text-xl font-heading text-primary-foreground drop-shadow-md">{goldsmith.name}</h3> {/* Added drop-shadow */}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 text-left space-y-1.5 flex-grow flex flex-col justify-between"> {/* Adjusted padding and space */}
                      <div>
                        <CardTitle className="text-lg font-heading text-accent mb-1 group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle>
                        <p className="flex items-center text-foreground/90 text-xs font-poppins mb-1.5"> {/* Adjusted margin and text color */}
                           <Gem className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />  {/* Changed icon to Gem */}
                           {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : goldsmith.specialty}
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 font-poppins mb-2.5"> {/* Adjusted line-clamp, leading and margin */}
                          {goldsmith.shortBio || `A master of timeless designs and intricate details, located in ${goldsmith.address || 'their workshop'}.`}
                        </p>
                      </div>
                      <NextLink
                        href={`/goldsmith/${goldsmith.id}`}
                        className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary text-primary-foreground hover:bg-primary/90 mt-auto w-full rounded-full text-sm py-2 shadow-md hover:shadow-lg")} // Adjusted size, variant, padding and added shadow
                      >
                        <span>View Profile & Connect</span>
                      </NextLink>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
               <p className="text-muted-foreground font-poppins py-8">No featured artisans available at the moment. Please check back soon!</p> /* Adjusted padding */
            )}
            <div className="mt-8 md:mt-10"> {/* Adjusted margin */}
              <Link
                href="/discover"
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground shadow-lg hover:shadow-xl transition-shadow rounded-full px-8 py-3 text-base")} // Adjusted padding and shadow
              >
                <span>Explore All Goldsmiths</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-10 md:py-12 lg:py-14 border-t border-border/10 bg-gradient-to-t from-secondary/10 to-background"> {/* Reduced py and border */}
          <div className="container max-w-screen-xl grid items-center justify-center gap-2 px-4 text-center md:px-6"> {/* Reduced gap */}
            <div className="space-y-1 mb-2 md:mb-3"> {/* Reduced space-y and mb */}
               <Handshake className="h-7 w-7 mx-auto text-primary mb-0.5" /> {/* Reduced size and mb */}
              <h2 className="font-heading text-accent text-2xl sm:text-3xl"> {/* Use text-accent */}
                Ready to Create or Connect?
              </h2>
              <p className="mx-auto max-w-[600px] text-foreground/85 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed font-poppins"> {/* Adjusted text size and text-foreground/70 to 85 and added font-poppins */}
                Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-0.5"> {/* Reduced pt */}
              <Link
                href="/discover"
                className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm")} /* Adjusted text size */
              >
                <span>Start Your Search <Search className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
              </Link>
              <Link
                href="/goldsmith-portal/register"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2 text-sm")} /* Adjusted text size and hover:text-primary-foreground */
              >
                 <span>Register as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
