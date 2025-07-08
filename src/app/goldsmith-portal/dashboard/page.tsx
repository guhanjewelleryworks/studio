// src/app/goldsmith-portal/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  UserCog, 
  Package, 
  GalleryHorizontal, 
  Settings,
  Bell,
  BarChart3,
  Loader2,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import type { Goldsmith } from '@/types/goldsmith';
import { fetchGoldsmithById, getNewOrderCountForGoldsmith } from '@/actions/goldsmith-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  goldsmithName: string;
  newOrdersCount: number; 
  portfolioImageCount: number;
  profileCompletion: number;
}

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
  name: string;
}

const calculateProfileCompletion = (goldsmith: Goldsmith | null): number => {
  if (!goldsmith) return 0;
  let completedFields = 0;
  const totalFields = 7; 

  if (goldsmith.name && goldsmith.name.trim() !== '') completedFields++;
  if (goldsmith.state && goldsmith.state.trim() !== '' && goldsmith.district && goldsmith.district.trim() !== '') completedFields++;
  if (goldsmith.specialty && (Array.isArray(goldsmith.specialty) ? goldsmith.specialty.length > 0 : (typeof goldsmith.specialty === 'string' && goldsmith.specialty.trim() !== ''))) completedFields++;
  if (goldsmith.bio && goldsmith.bio.trim() !== '') completedFields++;
  if (goldsmith.portfolioLink && goldsmith.portfolioLink.trim() !== '') completedFields++;
  if (goldsmith.yearsExperience && goldsmith.yearsExperience > 0) completedFields++;
  if (goldsmith.phone && goldsmith.phone.trim() !== '') completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
};

interface DashboardActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  linkHref: string;
  linkText: string;
  variant?: "default" | "outline";
  secondaryLinkHref?: string;
  secondaryLinkText?: string;
  notificationCount?: number;
}

const DashboardActionCard: React.FC<DashboardActionCardProps> = ({ title, description, icon: Icon, linkHref, linkText, variant = "default", secondaryLinkHref, secondaryLinkText, notificationCount }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
    <CardHeader>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
            <Icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-xl text-accent font-heading">{title}</CardTitle>
        </div>
        {notificationCount && notificationCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center rounded-full text-xs animate-pulse">
                {notificationCount}
            </Badge>
        )}
      </div>
      <CardDescription className="text-muted-foreground text-sm">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button asChild className={`w-full ${variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground"}`} variant={variant}>
        <Link href={linkHref}>{linkText}</Link>
      </Button>
      {secondaryLinkHref && secondaryLinkText && (
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href={secondaryLinkHref}>{secondaryLinkText}</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function GoldsmithDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    goldsmithName: "Loading...",
    newOrdersCount: 0, 
    portfolioImageCount: 0,
    profileCompletion: 0,
  });
  const [currentGoldsmith, setCurrentGoldsmith] = useState<Goldsmith | null>(null);
  const [loggedInGoldsmithId, setLoggedInGoldsmithId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('currentGoldsmithUser');
      if (storedUser) {
        try {
          const parsedUser: CurrentGoldsmithUser = JSON.parse(storedUser);
          if (parsedUser.isLoggedIn && parsedUser.id) {
            setLoggedInGoldsmithId(parsedUser.id);
          } else {
            toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
            router.push('/goldsmith-portal/login?reason=session_expired');
          }
        } catch (e) {
          console.error("Failed to parse currentGoldsmithUser from localStorage", e);
          toast({ title: "Error", description: "Could not verify session. Please log in.", variant: "destructive" });
          router.push('/goldsmith-portal/login?reason=parse_error');
        }
      } else {
        toast({ title: "Not Logged In", description: "Please log in to access your dashboard.", variant: "destructive" });
        router.push('/goldsmith-portal/login?reason=no_user');
      }
    }
  }, [router, toast]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!loggedInGoldsmithId) {
        // If no ID, means the first effect is still running or user is being redirected.
        // Only set loading to false if we definitely aren't going to fetch.
        if (!localStorage.getItem('currentGoldsmithUser')) {
             setIsLoading(false);
             setStats({ goldsmithName: "Guest", newOrdersCount: 0, portfolioImageCount: 0, profileCompletion: 0 });
        }
        return;
      }

      setIsLoading(true);
      try {
        const activeGoldsmith = await fetchGoldsmithById(loggedInGoldsmithId);
        
        if (activeGoldsmith && activeGoldsmith.id) {
          setCurrentGoldsmith(activeGoldsmith);
          // Check if goldsmith is verified. If not, show a message.
          if (activeGoldsmith.status !== 'verified') {
            toast({
              title: "Account Pending Verification",
              description: "Your account is currently under review. Some features may be limited until verification is complete.",
              variant: "default",
              duration: 10000,
            });
          }

          const ordersCount = await getNewOrderCountForGoldsmith(activeGoldsmith.id); 

          setStats({
            goldsmithName: activeGoldsmith.name,
            profileCompletion: calculateProfileCompletion(activeGoldsmith),
            newOrdersCount: ordersCount, 
            portfolioImageCount: activeGoldsmith.portfolioImages?.length || 0,
          });
        } else {
           toast({
            title: "Error Loading Profile",
            description: "Could not find your goldsmith profile. Please contact support.",
            variant: "destructive",
          });
          setStats({
            goldsmithName: "Profile Error",
            profileCompletion: 0,
            newOrdersCount: 0,
            portfolioImageCount: 0,
          });
           // Potentially log out or redirect if profile is crucial and not found
           localStorage.removeItem('currentGoldsmithUser');
           router.push('/goldsmith-portal/login?reason=profile_not_found');
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error Loading Dashboard",
          description: "Could not load dashboard data. Please try again later.",
          variant: "destructive",
        });
         setStats({ 
            goldsmithName: "Error Loading",
            profileCompletion: 0,
            newOrdersCount: 0,
            portfolioImageCount: 0,
          });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [loggedInGoldsmithId, toast, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('currentGoldsmithUser');
    }
    setCurrentGoldsmith(null);
    setLoggedInGoldsmithId(null); // Clear the ID state
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/goldsmith-portal/login');
    // Consider router.refresh() if other parts of app depend on this state for re-render.
  };


  if (isLoading && !currentGoldsmith) { // Show loader if actively loading or no goldsmithId yet
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
        </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading text-accent">
            {stats.goldsmithName === "Loading..." && isLoading ? <Loader2 className="h-8 w-8 animate-spin inline-block mr-2" /> : null}
            Welcome, {stats.goldsmithName}!
          </h1>
          <p className="text-muted-foreground text-lg">Manage your workshop and connect with customers.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleLogout} className="text-xs rounded-full">
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
        </Button>
      </header>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">New Orders</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.newOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">Portfolio Images</CardTitle>
            <GalleryHorizontal className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.portfolioImageCount}</div>
            <p className="text-xs text-muted-foreground">Showcasing your work</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">Profile Completion</CardTitle>
            <UserCog className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${stats.profileCompletion}%`}</div>
            <p className="text-xs text-muted-foreground">Keep your profile updated</p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8 bg-border/50" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardActionCard
          title="Manage Profile"
          description="Update your workshop details, bio, specialties, and contact information."
          icon={UserCog}
          linkHref="/goldsmith-portal/profile/edit"
          linkText="Edit Your Profile"
          variant="outline"
        />
        <DashboardActionCard
          title="Order Management"
          description="View new, active, and completed custom order requests."
          icon={Package}
          linkHref={`/goldsmith-portal/orders?goldsmithId=${currentGoldsmith?.id || ''}&status=all`}
          linkText="Manage All Orders"
          variant="default"
          notificationCount={stats.newOrdersCount}
        />
        <DashboardActionCard
          title="Portfolio Showcase"
          description="Manage images of your work to attract customers."
          icon={GalleryHorizontal}
          linkHref={`/goldsmith-portal/portfolio/manage?goldsmithId=${currentGoldsmith?.id || ''}`}
          linkText="Update Portfolio"
          variant="default"
        />
        <DashboardActionCard
          title="Performance Analytics"
          description="View insights on profile views and orders."
          icon={BarChart3}
          linkHref="/goldsmith-portal/analytics"
          linkText="View Analytics"
          variant="outline"
        />
        <DashboardActionCard
          title="Account Settings"
          description="Manage login, notifications, and payment details."
          icon={Settings}
          linkHref={`/goldsmith-portal/settings?goldsmithId=${currentGoldsmith?.id || ''}`}
          linkText="Go to Settings"
          variant="outline"
        />
      </section>
    </div>
  );
}
