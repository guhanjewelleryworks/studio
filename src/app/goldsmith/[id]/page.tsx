// src/app/goldsmith/[id]/page.tsx
'use client';

import type { Goldsmith as GoldsmithProfileType, NewOrderRequestInput, NewInquiryInput } from '@/types/goldsmith';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { MapPin, Star, MessageSquare, Send, ShieldCheck, Sparkles, Award, Eye, User, Edit3, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { fetchGoldsmithById, saveOrderRequest, saveInquiry } from '@/actions/goldsmith-actions';

interface PageParams {
  id: string;
}

// Helper function to ensure profile has all necessary fields with defaults
const ensureCompleteProfile = (profile: Partial<GoldsmithProfileType> | null, id: string): GoldsmithProfileType | null => {
  if (!profile) return null;
  return {
    id: profile.id || id,
    name: profile.name || "Goldsmith Name Not Available",
    address: profile.address || "Address Not Available",
    specialty: profile.specialty || ["Fine Jewelry"],
    rating: profile.rating || 0,
    imageUrl: profile.imageUrl || `https://picsum.photos/seed/${id}-discover/400/300`,
    profileImageUrl: profile.profileImageUrl || `https://picsum.photos/seed/${id}-profile/120/120`,
    location: profile.location || { lat: 34.0522, lng: -118.2437 }, // Default location
    shortBio: profile.shortBio || `Specializing in ${Array.isArray(profile.specialty) ? profile.specialty.join(', ') : profile.specialty || 'fine jewelry'}.`,
    tagline: profile.tagline || "Bespoke Creations",
    bio: profile.bio || "Talented artisan ready to create your unique piece.",
    portfolioImages: profile.portfolioImages || Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/${id}-work-${i + 1}/600/450`),
    yearsExperience: profile.yearsExperience || 0,
    certifications: profile.certifications || [],
    responseTime: profile.responseTime || "Within 2 business days",
    ordersCompleted: profile.ordersCompleted || 0,
    status: profile.status || 'pending_verification',
    ...profile,
  };
};


export default function GoldsmithProfilePage({ params: paramsPromise }: { params: Promise<PageParams> }) {
  const params = use(paramsPromise);
  const { id } = params;

  const [profile, setProfile] = useState<GoldsmithProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);


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
        const fetchedProfileData = await fetchGoldsmithById(id);
        const completeProfile = ensureCompleteProfile(fetchedProfileData, id);

        if (completeProfile) {
          setProfile(completeProfile);
          if(completeProfile.portfolioImages && completeProfile.portfolioImages.length > 0) {
            setSelectedImage(null); // Reset any previously selected image
            setImagePreview(null); // Reset preview
          }
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // TODO: Implement actual image upload to a service like S3 or Cloudinary
      // For now, we'll store a preview, but this won't persist or be part of the request.
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

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

  const handleRequestIntroduction = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setIsSubmittingInquiry(true);
     const form = e.target as HTMLFormElement;
     const customerName = (form.elements.namedItem('contact-name') as HTMLInputElement)?.value;
     const customerEmail = (form.elements.namedItem('contact-email') as HTMLInputElement)?.value;
     const customerPhone = (form.elements.namedItem('contact-phone') as HTMLInputElement)?.value;
     const message = (form.elements.namedItem('contact-message') as HTMLTextAreaElement)?.value;

     // Basic validation
    if (!customerName || !customerEmail || !message) {
      toast({ title: "Missing Information", description: "Please fill in your name, email, and message.", variant: "destructive" });
      setIsSubmittingInquiry(false);
      return;
    }

     const inquiryData: NewInquiryInput = {
        goldsmithId: profile.id,
        customerName,
        customerEmail,
        customerPhone,
        message,
        // referenceImage: imagePreview || undefined, // This would be a data URI or an uploaded URL in a real app
     };
     // In a real app, you would handle image upload first and then pass the image URL.
     // For simulation, if imagePreview exists, you might want to include it.

     console.log("Submitting Inquiry:", inquiryData);
     const result = await saveInquiry(inquiryData);

     if (result.success && result.data) {
        toast({
          title: 'Inquiry Request Sent!',
          description: `Your inquiry for ${profile.name} has been submitted. An admin will review it.`,
          duration: 7000,
        });
        form.reset();
        setSelectedImage(null);
        setImagePreview(null);
     } else {
        toast({
          title: 'Inquiry Submission Failed',
          description: result.error || "Could not send your inquiry. Please try again.",
          variant: 'destructive',
        });
     }
     setIsSubmittingInquiry(false);
   };

   const handleRequestCustomOrder = async () => {
    setIsSubmittingOrder(true);
    // Simulate collecting more detailed order info if a modal or separate form existed.
    // For now, let's use details from the inquiry form as a proxy if it's filled,
    // or prompt the user that more details are needed.
    const contactForm = document.getElementById('contact-form-section')?.querySelector('form');
    const itemName = "Custom Order for " + profile.name; // Example
    const details = (contactForm?.elements.namedItem('contact-message') as HTMLTextAreaElement)?.value || "Customer to provide more details via admin mediation.";
    const customerName = (contactForm?.elements.namedItem('contact-name') as HTMLInputElement)?.value || "Unknown Customer";
    const customerEmail = (contactForm?.elements.namedItem('contact-email') as HTMLInputElement)?.value || "no-email-provided@example.com";


    if (!customerName || customerName === "Unknown Customer" || !customerEmail.includes('@')) {
         toast({
            title: 'Information Needed for Custom Order',
            description: 'Please fill out the inquiry form below with your name, email, and project idea before requesting a custom order.',
            variant: 'default',
            duration: 7000,
        });
        document.getElementById('contact-name')?.focus();
        setIsSubmittingOrder(false);
        return;
    }

    const orderData: NewOrderRequestInput = {
        goldsmithId: profile.id,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: (contactForm?.elements.namedItem('contact-phone') as HTMLInputElement)?.value || undefined,
        itemDescription: itemName,
        details: details,
        // referenceImage: imagePreview || undefined, // This would be a data URI or an uploaded URL in a real app
    };

    console.log("Submitting Custom Order:", orderData);
    const result = await saveOrderRequest(orderData);

    if (result.success && result.data) {
        toast({
          title: 'Custom Order Request Submitted!',
          description: `Your custom order request for ${profile.name} has been sent. An admin will review it.`,
          duration: 7000,
        });
    } else {
        toast({
          title: 'Custom Order Submission Failed',
          description: result.error || "Could not submit your custom order request. Please try again.",
          variant: 'destructive',
        });
    }
    setIsSubmittingOrder(false);
   };


  return (
    <div className="container py-10 md:py-14 px-4 md:px-6 bg-background text-foreground">
        <Alert variant="default" className="mb-6 border-accent/50 text-accent-foreground bg-accent/10 rounded-lg p-3 shadow-sm">
          <ShieldCheck className="h-4 w-4 !text-accent mr-1.5" />
          <AlertTitle className="font-poppins font-semibold text-sm text-foreground">Secure & Mediated Connection</AlertTitle>
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
              <CardTitle className="text-xl font-heading text-accent">{profile.name}</CardTitle>
              {profile.tagline && <p className="text-xs text-primary font-medium font-poppins mt-0.5">{profile.tagline}</p>}
              <div className="flex items-center text-amber-500 mt-1">
                <Star className="h-3.5 w-3.5 mr-1 fill-current text-yellow-400" /> <span className="text-xs text-foreground font-poppins">{profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}</span>
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
               <Button size="default" className="w-full shadow-md rounded-full text-xs py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-1.5" onClick={handleRequestCustomOrder} disabled={isSubmittingOrder}>
                  <Send className="mr-1.5 h-3.5 w-3.5"/> {isSubmittingOrder ? "Submitting..." : "Request Custom Order"}
               </Button>
                <Button variant="outline" size="default" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full text-xs py-2.5 shadow-sm" onClick={(e) => { e.preventDefault(); document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <User className="mr-1.5 h-3.5 w-3.5"/> Request Introduction
               </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Bio, Portfolio, Contact Form */}
        <div className="md:col-span-2 space-y-6">
            <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
                <CardHeader className="p-5">
                    <CardTitle className="text-lg font-heading text-accent">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                    {profile.bio && <p className="text-sm text-foreground/85 leading-normal whitespace-pre-line">{profile.bio}</p>}
                </CardContent>
            </Card>

          <Card className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-5">
              <CardTitle className="text-lg font-heading text-accent">Portfolio Showcase</CardTitle>
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

           <Card id="contact-form-section" className="shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="p-5">
              <CardTitle className="text-lg font-heading text-accent">Connect with {profile.name}</CardTitle>
               <CardDescription className="text-xs text-muted-foreground mt-0.5">Initiate a conversation or request a custom piece through our secure admin-mediated process.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form className="space-y-3.5" onSubmit={handleRequestIntroduction}>
                 <div className="space-y-1">
                    <Label htmlFor="contact-name" className="text-foreground text-xs font-medium">Your Name</Label>
                    <Input id="contact-name" name="contact-name" placeholder="John Doe" required className="text-foreground text-sm py-2"/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-email" className="text-foreground text-xs font-medium">Your Email</Label>
                    <Input id="contact-email" name="contact-email" type="email" placeholder="john.doe@example.com" required className="text-foreground text-sm py-2"/>
                 </div>
                  <div className="space-y-1">
                    <Label htmlFor="contact-phone" className="text-foreground text-xs font-medium">Your Phone (Optional)</Label>
                    <Input id="contact-phone" name="contact-phone" type="tel" placeholder="e.g., 9876543210" className="text-foreground text-sm py-2"/>
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="contact-message" className="text-foreground text-xs font-medium">Your Inquiry / Project Idea</Label>
                    <Textarea id="contact-message" name="contact-message" placeholder="Briefly explain your jewelry idea or why you'd like to connect..." required rows={3} className="text-foreground text-sm py-2"/>
                 </div>
                  <div className="space-y-1">
                    <Label htmlFor="ornament-image" className="text-foreground text-xs font-medium">Attach Reference Image (Optional)</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        id="ornament-image" 
                        name="ornament-image"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="text-foreground text-sm py-1.5 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-2 p-2 border border-muted rounded-md inline-block">
                        <Image src={imagePreview} alt="Ornament preview" width={80} height={80} className="rounded object-contain" />
                      </div>
                    )}
                  </div>

                 <Button type="submit" size="default" className="shadow-md rounded-full text-xs py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmittingInquiry}>
                    <Send className="mr-1.5 h-3.5 w-3.5"/> {isSubmittingInquiry ? "Sending..." : "Send Inquiry to Admin"}
                 </Button>
                 <p className="text-[0.65rem] text-muted-foreground pt-1.5">Your request will be reviewed by an administrator before being forwarded to the goldsmith if appropriate.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
