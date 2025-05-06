

'use client'

import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageSquare, Send, Info, ShieldCheck, Sparkles, Award, Eye, User, Edit3 } from "lucide-react"; 
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { GoldsmithIcon } from '@/components/icons/goldsmith-icon';


interface GoldsmithProfile {
  id: string;
  name: string;
  tagline: string;
  address: string;
  specialty: string[];
  rating: number;
  bio: string;
  profileImageUrl: string;
  portfolioImages: string[];
  yearsExperience?: number;
  certifications?: string[];
  responseTime?: string;
  ordersCompleted?: number;
}

interface PageParams {
  id: string;
}


const fetchGoldsmithProfile = async (id: string): Promise<GoldsmithProfile | null> => {
  console.log("Fetching profile for ID:", id);
  await new Promise(resolve => setTimeout(resolve, 700)); 

  const mockProfiles: { [key: string]: GoldsmithProfile } = {
      'artisan-1': { id: 'artisan-1', name: 'Lumière Jewels', tagline: "Crafting Brilliance, One Gem at a Time", address: '123 Diamond St, Cityville', specialty: ['Engagement Rings', 'Custom Designs', 'Ethically Sourced Gems'], rating: 4.9, bio: 'At Lumière Jewels, we believe every piece of jewelry tells a story. With over 20 years of experience, our master artisans dedicate themselves to crafting unique and timeless pieces that capture life\'s most precious moments. We specialize in bespoke engagement rings and fine jewelry, using only ethically sourced diamonds and gemstones to ensure beauty with a conscience.', profileImageUrl: 'https://picsum.photos/seed/lumiere-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/lumiere-p1/600/450', 'https://picsum.photos/seed/lumiere-p2/600/450', 'https://picsum.photos/seed/lumiere-p3/600/450'], yearsExperience: 22, certifications: ['GIA Graduate Gemologist'], responseTime: 'Within 24 hours', ordersCompleted: 150 },
      'artisan-2': { id: 'artisan-2', name: 'Aura & Gold', tagline: "Your Story, Forged in Gold", address: '456 Sapphire Ave, Townsville', specialty: ['Custom Pendants', 'Personalized Necklaces', 'Gold & Platinum'], rating: 4.7, bio: 'Aura & Gold blends modern design sensibilities with traditional goldsmithing techniques. We specialize in creating personalized pendants and necklaces that reflect your unique aura. Each piece is meticulously handcrafted to become a cherished extension of your identity.', profileImageUrl: 'https://picsum.photos/seed/aura-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/aura-p1/600/450', 'https://picsum.photos/seed/aura-p2/600/450'], yearsExperience: 15, responseTime: '1-2 business days', ordersCompleted: 85 },
      'artisan-3': { id: 'artisan-3', name: 'Heritage Metalsmiths', tagline: "Preserving Legacies, Restoring Beauty", address: '789 Ruby Ln, Villagetown', specialty: ['Antique Restoration', 'Heirloom Redesign', 'Intricate Repairs'], rating: 4.8, bio: 'Heritage Metalsmiths is dedicated to the art of jewelry restoration and preservation. We are experts in bringing heirlooms and antique pieces back to their former glory, combining meticulous care with profound respect for craftsmanship of the past.', profileImageUrl: 'https://picsum.photos/seed/heritage-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/heritage-p1/600/450', 'https://picsum.photos/seed/heritage-p2/600/450', 'https://picsum.photos/seed/heritage-p3/600/450', 'https://picsum.photos/seed/heritage-p4/600/450'], yearsExperience: 30, certifications: ['Master Goldsmith Certification'], responseTime: 'Within 48 hours', ordersCompleted: 200 },
       'default': { id: 'default', name: 'Example Goldsmith', tagline: "Artistry in Every Detail", address: '1 Example Rd, Sample City', specialty: ['General Craftsmanship', 'Fine Repairs'], rating: 4.2, bio: 'This is a sample profile for a talented goldsmith, showcasing a commitment to quality and artistry in every piece created or restored.', profileImageUrl: 'https://picsum.photos/seed/goldsmith-default-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/goldsmith-default-p1/600/450'], responseTime: 'Varies', ordersCompleted: 30 }
  };

  return mockProfiles[id] || mockProfiles['default'];
}

// Make the component accept a promise for params
export default function GoldsmithProfilePage({ params }: { params: PageParams }) {
  const id = React.use(params).id; 

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
      <div className="container py-6 px-4 md:px-6 min-h-[calc(100vh-7rem)]">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-1 space-y-4">
            <Skeleton className="h-28 w-28 rounded-full mx-auto bg-muted/70" />
            <Skeleton className="h-7 w-3/4 mx-auto bg-muted/70" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-muted/70" />
            <Skeleton className="h-3.5 w-1/3 mx-auto bg-muted/70" />
            <Skeleton className="h-9 w-full rounded-full bg-muted/70" />
            <Skeleton className="h-9 w-full rounded-full bg-muted/60" />
          </div>
          <div className="md:col-span-2 space-y-5">
             <Skeleton className="h-7 w-1/3 bg-muted/70" />
             <Skeleton className="h-16 w-full bg-muted/70" />
             <Skeleton className="h-7 w-1/4 bg-muted/70" />
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                 <Skeleton className="h-36 w-full aspect-[4/3] rounded-lg bg-muted/70" />
                 <Skeleton className="h-36 w-full aspect-[4/3] rounded-lg bg-muted/70" />
                 <Skeleton className="h-36 w-full aspect-[4/3] rounded-lg bg-muted/70" />
             </div>
             <Skeleton className="h-7 w-1/4 bg-muted/70" />
              <Skeleton className="h-36 w-full rounded-lg bg-muted/70" />
          </div>
        </div>
      </div>
     )
  }

   if (error) {
     return <div className="container py-6 px-4 md:px-6 text-center text-destructive text-md">{error}</div>;
   }

  if (!profile) {
    return <div className="container py-6 px-4 md:px-6 text-center text-muted-foreground text-md">Profile not found.</div>;
  }

  const handleRequestIntroduction = (e: React.FormEvent) => {
     e.preventDefault();
     alert("Introduction request sent to admin for approval. (Simulated)");
   }

   const handleRequestCustomOrder = () => {
     alert("Custom order request sent to admin for review. (Simulated)");
   }

  return (
    <div className="container py-6 px-4 md:px-6">
        <Alert variant="default" className="mb-5 border-accent/40 text-accent-foreground bg-accent/5 rounded-lg p-3.5">
          <ShieldCheck className="h-3.5 w-3.5 !text-accent mr-1.5" />
          <AlertTitle className="font-semibold text-xs">Secure & Mediated Connection</AlertTitle>
          <AlertDescription className="text-[0.7rem]">
            To ensure a high-quality and secure experience for both customers and artisans, all initial communications and custom order requests are facilitated through Goldsmith Connect administrators. Direct contact details are shared upon mutual agreement and project confirmation.
          </AlertDescription>
        </Alert>
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-xl border-primary/15 rounded-xl overflow-hidden">
            <CardHeader className="items-center text-center bg-gradient-to-b from-card to-secondary/5 p-5">
              <Avatar className="w-24 h-24 mb-2.5 border-3 border-primary/40 shadow-lg">
                <AvatarImage src={profile.profileImageUrl} alt={profile.name} data-ai-hint="artisan portrait" />
                <AvatarFallback className="text-2xl bg-primary/15 text-primary-foreground">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold text-primary-foreground">{profile.name}</CardTitle>
              <p className="text-[0.7rem] text-accent font-medium">{profile.tagline}</p>
              <div className="flex items-center text-amber-400 mt-0.5">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" /> <span className="text-xs">{profile.rating.toFixed(1)}</span>
                 <span className="text-[0.65rem] text-muted-foreground ml-1">(Based on X reviews)</span>
              </div>
              <CardDescription className="flex items-center justify-center text-muted-foreground text-[0.7rem] pt-0.5">
                <MapPin className="h-3 w-3 mr-0.5" /> {profile.address}
              </CardDescription>
               <div className="pt-1.5 flex flex-wrap justify-center gap-1">
                    {profile.specialty.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-primary/5 text-primary text-[0.65rem] px-1.5 py-0.5 rounded-full shadow-sm">{spec}</Badge>
                    ))}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3 p-4">
               {profile.yearsExperience && (
                <div className="flex items-center text-[0.7rem] text-foreground/80">
                    <Award className="h-3.5 w-3.5 mr-1 text-primary/70"/>
                    <span>{profile.yearsExperience} years of master craftsmanship</span>
                </div>
               )}
                {profile.certifications && profile.certifications.length > 0 && (
                    <div className="text-[0.7rem] text-foreground/80">
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-primary/70 inline"/>
                        Certifications: {profile.certifications.join(', ')}
                    </div>
                )}
                {profile.responseTime && (
                    <div className="flex items-center text-[0.7rem] text-foreground/80">
                        <MessageSquare className="h-3.5 w-3.5 mr-1 text-primary/70"/>
                        <span>Responds: {profile.responseTime}</span>
                    </div>
                )}
                 {profile.ordersCompleted !== undefined && (
                    <div className="flex items-center text-[0.7rem] text-foreground/80">
                        <Edit3 className="h-3.5 w-3.5 mr-1 text-primary/70"/>
                        <span>{profile.ordersCompleted}+ Orders Completed</span>
                    </div>
                )}
               <Button size="sm" className="w-full shadow-md rounded-full text-xs py-2 bg-primary hover:bg-primary/90" onClick={handleRequestCustomOrder}>
                  <Send className="mr-1.5 h-3 w-3"/> Request Custom Order
               </Button>
                <Button variant="outline" size="sm" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full text-xs py-2 shadow-sm" onClick={handleRequestIntroduction}>
                  <User className="mr-1.5 h-3 w-3"/> Request Introduction
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-5">
            <Card className="shadow-xl border-primary/5 rounded-xl">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold text-primary-foreground">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{profile.bio}</p>
                </CardContent>
            </Card>

          <Card className="shadow-xl border-primary/5 rounded-xl">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-primary-foreground">Portfolio Showcase</CardTitle>
               <CardDescription className="text-xs text-foreground/70">A glimpse into the artisan&apos;s craft.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {profile.portfolioImages.map((imgUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md aspect-[4/3] group relative">
                        <Image
                          src={imgUrl}
                          alt={`Portfolio image ${index + 1} for ${profile.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                          data-ai-hint="luxury jewelry photography"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white/80"/>
                         </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-5 text-sm">This artisan&apos;s portfolio is currently being curated. Check back soon!</p>
              )}
            </CardContent>
          </Card>

           <Card className="shadow-xl border-primary/5 rounded-xl">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-primary-foreground">Connect with {profile.name}</CardTitle>
               <CardDescription className="text-xs text-foreground/70">Initiate a conversation or request a custom piece through our secure admin-mediated process.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form className="space-y-3.5" onSubmit={handleRequestIntroduction}>
                {/* TODO: Add form handling with react-hook-form */}
                 <div className="space-y-1">
                    <Label htmlFor="contact-name">Your Name</Label>
                    <Input id="contact-name" placeholder="John Doe" required/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-email">Your Email</Label>
                    <Input id="contact-email" type="email" placeholder="john.doe@example.com" required/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-message">Your Inquiry / Project Idea</Label>
                    <Textarea id="contact-message" placeholder="Briefly explain your jewelry idea or why you'd like to connect..." required rows={3}/>
                 </div>
                 <Button type="submit" size="sm" className="shadow-md rounded-full text-xs py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="mr-1.5 h-3 w-3"/> Send Inquiry to Admin
                 </Button>
                 <p className="text-[0.7rem] text-muted-foreground pt-1">Your request will be reviewed by an administrator before contact is established with the artisan.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
