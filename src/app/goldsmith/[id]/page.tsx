
'use client'

import * as React from 'react'; // Import React
import { useParams } from 'next/navigation'; // Import useParams
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageSquare, Send, Info } from "lucide-react"; // Removed Phone, Mail
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GoldsmithProfile {
  id: string;
  name: string;
  address: string; // Keep address for general location
  specialty: string[];
  rating: number;
  bio: string;
  // Removed direct contact info
  profileImageUrl: string;
  portfolioImages: string[];
}

// Mock Data - Replace with API call based on params.id
const fetchGoldsmithProfile = async (id: string): Promise<GoldsmithProfile | null> => {
  console.log("Fetching profile for ID:", id);
   // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic mock data - ideally fetch from DB/API
  const mockProfiles: { [key: string]: GoldsmithProfile } = {
      'artisan-1': { id: 'artisan-1', name: 'Artisan Jewelers 1', address: '123 Main St, Cityville', specialty: ['Engagement Rings', 'Custom Designs'], rating: 4.8, bio: 'Dedicated to crafting unique and timeless pieces. Over 20 years of experience in fine jewelry.', profileImageUrl: 'https://picsum.photos/seed/goldsmith1-avatar/100/100', portfolioImages: ['https://picsum.photos/seed/goldsmith1-p1/400/300', 'https://picsum.photos/seed/goldsmith1-p2/400/300', 'https://picsum.photos/seed/goldsmith1-p3/400/300'] },
      'artisan-2': { id: 'artisan-2', name: 'Golden Touch Crafters', address: '456 Oak Ave, Townsville', specialty: ['Custom Pendants', 'Gold Chains'], rating: 4.5, bio: 'Modern designs meet traditional techniques. We specialize in personalized pendants.', profileImageUrl: 'https://picsum.photos/seed/goldsmith2-avatar/100/100', portfolioImages: ['https://picsum.photos/seed/goldsmith2-p1/400/300', 'https://picsum.photos/seed/goldsmith2-p2/400/300'] },
      'artisan-3': { id: 'artisan-3', name: 'Precious Metalsmith', address: '789 Pine Ln, Villagetown', specialty: ['Restoration', 'Antique Jewelry', 'Repairs'], rating: 4.9, bio: 'Expert in restoring heirlooms and antique pieces to their former glory.', profileImageUrl: 'https://picsum.photos/seed/goldsmith3-avatar/100/100', portfolioImages: ['https://picsum.photos/seed/goldsmith3-p1/400/300', 'https://picsum.photos/seed/goldsmith3-p2/400/300', 'https://picsum.photos/seed/goldsmith3-p3/400/300', 'https://picsum.photos/seed/goldsmith3-p4/400/300'] },
       'default': { id: 'default', name: 'Example Goldsmith', address: '1 Example Rd, Sample City', specialty: ['General', 'Repairs'], rating: 4.2, bio: 'This is a sample profile for a talented goldsmith.', profileImageUrl: 'https://picsum.photos/seed/goldsmith-default-avatar/100/100', portfolioImages: ['https://picsum.photos/seed/goldsmith-default-p1/400/300'] }
  };

  return mockProfiles[id] || mockProfiles['default']; // Return specific profile or default
}

// Removed the params prop
export default function GoldsmithProfilePage() {
  // Use useParams hook to get route parameters
  const params = useParams();
  const id = params.id as string; // Accessing id from the hook

  const [profile, setProfile] = useState<GoldsmithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the id obtained from useParams
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

    if (id) { // Ensure id is available before loading
        loadProfile();
    } else {
        // This case might be less likely now with useParams but good for robustness
        setError("Goldsmith ID not found in URL.");
        setIsLoading(false);
    }
  }, [id]); // Depend on id


  if (isLoading) {
     return (
      <div className="container py-12 px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
             <Skeleton className="h-4 w-1/4 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-8 w-1/3" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-8 w-1/4" />
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <Skeleton className="h-40 w-full aspect-square" />
                 <Skeleton className="h-40 w-full aspect-square" />
                 <Skeleton className="h-40 w-full aspect-square" />
             </div>
             <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
     )
  }

   if (error) {
     return <div className="container py-12 px-4 md:px-6 text-center text-destructive">{error}</div>;
   }

  if (!profile) {
    return <div className="container py-12 px-4 md:px-6 text-center text-muted-foreground">Profile not found.</div>;
  }


  // TODO: Implement message sending logic via Admin
  const handleRequestIntroduction = (e: React.FormEvent) => {
     e.preventDefault();
     alert("Introduction request sent to admin for approval. Functionality not fully implemented.");
     // Server Action should:
     // 1. Get form data (name, email, message).
     // 2. Save the request to the database (e.g., Firestore collection 'introductionRequests').
     // 3. Include customerId, goldsmithId, message, timestamp, status ('pending').
     // 4. Notify the admin (e.g., via email or an admin dashboard notification).
     // 5. Show a confirmation message to the user.
   }

   // TODO: Implement order placement logic via Admin
   const handleRequestCustomOrder = () => {
     alert("Custom order request sent to admin for review. Functionality not fully implemented.");
     // Server Action should:
     // 1. Capture order details (e.g., description, materials, budget, customerId, goldsmithId).
     // 2. Save the request to the database (e.g., Firestore collection 'orderRequests').
     // 3. Include status ('pending_admin_review').
     // 4. Notify the admin.
     // 5. Redirect to an order confirmation/status page or show a message.
     // Admin will then review and forward the request to the goldsmith if approved.
   }

  return (
    <div className="container py-12 px-4 md:px-6">
        <Alert variant="default" className="mb-8 border-accent text-accent bg-accent/5">
          <Info className="h-4 w-4 !text-accent" />
          <AlertTitle>Brokered Connection</AlertTitle>
          <AlertDescription>
            To ensure quality and security, all communication and orders are initially facilitated through Goldsmith Connect administrators. Direct contact details are shared upon subscription and approval.
          </AlertDescription>
        </Alert>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl text-primary-foreground">{profile.name}</CardTitle>
              <div className="flex items-center text-amber-500">
                <Star className="h-5 w-5 mr-1 fill-current" /> {profile.rating.toFixed(1)}
              </div>
              <CardDescription className="flex items-center justify-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" /> {profile.address}
              </CardDescription>
               <div className="pt-2 flex flex-wrap justify-center gap-2">
                    {profile.specialty.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-secondary text-primary-foreground">{spec}</Badge>
                    ))}
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 pt-4">
               {/* Removed direct contact info display */}
               <Button className="w-full shadow-sm" onClick={handleRequestCustomOrder}>
                  <Send className="mr-2 h-4 w-4"/> Request Custom Order (via Admin)
               </Button>
                {/* Changed "Send a Message" to "Request Introduction" */}
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                  <MessageSquare className="mr-2 h-4 w-4"/> Request Introduction (via Admin)
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-8">
           {/* Bio Section */}
            <Card className="shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="text-xl text-primary-foreground">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
            </Card>


          {/* Portfolio Section */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">Portfolio</CardTitle>
               <CardDescription>Examples of previous work.</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profile.portfolioImages.map((imgUrl, index) => (
                    <Image
                      key={index}
                      src={imgUrl}
                      alt={`Portfolio image ${index + 1} for ${profile.name}`}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full aspect-[3/2] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                       // TODO: Add onClick for modal view
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No portfolio images available yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Form Section - Now for Introduction Request */}
           <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary-foreground">Request Introduction to {profile.name}</CardTitle>
               <CardDescription>Send an inquiry to the admin to facilitate contact with this goldsmith.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRequestIntroduction}>
                 {/* TODO: Add form handling with react-hook-form */}
                 <div className="space-y-2">
                    <Label htmlFor="contact-name">Your Name</Label>
                    <Input id="contact-name" placeholder="John Doe" required/>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-email">Your Email</Label>
                    <Input id="contact-email" type="email" placeholder="you@example.com" required/>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-message">Your Inquiry / Reason for Contact</Label>
                    <Textarea id="contact-message" placeholder="Briefly explain why you'd like to connect..." required rows={5}/>
                 </div>
                 <Button type="submit" className="shadow-sm">
                    <Send className="mr-2 h-4 w-4"/> Send Introduction Request
                 </Button>
                 <p className="text-xs text-muted-foreground pt-2">Your request will be reviewed by an administrator before contact is established.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
