
import Link from 'next/link';
import { Gem } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-20 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Gem className="hidden h-6 w-6 text-primary md:inline-block" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Goldsmith Connect. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
           <Link href="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
           <Link href="/admin" className="transition-colors hover:text-foreground">
             Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
