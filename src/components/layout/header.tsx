
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, UserPlus, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinkClasses = "relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-sm">
      <div className="container flex h-16 max-w-screen-xl items-center px-4 md:px-6">
        {/* Desktop Navigation */}
        <div className="mr-6 hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gem className="h-7 w-7 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">
                Goldsmith Connect
              </span>
              <span className="text-xs text-muted-foreground -mt-1">Finely Handcrafted</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/discover" className={cn(navLinkClasses)}>Discover</Link>
            <Link href="/#how-it-works" className={cn(navLinkClasses)}>How It Works</Link>
            <Link href="/pricing" className={cn(navLinkClasses)}>Pricing</Link>
            <Link href="/goldsmith-portal" className={cn(navLinkClasses)}>Goldsmith Portal</Link>
          </nav>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="md:hidden mr-2 p-1.5">
                <span className="flex items-center">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </span>
            </Button>
          </SheetTrigger>
           <SheetContent side="left" className="pr-0 bg-background w-[260px] sm:w-[300px] border-r border-border/20 shadow-xl p-0">
             <div className="flex flex-col h-full">
                <Link
                  href="/"
                  className="flex items-center space-x-2 px-4 py-4 border-b border-border/20"
                >
                  <Gem className="h-7 w-7 text-primary" />
                  <div>
                    <span className="font-bold text-md text-foreground">Goldsmith Connect</span>
                    <p className="text-[0.65rem] text-muted-foreground -mt-0.5">Finely Handcrafted</p>
                  </div>
                </Link>
              <nav className="flex-grow flex flex-col space-y-2 px-4 pt-4">
                <Link href="/discover" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1.5">Discover</Link>
                <Link href="/#how-it-works" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1.5">How It Works</Link>
                <Link href="/pricing" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1.5">Pricing</Link>
                <Link href="/goldsmith-portal" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1.5">Goldsmith Portal</Link>
                 <Link href="/admin" className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors py-1.5">Admin Portal</Link>
              </nav>
               <div className="px-4 pb-6 mt-auto flex flex-col gap-2.5 border-t border-border/20 pt-4">
                  <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full rounded-full text-sm")}>
                    <LogIn className="mr-1.5 h-3.5 w-3.5" /> Login
                  </Link>
                  <Link href="/signup" className={cn(buttonVariants({ size: "default" }), "w-full rounded-full text-sm bg-primary hover:bg-primary/90 text-primary-foreground")}>
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Sign Up
                  </Link>
               </div>
             </div>
           </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex flex-1 items-center justify-center md:justify-start md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <Gem className="h-7 w-7 text-primary" />
               <div className="flex flex-col">
                <span className="font-bold text-md sm:inline-block text-foreground">
                    Goldsmith Connect
                </span>
                 <span className="text-[0.65rem] text-muted-foreground -mt-0.5 sm:inline-block">Finely Handcrafted</span>
               </div>
            </Link>
          </div>

        {/* Login/Signup Buttons (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
             <Link
                href="/login"
                className={cn(
                   buttonVariants({ variant: "ghost", size: "sm" }),
                   'hover:bg-accent/10 text-foreground/80 hover:text-primary rounded-full px-5'
                )}
              >
                <span>Login</span>
             </Link>
             <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'default' }),
                  'shadow-sm hover:shadow-md transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5'
                )}
              >
                <span>Sign Up</span>
             </Link>
        </div>
      </div>
    </header>
  );
}
