// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Gem, ShieldCheck, Heart, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-background via-secondary/5 to-background py-10 sm:py-14 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <Handshake className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="font-heading text-4xl sm:text-5xl text-accent leading-tight">About Goldsmiths Connect</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Forging connections between discerning clients and master artisans to create timeless, personal jewelry.
          </p>
        </div>

        {/* Core Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
           <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-2xl group border-2 border-primary/20">
              <Image
                src="/goldsmith-and-customer.png" 
                alt="A goldsmith discussing a design with a customer"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
                data-ai-hint="artisan customer interaction"
              />
               <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          <div className="space-y-4">
            <h2 className="font-heading text-2xl text-accent flex items-center"><Heart className="h-6 w-6 mr-2 text-primary" /> Our Mission</h2>
            <p className="text-foreground/85">
              In a world of mass-produced jewelry, we saw a disconnect. On one side, customers yearned for unique, meaningful pieces that tell a personal story. On the other, countless master goldsmiths—true artists with generations of skill—were hidden in local workshops, their incredible craft unseen by a wider audience.
            </p>
            <p className="text-foreground/85 font-semibold">
              Goldsmiths Connect was born from a simple yet powerful vision: to bridge that gap.
            </p>
             <p className="text-foreground/85">
              We are a curated digital platform dedicated to celebrating craftsmanship, fostering trust, and making the creation of bespoke jewelry a seamless and secure experience for everyone.
            </p>
          </div>
        </div>

        {/* For Customers & For Goldsmiths Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-accent"><Users className="h-6 w-6 mr-2 text-primary" /> For Our Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide a secure, inspiring environment to discover verified local artisans. Our admin-mediated process ensures that your journey—from a simple idea to a cherished heirloom—is built on a foundation of trust, transparency, and unparalleled quality.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-accent"><Briefcase className="h-6 w-6 mr-2 text-primary" /> For Our Goldsmiths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer a dedicated space to showcase your unique artistry, connect with a targeted audience seeking bespoke work, and grow your business. Focus on your craft while we handle the initial introductions and order vetting.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Commitment Section */}
        <Card className="shadow-xl bg-card border-primary/20 text-center py-8">
            <CardHeader className="pt-0">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle className="text-2xl text-accent">Our Commitment to Trust & Quality</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="max-w-2xl mx-auto text-muted-foreground">
                Every goldsmith on our platform undergoes a verification process. Every custom order inquiry is reviewed by our administrators. This two-way check ensures that all interactions begin with clarity and security, protecting both the customer's vision and the artisan's time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Button asChild>
                        <Link href="/discover">Discover Artisans</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/goldsmith-portal">Join as a Goldsmith</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
