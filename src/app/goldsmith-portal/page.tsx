
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
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2.5">
                 <div className="inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm font-poppins">Goldsmith Partner Portal</div>
                <h1 className="font-heading text-foreground leading-tight"> {/* Removed size and weight, will inherit from global h1 */}
                  Showcase Your Artistry, Expand Your Reach
                </h1>
                <p className="max-w-[600px] text-foreground/85 md:text-lg leading-relaxed">
                  Join Goldsmith Connect to receive custom order inquiries, manage your bespoke creations, and connect with a discerning clientele passionate about fine jewelry.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 min-[400px]:flex-row pt-1.5">
                <Link
                  href="/goldsmith-portal/register"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'default' }), 
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-8 py-3 text-base' // Buttons already use Poppins
                  )}
                >
                  <span>Register Your Workshop</span>
                </Link>
                <Link
                  href="/goldsmith-portal/login"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-primary text-primary hover:bg-primary/10 rounded-full px-8 py-3 text-base' 
                  )}
                >
                  <span>Login to Dashboard</span>
                </Link>
              </div>
            </div>
             <Image
              src="https://images.unsplash.com/photo-1596548405158-809386f68048?q=80&w=800&auto=format&fit=crop"
              alt="Goldsmith crafting jewelry"
              width={600}
              height={450}
              className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full shadow-2xl border-2 border-primary/15 transition-transform duration-300 hover:scale-105"
              data-ai-hint="goldsmith crafting jewelry"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-16 lg:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="space-y-1.5">
              <h2 className="font-heading text-foreground">Why Partner with Goldsmith Connect?</h2> {/* Removed size and weight */}
              <p className="max-w-[850px] text-foreground/85 md:text-base/relaxed lg:text-md/relaxed xl:text-lg/relaxed">
                Expand your reach, streamline your custom orders, and focus on what you do best – creating beautiful, timeless jewelry.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:max-w-none pt-10 md:pt-12">
            {[
              { icon: Users, title: "Connect with Clients", description: "Receive curated custom order requests from customers seeking unique, handcrafted jewelry." },
              { icon: Palette, title: "Showcase Your Craft", description: "Build a stunning portfolio to display your unique style and expertise to a targeted audience." },
              { icon: DollarSign, title: "Streamline Orders", description: "Manage inquiries, communications, and order progress through your dedicated dashboard." }
            ].map((benefit, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card border-primary/10 rounded-xl flex flex-col text-center p-5">
                <CardHeader className="items-center pb-2.5">
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary mb-2.5 shadow-md">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle> {/* CardTitle uses font-heading */}
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
      <section className="w-full py-12 md:py-16 lg:py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="space-y-1.5">
              <h2 className="font-heading text-foreground">Joining is Simple</h2> {/* Removed size and weight */}
               <p className="max-w-[850px] text-foreground/85 md:text-base/relaxed lg:text-md/relaxed xl:text-lg/relaxed">
                Start connecting with customers in just a few easy steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-6 md:grid-cols-3 pt-10 md:pt-12">
             {[
               { step: 1, title: "Register Profile", description: "Sign up and create your detailed goldsmith profile. Showcase your workshop, specialties, and unique style." },
               { step: 2, title: "Verification Process", description: "Our team will review and verify your details to maintain a high standard of quality and trust within our network." },
               { step: 3, title: "Start Connecting", description: "Once approved, you'll begin receiving order inquiries and can manage everything from your personalized dashboard." },
             ].map((item) => (
               <div key={item.step} className="grid gap-1.5 text-center items-center p-3 rounded-lg hover:bg-card/60 transition-colors">
                  <div className="flex justify-center items-center mb-2.5">
                   <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg font-poppins">{item.step}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed"> {/* text-foreground/70 might be too light */}
                    {item.description}
                  </p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-border/15 bg-background">
        <div className="container grid items-center justify-center gap-3 px-4 text-center md:px-6">
          <div className="space-y-3">
             <Handshake className="h-10 w-10 mx-auto text-primary mb-1.5" />
            <h2 className="font-heading text-foreground"> {/* Removed size and weight */}
              Ready to Elevate Your Goldsmith Business?
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/85 md:text-base/relaxed lg:text-md/relaxed xl:text-lg/relaxed">
              Join our growing network of skilled artisans. Register today and start receiving custom orders, connecting you with clients who appreciate true craftsmanship.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 min-[400px]:flex-row justify-center pt-3">
             <Link
                href="/goldsmith-portal/register"
                className={cn(
                    buttonVariants({ size: 'lg', variant: 'default' }), 
                    'shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-10 py-3 text-base'
                )}
              >
                <span>
                  Register Now
                  <CheckCircle className="ml-2 h-4 w-4 inline" />
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
