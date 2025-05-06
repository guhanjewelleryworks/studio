
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-gradient-to-t from-background via-secondary/10 to-secondary/30 py-10 mt-16"> {/* Added gradient & padding, increased mt */}
      <div className="container flex flex-col items-center justify-between gap-8 md:flex-row md:items-start md:gap-12"> {/* Adjusted gap & alignment */}
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left"> {/* Adjusted gap & alignment */}
          <Link href="/" className="flex items-center space-x-2.5 mb-2"> {/* Adjusted spacing */}
             <Gem className="h-6 w-6 text-primary" />
             <span className="font-semibold text-lg text-primary-foreground">Goldsmith Connect</span> {/* Increased font size */}
           </Link>
          <p className="text-sm text-muted-foreground max-w-xs"> {/* Added max-w */}
            Connecting you with local artisans to craft your dream jewelry through a secure, mediated process.
          </p>
           <p className="text-xs text-muted-foreground/80 pt-2"> {/* Smaller text for copyright */}
             © {currentYear} Goldsmith Connect. All rights reserved.
           </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 text-sm"> {/* Grid layout for links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                How It Works
              </Link>
              <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4">
                Contact Us
              </Link>
              {/* Add About Us link if page exists */}
            </nav>
          </div>
           <div>
             <h3 className="font-semibold text-foreground mb-3">For Customers</h3>
            <nav className="flex flex-col gap-2">
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
             <h3 className="font-semibold text-foreground mb-3">For Goldsmiths</h3>
            <nav className="flex flex-col gap-2">
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
            {/* Legal Section (Optional - can be combined or separate) */}
          <div className="col-span-2 sm:col-span-1 sm:col-start-3">
             <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <nav className="flex flex-col gap-2">
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
