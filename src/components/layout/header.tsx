// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, UserPlus, Gem, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navLinkClasses = "relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

interface CurrentUser {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
}

export function Header() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse currentUser from localStorage", e);
          localStorage.removeItem('currentUser'); // Clear corrupted item
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    // Redirect to home page or login page after logout
    // window.location.href = '/'; // Force full page reload to ensure state is cleared everywhere
    router.push('/');
    router.refresh(); // Try to force a refresh of server components if needed
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-sm">
      <div className="container flex h-20 max-w-screen-xl items-center px-4 md:px-6">
        {/* Desktop Navigation */}
        <div className="mr-6 hidden md:flex items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            { <Image src="/logo_header.png" alt="Goldsmith Connect Logo" width={36} height={36} className="h-9 w-9 text-primary" /> }
            <div className="flex flex-col">
              <span className="font-bold text-lg text-accent">
                Goldsmith Connect
              </span>
              <span className="text-xs text-muted-foreground -mt-1">Finely Handcrafted</span>
            </div>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/discover" className={cn(navLinkClasses)}>Discover</Link>
            <Link href="/#how-it-works" className={cn(navLinkClasses)}>How It Works</Link>
            <Link href="/pricing" className={cn(navLinkClasses)}>Pricing</Link>
            <Link href="/goldsmith-portal" className={cn(navLinkClasses)}>Goldsmith Portal</Link>
          </nav>
        </div>

        {/* Mobile Menu Trigger & Logo grouping for mobile */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background w-[280px] sm:w-[320px] border-r border-border/20 shadow-xl p-0">
              <div className="flex flex-col h-full">
                <Link
                  href="/"
                  className="flex items-center space-x-2.5 px-6 py-5 border-b border-border/20"
                >
                  <Image src="/logo_header.png" alt="Goldsmith Connect Logo" width={32} height={32} className="h-8 w-8 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-accent">Goldsmith Connect</span>
                    <span className="text-xs text-muted-foreground -mt-1">Finely Handcrafted</span>
                  </div>
                </Link>
                <nav className="flex-grow flex flex-col space-y-3 px-6 pt-6">
                  <Link href="/discover" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2">Discover</Link>
                  <Link href="/#how-it-works" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2">How It Works</Link>
                  <Link href="/pricing" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2">Pricing</Link>
                  <Link href="/goldsmith-portal" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2">Goldsmith Portal</Link>
                  <Link href="/admin" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2">Admin Portal</Link>
                </nav>
                <div className="px-6 pb-8 mt-auto flex flex-col gap-3 border-t border-border/20 pt-6">
                  {currentUser && currentUser.isLoggedIn ? (
                    <>
                      <span className="text-sm text-center text-muted-foreground py-2">Welcome, {currentUser.name}!</span>
                      <Button onClick={handleLogout} variant="destructive" size="lg" className="w-full rounded-full text-base">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full text-base border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground")}>
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Link>
                      <Link href="/signup" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
                        <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo_header.png" alt="Goldsmith Connect Logo" width={32} height={32} className="h-8 w-8 text-primary md:hidden" />
            <div className="flex flex-col md:hidden">
              <span className="font-bold text-lg text-accent">
                Goldsmith Connect
              </span>
               <span className="text-xs text-muted-foreground -mt-1">Finely Handcrafted</span>
            </div>
          </Link>
          <div className="w-10 h-10 md:hidden" /> {/* Spacer for mobile */}
        </div>


        {/* Login/Signup or User Info/Logout Buttons (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-3">
          {currentUser && currentUser.isLoggedIn ? (
            <>
              <span className="text-sm text-muted-foreground">
                <UserCircle className="inline-block h-4 w-4 mr-1 relative -top-px" />
                {currentUser.name}
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="default" 
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground rounded-full px-6 py-2"
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'default' }),
                  'border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2'
                )}
              >
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'default', variant: 'default' }),
                  'ml-2 shadow-sm hover:shadow-md transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2'
                )}
              >
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
