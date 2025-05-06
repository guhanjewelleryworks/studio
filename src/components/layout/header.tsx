import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinkClasses = "relative text-sm font-medium text-foreground/70 transition-colors hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"; // Adjusted font size and spacing

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm"> {/* Increased blur, adjusted opacity */}
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6"> {/* Adjusted padding */}
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex items-center"> {/* Adjusted margin */}
          <Link href="/" className="mr-6 flex items-center space-x-2.5"> {/* Adjusted spacing */}
            <Gem className="h-6 w-6 text-primary" /> {/* Standardized icon size */}
            <span className="hidden font-bold sm:inline-block text-primary-foreground"> {/* Removed text-lg */}
              Goldsmith Connect
            </span>
          </Link>
          <nav className="flex items-center gap-6 lg:gap-8 text-sm"> {/* Adjusted gap */}
            <Link
              href="/discover"
              className={cn(navLinkClasses)}
            >
              Discover
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(navLinkClasses)}
            >
              How It Works
            </Link>
             <Link
              href="/pricing"
              className={cn(navLinkClasses)}
            >
              Pricing
            </Link>
             <Link
              href="/goldsmith-portal"
              className={cn(navLinkClasses)}
            >
              Goldsmith Portal
            </Link>
            {/* Hiding Admin link from main nav for typical users */}
          </nav>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="md:hidden mr-3"> {/* Adjusted margin */}
                <span className="flex items-center">
                    <Menu className="h-5 w-5" /> {/* Slightly smaller icon */}
                    <span className="sr-only">Toggle Menu</span>
                </span>
            </Button>
          </SheetTrigger>
           <SheetContent side="left" className="pr-0 bg-background w-[280px] sm:w-[320px] border-r border-border/40"> {/* Adjusted width, added border */}
             <div className="flex flex-col h-full">
                <Link
                  href="/"
                  className="flex items-center space-x-2.5 px-6 py-4 border-b border-border/40" // Added padding, border
                >
                  <Gem className="h-6 w-6 text-primary" /> {/* Consistent icon size */}
                  <span className="font-bold text-primary-foreground">Goldsmith Connect</span> {/* Consistent size */}
                </Link>
              <div className="flex-grow flex flex-col space-y-3 px-6 pt-6"> {/* Increased spacing, padding */}
                <Link href="/discover" className="text-base font-medium text-foreground hover:text-primary transition-colors">Discover</Link> {/* Increased size */}
                <Link href="/#how-it-works" className="text-base font-medium text-foreground hover:text-primary transition-colors">How It Works</Link>
                <Link href="/pricing" className="text-base font-medium text-foreground hover:text-primary transition-colors">Pricing</Link>
                <Link href="/goldsmith-portal" className="text-base font-medium text-foreground hover:text-primary transition-colors">Goldsmith Portal</Link>
                 <Link href="/admin" className="text-base font-medium text-foreground hover:text-primary transition-colors">Admin Portal</Link> {/* Keep Admin in mobile for convenience */}
              </div>
              {/* Login/Signup links at the bottom of the mobile menu */}
               <div className="px-6 pb-6 mt-auto flex flex-col gap-3">
                  <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>Login</Link>
                  <Link href="/signup" className={cn(buttonVariants({ size: "sm" }), "w-full")}>Sign Up</Link>
               </div>
             </div>
           </SheetContent>
        </Sheet>

        {/* Mobile Logo - Centered when menu is open */}
        <div className="flex flex-1 items-center justify-start md:hidden pl-2"> {/* Added padding */}
            <Link href="/" className="flex items-center space-x-2.5">
              <Gem className="h-6 w-6 text-primary" />
               <span className="font-bold sm:inline-block text-primary-foreground"> {/* Consistent size */}
                  Goldsmith Connect
               </span>
            </Link>
          </div>

        {/* Login/Signup Buttons (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-3"> {/* Adjusted spacing */}
          <nav className="flex items-center">
             {/* Use Link directly with buttonVariants */}
             <Link
                href="/login"
                className={cn(
                   buttonVariants({ variant: "ghost", size: "sm" }), // Smaller size
                   'hover:bg-accent/80 text-foreground/80 hover:text-foreground'
                )}
              >
                <span>Login</span>
             </Link>
             <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'sm' }), // Smaller size
                  'ml-2 shadow-sm hover:shadow-md transition-shadow'
                )}
              >
                <span>Sign Up</span>
             </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
