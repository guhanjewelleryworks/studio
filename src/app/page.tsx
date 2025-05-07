
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Handshake, Gift, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GoldsmithIcon } from '@/components/icons/goldsmith-icon';

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
          <path d="M0 80L80 0ZM80 80L0 0Z" className="stroke-primary/40 fill-none"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
    </svg>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-10 md:py-12 lg:py-16 bg-gradient-to-br from-secondary/30 via-background to-background overflow-hidden">
        <HeroPattern />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-4 lg:grid-cols-[1fr_500px] lg:gap-6 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-1.5">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl/none text-primary-foreground leading-tight">
                  Discover Local Goldsmiths, Craft Your Dreams
                </h1>
                <p className="max-w-[600px] text-foreground/75 md:text-lg leading-relaxed">
                  Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 min-[400px]:flex-row pt-0.5">
                 <Link
                   href="/discover"
                   className={cn(
                     buttonVariants({ size: 'lg', variant: 'default' }),
                     'shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2.5 text-base'
                   )}
                 >
                   <span>
                     Find a Goldsmith
                     <MapPin className="ml-1.5 h-4 w-4 inline" />
                   </span>
                 </Link>
                 <Link
                   href="/goldsmith-portal"
                   className={cn(
                     buttonVariants({ variant: 'outline', size: 'lg' }),
                     'shadow-md hover:shadow-lg transition-shadow border-accent text-accent-foreground hover:bg-accent/10 rounded-full px-6 py-2.5 text-base'
                   )}
                 >
                   <span>
                     Join as a Goldsmith
                     <GoldsmithIcon className="ml-1.5 h-4 w-4 inline" />
                   </span>
                 </Link>
              </div>
            </div>
            <Image
              src="https://picsum.photos/seed/goldsmith-landing-hero/800/600"
              alt="Elegant Jewelry Background"
              width={600}
              height={550}
              className="mx-auto aspect-[6/5.5] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-xl border-2 border-primary/10 transition-transform duration-300 hover:scale-105"
              data-ai-hint="elegant jewelry"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-8 md:py-10 lg:py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
            <div className="space-y-0.5">
              <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">How It Works</div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">Your Secure Path to Custom Jewelry</h2>
              <p className="max-w-[800px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
                We connect you with talented goldsmiths through a verified and mediated process, ensuring quality and trust.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:max-w-none pt-5 md:pt-6">
            {[
              { icon: Search, title: "1. Discover & Inquire", description: "Browse verified goldsmith profiles. Submit an introduction or custom order request through our elegant platform." },
              { icon: ShieldCheck, title: "2. Admin Mediation", description: "Our team reviews your request, ensuring a secure and smooth process. We facilitate introductions and order details." },
              { icon: Gift, title: "3. Create & Cherish", description: "Collaborate with your chosen artisan. They craft your piece with passion, and you receive your dream jewelry." },
            ].map((step, index) => (
              <div key={index} className="grid gap-0.5 text-center group p-2.5 rounded-xl bg-card hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary/20">
                <div className="flex justify-center items-center mb-1">
                   <div className="p-2 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                      <step.icon className="h-5 w-5" />
                   </div>
                </div>
                <h3 className="text-md font-semibold text-foreground">{step.title}</h3>
                <p className="text-xs text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Goldsmiths Section */}
      <section className="w-full py-8 md:py-10 lg:py-12 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container grid items-center justify-center gap-2.5 px-4 text-center md:px-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl/tight text-foreground">Meet Our Talented Artisans</h2>
            <p className="mx-auto max-w-[600px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
              Discover skilled goldsmiths ready to craft your next masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 overflow-hidden group rounded-xl">
                <CardHeader className="p-0 relative">
                  <Image
                    src={`https://picsum.photos/seed/goldsmith-featured${i}/400/250`}
                    alt={`Featured Goldsmith ${i}`}
                    width={400}
                    height={250}
                    className="object-cover w-full aspect-video group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="jewelry goldsmith profile"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                     <h3 className="text-md font-semibold text-white">Artisan Jewelers {i}</h3>
                   </div>
                </CardHeader>
                 <CardContent className="p-2 text-left space-y-0.5">
                   <CardTitle className="text-md text-foreground mb-0.5 group-hover:text-primary transition-colors">Artisan Jewelers {i}</CardTitle>
                  <CardDescription className="flex items-center text-foreground/70 text-[0.7rem]">
                    <MapPin className="mr-1 h-3 w-3 text-muted-foreground" /> Cityville, ST
                  </CardDescription>
                  <p className="text-[0.7rem] text-foreground/80 leading-relaxed line-clamp-2">Specializing in custom engagement rings and intricate designs with a classic flair.</p>
                   <Link
                      href={`/goldsmith/artisan-${i}`} 
                      className={cn(
                         buttonVariants({ variant: "outline", size: "xs" }),
                         'text-accent-foreground border-accent hover:bg-accent/10 mt-1 w-full rounded-full text-[0.65rem] py-1'
                      )}
                    >
                      <span>View Profile</span>
                   </Link>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-5 md:mt-6">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'default', variant: 'outline' }),
                   'border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm'
                 )}
               >
                 <span>Explore All Goldsmiths</span>
               </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-8 md:py-10 lg:py-12 border-t border-border/10 bg-gradient-to-t from-secondary/10 to-background">
        <div className="container grid items-center justify-center gap-2 px-4 text-center md:px-6">
          <div className="space-y-1">
             <Handshake className="h-8 w-8 mx-auto text-primary mb-0.5" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl/tight text-foreground">
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
              Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 min-[400px]:flex-row justify-center pt-0.5">
              <Link
                 href="/discover"
                 className={cn(
                   buttonVariants({ size: 'default', variant: 'default' }),
                   'shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm'
                 )}
               >
                 <span>
                   Start Your Search
                    <Search className="ml-1.5 h-4 w-4 inline" />
                 </span>
              </Link>
              <Link
                href="/goldsmith-portal/register"
                className={cn(
                  buttonVariants({ size: 'default', variant: 'outline' }),
                  'shadow-md hover:shadow-lg transition-shadow border-accent text-accent-foreground hover:bg-accent/10 rounded-full px-6 py-2 text-sm'
                )}
              >
                <span>
                  Register as a Goldsmith
                  <GoldsmithIcon className="ml-1.5 h-4 w-4 inline" />
                </span>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
