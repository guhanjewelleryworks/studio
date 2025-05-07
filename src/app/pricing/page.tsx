
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Customer Basic',
    id: 'tier-customer-basic',
    href: '/signup', 
    priceMonthly: 'Free', 
    priceAnnual: null,
    description: 'Discover artisans and explore their creations. Perfect for browsing and initial inquiries.',
    features: [
      'View goldsmith portfolios & specialties',
      'See general artisan locations',
      'Submit admin-mediated order inquiries',
      'Save favorite artisans',
    ],
    mostPopular: false,
    cta: 'Get Started',
  },
  {
    name: 'Customer Premium',
    id: 'tier-customer-premium',
    href: '/signup', 
    priceMonthly: '$19', 
    priceAnnual: '$199', 
    description: 'Unlock direct communication and enhanced features for a personalized experience.',
    features: [
      'All Basic features',
      'Request direct introductions (Admin approved)',
      'Priority support for inquiries',
      'Exclusive access to new artisan showcases',
      'Early access to platform features',
    ],
    mostPopular: true,
    cta: 'Go Premium',
  },
  {
    name: 'Goldsmith Partner',
    id: 'tier-goldsmith-partner',
    href: '/goldsmith-portal/register', 
    priceMonthly: '$49', 
    priceAnnual: '$499',
    description: 'Showcase your artistry, receive curated order requests, and grow your bespoke business.',
    features: [
      'Verified profile listing with portfolio showcase',
      'Receive admin-approved custom order requests',
      'Secure, mediated communication channel',
      'Analytics on profile views and inquiries',
      'Featured artisan opportunities',
    ],
    mostPopular: false,
    cta: 'Become a Partner',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-br from-background via-secondary/5 to-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-4xl text-center">
           <Sparkles className="h-10 w-10 mx-auto text-primary mb-2.5" />
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wider">Pricing Plans</h2>
          <p className="mt-1.5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Connect & Create with Goldsmith Connect
          </p>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-foreground/75">
          Choose a plan that suits your journey into the world of bespoke jewelry. We facilitate secure and inspiring connections between discerning customers and skilled artisans.
        </p>
        <div className="isolate mx-auto mt-12 grid max-w-md grid-cols-1 gap-6 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "shadow-xl border-primary/10 flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                tier.mostPopular ? 'ring-2 ring-primary border-primary bg-primary/5' : 'bg-card'
              )}
            >
              {tier.mostPopular && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider py-1.5 px-3 text-center">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-4 pt-6 px-5">
                <CardTitle className="text-xl font-semibold leading-6 text-foreground">{tier.name}</CardTitle>
                <p className="mt-3">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">{tier.priceMonthly}</span>
                  {tier.priceMonthly !== 'Free' && <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>}
                </p>
                {tier.priceAnnual && tier.priceMonthly !== 'Free' && (
                  <p className="text-xs text-muted-foreground">
                    or {tier.priceAnnual}/year
                  </p>
                )}
                <CardDescription className="mt-3 text-sm leading-6 text-muted-foreground h-14">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-1 px-5">
                <ul role="list" className="space-y-2 text-sm leading-6 text-foreground/90">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-2.5 items-center">
                      <Check className="h-4 w-4 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-5 pt-3 mt-auto">
                <Link
                  href={tier.href}
                  className={cn(
                      buttonVariants({ 
                        variant: tier.mostPopular ? 'default' : 'outline', // Default for popular, outline for others for better contrast
                        size: 'lg' 
                      }),
                      'w-full shadow-md rounded-full text-sm py-2.5',
                      tier.mostPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10'
                  )}
                >
                  <span>{tier.cta}</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
           *All direct contact details are shared upon subscription and admin approval to ensure a secure and trusted environment.
        </p>
      </div>
    </div>
  );
}
