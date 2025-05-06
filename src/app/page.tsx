import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Sparkles, UserCheck, Lock, CircleCheckBig, Handshake } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 lg:py-28 xl:py-32 bg-gradient-to-br from-secondary/80 via-background to-background"> {/* Reduced py */}
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_450px] lg:gap-10 xl:grid-cols-[1fr_550px]"> {/* Reduced gap */}
            <div className="flex flex-col justify-center space-y-4"> {/* Reduced space-y */}
              <div className="space-y-2"> {/* Reduced space-y */}
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-primary-foreground">
                  Discover Local Goldsmiths, Craft Your Dreams
                </h1>
                <p className="max-w-[650px] text-foreground md:text-xl leading-relaxed">
                  Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row"> {/* Reduced gap */}
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
      <section id="how-it-works" className="w-full py-12 md:py-20 lg:py-24 bg-background"> {/* Reduced py */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center"> {/* Reduced space-y */}
            <div className="space-y-2"> {/* Reduced space-y */}
              <div className="inline-block rounded-lg bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-primary-foreground">Your Secure Path to Custom Jewelry</h2>
              <p className="max-w-[900px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We connect you with talented goldsmiths through a verified and mediated process.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:max-w-none pt-10 md:pt-12"> {/* Reduced gap, adjusted pt */}
            <div className="grid gap-1.5 text-center group"> {/* Reduced gap */}
              <div className="flex justify-center items-center mb-2.5"> {/* Reduced mb */}
                 <div className="p-2.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"> {/* Reduced p */}
                    <Search className="h-6 w-6" /> {/* Slightly smaller icon */}
                 </div>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground">1. Discover & Inquire</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Browse verified goldsmith profiles. Submit an introduction or custom order request via our platform.
              </p>
            </div>
            <div className="grid gap-1.5 text-center group"> {/* Reduced gap */}
               <div className="flex justify-center items-center mb-2.5"> {/* Reduced mb */}
                 <div className="p-2.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"> {/* Reduced p */}
                    <Lock className="h-6 w-6" /> {/* Slightly smaller icon */}
                 </div>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground">2. Admin Mediation</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Our team reviews your request. If approved, we facilitate a secure introduction or pass order details to the goldsmith.
              </p>
            </div>
            <div className="grid gap-1.5 text-center group"> {/* Reduced gap */}
               <div className="flex justify-center items-center mb-2.5"> {/* Reduced mb */}
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"> {/* Reduced p */}
                    <Sparkles className="h-6 w-6" /> {/* Slightly smaller icon */}
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
      <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-b from-secondary/60 to-background"> {/* Reduced py */}
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6"> {/* Reduced gap */}
          <div className="space-y-2"> {/* Reduced space-y */}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">Meet Our Talented Artisans</h2>
            <p className="mx-auto max-w-[650px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover skilled goldsmiths ready to craft your next masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8"> {/* Reduced gap, pt */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/20 overflow-hidden group"> {/* Reduced hover translate */}
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
                 <CardContent className="p-4 text-left space-y-1.5"> {/* Reduced p, space-y */}
                  <CardTitle className="text-xl text-primary-foreground">Artisan Jewelers {i}</CardTitle> {/* Removed mb */}
                  <CardDescription className="flex items-center text-foreground text-sm">
                    <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" /> Cityville, ST
                  </CardDescription>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">Specializing in custom engagement rings and intricate designs.</p>
                   <Link
                      href={`/goldsmith/artisan-${i}`}
                      className={cn(
                         buttonVariants({ variant: "outline", size: "sm" }),
                         'text-accent border-accent hover:bg-accent/10 mt-2.5 w-full' // Reduced mt
                      )}
                    >
                      <span>View Profile</span>
                   </Link>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-8 md:mt-10"> {/* Reduced mt */}
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
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-border/20 bg-gradient-to-t from-secondary/40 to-background"> {/* Reduced py */}
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6"> {/* Reduced gap */}
          <div className="space-y-2"> {/* Reduced space-y */}
             <Handshake className="h-10 w-10 mx-auto text-primary mb-2" /> {/* Replaced icon and adjusted size/margin */}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[650px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 min-[400px]:flex-row justify-center"> {/* Reduced gap */}
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
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10'
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
