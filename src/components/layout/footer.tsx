
import Link from 'next/link';
import { Gem } from 'lucide-react'; // Using Gem as a consistent brand icon
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinkClasses = "text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 text-sm";

  return (
    <footer className="w-full border-t border-border/20 bg-gradient-to-t from-background via-background to-secondary/10 py-10 mt-auto">
      <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Logo and Description */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2.5 mb-2">
               <Gem className="h-7 w-7 text-primary" />
               <span className="font-semibold text-xl text-primary-foreground">Goldsmith Connect</span>
             </Link>
            <p className="text-sm text-foreground/70 max-w-xs leading-relaxed">
              Connecting you with local artisans to craft your dream jewelry through a secure, mediated process.
            </p>
             <p className="text-xs text-muted-foreground/80 pt-2">
               © {currentYear} Goldsmith Connect. All rights reserved.
             </p>
          </div>

          {/* Navigation Links - More balanced distribution */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-3 text-base">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/#how-it-works" className={footerLinkClasses}>How It Works</Link>
              <Link href="/pricing" className={footerLinkClasses}>Pricing</Link>
              <Link href="/contact" className={footerLinkClasses}>Contact Us</Link>
            </nav>
          </div>
          <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-3 text-base">For Customers</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/discover" className={footerLinkClasses}>Find Goldsmiths</Link>
              <Link href="/signup" className={footerLinkClasses}>Sign Up</Link>
              <Link href="/login" className={footerLinkClasses}>Login</Link>
            </nav>
          </div>
           <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-3 text-base">For Goldsmiths</h3>
            <nav className="flex flex-col gap-2">
               <Link href="/goldsmith-portal" className={footerLinkClasses}>Goldsmith Portal</Link>
              <Link href="/goldsmith-portal/register" className={footerLinkClasses}>Register</Link>
              <Link href="/goldsmith-portal/login" className={footerLinkClasses}>Login</Link>
            </nav>
          </div>
          <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-3 text-base">Legal</h3>
            <nav className="flex flex-col gap-2">
               <Link href="/terms" className={footerLinkClasses}>Terms of Service</Link>
              <Link href="/privacy" className={footerLinkClasses}>Privacy Policy</Link>
               <Link href="/admin" className={footerLinkClasses}>Admin Login</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
