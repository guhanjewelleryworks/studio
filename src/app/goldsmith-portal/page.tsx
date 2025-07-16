

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Users, Handshake, Palette } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';


export default function GoldsmithPortalPage() {
  return (
    <div className="flex flex-col items-center bg-background min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-secondary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 xl:items-center">
            <div className="flex flex-col justify-center space-y-3">
              <div className="space-y-1.5">
                 <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm font-poppins">Goldsmith Partner Portal</div>
                <h1 className="font-heading text-foreground leading-tight">
                  Showcase Your Artistry, Expand Your Reach
                </h1>
                <p className="max-w-[600px] text-foreground/85 md:text-lg leading-relaxed">
                  Join Goldsmith Connect to receive custom order inquiries, manage your bespoke creations, and connect with a discerning clientele passionate about fine jewelry.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-1.5">
                <Link
                  href="/goldsmith-portal/register"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'default' }),
                    'shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-2 text-base bg-primary text-primary-foreground hover:bg-primary/90' // Removed transform
                  )}
                >
                  <span>Register Your Workshop</span>
                </Link>
                <Link
                  href="/goldsmith-portal/login"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'shadow-lg hover:shadow-xl transition-all duration-300 border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2 text-base' // Removed transform
                  )}
                >
                  <span>Login to Dashboard</span>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl group border-2 border-primary/20">
              <Image
                src="/images/goldsmith_crafting.png"
                alt="Goldsmith crafting a detailed piece of jewelry with a torch"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
                data-ai-hint="jewelry hero background"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-black/5 to-black/20 pointer-events-none group-hover:bg-black/5 transition-colors"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8">
            <div className="space-y-1">
              <h2 className="font-heading text-foreground">Why Partner with Goldsmith Connect?</h2>
              <p className="max-w-[850px] text-muted-foreground md:text-base/relaxed lg:text-sm/relaxed xl:text-lg/relaxed">
                Expand your reach, streamline your custom orders, and focus on what you do best – creating beautiful, timeless jewelry.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:max-w-none pt-6 md:pt-8">
            {[
              { icon: Users, title: "Connect with Clients", description: "Receive curated custom order requests from customers seeking unique, handcrafted jewelry." },
              { icon: Palette, title: "Showcase Your Craft", description: "Build a stunning portfolio to display your unique style and expertise to a targeted audience." },
              { icon: DollarSign, title: "Streamline Orders", description: "Manage inquiries, communications, and order progress through your dedicated dashboard." }
            ].map((benefit, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 rounded-xl flex flex-col text-center p-4">
                <CardHeader className="items-center pb-1.5">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary mb-1.5 shadow-md">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-md text-accent">{benefit.title}</CardTitle>
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
      <section className="w-full py-12 md:py-16 lg:py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8">
            <div className="space-y-1">
              <h2 className="font-heading text-foreground">Joining is Simple</h2>
               <p className="max-w-[850px] text-muted-foreground md:text-base/relaxed lg:text-sm/relaxed xl:text-lg/relaxed">
                Start connecting with customers in just a few easy steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-4 md:grid-cols-3 pt-6 md:pt-8">
             {[
               { step: 1, title: "Register Profile", description: "Sign up and create your detailed goldsmith profile. Showcase your workshop, specialties, and unique style." },
               { step: 2, title: "Verification Process", description: "Our team will review and verify your details to maintain a high standard of quality and trust within our network." },
               { step: 3, title: "Start Connecting", description: "Once approved, you'll begin receiving order inquiries and can manage everything from your personalized dashboard." },
             ].map((item) => (
               <div key={item.step} className="grid gap-1 text-center items-center p-2 rounded-lg hover:bg-card/60 transition-colors">
                  <div className="flex justify-center items-center mb-1.5">
                   <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg font-poppins">{item.step}</span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-accent">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-border/15 bg-background">
        <div className="container grid items-center justify-center gap-2 px-4 text-center md:px-6">
          <div className="space-y-1.5">
             <Handshake className="h-8 w-8 mx-auto text-primary mb-1" />
            <h2 className="font-heading text-foreground">
              Ready to Elevate Your Goldsmith Business?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-base/relaxed lg:text-sm/relaxed xl:text-lg/relaxed">
              Join our growing network of skilled artisans. Register today and start receiving custom orders, connecting you with clients who appreciate true craftsmanship.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-2">
             <Link
                href="/goldsmith-portal/register"
                className={cn(
                    buttonVariants({ size: 'lg', variant: 'default' }),
                    'shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full px-6 py-2 text-base bg-primary text-primary-foreground hover:bg-primary/90' // Removed transform
                )}
              >
                <span>
                  Register Now
                  <CheckCircle className="ml-1 h-4 w-4 inline" />
                </span>
              </Link>
             <Link
               href="/contact?subject=GoldsmithInquiry"
               className={cn(
                   buttonVariants({ variant: 'link', size: 'lg' }),
                   'text-primary hover:text-primary/80 text-base'
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
