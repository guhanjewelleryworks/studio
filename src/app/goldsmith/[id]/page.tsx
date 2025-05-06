
'use client'

import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageSquare, Send, Info, ShieldCheck, Sparkles, Award } from "lucide-react";
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
}

interface PageParams {
  id: string;
}


const fetchGoldsmithProfile = async (id: string): Promise<GoldsmithProfile | null> => {
  console.log("Fetching profile for ID:", id);
  await new Promise(resolve => setTimeout(resolve, 800)); // Slightly reduced delay

  const mockProfiles: { [key: string]: GoldsmithProfile } = {
      'artisan-1': { id: 'artisan-1', name: 'Lumière Jewels', tagline: "Crafting Brilliance, One Gem at a Time", address: '123 Diamond St, Cityville', specialty: ['Engagement Rings', 'Custom Designs', 'Ethically Sourced Gems'], rating: 4.9, bio: 'At Lumière Jewels, we believe every piece of jewelry tells a story. With over 20 years of experience, our master artisans dedicate themselves to crafting unique and timeless pieces that capture life\'s most precious moments. We specialize in bespoke engagement rings and fine jewelry, using only ethically sourced diamonds and gemstones to ensure beauty with a conscience.', profileImageUrl: 'https://picsum.photos/seed/lumiere-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/lumiere-p1/600/450', 'https://picsum.photos/seed/lumiere-p2/600/450', 'https://picsum.photos/seed/lumiere-p3/600/450'], yearsExperience: 22, certifications: ['GIA Graduate Gemologist'] },
      'artisan-2': { id: 'artisan-2', name: 'Aura & Gold', tagline: "Your Story, Forged in Gold", address: '456 Sapphire Ave, Townsville', specialty: ['Custom Pendants', 'Personalized Necklaces', 'Gold & Platinum'], rating: 4.7, bio: 'Aura & Gold blends modern design sensibilities with traditional goldsmithing techniques. We specialize in creating personalized pendants and necklaces that reflect your unique aura. Each piece is meticulously handcrafted to become a cherished extension of your identity.', profileImageUrl: 'https://picsum.photos/seed/aura-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/aura-p1/600/450', 'https://picsum.photos/seed/aura-p2/600/450'], yearsExperience: 15 },
      'artisan-3': { id: 'artisan-3', name: 'Heritage Metalsmiths', tagline: "Preserving Legacies, Restoring Beauty", address: '789 Ruby Ln, Villagetown', specialty: ['Antique Restoration', 'Heirloom Redesign', 'Intricate Repairs'], rating: 4.8, bio: 'Heritage Metalsmiths is dedicated to the art of jewelry restoration and preservation. We are experts in bringing heirlooms and antique pieces back to their former glory, combining meticulous care with profound respect for craftsmanship of the past.', profileImageUrl: 'https://picsum.photos/seed/heritage-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/heritage-p1/600/450', 'https://picsum.photos/seed/heritage-p2/600/450', 'https://picsum.photos/seed/heritage-p3/600/450', 'https://picsum.photos/seed/heritage-p4/600/450'], yearsExperience: 30, certifications: ['Master Goldsmith Certification'] },
       'default': { id: 'default', name: 'Example Goldsmith', tagline: "Artistry in Every Detail", address: '1 Example Rd, Sample City', specialty: ['General Craftsmanship', 'Fine Repairs'], rating: 4.2, bio: 'This is a sample profile for a talented goldsmith, showcasing a commitment to quality and artistry in every piece created or restored.', profileImageUrl: 'https://picsum.photos/seed/goldsmith-default-avatar/120/120', portfolioImages: ['https://picsum.photos/seed/goldsmith-default-p1/600/450'] }
  };

  return mockProfiles[id] || mockProfiles['default'];
}

// Make the component accept a promise for params
export default function GoldsmithProfilePage({ params: paramsPromise }: { params: Promise<PageParams> }) {
  const params = React.use(paramsPromise);
  const { id } = params; 

  const [profile, setProfile] = useState<GoldsmithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const loadProfile = async () => {
      if (!id) { // Check if id is available
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
      <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)]"> {/* Reduced padding and min-height */}
        <div className="grid md:grid-cols-3 gap-6"> {/* Reduced gap */}
          <div className="md:col-span-1 space-y-5"> {/* Reduced space */}
            <Skeleton className="h-32 w-32 rounded-full mx-auto bg-muted/80" /> {/* Adjusted size */}
            <Skeleton className="h-8 w-2/3 mx-auto bg-muted/80" /> {/* Adjusted size */}
            <Skeleton className="h-5 w-1/2 mx-auto bg-muted/80" /> {/* Adjusted size */}
            <Skeleton className="h-4 w-1/3 mx-auto bg-muted/80" /> {/* Adjusted size */}
            <Skeleton className="h-10 w-full rounded-full bg-muted/80" /> {/* Adjusted size */}
            <Skeleton className="h-10 w-full rounded-full bg-muted/70" /> {/* Adjusted size */}
          </div>
          <div className="md:col-span-2 space-y-6"> {/* Reduced space */}
             <Skeleton className="h-8 w-1/3 bg-muted/80" /> {/* Adjusted size */}
             <Skeleton className="h-20 w-full bg-muted/80" /> {/* Adjusted size */}
             <Skeleton className="h-8 w-1/4 bg-muted/80" /> {/* Adjusted size */}
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Reduced gap */}
                 <Skeleton className="h-40 w-full aspect-[4/3] rounded-lg bg-muted/80" /> {/* Adjusted size */}
                 <Skeleton className="h-40 w-full aspect-[4/3] rounded-lg bg-muted/80" /> {/* Adjusted size */}
                 <Skeleton className="h-40 w-full aspect-[4/3] rounded-lg bg-muted/80" /> {/* Adjusted size */}
             </div>
             <Skeleton className="h-8 w-1/4 bg-muted/80" /> {/* Adjusted size */}
              <Skeleton className="h-40 w-full rounded-lg bg-muted/80" /> {/* Adjusted size */}
          </div>
        </div>
      </div>
     )
  }

   if (error) {
     return <div className="container py-8 px-4 md:px-6 text-center text-destructive text-lg">{error}</div>;
   }

  if (!profile) {
    return <div className="container py-8 px-4 md:px-6 text-center text-muted-foreground text-lg">Profile not found.</div>;
  }

  const handleRequestIntroduction = (e: React.FormEvent) => {
     e.preventDefault();
     // TODO: Implement actual server action and toast notification
     alert("Introduction request sent to admin for approval. (Simulated)");
   }

   const handleRequestCustomOrder = () => {
     // TODO: Implement actual server action and toast notification
     alert("Custom order request sent to admin for review. (Simulated)");
   }

  return (
    <div className="container py-8 px-4 md:px-6"> {/* Reduced padding */}
        <Alert variant="default" className="mb-6 border-accent/50 text-accent-foreground bg-accent/10 rounded-lg p-4"> {/* Adjusted padding and margin */}
          <ShieldCheck className="h-4 w-4 !text-accent mr-2" /> {/* Adjusted icon size */}
          <AlertTitle className="font-semibold text-sm">Secure & Mediated Connection</AlertTitle> {/* Reduced font size */}
          <AlertDescription className="text-xs"> {/* Reduced font size */}
            To ensure a high-quality and secure experience for both customers and artisans, all initial communications and custom order requests are facilitated through Goldsmith Connect administrators. Direct contact details are shared upon mutual agreement and project confirmation.
          </AlertDescription>
        </Alert>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8"> {/* Reduced gap */}
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-1 space-y-5"> {/* Reduced space */}
          <Card className="shadow-xl border-primary/20 rounded-xl overflow-hidden">
            <CardHeader className="items-center text-center bg-gradient-to-b from-card to-secondary/10 p-6"> {/* Adjusted padding */}
              <Avatar className="w-28 h-28 mb-3 border-4 border-primary/50 shadow-lg"> {/* Adjusted size and margin */}
                <AvatarImage src={profile.profileImageUrl} alt={profile.name} data-ai-hint="artisan portrait" />
                <AvatarFallback className="text-3xl bg-primary/20 text-primary-foreground">{profile.name.charAt(0)}</AvatarFallback> {/* Adjusted font size */}
              </Avatar>
              <CardTitle className="text-2xl font-bold text-primary-foreground">{profile.name}</CardTitle> {/* Reduced font size */}
              <p className="text-xs text-accent font-medium">{profile.tagline}</p> {/* Reduced font size */}
              <div className="flex items-center text-amber-400 mt-0.5"> {/* Reduced margin */}
                <Star className="h-4 w-4 mr-1 fill-current" /> {profile.rating.toFixed(1)} {/* Adjusted icon size */}
                 <span className="text-xs text-muted-foreground ml-1">(Based on X reviews)</span> {/* Placeholder for review count */}
              </div>
              <CardDescription className="flex items-center justify-center text-muted-foreground text-xs pt-0.5"> {/* Reduced font size and padding */}
                <MapPin className="h-3.5 w-3.5 mr-1" /> {profile.address} {/* Adjusted icon size */}
              </CardDescription>
               <div className="pt-2 flex flex-wrap justify-center gap-1.5"> {/* Adjusted padding and gap */}
                    {profile.specialty.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full shadow-sm">{spec}</Badge> {/* Adjusted padding */}
                    ))}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3.5 p-5"> {/* Adjusted padding and space */}
               {profile.yearsExperience && (
                <div className="flex items-center text-xs text-foreground/80"> {/* Reduced font size */}
                    <Award className="h-4 w-4 mr-1.5 text-primary/80"/> {/* Adjusted icon size */}
                    <span>{profile.yearsExperience} years of master craftsmanship</span>
                </div>
               )}
                {profile.certifications && profile.certifications.length > 0 && (
                    <div className="text-xs text-foreground/80"> {/* Reduced font size */}
                        <Sparkles className="h-4 w-4 mr-1.5 text-primary/80 inline"/> {/* Adjusted icon size */}
                        Certifications: {profile.certifications.join(', ')}
                    </div>
                )}
               <Button size="default" className="w-full shadow-md rounded-full text-sm py-2.5 bg-primary hover:bg-primary/90" onClick={handleRequestCustomOrder}> {/* Adjusted padding and font size */}
                  <Send className="mr-2 h-3.5 w-3.5"/> Request Custom Order {/* Adjusted icon size */}
               </Button>
                <Button variant="outline" size="default" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full text-sm py-2.5 shadow-sm" onClick={handleRequestIntroduction}> {/* Adjusted padding and font size */}
                  <MessageSquare className="mr-2 h-3.5 w-3.5"/> Request Introduction {/* Adjusted icon size */}
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-6"> {/* Reduced space */}
            <Card className="shadow-xl border-primary/10 rounded-xl">
                <CardHeader className="p-5"> {/* Adjusted padding */}
                    <CardTitle className="text-xl font-semibold text-primary-foreground">About {profile.name}</CardTitle> {/* Reduced font size */}
                </CardHeader>
                <CardContent className="p-5 pt-0"> {/* Adjusted padding */}
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{profile.bio}</p> {/* Reduced font size */}
                </CardContent>
            </Card>

          <Card className="shadow-xl border-primary/10 rounded-xl">
            <CardHeader className="p-5"> {/* Adjusted padding */}
              <CardTitle className="text-xl font-semibold text-primary-foreground">Portfolio Showcase</CardTitle> {/* Reduced font size */}
               <CardDescription className="text-sm text-foreground/70">A glimpse into the artisan&apos;s craft.</CardDescription> {/* Reduced font size */}
            </CardHeader>
            <CardContent className="p-5 pt-0"> {/* Adjusted padding */}
              {profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Reduced gap */}
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
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">This artisan&apos;s portfolio is currently being curated. Check back soon!</p> {/* Adjusted padding */}
              )}
            </CardContent>
          </Card>

           <Card className="shadow-xl border-primary/10 rounded-xl">
            <CardHeader className="p-5"> {/* Adjusted padding */}
              <CardTitle className="text-xl font-semibold text-primary-foreground">Connect with {profile.name}</CardTitle> {/* Reduced font size */}
               <CardDescription className="text-sm text-foreground/70">Initiate a conversation or request a custom piece through our secure admin-mediated process.</CardDescription> {/* Reduced font size */}
            </CardHeader>
            <CardContent className="p-5 pt-0"> {/* Adjusted padding */}
              <form className="space-y-4" onSubmit={handleRequestIntroduction}> {/* Reduced space */}
                 {/* TODO: Add form handling with react-hook-form */}
                 <div className="space-y-1.5"> {/* Reduced space */}
                    <Label htmlFor="contact-name" className="text-sm">Your Name</Label> {/* Reduced font size */}
                    <Input id="contact-name" placeholder="John Doe" required className="text-sm"/> {/* Reduced font size */}
                 </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-sm">Your Email</Label>
                    <Input id="contact-email" type="email" placeholder="john.doe@example.com" required className="text-sm"/>
                 </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className="text-sm">Your Inquiry / Project Idea</Label>
                    <Textarea id="contact-message" placeholder="Briefly explain your jewelry idea or why you'd like to connect..." required rows={3} className="text-sm"/> {/* Reduced rows and font size */}
                 </div>
                 <Button type="submit" size="default" className="shadow-md rounded-full text-sm py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"> {/* Adjusted padding and font size */}
                    <Send className="mr-2 h-3.5 w-3.5"/> Send Inquiry to Admin {/* Adjusted icon size */}
                 </Button>
                 <p className="text-xs text-muted-foreground pt-1.5">Your request will be reviewed by an administrator before contact is established with the artisan.</p> {/* Adjusted padding */}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
