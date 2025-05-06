import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Sparkles, UserCheck, Lock, CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
      <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-secondary/80 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-primary-foreground">
                  Discover Local Goldsmiths, Craft Your Dreams
                </h1>
                <p className="max-w-[650px] text-foreground md:text-xl leading-relaxed">
                  Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                 <Link
                   href="/discover"
                   className={cn(
                     buttonVariants({ size: 'lg' }),
                     'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
                   )}
                 >
                   <span>
                     Find a Goldsmith
                     <MapPin className="ml-2 h-5 w-5 inline" />
                   </span>
                 </Link>
                 <Link
                   href="/goldsmith-portal"
                   className={cn(
                     buttonVariants({ variant: 'outline', size: 'lg' }),
                     'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10'
                   )}
                 >
                   <span>
                     Join as a Goldsmith
                     <UserCheck className="ml-2 h-5 w-5 inline" />
                   </span>
                 </Link>
              </div>
            </div>
            <Image
              src="https://picsum.photos/seed/goldsmith-hero/600/500"
              alt="Hero Goldsmith"
              width={600}
              height={500}
              className="mx-auto aspect-[6/5] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-2xl border-2 border-border/20 transition-transform duration-300 hover:scale-105"
              data-ai-hint="jewelry crafting hands"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-primary-foreground">Your Secure Path to Custom Jewelry</h2>
              <p className="max-w-[900px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We connect you with talented goldsmiths through a verified and mediated process.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-12 sm:grid-cols-2 md:gap-16 lg:grid-cols-3 lg:max-w-none pt-20">
            <div className="grid gap-3 text-center group">
              <div className="flex justify-center items-center mb-4">
                 <div className="p-4 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Search className="h-8 w-8" />
                 </div>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground">1. Discover & Inquire</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Browse verified goldsmith profiles. Submit an introduction or custom order request via our platform.
              </p>
            </div>
            <div className="grid gap-3 text-center group">
               <div className="flex justify-center items-center mb-4">
                 <div className="p-4 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Lock className="h-8 w-8" />
                 </div>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground">2. Admin Mediation</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Our team reviews your request. If approved, we facilitate a secure introduction or pass order details to the goldsmith.
              </p>
            </div>
            <div className="grid gap-3 text-center group">
               <div className="flex justify-center items-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Sparkles className="h-8 w-8" />
                  </div>
               </div>
              <h3 className="text-xl font-semibold text-primary-foreground">3. Create & Receive</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Communicate via the platform to finalize details. Your chosen artisan crafts your piece, and you receive your dream jewelry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Goldsmiths Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/60 to-background">
        <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">Meet Our Talented Artisans</h2>
            <p className="mx-auto max-w-[650px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover skilled goldsmiths ready to craft your next masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 bg-card border-primary/20 overflow-hidden group">
                <CardHeader className="p-0 relative">
                  <Image
                    src={`https://picsum.photos/seed/goldsmith${i}/400/250`}
                    alt={`Featured Goldsmith ${i}`}
                    width={400}
                    height={250}
                    className="object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="jewelry goldsmith profile"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardHeader>
                 <CardContent className="p-6 text-left space-y-3">
                  <CardTitle className="text-xl text-primary-foreground mb-1">Artisan Jewelers {i}</CardTitle>
                  <CardDescription className="flex items-center text-foreground text-sm">
                    <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" /> Cityville, ST
                  </CardDescription>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">Specializing in custom engagement rings and intricate designs.</p>
                   <Link
                      href={`/goldsmith/artisan-${i}`}
                      className={cn(
                         buttonVariants({ variant: "outline", size: "sm" }),
                         'text-accent border-accent hover:bg-accent/10 mt-4 w-full'
                      )}
                    >
                      <span>View Profile</span>
                   </Link>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-16">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'lg', variant: 'outline' }),
                   'border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
                 )}
               >
                 <span>Explore All Goldsmiths</span>
               </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 lg:py-28 border-t border-border/20 bg-gradient-to-t from-secondary/40 to-background"> {/* Reduced py- from 32 to 28 */}
        <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
          <div className="space-y-5">
             <GoldsmithIcon />
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[650px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'lg' }),
                   'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
                 )}
               >
                 <span>
                   Start Your Search
                    <Search className="ml-2 h-5 w-5 inline" />
                 </span>
              </Link>
              <Link
                 href="/goldsmith-portal/register"
                 className={cn(
                   buttonVariants({ variant: 'outline', size: 'lg' }), // Changed variant to outline
                   'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10' // Added accent colors
                 )}
               >
                 <span>
                   Register as a Goldsmith
                     <CircleCheckBig className="ml-2 h-5 w-5 inline" />
                 </span>
               </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
