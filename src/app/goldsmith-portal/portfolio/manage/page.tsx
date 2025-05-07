// src/app/goldsmith-portal/portfolio/manage/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const mockPortfolioImages = [
  { id: 'img1', src: 'https://picsum.photos/seed/portfolio-a/300/200', alt: 'Elegant gold ring', dataAiHint: 'gold ring' },
  { id: 'img2', src: 'https://picsum.photos/seed/portfolio-b/300/200', alt: 'Sapphire necklace', dataAiHint: 'sapphire necklace' },
  { id: 'img3', src: 'https://picsum.photos/seed/portfolio-c/300/200', alt: 'Custom bracelet', dataAiHint: 'custom bracelet' },
];

export default function ManageGoldsmithPortfolioPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
                <GalleryHorizontal className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-accent">Manage Portfolio</CardTitle>
            </div>
            <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Image
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">
            Showcase your best work. Upload high-quality images of your creations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockPortfolioImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockPortfolioImages.map(image => (
                <div key={image.id} className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md group">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {/* Add buttons for edit/delete if needed */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground text-center py-6">
              Your portfolio is currently empty. Start by adding images of your work!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
