// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, UserPlus, LogOut, ShoppingBag, Edit, LayoutDashboard, Home, Briefcase, Shield, Contact } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; 
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const navLinkClasses = "relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

interface GoldsmithUser {
    id: string;
    name: string;
    email: string;
}

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [goldsmithUser, setGoldsmithUser] = useState<GoldsmithUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, where localStorage is available.
    setIsClient(true);
    try {
        const storedUser = localStorage.getItem('currentGoldsmithUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.isLoggedIn) {
                 setGoldsmithUser(parsedUser);
            } else {
                 setGoldsmithUser(null);
            }
        } else {
             setGoldsmithUser(null);
        }
    } catch (e) {
        console.error("Failed to parse goldsmith user from localStorage", e);
        setGoldsmithUser(null);
    }
  }, [pathname]); // Re-check on path change

  const handleCustomerLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  const handleGoldsmithLogout = () => {
    // Clear the user state immediately
    setGoldsmithUser(null);
    // Remove from local storage
    localStorage.removeItem('currentGoldsmithUser');
    // Force a full page reload to ensure all state is cleared, then navigate.
    // This is more robust than a simple router.push for logout scenarios.
    window.location.href = '/'; 
  };
  
  const renderDesktopUserActions = () => {
    if (status === 'loading' || !isClient) {
      return <Skeleton className="h-10 w-40 rounded-full" />;
    }

    if (goldsmithUser) {
        return (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 h-10 rounded-full px-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{goldsmithUser.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{goldsmithUser.name}</p>
                    <p className="text-xs text-muted-foreground">Goldsmith Portal</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <p className="font-medium">{goldsmithUser.name}</p>
                    <p className="text-xs text-muted-foreground font-normal whitespace-normal break-words">{goldsmithUser.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/goldsmith-portal/dashboard"><Briefcase className="mr-2 h-4 w-4" />Goldsmith Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/goldsmith-portal/profile/edit"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGoldsmithLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    if (status === 'authenticated') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                <AvatarFallback>{session.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground font-normal whitespace-normal break-words">{session.user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/"><Home className="mr-2 h-4 w-4" />Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer/profile/edit"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer/orders"><ShoppingBag className="mr-2 h-4 w-4" />My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCustomerLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // Guest view - Hide Login/Signup on Admin pages
    if (pathname.startsWith('/admin')) {
      return null;
    }
    
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full px-5 py-1.5'
          )}
        >
          <span>Login</span>
        </Link>
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ size: 'sm', variant: 'default' }),
            'shadow-sm hover:shadow-md transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-1.5'
          )}
        >
          <span>Sign Up</span>
        </Link>
      </div>
    );
  };
  
  const renderMobileUserActions = () => {
     if (status === 'loading' || !isClient) {
      return <Skeleton className="h-12 w-full rounded-full" />;
     }
     
     if (goldsmithUser) {
        return (
            <>
                <Link href="/goldsmith-portal/dashboard" onClick={() => setIsSheetOpen(false)} className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
                    <Briefcase className="mr-2 h-4 w-4" /> Goldsmith Dashboard
                </Link>
                <Button onClick={handleGoldsmithLogout} variant="destructive" size="lg" className="w-full rounded-full text-base">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </>
        );
     }

     if (status === 'authenticated') {
       return (
        <>
           <Link href="/customer/dashboard" onClick={() => setIsSheetOpen(false)} className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
          </Link>
          <Button onClick={handleCustomerLogout} variant="destructive" size="lg" className="w-full rounded-full text-base">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </>
       );
     }
     
    // Guest view - Hide Login/Signup on Admin pages
    if (pathname.startsWith('/admin')) {
      return null;
    }
     
     return (
        <>
          <Link href="/login" onClick={() => setIsSheetOpen(false)} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full text-base border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground")}>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Link>
          <Link href="/signup" onClick={() => setIsSheetOpen(false)} className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full rounded-full text-base")}>
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Link>
        </>
     );
  };

  return (
    <header className="w-full border-b border-border/20 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-sm h-16">
      <div className="container flex h-full max-w-screen-xl items-center px-4 md:px-6">
        {/* Desktop Navigation */}
        <div className="mr-6 hidden md:flex items-center">
          <Link href="/" className="mr-8 flex items-center">
            <Image 
              src="/logo_wordmark.png" 
              alt="Goldsmith Connect Logo" 
              width={160} 
              height={40} 
              className="h-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/discover" className={cn(navLinkClasses)}>Discover</Link>
            <Link href="/#how-it-works" className={cn(navLinkClasses)}>How It Works</Link>
            <Link href="/pricing" className={cn(navLinkClasses)}>Pricing</Link>
            <Link href="/goldsmith-portal" className={cn(navLinkClasses)}>Goldsmith Portal</Link>
            <Link href="/contact" className={cn(navLinkClasses)}>Contact Us</Link>
          </nav>
        </div>

        {/* Mobile Menu Trigger & Logo grouping for mobile */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                      onClick={() => setIsSheetOpen(false)}
                      className="flex items-center space-x-2.5 px-6 py-5 border-b border-border/20"
                    >
                       <Image 
                         src="/logo_wordmark.png" 
                         alt="Goldsmith Connect Logo" 
                         width={160} 
                         height={40} 
                         className="h-auto"
                       />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-grow flex flex-col space-y-1 px-4 pt-4">
                  <Link href="/discover" onClick={() => setIsSheetOpen(false)} className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Discover</Link>
                  <Link href="/#how-it-works" onClick={() => setIsSheetOpen(false)} className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">How It Works</Link>
                  <Link href="/pricing" onClick={() => setIsSheetOpen(false)} className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Pricing</Link>
                  <Link href="/goldsmith-portal" onClick={() => setIsSheetOpen(false)} className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Goldsmith Portal</Link>
                  <Link href="/contact" onClick={() => setIsSheetOpen(false)} className="text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary">Contact Us</Link>
                  <Link href="/admin/login" onClick={() => setIsSheetOpen(false)} className="flex items-center text-base font-medium text-foreground/90 hover:text-primary transition-colors py-2.5 px-2 rounded-md hover:bg-secondary"><Shield className="mr-2 h-4 w-4"/>Admin Portal</Link>
                </nav>
                <div className="px-6 pb-8 mt-auto flex flex-col gap-3 border-t border-border/20 pt-6">
                   {renderMobileUserActions()}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <Image 
                src="/logo_wordmark.png" 
                alt="Goldsmith Connect Logo" 
                width={150} 
                height={38} 
                className="h-auto md:hidden" 
            />
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
