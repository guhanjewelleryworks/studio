// src/app/goldsmith/[id]/page.tsx
'use client';

import type { Goldsmith as GoldsmithProfile } from '@/types/goldsmith';
import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { MapPin, Star, MessageSquare, Send, ShieldCheck, Sparkles, Award, Eye, User, Edit3 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Added useToast import

interface PageParams {
  id: string;
}

const fetchGoldsmithProfile = async (id: string): Promise<GoldsmithProfile | null> => {
  console.log("Fetching profile for ID:", id);
  await new Promise(resolve => setTimeout(resolve, 700));

  const mockProfiles: { [key: string]: GoldsmithProfile } = {
      'artisan-1': { id: 'artisan-1', name: 'Lumière Jewels', tagline: "Crafting Brilliance, One Gem at a Time", address: '123 Diamond St, Cityville', specialty: ['Engagement Rings', 'Custom Designs', 'Ethically Sourced Gems'], rating: 4.9, bio: 'At Lumière Jewels, we believe every piece of jewelry tells a story. With over 20 years of experience, our master artisans dedicate themselves to crafting unique and timeless pieces that capture life\'s most precious moments. We specialize in bespoke engagement rings and fine jewelry, using only ethically sourced diamonds and gemstones to ensure beauty with a conscience.', profileImageUrl: 'https://picsum.photos/seed/lumiere-profile/120/120', portfolioImages: ['https://picsum.photos/seed/lumiere-work1/600/450', 'https://picsum.photos/seed/lumiere-work2/600/450', 'https://picsum.photos/seed/lumiere-work3/600/450'], yearsExperience: 22, certifications: ['GIA Graduate Gemologist'], responseTime: 'Within 24 hours', ordersCompleted: 150, location: { lat: 34.0522, lng: -118.2437 }, shortBio: 'Crafting timeless elegance with ethically sourced diamonds and gemstones.' },
      'artisan-2': { id: 'artisan-2', name: 'Aura & Gold', tagline: "Your Story, Forged in Gold", address: '456 Sapphire Ave, Townsville', specialty: ['Custom Pendants', 'Personalized Necklaces', 'Gold & Platinum'], rating: 4.7, bio: 'Aura & Gold blends modern design sensibilities with traditional goldsmithing techniques. We specialize in creating personalized pendants and necklaces that reflect your unique aura. Each piece is meticulously handcrafted to become a cherished extension of your identity.', profileImageUrl: 'https://picsum.photos/seed/aura-profile/120/120', portfolioImages: ['https://picsum.photos/seed/aura-work1/600/450', 'https://picsum.photos/seed/aura-work2/600/450'], yearsExperience: 15, responseTime: '1-2 business days', ordersCompleted: 85, location: { lat: 34.0530, lng: -118.2445 }, shortBio: 'Unique, handcrafted pendants that tell your personal story with artistry.' },
      'artisan-3': { id: 'artisan-3', name: 'Heritage Metalsmiths', tagline: "Preserving Legacies, Restoring Beauty", address: '789 Ruby Ln, Villagetown', specialty: ['Antique Restoration', 'Heirloom Redesign', 'Intricate Repairs'], rating: 4.8, bio: 'Heritage Metalsmiths is dedicated to the art of jewelry restoration and preservation. We are experts in bringing heirlooms and antique pieces back to their former glory, combining meticulous care with profound respect for craftsmanship of the past.', profileImageUrl: 'https://picsum.photos/seed/heritage-profile/120/120', portfolioImages: ['https://picsum.photos/seed/heritage-work1/600/450', 'https://picsum.photos/seed/heritage-work2/600/450', 'https://picsum.photos/seed/heritage-work3/600/450', 'https://picsum.photos/seed/heritage-work4/600/450'], yearsExperience: 30, certifications: ['Master Goldsmith Certification'], responseTime: 'Within 48 hours', ordersCompleted: 200, location: { lat: 34.0515, lng: -118.2430 }, shortBio: 'Preserving history through expert restoration of antique and heirloom jewelry.' },
       'default': { id: 'default', name: 'Example Goldsmith', tagline: "Artistry in Every Detail", address: '1 Example Rd, Sample City', specialty: ['General Craftsmanship', 'Fine Repairs'], rating: 4.2, bio: 'This is a sample profile for a talented goldsmith, showcasing a commitment to quality and artistry in every piece created or restored.', profileImageUrl: 'https://picsum.photos/seed/goldsmith-default-profile/120/120', portfolioImages: ['https://picsum.photos/seed/goldsmith-default-work1/600/450'], responseTime: 'Varies', ordersCompleted: 30, location: { lat: 34.0540, lng: -118.2450 }, shortBio: 'Elegant necklaces and bracelets designed to adorn and inspire.' }
  };

  return mockProfiles[id] || mockProfiles['default'];
};


// Make the component accept a promise for params
export default function GoldsmithProfilePage({ params }: { params: PageParams }) {
  const { id } = params; // Accessing id directly (adjust based on framework specifics if needed)

  const [profile, setProfile] = useState<GoldsmithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Initialize useToast

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
      <div className="container py-6 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-background text-foreground">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-5">
            <Skeleton className="h-32 w-32 rounded-full mx-auto bg-muted/70" />
            <Skeleton className="h-7 w-4/5 mx-auto bg-muted/70" />
            <Skeleton className="h-5 w-3/5 mx-auto bg-muted/70" />
            <Skeleton className="h-4 w-2/5 mx-auto bg-muted/70" />
            <Skeleton className="h-10 w-full rounded-full bg-muted/70" />
            <Skeleton className="h-10 w-full rounded-full bg-muted/60" />
          </div>
          <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-9 w-2/5 bg-muted/70" />
             <Skeleton className="h-20 w-full bg-muted/70" />
             <Skeleton className="h-9 w-1/3 bg-muted/70" />
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 <Skeleton className="h-40 w-full aspect-square rounded-lg bg-muted/70" />
                 <Skeleton className="h-40 w-full aspect-square rounded-lg bg-muted/70" />
                 <Skeleton className="h-40 w-full aspect-square rounded-lg bg-muted/70" />
             </div>
             <Skeleton className="h-9 w-1/3 bg-muted/70" />
              <Skeleton className="h-40 w-full rounded-lg bg-muted/70" />
          </div>
        </div>
      </div>
     );
  }

   if (error) {
     return <div className="container py-6 md:py-10 px-4 md:px-6 text-center text-destructive text-lg">{error}</div>;
   }

  if (!profile) {
    return <div className="container py-6 md:py-10 px-4 md:px-6 text-center text-muted-foreground text-lg">Profile not found.</div>;
  }

  const handleRequestIntroduction = (e: React.FormEvent) => {
     e.preventDefault();
     // Simulate admin mediation logic
     toast({
        title: 'Introduction Request Sent',
        description: 'Your request has been sent to an administrator for review and approval. You will be notified once confirmed.',
        duration: 5000,
      });
   };

   const handleRequestCustomOrder = () => {
    // Simulate admin mediation logic
     toast({
        title: 'Custom Order Request Submitted',
        description: 'Your custom order request has been submitted to an administrator for review. They will contact you or the goldsmith soon.',
        duration: 5000,
      });
   };


  return (
    <div className="container py-10 md:py-14 px-4 md:px-6 bg-background text-foreground">
        <Alert variant="default" className="mb-6 border-accent/50 text-accent-foreground bg-accent/10 rounded-lg p-3 shadow-sm"> {/* Reduced mb and p */}
          <ShieldCheck className="h-4 w-4 !text-accent mr-1.5" /> {/* Reduced mr */}
          <AlertTitle className="font-poppins font-semibold text-sm text-foreground">Secure & Mediated Connection</AlertTitle> {/* Changed to text-foreground */}
          <AlertDescription className="text-xs mt-0.5 text-muted-foreground">
            All initial communications and custom order requests are facilitated through Goldsmith Connect administrators.
          </AlertDescription>
        </Alert>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-1 space-y-5">
          <Card className="shadow-xl border-primary/15 rounded-xl overflow-hidden bg-card">
            <CardHeader className="items-center text-center bg-gradient-to-b from-card to-secondary/10 p-5">
              <Avatar className="w-28 h-28 mb-3 border-4 border-primary/50 shadow-lg">
                <AvatarImage src={profile.profileImageUrl} alt={profile.name} data-ai-hint="artisan portrait" />
                <AvatarFallback className="text-3xl bg-primary/20 text-primary-foreground font-poppins">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl text-accent">{profile.name}</CardTitle>
              {profile.tagline && <p className="text-xs text-primary font-medium font-poppins mt-0.5">{profile.tagline}</p>}
              <div className="flex items-center text-amber-500 mt-1">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" /> <span className="text-xs text-foreground font-poppins">{profile.rating.toFixed(1)}</span>
                 <span className="text-[0.65rem] text-muted-foreground ml-1">(Based on X reviews)</span>
              </div>
              <CardDescription className="flex items-center justify-center text-muted-foreground text-xs pt-1">
                <MapPin className="h-3 w-3 mr-0.5" /> {profile.address}
              </CardDescription>
               <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                    {Array.isArray(profile.specialty) ? profile.specialty.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-primary/10 text-primary text-[0.65rem] px-2 py-0.5 rounded-full shadow-sm font-poppins">{spec}</Badge>
                    )) : (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[0.65rem] px-2 py-0.5 rounded-full shadow-sm font-poppins">{profile.specialty}</Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 p-5">
               {profile.yearsExperience && (
                <div className="flex items-center text-xs text-foreground">
                    <Award className="h-3.5 w-3.5 mr-1.5 text-primary/70"/>
                    <span>{profile.yearsExperience} years of master craftsmanship</span>
                </div>
               )}
                {profile.certifications && profile.certifications.length > 0 && (
                    <div className="text-xs text-foreground">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary/70 inline"/>
                        Certifications: {profile.certifications.join(', ')}
                    </div>
                )}
                {profile.responseTime && (
                    <div className="flex items-center text-xs text-foreground">
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary/70"/>
                        <span>Responds: {profile.responseTime}</span>
                    </div>
                )}
                 {profile.ordersCompleted !== undefined && (
                    <div className="flex items-center text-xs text-foreground">
                        <Edit3 className="h-3.5 w-3.5 mr-1.5 text-primary/70"/>
                        <span>{profile.ordersCompleted}+ Orders Completed</span>
                    </div>
                )}
               <Button size="default" className="w-full shadow-md rounded-full text-xs py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-1.5" onClick={handleRequestCustomOrder}>
                  <Send className="mr-1.5 h-3.5 w-3.5"/> Request Custom Order
               </Button>
                <Button variant="outline" size="default" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full text-xs py-2.5 shadow-sm" onClick={handleRequestIntroduction}>
                  <User className="mr-1.5 h-3.5 w-3.5"/> Request Introduction
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-6">
            <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
                <CardHeader className="p-5">
                    <CardTitle className="text-lg text-accent">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                    {profile.bio && <p className="text-sm text-foreground/85 leading-normal whitespace-pre-line">{profile.bio}</p>}
                </CardContent>
            </Card>

          <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-5">
              <CardTitle className="text-lg text-accent">Portfolio Showcase</CardTitle>
               <CardDescription className="text-xs text-muted-foreground mt-0.5">A glimpse into the artisan&apos;s craft.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <Eye className="h-7 w-7 text-white/80"/>
                         </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6 text-sm">This artisan&apos;s portfolio is currently being curated. Check back soon!</p>
              )}
            </CardContent>
          </Card>

           <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-5">
              <CardTitle className="text-lg text-accent">Connect with {profile.name}</CardTitle>
               <CardDescription className="text-xs text-muted-foreground mt-0.5">Initiate a conversation or request a custom piece through our secure admin-mediated process.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form className="space-y-3.5" onSubmit={handleRequestIntroduction}> {/* Updated to handleRequestIntroduction, can be adjusted */}
                 {/* TODO: Add form handling with react-hook-form */}
                 <div className="space-y-1">
                    <Label htmlFor="contact-name" className="text-foreground text-xs font-medium">Your Name</Label>
                    <Input id="contact-name" placeholder="John Doe" required className="text-foreground text-sm py-2"/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-email" className="text-foreground text-xs font-medium">Your Email</Label>
                    <Input id="contact-email" type="email" placeholder="john.doe@example.com" required className="text-foreground text-sm py-2"/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-message" className="text-foreground text-xs font-medium">Your Inquiry / Project Idea</Label>
                    <Textarea id="contact-message" placeholder="Briefly explain your jewelry idea or why you'd like to connect..." required rows={3} className="text-foreground text-sm py-2"/>
                 </div>
                 <Button type="submit" size="default" className="shadow-md rounded-full text-xs py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="mr-1.5 h-3.5 w-3.5"/> Send Inquiry to Admin
                 </Button>
                 <p className="text-[0.65rem] text-muted-foreground pt-1.5">Your request will be reviewed by an administrator.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
