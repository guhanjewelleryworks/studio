import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Gem } from 'lucide-react'; // Using Gem icon for logo

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gem className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-primary-foreground">
              Goldsmith Connect
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/discover"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Discover
            </Link>
            <Link
              href="/#how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              How It Works
            </Link>
             <Link
              href="/goldsmith-portal"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Goldsmith Portal
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Admin
            </Link>
          </nav>
        </div>
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
           <SheetContent side="left" className="pr-0 bg-background w-[240px] sm:w-[300px]">
             <Link
                href="/"
                className="flex items-center space-x-2 px-4 mb-6"
              >
                <Gem className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary-foreground">Goldsmith Connect</span>
              </Link>
            <div className="flex flex-col space-y-3 px-4">
              <Link href="/discover" className="text-foreground">Discover</Link>
              <Link href="/#how-it-works" className="text-foreground">How It Works</Link>
              <Link href="/goldsmith-portal" className="text-foreground">Goldsmith Portal</Link>
               <Link href="/admin" className="text-foreground">Admin Portal</Link>
            </div>
           </SheetContent>
        </Sheet>
         {/* Mobile Logo - Centered when menu is open */}
        <div className="flex flex-1 items-center justify-start md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-primary" />
               <span className="font-bold sm:inline-block text-primary-foreground">
                  Goldsmith Connect
               </span>
            </Link>
          </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
             <Button asChild className="ml-2 shadow-sm">
               <Link href="/signup">Sign Up</Link>
             </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
