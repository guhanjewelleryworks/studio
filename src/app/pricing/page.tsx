// src/app/pricing/page.tsx
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchPlatformSettings } from '@/actions/settings-actions';

export default async function PricingPage() {
  const settings = await fetchPlatformSettings();

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
      priceMonthly: `$${settings.customerPremiumPriceMonthly}`,
      priceAnnual: `$${settings.customerPremiumPriceAnnual}`,
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
      priceMonthly: `$${settings.goldsmithPartnerPriceMonthly}`,
      priceAnnual: `$${settings.goldsmithPartnerPriceAnnual}`,
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

  return (
    <div className="bg-gradient-to-br from-background via-secondary/5 to-background py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-4xl text-center mb-8">
           <Sparkles className="h-9 w-9 mx-auto text-primary mb-2" />
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wider font-poppins">Pricing Plans</h2>
          <p className="font-heading mt-1 text-4xl tracking-tight text-foreground sm:text-5xl"> 
            Connect & Create with Goldsmith Connect
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg leading-8 text-muted-foreground mb-10">
          Choose a plan that suits your journey into the world of bespoke jewelry. We facilitate secure and inspiring connections between discerning customers and skilled artisans.
        </p>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-5 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "shadow-xl border-primary/10 flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
                tier.mostPopular ? 'ring-2 ring-primary border-primary bg-primary/5' : 'bg-card'
              )}
            >
              {tier.mostPopular && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider py-1 px-3 text-center font-poppins">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-3 pt-5 px-4">
                <CardTitle className="text-xl leading-6 text-accent">{tier.name}</CardTitle>
                <p className="mt-2.5">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground font-poppins">{tier.priceMonthly}</span>
                  {tier.priceMonthly !== 'Free' && <span className="text-sm font-semibold leading-6 text-muted-foreground font-poppins">/month</span>}
                </p>
                {tier.priceAnnual && tier.priceMonthly !== 'Free' && (
                  <p className="text-xs text-muted-foreground font-poppins mt-0.5">
                    or {tier.priceAnnual}/year
                  </p>
                )}
                <CardDescription className="mt-2.5 text-sm leading-6 text-muted-foreground h-12">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0.5 px-4">
                <ul role="list" className="space-y-1.5 text-sm leading-6 text-foreground/90">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-2 items-center">
                      <Check className="h-3.5 w-3.5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-4 pt-2.5 mt-auto">
                <Link
                  href={tier.href}
                  className={cn(
                      buttonVariants({
                        variant: tier.mostPopular ? 'default' : 'outline',
                        size: 'lg'
                      }),
                      'w-full shadow-md rounded-full text-sm py-2.5',
                      tier.mostPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground'
                  )}
                >
                  <span>{tier.cta}</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
           *All direct contact details are shared upon subscription and admin approval to ensure a secure and trusted environment.
        </p>
      </div>
    </div>
  );
}
