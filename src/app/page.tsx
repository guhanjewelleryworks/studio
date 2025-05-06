import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Sparkles, UserCheck, Lock, CircleCheckBig, Handshake, Gift, ShieldCheck, Gem } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Subtle pattern for hero section
const HeroPattern = () => (
  <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(farthest-side_at_top_left,white,transparent)]">
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern
          id="hero-pattern"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <path d="M0 80L80 0ZM80 80L0 0Z" className="stroke-primary/50 fill-none"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
    </svg>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-36 xl:pt-24 xl:pb-40 bg-gradient-to-br from-secondary/50 via-background to-background overflow-hidden">
        <HeroPattern />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-primary-foreground leading-tight">
                  Craft Your Story, Piece by Piece
                </h1>
                <p className="max-w-[650px] text-foreground/80 md:text-xl leading-relaxed">
                  Goldsmith Connect is your trusted partner in discovering local artisans. Find the perfect goldsmith to bring your unique jewelry vision to life through a secure, mediated, and delightful experience.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                 <Link
                   href="/discover"
                   className={cn(
                     buttonVariants({ size: 'lg' }),
                     'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-base'
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
                     'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full px-8 py-3 text-base'
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
              src="https://picsum.photos/seed/elegant-jewelry/600/550"
              alt="Elegant Jewelry Piece"
              width={600}
              height={550}
              className="mx-auto aspect-[6/5.5] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-2xl border-2 border-primary/20 transition-transform duration-300 hover:scale-105"
              data-ai-hint="elegant jewelry"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-28 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-secondary/70 px-4 py-1.5 text-sm font-medium text-secondary-foreground shadow-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground">Your Journey to Custom Jewelry</h2>
              <p className="max-w-[900px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                We connect you with talented goldsmiths through a verified and mediated process, ensuring quality and trust.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:max-w-none pt-12 md:pt-16">
            {[
              { icon: Search, title: "1. Discover & Inquire", description: "Browse verified goldsmith profiles. Submit an introduction or custom order request through our elegant platform." },
              { icon: ShieldCheck, title: "2. Admin Mediation", description: "Our team reviews your request, ensuring a secure and smooth process. We facilitate introductions and order details." },
              { icon: Gift, title: "3. Create & Cherish", description: "Collaborate with your chosen artisan. They craft your piece with passion, and you receive your dream jewelry." },
            ].map((step, index) => (
              <div key={index} className="grid gap-2 text-center group p-6 rounded-xl bg-card hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/30">
                <div className="flex justify-center items-center mb-3">
                   <div className="p-3 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <step.icon className="h-7 w-7" />
                   </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-foreground">{step.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Goldsmiths Section */}
      <section className="w-full py-16 md:py-24 lg:py-28 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">Meet Our Artisans</h2>
            <p className="mx-auto max-w-[650px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              Discover skilled goldsmiths, each with a unique style, ready to craft your next treasured piece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 overflow-hidden group rounded-xl">
                <CardHeader className="p-0 relative">
                  <Image
                    src={`https://picsum.photos/seed/artisan${i}/400/300`}
                    alt={`Featured Goldsmith ${i}`}
                    width={400}
                    height={300}
                    className="object-cover w-full aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="goldsmith portrait"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                     <h3 className="text-lg font-semibold text-white">Artisan Jewelers {i}</h3>
                   </div>
                </CardHeader>
                 <CardContent className="p-4 text-left space-y-2">
                  <CardDescription className="flex items-center text-foreground/70 text-sm">
                    <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" /> Cityville, ST
                  </CardDescription>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">Specializing in bespoke engagement rings and intricate gemstone settings with a modern touch.</p>
                   <Link
                      href={`/goldsmith/artisan-${i}`}
                      className={cn(
                         buttonVariants({ variant: "outline", size: "sm" }),
                         'text-accent border-accent hover:bg-accent/10 mt-3 w-full rounded-full'
                      )}
                    >
                      <span>View Profile</span>
                   </Link>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-10 md:mt-12">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'lg', variant: 'outline' }),
                   'border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-8 py-3 text-base'
                 )}
               >
                 <span>Explore All Goldsmiths</span>
               </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 border-t border-border/10 bg-gradient-to-t from-secondary/20 to-background">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
             <Gem className="h-12 w-12 mx-auto text-primary mb-2" />
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[650px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              Whether you're looking for a unique custom piece or you're a goldsmith ready to showcase your exceptional craft, Goldsmith Connect is your premier destination.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center pt-2">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'lg' }),
                   'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-base'
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
                  'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full px-8 py-3 text-base'
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
