// src/app/goldsmith/[id]/page.tsx
'use client';

import type { Goldsmith as GoldsmithProfile } from '@/types/goldsmith';
import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { MapPin, Star, MessageSquare, Send, Info, ShieldCheck, Sparkles, Award, Eye, User, Edit3 } from "lucide-react"; 
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';


interface PageParams {
  id: string;
}


const fetchGoldsmithProfile = async (id: string): Promise<GoldsmithProfile | null> => {
  console.log("Fetching profile for ID:", id);
  await new Promise(resolve => setTimeout(resolve, 700)); 

  const mockProfiles: { [key: string]: GoldsmithProfile } = {
      'artisan-1': { id: 'artisan-1', name: 'Lumière Jewels', tagline: "Crafting Brilliance, One Gem at a Time", address: '123 Diamond St, Cityville', specialty: ['Engagement Rings', 'Custom Designs', 'Ethically Sourced Gems'], rating: 4.9, bio: 'At Lumière Jewels, we believe every piece of jewelry tells a story. With over 20 years of experience, our master artisans dedicate themselves to crafting unique and timeless pieces that capture life\'s most precious moments. We specialize in bespoke engagement rings and fine jewelry, using only ethically sourced diamonds and gemstones to ensure beauty with a conscience.', profileImageUrl: 'https://picsum.photos/seed/lumiere-profile/120/120', portfolioImages: ['https://picsum.photos/seed/lumiere-work1/600/450', 'https://picsum.photos/seed/lumiere-work2/600/450', 'https://picsum.photos/seed/lumiere-work3/600/450'], yearsExperience: 22, certifications: ['GIA Graduate Gemologist'], responseTime: 'Within 24 hours', ordersCompleted: 150, location: { lat: 34.0522, lng: -118.2437 } },
      'artisan-2': { id: 'artisan-2', name: 'Aura & Gold', tagline: "Your Story, Forged in Gold", address: '456 Sapphire Ave, Townsville', specialty: ['Custom Pendants', 'Personalized Necklaces', 'Gold & Platinum'], rating: 4.7, bio: 'Aura & Gold blends modern design sensibilities with traditional goldsmithing techniques. We specialize in creating personalized pendants and necklaces that reflect your unique aura. Each piece is meticulously handcrafted to become a cherished extension of your identity.', profileImageUrl: 'https://picsum.photos/seed/aura-profile/120/120', portfolioImages: ['https://picsum.photos/seed/aura-work1/600/450', 'https://picsum.photos/seed/aura-work2/600/450'], yearsExperience: 15, responseTime: '1-2 business days', ordersCompleted: 85, location: { lat: 34.0530, lng: -118.2445 } },
      'artisan-3': { id: 'artisan-3', name: 'Heritage Metalsmiths', tagline: "Preserving Legacies, Restoring Beauty", address: '789 Ruby Ln, Villagetown', specialty: ['Antique Restoration', 'Heirloom Redesign', 'Intricate Repairs'], rating: 4.8, bio: 'Heritage Metalsmiths is dedicated to the art of jewelry restoration and preservation. We are experts in bringing heirlooms and antique pieces back to their former glory, combining meticulous care with profound respect for craftsmanship of the past.', profileImageUrl: 'https://picsum.photos/seed/heritage-profile/120/120', portfolioImages: ['https://picsum.photos/seed/heritage-work1/600/450', 'https://picsum.photos/seed/heritage-work2/600/450', 'https://picsum.photos/seed/heritage-work3/600/450', 'https://picsum.photos/seed/heritage-work4/600/450'], yearsExperience: 30, certifications: ['Master Goldsmith Certification'], responseTime: 'Within 48 hours', ordersCompleted: 200, location: { lat: 34.0515, lng: -118.2430 } },
       'default': { id: 'default', name: 'Example Goldsmith', tagline: "Artistry in Every Detail", address: '1 Example Rd, Sample City', specialty: ['General Craftsmanship', 'Fine Repairs'], rating: 4.2, bio: 'This is a sample profile for a talented goldsmith, showcasing a commitment to quality and artistry in every piece created or restored.', profileImageUrl: 'https://picsum.photos/seed/goldsmith-default-profile/120/120', portfolioImages: ['https://picsum.photos/seed/goldsmith-default-work1/600/450'], responseTime: 'Varies', ordersCompleted: 30, location: { lat: 34.0540, lng: -118.2450 } }
  };

  return mockProfiles[id] || mockProfiles['default'];
}

// Make the component accept a promise for params
export default function GoldsmithProfilePage({ params: paramsProp }: { params: PageParams }) {
  const params = use(Promise.resolve(paramsProp)); // Ensure params are resolved
  const { id } = params; // Accessing id directly (adjust based on framework specifics if needed)

  const [profile, setProfile] = useState<GoldsmithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const loadProfile = async () => {
      if (!id) { 
        setError("Goldsmith ID not found in URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProfile = await fetchGoldsmithProfile(id);
        if (fetchedProfile) {
          setProfile(fetchedProfile);
        } else {
          setError("Goldsmith profile not found.");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load goldsmith profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id]);


  if (isLoading) {
     return (
      <div className="container py-10 md:py-14 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-background text-foreground">
        <div className="grid md:grid-cols-3 gap-8"> {/* Increased gap */}
          <div className="md:col-span-1 space-y-6"> {/* Increased space-y */}
            <Skeleton className="h-36 w-36 rounded-full mx-auto bg-muted/70" /> {/* Increased size */}
            <Skeleton className="h-8 w-4/5 mx-auto bg-muted/70" />
            <Skeleton className="h-6 w-3/5 mx-auto bg-muted/70" /> {/* Increased h */}
            <Skeleton className="h-5 w-2/5 mx-auto bg-muted/70" /> {/* Increased h */}
            <Skeleton className="h-12 w-full rounded-full bg-muted/70" /> {/* Increased h */}
            <Skeleton className="h-12 w-full rounded-full bg-muted/60" /> {/* Increased h */}
          </div>
          <div className="md:col-span-2 space-y-8"> {/* Increased space-y */}
             <Skeleton className="h-10 w-2/5 bg-muted/70" /> {/* Increased h */}
             <Skeleton className="h-24 w-full bg-muted/70" /> {/* Increased h */}
             <Skeleton className="h-10 w-1/3 bg-muted/70" /> {/* Increased h */}
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Increased gap */}
                 <Skeleton className="h-48 w-full aspect-square rounded-lg bg-muted/70" /> {/* Increased h */}
                 <Skeleton className="h-48 w-full aspect-square rounded-lg bg-muted/70" /> {/* Increased h */}
                 <Skeleton className="h-48 w-full aspect-square rounded-lg bg-muted/70" /> {/* Increased h */}
             </div>
             <Skeleton className="h-10 w-1/3 bg-muted/70" /> {/* Increased h */}
              <Skeleton className="h-48 w-full rounded-lg bg-muted/70" /> {/* Increased h */}
          </div>
        </div>
      </div>
     )
  }

   if (error) {
     return <div className="container py-10 md:py-14 px-4 md:px-6 text-center text-destructive text-lg">{error}</div>;
   }

  if (!profile) {
    return <div className="container py-10 md:py-14 px-4 md:px-6 text-center text-muted-foreground text-lg">Profile not found.</div>;
  }

  const handleRequestIntroduction = (e: React.FormEvent) => {
     e.preventDefault();
     alert("Introduction request sent to admin for approval. (Simulated)");
   }

   const handleRequestCustomOrder = () => {
     alert("Custom order request sent to admin for review. (Simulated)");
   }

  return (
    <div className="container py-10 md:py-14 px-4 md:px-6 bg-background text-foreground">
        <Alert variant="default" className="mb-8 border-accent/50 text-accent-foreground bg-accent/10 rounded-lg p-4 shadow-sm"> {/* Increased mb */}
          <ShieldCheck className="h-4 w-4 !text-accent mr-2" />
          <AlertTitle className="font-poppins font-semibold text-sm text-foreground">Secure & Mediated Connection</AlertTitle>
          <AlertDescription className="text-xs mt-0.5 text-muted-foreground">
            To ensure a high-quality and secure experience for both customers and artisans, all initial communications and custom order requests are facilitated through Goldsmith Connect administrators. Direct contact details are shared upon mutual agreement and project confirmation.
          </AlertDescription>
        </Alert>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10"> {/* Increased gap */}
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-1 space-y-6"> {/* Increased space-y */}
          <Card className="shadow-xl border-primary/15 rounded-xl overflow-hidden bg-card">
            <CardHeader className="items-center text-center bg-gradient-to-b from-card to-secondary/10 p-6">
              <Avatar className="w-32 h-32 mb-3.5 border-4 border-primary/50 shadow-lg"> {/* Increased size and mb */}
                <AvatarImage src={profile.profileImageUrl} alt={profile.name} data-ai-hint="artisan portrait" />
                <AvatarFallback className="text-4xl bg-primary/20 text-primary-foreground font-poppins">{profile.name.charAt(0)}</AvatarFallback> {/* Increased text size */}
              </Avatar>
              <CardTitle className="text-2xl text-foreground">{profile.name}</CardTitle>
              {profile.tagline && <p className="text-sm text-primary font-medium font-poppins mt-0.5">{profile.tagline}</p>} {/* Added mt */}
              <div className="flex items-center text-amber-500 mt-1.5"> {/* Increased mt */}
                <Star className="h-4 w-4 mr-1.5 fill-current" /> <span className="text-sm text-foreground font-poppins">{profile.rating.toFixed(1)}</span>
                 <span className="text-xs text-muted-foreground ml-1.5">(Based on X reviews)</span>
              </div>
              <CardDescription className="flex items-center justify-center text-muted-foreground text-sm pt-1.5"> {/* Increased pt */}
                <MapPin className="h-3.5 w-3.5 mr-1" /> {profile.address}
              </CardDescription>
               <div className="pt-2.5 flex flex-wrap justify-center gap-2"> {/* Increased pt and gap */}
                    {Array.isArray(profile.specialty) ? profile.specialty.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full shadow-sm font-poppins">{spec}</Badge> /* Increased px/py */
                    )) : (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full shadow-sm font-poppins">{profile.specialty}</Badge> /* Increased px/py */
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4 p-6"> {/* Increased space-y and p */}
               {profile.yearsExperience && (
                <div className="flex items-center text-sm text-foreground">
                    <Award className="h-4 w-4 mr-2 text-primary/70"/> {/* Increased mr */}
                    <span>{profile.yearsExperience} years of master craftsmanship</span>
                </div>
               )}
                {profile.certifications && profile.certifications.length > 0 && (
                    <div className="text-sm text-foreground">
                        <Sparkles className="h-4 w-4 mr-2 text-primary/70 inline"/> {/* Increased mr */}
                        Certifications: {profile.certifications.join(', ')}
                    </div>
                )}
                {profile.responseTime && (
                    <div className="flex items-center text-sm text-foreground">
                        <MessageSquare className="h-4 w-4 mr-2 text-primary/70"/> {/* Increased mr */}
                        <span>Responds: {profile.responseTime}</span>
                    </div>
                )}
                 {profile.ordersCompleted !== undefined && (
                    <div className="flex items-center text-sm text-foreground">
                        <Edit3 className="h-4 w-4 mr-2 text-primary/70"/> {/* Increased mr */}
                        <span>{profile.ordersCompleted}+ Orders Completed</span>
                    </div>
                )}
               <Button size="lg" className="w-full shadow-md rounded-full text-sm py-3 bg-primary hover:bg-primary/90 text-primary-foreground mt-2" onClick={handleRequestCustomOrder}> {/* Increased py and mt */}
                  <Send className="mr-2 h-4 w-4"/> Request Custom Order {/* Increased icon size */}
               </Button>
                <Button variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full text-sm py-3 shadow-sm" onClick={handleRequestIntroduction}> {/* Increased py */}
                  <User className="mr-2 h-4 w-4"/> Request Introduction {/* Increased icon size */}
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-8"> {/* Increased space-y */}
            <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
                <CardHeader className="p-6"> {/* Increased p */}
                    <CardTitle className="text-xl text-foreground">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0"> {/* Increased p */}
                    {profile.bio && <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">{profile.bio}</p>}
                </CardContent>
            </Card>

          <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-6"> {/* Increased p */}
              <CardTitle className="text-xl text-foreground">Portfolio Showcase</CardTitle>
               <CardDescription className="text-sm text-muted-foreground mt-1">A glimpse into the artisan&apos;s craft.</CardDescription> {/* Increased mt */}
            </CardHeader>
            <CardContent className="p-6 pt-0"> {/* Increased p */}
              {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolioImages.map((imgUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md aspect-square group relative">
                        <Image
                          src={imgUrl}
                          alt={`Portfolio image ${index + 1} for ${profile.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                          data-ai-hint="luxury jewelry photography"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white/80"/> {/* Increased icon size */}
                         </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8 text-base">This artisan&apos;s portfolio is currently being curated. Check back soon!</p> {/* Increased py */}
              )}
            </CardContent>
          </Card>

           <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-6"> {/* Increased p */}
              <CardTitle className="text-xl text-foreground">Connect with {profile.name}</CardTitle>
               <CardDescription className="text-sm text-muted-foreground mt-1">Initiate a conversation or request a custom piece through our secure admin-mediated process.</CardDescription> {/* Increased mt */}
            </CardHeader>
            <CardContent className="p-6 pt-0"> {/* Increased p */}
              <form className="space-y-5" onSubmit={handleRequestIntroduction}> {/* Increased space-y */}
                 {/* TODO: Add form handling with react-hook-form */}
                 <div className="space-y-1.5"> {/* Ensured consistent spacing */}
                    <Label htmlFor="contact-name" className="text-foreground">Your Name</Label>
                    <Input id="contact-name" placeholder="John Doe" required className="text-foreground"/>
                 </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-foreground">Your Email</Label>
                    <Input id="contact-email" type="email" placeholder="john.doe@example.com" required className="text-foreground"/>
                 </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className="text-foreground">Your Inquiry / Project Idea</Label>
                    <Textarea id="contact-message" placeholder="Briefly explain your jewelry idea or why you'd like to connect..." required rows={4} className="text-foreground"/>
                 </div>
                 <Button type="submit" size="lg" className="shadow-md rounded-full text-sm py-3 bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Increased py */}
                    <Send className="mr-2 h-4 w-4"/> Send Inquiry to Admin
                 </Button>
                 <p className="text-xs text-muted-foreground pt-2">Your request will be reviewed by an administrator before contact is established with the artisan.</p> {/* Increased pt */}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
