import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, ShoppingBag, Sparkles, UserCheck, CheckCircle } from 'lucide-react';
import Image from 'next/image';

// Inline SVG for a goldsmith icon
const GoldsmithIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 text-primary"
  >
    <path d="M4 20h16M4 16h16M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.1-.36 2.1-.97 2.93-.61.83-1.43 1.52-2.4 1.97M17 8V4M7 8V4" />
    <path d="m13.1 14.9-.5-1.5 1.4-1.4" />
    <path d="m12.5 17.4 1.4-1.4-.5-1.5" />
  </svg>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-secondary to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary-foreground">
                  Discover Local Goldsmiths, Craft Your Dreams
                </h1>
                <p className="max-w-[600px] text-foreground md:text-xl">
                  Goldsmith Connect links you with skilled artisans in your area. Find the perfect goldsmith to bring your custom jewelry vision to life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/discover">
                    Find a Goldsmith
                    <MapPin className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10">
                  <Link href="/goldsmith-portal">
                    Join as a Goldsmith
                    <UserCheck className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://picsum.photos/seed/goldsmith-hero/600/400"
              alt="Hero Goldsmith"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary-foreground">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary-foreground">Simple Steps to Your Perfect Piece</h2>
              <p className="max-w-[900px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connecting with talented goldsmiths and ordering custom jewelry has never been easier.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none pt-12">
            <div className="grid gap-1 text-center">
              <Search className="h-10 w-10 mx-auto text-accent" />
              <h3 className="text-xl font-bold text-primary-foreground">1. Discover</h3>
              <p className="text-sm text-foreground">
                Browse nearby goldsmiths using our map or list view. Filter by specialty and location.
              </p>
            </div>
            <div className="grid gap-1 text-center">
               <ShoppingBag className="h-10 w-10 mx-auto text-accent" />
              <h3 className="text-xl font-bold text-primary-foreground">2. Connect & Order</h3>
              <p className="text-sm text-foreground">
                View profiles, message goldsmiths directly, and place your custom order with specific details.
              </p>
            </div>
            <div className="grid gap-1 text-center">
               <Sparkles className="h-10 w-10 mx-auto text-accent" />
              <h3 className="text-xl font-bold text-primary-foreground">3. Create & Receive</h3>
              <p className="text-sm text-foreground">
                Your chosen artisan crafts your unique piece. Receive updates and get your dream jewelry delivered or pick it up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Goldsmiths Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary-foreground">Meet Our Talented Artisans</h2>
            <p className="mx-auto max-w-[600px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover skilled goldsmiths ready to craft your next masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/30">
                <CardHeader>
                  <Image
                    src={`https://picsum.photos/seed/goldsmith${i}/400/250`}
                    alt={`Featured Goldsmith ${i}`}
                    width={400}
                    height={250}
                    className="rounded-t-lg object-cover w-full aspect-video"
                  />
                  <CardTitle className="pt-4 text-primary-foreground">Artisan Jewelers {i}</CardTitle>
                  <CardDescription className="flex items-center justify-center text-foreground">
                    <MapPin className="mr-1 h-4 w-4" /> Cityville, ST
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Specializing in custom engagement rings and intricate designs.</p>
                  <Button variant="link" asChild className="mt-2 text-accent hover:text-accent/80">
                    <Link href={`/goldsmith/artisan-${i}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-8">
             <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md">
                <Link href="/discover">
                  Explore All Goldsmiths
                </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
             <GoldsmithIcon />
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary-foreground">
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
             <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/discover">
                Start Your Search
                <Search className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="shadow-md hover:shadow-lg transition-shadow text-primary-foreground hover:bg-primary/80">
               <Link href="/goldsmith-portal/register">
                 Register as a Goldsmith
                 <CheckCircle className="ml-2 h-5 w-5" />
               </Link>
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
