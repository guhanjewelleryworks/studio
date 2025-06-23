// src/app/goldsmith-portal/portfolio/manage/page.tsx
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryHorizontal, PlusCircle, Trash2, Loader2, ArrowLeft, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NextImage from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchGoldsmithById, 
  addGoldsmithPortfolioImage, 
  deleteGoldsmithPortfolioImage 
} from '@/actions/goldsmith-actions';
import type { Goldsmith } from '@/types/goldsmith';
import Link from 'next/link';

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
}

export default function ManageGoldsmithPortfolioPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<CurrentGoldsmithUser | null>(null);
  const [goldsmith, setGoldsmith] = useState<Goldsmith | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store URL of image being deleted
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentGoldsmithUser');
    if (user) {
      const parsedUser: CurrentGoldsmithUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentUser(parsedUser);
        loadGoldsmithData(parsedUser.id);
      } else {
        router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/portfolio/manage');
      }
    } else {
      router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/portfolio/manage');
    }
  }, [router]);

  const loadGoldsmithData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGoldsmithById(id);
      if (data) {
        setGoldsmith(data);
      } else {
        setError("Could not load your profile data. Please try again or contact support.");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching your portfolio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          toast({ title: "Image too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
          return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !imagePreview || !currentUser?.id) {
      toast({ title: "No file selected", description: "Please select an image to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const result = await addGoldsmithPortfolioImage(currentUser.id, imagePreview);
      if (result.success && result.data) {
        setGoldsmith(result.data);
        toast({ title: "Image Uploaded", description: "Your new portfolio image has been added." });
        setSelectedFile(null);
        setImagePreview(null);
        // Clear the file input visually
        const fileInput = document.getElementById('new-image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
      } else {
        toast({ title: "Upload Failed", description: result.error || "Could not upload the image.", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Upload Error", description: "An unexpected error occurred during upload.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!currentUser?.id) return;
    setIsDeleting(imageUrl);
    try {
      const result = await deleteGoldsmithPortfolioImage(currentUser.id, imageUrl);
       if (result.success && result.data) {
        setGoldsmith(result.data);
        toast({ title: "Image Deleted", description: "The image has been removed from your portfolio." });
      } else {
        toast({ title: "Deletion Failed", description: result.error || "Could not delete the image.", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Deletion Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <header className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <GalleryHorizontal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Manage Portfolio</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/goldsmith-portal/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      {/* Upload Form */}
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-accent">Add New Image</CardTitle>
          <CardDescription className="text-muted-foreground">
            Showcase your best work. Upload high-quality images of your creations (max 4MB per image).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-image-upload" className="sr-only">Choose Image</Label>
              <Input 
                id="new-image-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            {imagePreview && (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 relative rounded-md overflow-hidden border border-border">
                  <NextImage src={imagePreview} alt="Preview of new portfolio item" fill className="object-cover" />
                </div>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Existing Portfolio */}
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl text-accent">Your Current Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({length: 3}).map((_, i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : goldsmith?.portfolioImages && goldsmith.portfolioImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {goldsmith.portfolioImages.map((imageUrl, index) => (
                <div key={imageUrl} className="relative aspect-square rounded-lg overflow-hidden shadow-md group">
                  <NextImage 
                    src={imageUrl} 
                    alt={`Portfolio item ${index + 1}`}
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="jewelry photo"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDelete(imageUrl)}
                      disabled={isDeleting === imageUrl}
                    >
                      {isDeleting === imageUrl ? <Loader2 className="h-5 w-5 animate-spin"/> : <Trash2 className="h-5 w-5" />}
                      <span className="sr-only">Delete Image</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Your portfolio is currently empty.</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Start by uploading images of your work using the form above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
