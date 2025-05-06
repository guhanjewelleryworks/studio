import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Users, BarChart, Gift, Edit3, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';


export default function GoldsmithPortalPage() {
  return (
    <div className="flex flex-col items-center bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/30 to-background"> {/* Reduced padding */}
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 xl:items-center"> {/* Reduced gap */}
            <div className="flex flex-col justify-center space-y-4"> {/* Reduced space */}
              <div className="space-y-2.5"> {/* Reduced space */}
                 <div className="inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm">Goldsmith Partner Portal</div> {/* Adjusted padding */}
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-primary-foreground leading-tight">
                  Showcase Your Artistry, Expand Your Reach
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl leading-relaxed">
                  Join Goldsmith Connect to receive custom order inquiries, manage your bespoke creations, and connect with a discerning clientele passionate about fine jewelry.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 min-[400px]:flex-row pt-1.5"> {/* Reduced gap and padding */}
                <Link
                  href="/goldsmith-portal/register"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'default' }), 
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-7 py-2.5 text-base' // Adjusted padding
                  )}
                >
                  <span>Register Your Workshop</span>
                </Link>
                <Link
                  href="/goldsmith-portal/login"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full px-7 py-2.5 text-base' // Adjusted padding
                  )}
                >
                  <span>Login to Dashboard</span>
                </Link>
              </div>
            </div>
             <Image
              src="https://picsum.photos/seed/goldsmith-studio/600/450"
              alt="Modern Goldsmith Studio"
              width={600}
              height={450}
              className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full shadow-2xl border-2 border-primary/10"
              data-ai-hint="modern goldsmith studio"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-16 lg:py-20 bg-background"> {/* Reduced padding */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2.5 text-center"> {/* Reduced space */}
            <div className="space-y-1.5"> {/* Reduced space */}
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground">Why Partner with Goldsmith Connect?</h2>
              <p className="max-w-[900px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Expand your reach, streamline your custom orders, and focus on what you do best – creating beautiful, timeless jewelry.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:max-w-none pt-10 md:pt-12"> {/* Reduced gap and padding */}
            {[
              { icon: Users, title: "Connect with Clients", description: "Receive curated custom order requests from customers seeking unique, handcrafted jewelry." },
              { icon: Edit3, title: "Showcase Your Craft", description: "Build a stunning portfolio to display your unique style and expertise to a targeted audience." },
              { icon: DollarSign, title: "Streamline Orders", description: "Manage inquiries, communications, and order progress through your dedicated dashboard." }
            ].map((benefit, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 rounded-xl flex flex-col text-center p-5"> {/* Adjusted padding */}
                <CardHeader className="items-center pb-2.5"> {/* Reduced padding */}
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary mb-2.5"> {/* Adjusted padding and margin */}
                    <benefit.icon className="h-6 w-6" /> {/* Reduced icon size */}
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* How to Join Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-secondary/30"> {/* Reduced padding */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2.5 text-center"> {/* Reduced space */}
            <div className="space-y-1.5"> {/* Reduced space */}
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground">Joining is Simple</h2>
               <p className="max-w-[900px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Start connecting with customers in just a few easy steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-3 pt-10 md:pt-12"> {/* Reduced gap and padding */}
             {[
               { step: 1, title: "Register Profile", description: "Sign up and create your detailed goldsmith profile. Showcase your workshop, specialties, and unique style." },
               { step: 2, title: "Verification Process", description: "Our team will review and verify your details to maintain a high standard of quality and trust within our network." },
               { step: 3, title: "Start Connecting", description: "Once approved, you'll begin receiving order inquiries and can manage everything from your personalized dashboard." },
             ].map((item) => (
               <div key={item.step} className="grid gap-1.5 text-center items-center p-3 rounded-lg hover:bg-card/50 transition-colors"> {/* Adjusted padding and gap */}
                  <div className="flex justify-center items-center mb-2.5"> {/* Adjusted margin */}
                   <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">{item.step}</span> {/* Adjusted size */}
                  </div>
                  <h3 className="text-lg font-semibold text-primary-foreground">{item.title}</h3> {/* Reduced font size */}
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-border/10"> {/* Reduced padding */}
        <div className="container grid items-center justify-center gap-3 px-4 text-center md:px-6"> {/* Reduced gap */}
          <div className="space-y-3"> {/* Reduced space */}
             <Gift className="h-10 w-10 mx-auto text-primary mb-1.5" /> {/* Adjusted size and margin */}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl/tight text-primary-foreground">
              Ready to Elevate Your Goldsmith Business?
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/70 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              Join our growing network of skilled artisans. Register today and start receiving custom orders, connecting you with clients who appreciate true craftsmanship.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 min-[400px]:flex-row justify-center pt-3"> {/* Reduced gap and padding */}
             <Link
                href="/goldsmith-portal/register"
                className={cn(
                    buttonVariants({ size: 'lg', variant: 'premium' }), 
                    'shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-9 py-2.5 text-base' // Adjusted padding
                )}
              >
                <span>
                  Register Now
                  <CheckCircle className="ml-2 h-4 w-4 inline" /> {/* Reduced icon size */}
                </span>
              </Link>
             <Link
               href="/contact?subject=GoldsmithInquiry"
               className={cn(
                   buttonVariants({ variant: 'link', size: 'lg' }),
                   'text-accent hover:text-accent/80 text-base'
                )}
             >
               <span>Have Questions? Contact Us</span>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
