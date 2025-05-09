
import Link from 'next/link';
import { Gem } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinkClasses = "text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 text-xs";

  return (
    <footer className="w-full border-t border-border/20 bg-gradient-to-t from-background via-background to-secondary/10 py-8 mt-auto"> {/* Reduced padding */}
      <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"> {/* Reduced gap */}
          {/* Logo and Description */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-2 text-center md:text-left"> {/* Reduced gap */}
            <Link href="/" className="flex items-center space-x-2 mb-1.5"> {/* Reduced mb */}
               <Image src="/logo.png" alt="Goldsmith Connect Logo" width={28} height={28} className="h-7 w-7" />
               <div className="flex flex-col">
                <span className="font-semibold text-lg text-accent">Goldsmith Connect</span>
                <span className="text-xs text-muted-foreground -mt-1">Finely Handcrafted</span>
               </div>
             </Link>
            <p className="text-xs text-foreground/70 max-w-xs leading-relaxed"> {/* Adjusted leading */}
              Connecting you with local artisans to craft your dream jewelry through a secure, mediated process.
            </p>
             <p className="text-[0.7rem] text-muted-foreground/80 pt-1.5"> {/* Reduced pt */}
               © {currentYear} Goldsmith Connect. All rights reserved.
             </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-2.5 text-sm">Company</h3> {/* Reduced mb */}
            <nav className="flex flex-col gap-1.5"> {/* Reduced gap */}
              <Link href="/#how-it-works" className={footerLinkClasses}>How It Works</Link>
              <Link href="/pricing" className={footerLinkClasses}>Pricing</Link>
              <Link href="/contact" className={footerLinkClasses}>Contact Us</Link>
            </nav>
          </div>
          <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-2.5 text-sm">For Customers</h3>
            <nav className="flex flex-col gap-1.5">
              <Link href="/discover" className={footerLinkClasses}>Find Goldsmiths</Link>
              <Link href="/signup" className={footerLinkClasses}>Sign Up</Link>
              <Link href="/login" className={footerLinkClasses}>Login</Link>
            </nav>
          </div>
           <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-2.5 text-sm">For Goldsmiths</h3>
            <nav className="flex flex-col gap-1.5">
               <Link href="/goldsmith-portal" className={footerLinkClasses}>Goldsmith Portal</Link>
              <Link href="/goldsmith-portal/register" className={footerLinkClasses}>Register</Link>
              <Link href="/goldsmith-portal/login" className={footerLinkClasses}>Goldsmith Login</Link>
            </nav>
          </div>
          <div className="md:col-span-2">
             <h3 className="font-semibold text-foreground mb-2.5 text-sm">Admin & Legal</h3>
            <nav className="flex flex-col gap-1.5">
               <Link href="/admin" className={footerLinkClasses}>Admin Portal</Link>
               <Link href="/terms" className={footerLinkClasses}>Terms of Service</Link>
              <Link href="/privacy" className={footerLinkClasses}>Privacy Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
