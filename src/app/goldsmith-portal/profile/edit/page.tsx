// src/app/goldsmith-portal/profile/edit/page.tsx
'use client';

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCog, Loader2, ArrowLeft, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchGoldsmithById, updateGoldsmithProfile, updateGoldsmithProfileImage } from '@/actions/goldsmith-actions';
import type { Goldsmith } from '@/types/goldsmith';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NextImage from 'next/image';

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
  name: string;
}

const indianStates: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
};
const stateNames = Object.keys(indianStates).sort();

export default function EditGoldsmithProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentGoldsmithUser, setCurrentGoldsmithUser] = useState<CurrentGoldsmithUser | null>(null);
  const [goldsmithData, setGoldsmithData] = useState<Goldsmith | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    state: '',
    district: '',
    specialty: '',
    portfolioLink: '',
    bio: '',
    tagline: '',
    yearsExperience: 0,
    responseTime: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('currentGoldsmithUser');
    if (user) {
      const parsedUser: CurrentGoldsmithUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentGoldsmithUser(parsedUser);
        fetchProfileData(parsedUser.id);
      } else {
        router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/profile/edit');
      }
    } else {
      router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/profile/edit');
    }
  }, [router]);

  const fetchProfileData = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await fetchGoldsmithById(id);
      if (data) {
        setGoldsmithData(data);
        setFormData({
            name: data.name || '',
            contactPerson: data.contactPerson || '',
            phone: data.phone || '',
            state: data.state || '',
            district: data.district || '',
            specialty: Array.isArray(data.specialty) ? data.specialty.join(', ') : data.specialty || '',
            portfolioLink: data.portfolioLink || '',
            bio: data.bio || '',
            tagline: data.tagline || '',
            yearsExperience: data.yearsExperience || 0,
            responseTime: data.responseTime || '',
        });
      } else {
        toast({ title: "Error", description: "Could not fetch your profile data.", variant: "destructive" });
        router.push('/goldsmith-portal/dashboard');
      }
    } catch (error) {
      console.error("Failed to fetch goldsmith data:", error);
      toast({ title: "Error", description: "Failed to load your profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: 'state' | 'district', value: string) => {
    setFormData(prev => {
        const newState = { ...prev, [name]: value };
        if (name === 'state') {
            newState.district = ''; // Reset district when state changes
        }
        return newState;
    });
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          toast({ title: "Image too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
          return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageFile || !imagePreview || !currentGoldsmithUser?.id) {
      toast({ title: "No file selected", description: "Please select an image to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const result = await updateGoldsmithProfileImage(currentGoldsmithUser.id, imagePreview);
      if (result.success && result.data) {
        setGoldsmithData(result.data);
        toast({ title: "Profile Picture Updated!", description: "Your new picture is now live." });
        setImageFile(null);
        setImagePreview(null);
        const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
      } else {
        toast({ title: "Upload Failed", description: result.error || "Could not upload image.", variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Upload Error", description: "An unexpected error occurred during upload.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentGoldsmithUser?.id) return;
    setIsSaving(true);
    try {
      const result = await updateGoldsmithProfile(currentGoldsmithUser.id, {
        ...formData,
        specialty: formData.specialty.split(',').map(s => s.trim()).filter(s => s),
        yearsExperience: Number(formData.yearsExperience) || 0,
      });
      if (result.success && result.data) {
        toast({ title: "Profile Updated", description: "Your workshop profile has been successfully updated." });
        setGoldsmithData(result.data); // Refresh local data with the updated version
        if (currentGoldsmithUser.name !== result.data.name) {
            localStorage.setItem('currentGoldsmithUser', JSON.stringify({ ...currentGoldsmithUser, name: result.data.name }));
        }
      } else {
        toast({ title: "Update Failed", description: result.error || "Could not update your profile.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({ title: "Update Failed", description: "An unexpected server error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !goldsmithData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading Your Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
       <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Edit Your Profile</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/goldsmith-portal/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      
      {/* New Profile Picture Card */}
      <Card className="max-w-3xl mx-auto shadow-xl bg-card border-primary/10 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-accent">Profile Picture</CardTitle>
          <CardDescription className="text-muted-foreground">
            A great profile picture helps build trust with customers. Recommended size: 400x400 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleImageUpload} className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="h-28 w-28 border-2 border-primary/20 shadow-md">
                    <AvatarImage src={goldsmithData.profileImageUrl} alt={goldsmithData.name} />
                    <AvatarFallback>{goldsmithData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow space-y-3">
                    <Label htmlFor="profile-image-upload">New Profile Picture</Label>
                    <Input 
                        id="profile-image-upload" 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageFileChange}
                        disabled={isUploading}
                        className="text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {imagePreview && (
                        <div className="flex items-center gap-4">
                            <NextImage src={imagePreview} alt="New profile preview" width={80} height={80} className="rounded-md object-cover border border-muted" />
                             <Button type="submit" disabled={isUploading}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                {isUploading ? "Uploading..." : "Upload New Picture"}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </CardContent>
      </Card>


      <Card className="max-w-3xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl text-accent">Workshop Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Keep your workshop information up-to-date to attract more customers. Your email cannot be changed from this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Workshop Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} disabled={isSaving} />
                </div>
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="tagline">Tagline / Short Slogan</Label>
                <Input id="tagline" name="tagline" placeholder="e.g., Bespoke Creations for Timeless Moments" value={formData.tagline} onChange={handleInputChange} disabled={isSaving} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleSelectChange('state', value)} value={formData.state} required disabled={isSaving}>
                  <SelectTrigger id="state" className="text-foreground">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateNames.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">District / City</Label>
                <Select onValueChange={(value) => handleSelectChange('district', value)} value={formData.district} required disabled={isSaving || !formData.state}>
                  <SelectTrigger id="district" className="text-foreground">
                    <SelectValue placeholder="Select your district/city" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.state && indianStates[formData.state]?.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSaving} />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="specialty">Specialties (comma-separated)</Label>
                <Input id="specialty" name="specialty" placeholder="e.g., Hand Engraving, Platinum Smithing, Custom Designs" value={formData.specialty} onChange={handleInputChange} disabled={isSaving} />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="bio">About Your Workshop (Bio)</Label>
                <Textarea id="bio" name="bio" rows={5} value={formData.bio} onChange={handleInputChange} disabled={isSaving} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input id="yearsExperience" name="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleInputChange} disabled={isSaving} />
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="responseTime">Typical Response Time</Label>
                    <Input id="responseTime" name="responseTime" placeholder="e.g., Within 24 hours" value={formData.responseTime} onChange={handleInputChange} disabled={isSaving} />
                </div>
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="portfolioLink">Portfolio Link (Website, Instagram, etc.)</Label>
                <Input id="portfolioLink" name="portfolioLink" type="url" value={formData.portfolioLink} onChange={handleInputChange} disabled={isSaving} />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
