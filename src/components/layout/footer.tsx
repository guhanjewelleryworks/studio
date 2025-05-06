
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-gradient-to-t from-background via-secondary/10 to-secondary/30 py-8 mt-10"> {/* Reduced py, mt */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Logo and Description */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2 mb-1">
               <Gem className="h-6 w-6 text-primary" />
               <span className="font-semibold text-lg text-primary-foreground">Goldsmith Connect</span>
             </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting you with local artisans to craft your dream jewelry through a secure, mediated process.
            </p>
             <p className="text-xs text-muted-foreground/80 pt-1">
               © {currentYear} Goldsmith Connect. All rights reserved.
             </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Company</h3>
              <nav className="flex flex-col gap-1.5">
                <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  How It Works
                </Link>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Contact Us
                </Link>
              </nav>
            </div>
             <div>
               <h3 className="font-semibold text-foreground mb-2">For Customers</h3>
              <nav className="flex flex-col gap-1.5">
                <Link href="/discover" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Find Goldsmiths
                </Link>
                <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Pricing
                </Link>
                 <Link href="/signup" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                   Sign Up
                </Link>
              </nav>
            </div>
             <div>
               <h3 className="font-semibold text-foreground mb-2">For Goldsmiths</h3>
              <nav className="flex flex-col gap-1.5">
                 <Link href="/goldsmith-portal" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                   Goldsmith Portal
                </Link>
                <Link href="/goldsmith-portal/register" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Register
                </Link>
                <Link href="/goldsmith-portal/login" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Login
                </Link>
              </nav>
            </div>
            <div className="col-span-2 sm:col-span-1 sm:col-start-auto md:col-start-3">
               <h3 className="font-semibold text-foreground mb-2">Legal</h3>
              <nav className="flex flex-col gap-1.5">
                 <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Terms
                </Link>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                  Privacy
                </Link>
                 <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                   Admin Login
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
