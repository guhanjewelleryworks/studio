import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Users, Edit3, Gift } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';


export default function GoldsmithPortalPage() {
  return (
    <div className="flex flex-col items-center bg-background">
      {/* Hero Section */}
      <section className="w-full py-10 md:py-12 lg:py-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-8 xl:items-center">
            <div className="flex flex-col justify-center space-y-3.5">
              <div className="space-y-2">
                 <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">Goldsmith Partner Portal</div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl/none text-primary-foreground leading-tight">
                  Showcase Your Artistry, Expand Your Reach
                </h1>
                <p className="max-w-[550px] text-foreground/80 md:text-lg leading-relaxed">
                  Join Goldsmith Connect to receive custom order inquiries, manage your bespoke creations, and connect with a discerning clientele passionate about fine jewelry.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-1">
                <Link
                  href="/goldsmith-portal/register"
                  className={cn(
                    buttonVariants({ size: 'default', variant: 'default' }), 
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-6 py-2 text-sm'
                  )}
                >
                  <span>Register Your Workshop</span>
                </Link>
                <Link
                  href="/goldsmith-portal/login"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'default' }),
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground rounded-full px-6 py-2 text-sm'
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
              className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full shadow-xl border-2 border-primary/10"
              data-ai-hint="modern goldsmith studio"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-10 md:py-12 lg:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary-foreground">Why Partner with Goldsmith Connect?</h2>
              <p className="max-w-[800px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
                Expand your reach, streamline your custom orders, and focus on what you do best – creating beautiful, timeless jewelry.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:max-w-none pt-8 md:pt-10">
            {[
              { icon: Users, title: "Connect with Clients", description: "Receive curated custom order requests from customers seeking unique, handcrafted jewelry." },
              { icon: Edit3, title: "Showcase Your Craft", description: "Build a stunning portfolio to display your unique style and expertise to a targeted audience." },
              { icon: DollarSign, title: "Streamline Orders", description: "Manage inquiries, communications, and order progress through your dedicated dashboard." }
            ].map((benefit, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 rounded-xl flex flex-col text-center p-4">
                <CardHeader className="items-center pb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary mb-2">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-primary-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* How to Join Section */}
      <section className="w-full py-10 md:py-12 lg:py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary-foreground">Joining is Simple</h2>
               <p className="max-w-[800px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
                Start connecting with customers in just a few easy steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-5 md:grid-cols-3 pt-8 md:pt-10">
             {[
               { step: 1, title: "Register Profile", description: "Sign up and create your detailed goldsmith profile. Showcase your workshop, specialties, and unique style." },
               { step: 2, title: "Verification Process", description: "Our team will review and verify your details to maintain a high standard of quality and trust within our network." },
               { step: 3, title: "Start Connecting", description: "Once approved, you'll begin receiving order inquiries and can manage everything from your personalized dashboard." },
             ].map((item) => (
               <div key={item.step} className="grid gap-1 text-center items-center p-2.5 rounded-lg hover:bg-card/50 transition-colors">
                  <div className="flex justify-center items-center mb-2">
                   <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md">{item.step}</span>
                  </div>
                  <h3 className="text-md font-semibold text-primary-foreground">{item.title}</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-10 md:py-12 lg:py-16 border-t border-border/10">
        <div className="container grid items-center justify-center gap-2.5 px-4 text-center md:px-6">
          <div className="space-y-2.5">
             <Gift className="h-9 w-9 mx-auto text-primary mb-1" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl/tight text-primary-foreground">
              Ready to Elevate Your Goldsmith Business?
            </h2>
            <p className="mx-auto max-w-[550px] text-foreground/70 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
              Join our growing network of skilled artisans. Register today and start receiving custom orders, connecting you with clients who appreciate true craftsmanship.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-2.5">
             <Link
                href="/goldsmith-portal/register"
                className={cn(
                    buttonVariants({ size: 'default', variant: 'premium' }), 
                    'shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-8 py-2 text-sm'
                )}
              >
                <span>
                  Register Now
                  <CheckCircle className="ml-1.5 h-3.5 w-3.5 inline" />
                </span>
              </Link>
             <Link
               href="/contact?subject=GoldsmithInquiry"
               className={cn(
                   buttonVariants({ variant: 'link', size: 'default' }),
                   'text-accent hover:text-accent/80 text-sm'
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
