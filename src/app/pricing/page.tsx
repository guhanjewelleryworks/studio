import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Import cn

// Placeholder pricing tiers
const tiers = [
  {
    name: 'Customer Basic',
    id: 'tier-customer-basic',
    href: '/signup', // Link to signup or relevant upgrade path
    priceMonthly: '$X',
    description: 'Browse goldsmith profiles and general information.',
    features: [
      'View goldsmith portfolios',
      'See general location',
      'Submit order inquiries (Admin mediated)',
    ],
    mostPopular: false,
  },
  {
    name: 'Customer Premium',
    id: 'tier-customer-premium',
    href: '/signup', // Link to signup or relevant upgrade path
    priceMonthly: '$Y',
    description: 'Unlock direct communication features after admin approval.',
    features: [
      'All Basic features',
      'Request direct introduction (Admin approved)',
      'Priority support',
      // Add more features
    ],
    mostPopular: true,
  },
  {
    name: 'Goldsmith Partner',
    id: 'tier-goldsmith-partner',
    href: '/goldsmith-portal/register', // Link to registration
    priceMonthly: '$Z', // Or commission based
    description: 'Receive curated order requests and showcase your work.',
    features: [
      'Verified profile listing',
      'Receive admin-approved order requests',
      'Secure communication channel (Admin mediated)',
      'Portfolio showcase',
      // Add more features
    ],
    mostPopular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-background to-secondary py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Connect Through Goldsmith Connect
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-foreground">
          Choose the plan that best suits your needs. We facilitate connections between customers and skilled goldsmiths. Direct contact details are shared upon subscription and admin approval.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 md:max-w-2xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`shadow-lg border-primary/30 flex flex-col justify-between ${
                tier.mostPopular ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold leading-6 text-primary-foreground">{tier.name}</CardTitle>
                <CardDescription className="mt-4 text-sm leading-6 text-muted-foreground">{tier.description}</CardDescription>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">{tier.priceMonthly}</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Link
                  href={tier.href}
                  className={cn(
                      buttonVariants({ variant: tier.mostPopular ? 'default' : 'secondary' }),
                      'w-full shadow-md'
                  )}
                >
                  <span>{tier.id.includes('customer') ? 'Get started' : 'Register Now'}</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-12">
           * Pricing is illustrative. Please define your actual subscription model and fees.
        </p>
      </div>
    </div>
  );
}
