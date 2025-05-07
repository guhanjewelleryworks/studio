
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShieldCheck, Gift, MapPin, Handshake } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// import { GoldsmithIcon } from '@/components/icons/goldsmith-icon'; // Corrected import path


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
          <path d="M0 80L80 0ZM80 80L0 0Z" className="stroke-primary/40 fill-none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-pattern)" />
    </svg>
  </div>
);


export default function Home() {
  const featuredGoldsmiths = [
    { id: 'artisan-1', name: 'Lumière Jewels', location: 'Cityville, ST', specialty: 'Engagement Rings, Custom Designs', imageUrl: 'https://picsum.photos/seed/lumiere-home/400/250', dataAiHint: "jewelry goldsmith profile" },
    { id: 'artisan-2', name: 'Aura & Gold', location: 'Townsville, ST', specialty: 'Custom Pendants, Gold & Platinum', imageUrl: 'https://picsum.photos/seed/aura-home/400/250', dataAiHint: "jewelry goldsmith workshop" },
    { id: 'artisan-3', name: 'Heritage Metalsmiths', location: 'Villagetown, ST', specialty: 'Antique Restoration, Heirloom Redesign', imageUrl: 'https://picsum.photos/seed/heritage-home/400/250', dataAiHint: "goldsmith tools" },
  ];

  const howItWorksSteps = [
    { icon: Search, title: "1. Discover & Inquire", description: "Browse verified goldsmith profiles. Submit an introduction or custom order request through our elegant platform." },
    { icon: ShieldCheck, title: "2. Admin Mediation", description: "Our team reviews your request, ensuring a secure and smooth process. We facilitate introductions and order details." },
    { icon: Gift, title: "3. Create & Cherish", description: "Collaborate with your chosen artisan. They craft your piece with passion, and you receive your dream jewelry." },
  ];

  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-secondary/10 to-background overflow-hidden"> {/* Reduced py */}
        <HeroPattern />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-8 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-3 md:space-y-4"> {/* Reduced space-y */}
              <div className="space-y-2"> {/* Reduced space-y */}
                <h1 className="font-heading text-accent leading-tight text-3xl sm:text-4xl xl:text-5xl/none"> {/* Use text-accent */}
                  Discover Local Goldsmiths,
                  <br />
                  <span className="text-primary">Craft Your Dreams.</span>
                </h1>
                <p className="max-w-[600px] text-foreground/85 md:text-base lg:text-lg leading-relaxed"> {/* Adjusted text size for md */}
                  Goldsmith Connect links you with skilled artisans in your area through a secure, mediated process. Find the perfect goldsmith to bring your custom jewelry vision to life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-1">
                <Link
                  href="/discover"
                  className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2.5 text-sm")}  /* Adjusted py and text size */
                >
                  <span>Find a Goldsmith <MapPin className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
                </Link>
                <Link
                  href="/goldsmith-portal"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2.5 text-sm")}  /* Adjusted py, text size and hover:text-primary-foreground */
                >
                   <span>Join as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
                </Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-[6/5.5] w-full lg:order-last group rounded-xl shadow-xl overflow-hidden border-2 border-primary/10">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-dea6284784f2?q=80&w=800&auto=format&fit=crop"
                alt="Elegant Jewelry Background"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 550px"
                data-ai-hint="luxury jewelry piece"
                priority
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-black/5 to-black/20 pointer-events-none group-hover:bg-black/5 transition-colors"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-16 lg:py-20 bg-background"> {/* Reduced py */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6 md:mb-8"> {/* Reduced mb */}
            <div className="space-y-1.5"> {/* Reduced space-y */}
              <div className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm">How It Works</div>
              <h2 className="font-heading text-accent text-2xl sm:text-3xl">Your Secure Path to Custom Jewelry</h2> {/* Use text-accent */}
              <p className="max-w-[800px] text-muted-foreground md:text-sm lg:text-base/relaxed xl:text-base/relaxed"> {/* Adjusted text size */}
                We connect you with talented goldsmiths through a verified and mediated process, ensuring quality and trust.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-4 md:gap-5 lg:grid-cols-3 lg:max-w-none pt-4 md:pt-6"> {/* Reduced gap and pt */}
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="grid gap-1 text-center group p-3 rounded-xl bg-card hover:shadow-lg transition-shadow duration-300 border border-primary/10 hover:border-primary/30">
                <div className="flex justify-center items-center mb-1"> {/* Reduced mb */}
                  <div className="p-2 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-md">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-heading font-semibold text-accent">{step.title}</h3> {/* Use text-accent */}
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Goldsmiths Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/10 to-background"> {/* Reduced py */}
        <div className="container grid items-center justify-center gap-3 px-4 text-center md:px-6">
          <div className="space-y-1.5 mb-4 md:mb-6"> {/* Reduced mb */}
            <h2 className="font-heading text-accent text-2xl sm:text-3xl">Meet Our Talented Artisans</h2> {/* Use text-accent */}
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-sm lg:text-base/relaxed xl:text-base/relaxed"> {/* Adjusted text size */}
              Discover skilled goldsmiths ready to craft your next masterpiece.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-3 md:pt-4"> {/* Reduced gap and pt */}
            {featuredGoldsmiths.map((goldsmith) => (
              <Card key={goldsmith.id} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 overflow-hidden group rounded-xl"> {/* Adjusted border */}
                <CardHeader className="p-0 relative">
                  <Image
                    src={goldsmith.imageUrl}
                    alt={goldsmith.name}
                    width={400}
                    height={200}
                    className="object-cover w-full aspect-video group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={goldsmith.dataAiHint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2"> {/* Reduced p */}
                    <h3 className="text-base font-semibold text-white font-poppins">{goldsmith.name}</h3> {/* Use text-white for overlay */}
                  </div>
                </CardHeader>
                <CardContent className="p-2.5 text-left space-y-0.5"> {/* Reduced p */}
                  <CardTitle className="text-base text-accent group-hover:text-primary transition-colors">{goldsmith.name}</CardTitle> {/* Use text-accent */}
                  <p className="flex items-center text-muted-foreground text-xs">
                     <MapPin className="mr-1 h-3 w-3 text-muted-foreground" /> {goldsmith.specialty}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    A master of timeless designs and intricate details, located in {goldsmith.location}.
                  </p>
                  <Link href={`/goldsmith/${goldsmith.id}`} className={cn(buttonVariants({ variant: "outline", size: "xs" }), "text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground mt-1 w-full rounded-full text-[0.65rem] py-1")}> {/* Adjusted mt and py */}
                    <span>View Profile</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-5 md:mt-6"> {/* Reduced mt */}
            <Link
              href="/discover"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm")} /* Adjusted text size */
            >
              <span>Explore All Goldsmiths</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-border/10 bg-gradient-to-t from-secondary/10 to-background"> {/* Reduced py and border */}
        <div className="container grid items-center justify-center gap-2 px-4 text-center md:px-6"> {/* Reduced gap */}
          <div className="space-y-1 mb-2 md:mb-3"> {/* Reduced space-y and mb */}
             <Handshake className="h-7 w-7 mx-auto text-primary mb-0.5" /> {/* Reduced size and mb */}
            <h2 className="font-heading text-accent text-2xl sm:text-3xl"> {/* Use text-accent */}
              Ready to Create or Connect?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-sm lg:text-base/relaxed xl:text-base/relaxed"> {/* Adjusted text size */}
              Whether you're looking for a custom piece or you're a goldsmith ready to showcase your craft, Goldsmith Connect is your platform.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-0.5"> {/* Reduced pt */}
            <Link
              href="/discover"
              className={cn(buttonVariants({ size: 'lg', variant: 'default' }), "shadow-md hover:shadow-lg transition-shadow rounded-full px-6 py-2 text-sm")} /* Adjusted text size */
            >
              <span>Start Your Search <Search className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
            </Link>
            <Link
              href="/goldsmith-portal/register"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2 text-sm")} /* Adjusted text size and hover:text-primary-foreground */
            >
               <span>Register as a Goldsmith <UserCheck className="ml-1.5 h-4 w-4 inline" /></span> {/* Adjusted icon margin */}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
