// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, UserPlus, UserCircle, LogOut, ShoppingBag, MessageCircle, Edit, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentUser {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
}

const navLinkClasses = "relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

type UserStatus = 'loading' | 'guest' | 'customer' | 'admin' | 'goldsmith';

export function Header() {
  const [userStatus, setUserStatus] = useState<UserStatus>('loading');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client after hydration
    const storedUser = localStorage.getItem('currentUser');
    const storedAdminStatus = localStorage.getItem('isAdminLoggedIn');
    const storedGoldsmithStatus = localStorage.getItem('currentGoldsmithUser');
    
    if (storedAdminStatus === 'true') {
        setUserStatus('admin');
    } else if (storedGoldsmithStatus) {
        try {
            const parsedGoldsmith = JSON.parse(storedGoldsmithStatus);
            if (parsedGoldsmith.isLoggedIn) {
                setUserStatus('goldsmith');
            } else {
                setUserStatus('guest');
            }
        } catch (e) {
            setUserStatus('guest');
        }
    } else if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.isLoggedIn) {
                setCurrentUser(parsedUser);
                setUserStatus('customer');
            } else {
                setUserStatus('guest');
            }
        } catch (e) {
            setUserStatus('guest');
        }
    } else {
        setUserStatus('guest');
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    setUserStatus('guest'); // Reset status on logout
    router.push('/');
    window.location.reload(); // Force reload to ensure all state is cleared
  };

  const renderDesktopUserActions = () => {
    switch (userStatus) {
        case 'loading':
            return <Skeleton className="h-10 w-40 rounded-full" />;
        
        case 'admin':
        case 'goldsmith':
            return null; // Intentionally show nothing for these roles in main header

        case 'customer':
            return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="default" 
                      className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-6 py-2 flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>{currentUser?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/customer/dashboard" onClick={(e) => e.stopPropagation()}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/profile/edit" onClick={(e) => e.stopPropagation()}><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/orders" onClick={(e) => e.stopPropagation()}><ShoppingBag className="mr-2 h-4 w-4" />My Orders</Link>
                    </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/customer/inquiries" onClick={(e) => e.stopPropagation()}><MessageCircle className="mr-2 h-4 w-4" />My Inquiries</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
        
        case 'guest':
        default:
            return (
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
            );
    }
  };
  
  const renderMobileUserActions = () => {
    switch (userStatus) {
        case 'loading':
            return (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-12 w-full rounded-full" />
                  <Skeleton className="h-12 w-full rounded-full" />
                </div>
            );

        case 'admin':
        case 'goldsmith':
            return null; // Intentionally show nothing

        case 'customer':
            return (
                <>
                   <Link href="/customer/dashboard" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                  </Link>
                  <Button onClick={handleLogout} variant="destructive" size="lg" className="w-full rounded-full text-base">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
            );

        case 'guest':
        default:
            return (
              <>
                <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full text-base border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground")}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
                <Link href="/signup" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </>
            );
    }
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
                <SheetHeader>
                  <SheetTitle asChild>
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
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-grow flex flex-col space-y-1 px-4 pt-4">
                  <Link href="/discover" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Discover</Link>
                  <Link href="/#how-it-works" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">How It Works</Link>
                  <Link href="/pricing" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Pricing</Link>
                  <Link href="/goldsmith-portal" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Goldsmith Portal</Link>
                  <Link href="/admin" className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Admin Portal</Link>
                </nav>
                <div className="px-6 pb-8 mt-auto flex flex-col gap-3 border-t border-border/20 pt-6">
                   {renderMobileUserActions()}
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
          {renderDesktopUserActions()}
        </div>
      </div>
    </header>
  );
}
