
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-gradient-to-t from-background via-secondary/10 to-secondary/30 py-8 mt-12"> {/* Reduced py, mt */}
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row md:items-start md:gap-10"> {/* Reduced gap */}
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"> {/* Reduced gap */}
          <Link href="/" className="flex items-center space-x-2 mb-1"> {/* Reduced space-x, mb */}
             <Gem className="h-6 w-6 text-primary" />
             <span className="font-semibold text-lg text-primary-foreground">Goldsmith Connect</span>
           </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Connecting you with local artisans to craft your dream jewelry through a secure, mediated process.
          </p>
           <p className="text-xs text-muted-foreground/80 pt-1"> {/* Reduced pt */}
             © {currentYear} Goldsmith Connect. All rights reserved.
           </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm"> {/* Reduced gap-x, gap-y */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Company</h3> {/* Reduced mb */}
            <nav className="flex flex-col gap-1.5"> {/* Reduced gap */}
              <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                How It Works
              </Link>
              <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                Contact Us
              </Link>
            </nav>
          </div>
           <div>
             <h3 className="font-semibold text-foreground mb-2">For Customers</h3> {/* Reduced mb */}
            <nav className="flex flex-col gap-1.5"> {/* Reduced gap */}
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
             <h3 className="font-semibold text-foreground mb-2">For Goldsmiths</h3> {/* Reduced mb */}
            <nav className="flex flex-col gap-1.5"> {/* Reduced gap */}
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
          <div className="col-span-2 sm:col-span-1 sm:col-start-3">
             <h3 className="font-semibold text-foreground mb-2">Legal</h3> {/* Reduced mb */}
            <nav className="flex flex-col gap-1.5"> {/* Reduced gap */}
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
    </footer>
  );
}
