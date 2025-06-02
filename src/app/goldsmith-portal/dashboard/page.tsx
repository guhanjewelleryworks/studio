// src/app/goldsmith-portal/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  UserCog, 
  Package, 
  MessageSquare, 
  GalleryHorizontal, 
  Settings,
  Bell,
  BarChart3,
  Loader2,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import type { Goldsmith } from '@/types/goldsmith';
import { fetchAllGoldsmiths, getNewOrderCountForGoldsmith, getPendingInquiriesCountForGoldsmith } from '@/actions/goldsmith-actions';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  goldsmithName: string;
  newOrdersCount: number;
  pendingInquiriesCount: number;
  profileCompletion: number;
}

// Function to calculate profile completion
const calculateProfileCompletion = (goldsmith: Goldsmith | null): number => {
  if (!goldsmith) return 0;
  let completedFields = 0;
  const totalFields = 7; // name, address, specialty, bio, portfolioLink, yearsExperience, phone

  if (goldsmith.name && goldsmith.name.trim() !== '') completedFields++;
  if (goldsmith.address && goldsmith.address.trim() !== '') completedFields++;
  if (goldsmith.specialty && (Array.isArray(goldsmith.specialty) ? goldsmith.specialty.length > 0 : (typeof goldsmith.specialty === 'string' && goldsmith.specialty.trim() !== ''))) completedFields++;
  if (goldsmith.bio && goldsmith.bio.trim() !== '') completedFields++;
  if (goldsmith.portfolioLink && goldsmith.portfolioLink.trim() !== '') completedFields++;
  if (goldsmith.yearsExperience && goldsmith.yearsExperience > 0) completedFields++;
  if (goldsmith.phone && goldsmith.phone.trim() !== '') completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
};

export default function GoldsmithDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    goldsmithName: "Loading...",
    newOrdersCount: 0, 
    pendingInquiriesCount: 0,
    profileCompletion: 0,
  });
  const [currentGoldsmith, setCurrentGoldsmith] = useState<Goldsmith | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // For simulation, fetch the first verified goldsmith to represent the "logged-in" user.
        // In a real app, you'd get the logged-in goldsmith's ID from session/auth state.
        const allVerifiedGoldsmiths = await fetchAllGoldsmiths(); 
        const activeGoldsmith = allVerifiedGoldsmiths.length > 0 ? allVerifiedGoldsmiths[0] : null;
        
        if (activeGoldsmith && activeGoldsmith.id) {
          setCurrentGoldsmith(activeGoldsmith);
          const [ordersCount, inquiriesCount] = await Promise.all([
            getNewOrderCountForGoldsmith(activeGoldsmith.id), // This counts 'new' which might need adjustment
            getPendingInquiriesCountForGoldsmith(activeGoldsmith.id)
          ]);

          // Fetch count for orders specifically in 'pending_goldsmith_review'
          // This requires a modification to getNewOrderCountForGoldsmith or a new action
          // For now, we'll use the existing ordersCount which refers to status 'new' in its current implementation
          // Ideally, getNewOrderCountForGoldsmith should count 'pending_goldsmith_review' for the goldsmith dashboard

          setStats({
            goldsmithName: activeGoldsmith.name,
            profileCompletion: calculateProfileCompletion(activeGoldsmith),
            newOrdersCount: ordersCount, // This is the count of orders with status 'new' assigned to this goldsmith
            pendingInquiriesCount: inquiriesCount,
          });
        } else {
           toast({
            title: "No Verified Goldsmith Found",
            description: "Dashboard data requires a verified goldsmith profile. Please register or await verification.",
            variant: "default",
            duration: 7000,
          });
          setStats({
            goldsmithName: "Artisan",
            profileCompletion: 0,
            newOrdersCount: 0,
            pendingInquiriesCount: 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error Loading Dashboard",
          description: "Could not load dashboard data. Please try again later.",
          variant: "destructive",
        });
         setStats({ // Fallback stats on error
            goldsmithName: "Error Loading",
            profileCompletion: 0,
            newOrdersCount: 0,
            pendingInquiriesCount: 0,
          });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading text-accent">
            {isLoading && stats.goldsmithName === "Loading..." ? <Loader2 className="h-8 w-8 animate-spin inline-block mr-2" /> : null}
            Welcome, {stats.goldsmithName}!
          </h1>
          <p className="text-muted-foreground text-lg">Manage your workshop and connect with customers.</p>
        </div>
        <Button variant="destructive" size="sm" asChild className="text-xs rounded-full">
            {/* This should ideally log out the user, for now it just links to homepage */}
            <Link href="/">
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout (Simulated)
            </Link>
        </Button>
      </header>

      {/* Overview Stats */}
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
            <CardTitle className="text-sm font-medium text-accent">Pending Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.pendingInquiriesCount}</div>
            <p className="text-xs text-muted-foreground">Require your response</p>
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

      {/* Main Dashboard Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardActionCard
          title="Manage Profile"
          description="Update your workshop details, bio, specialties, and contact information."
          icon={UserCog}
          linkHref={`/goldsmith-portal/profile/edit${currentGoldsmith ? '?id=' + currentGoldsmith.id : ''}`} // Pass ID if available
          linkText="Edit Your Profile"
          variant="outline"
        />
        <DashboardActionCard
          title="Order Management"
          description="View new, active, and completed custom order requests."
          icon={Package}
          linkHref={`/goldsmith-portal/orders?goldsmithId=${currentGoldsmith?.id || ''}&status=pending_goldsmith_review`} 
          linkText="View New Orders"
          variant="default"
          secondaryLinkHref={`/goldsmith-portal/orders?goldsmithId=${currentGoldsmith?.id || ''}&status=in_progress`} // Changed 'active' to 'in_progress' for clarity
          secondaryLinkText="Manage Active Orders"
        />
        <DashboardActionCard
          title="Communication Hub"
          description="Respond to customer inquiries and manage conversations."
          icon={MessageSquare}
          linkHref={`/goldsmith-portal/messages?goldsmithId=${currentGoldsmith?.id || ''}`}
          linkText="Access Messages"
          variant="default"
        />
        <DashboardActionCard
          title="Portfolio Showcase"
          description="Manage images of your work to attract customers."
          icon={GalleryHorizontal}
          linkHref={`/goldsmith-portal/portfolio/manage?goldsmithId=${currentGoldsmith?.id || ''}`}
          linkText="Update Portfolio"
          variant="outline"
        />
        <DashboardActionCard
          title="Performance Analytics"
          description="View insights on profile views, inquiries, and order trends."
          icon={BarChart3}
          linkHref={`/goldsmith-portal/analytics?goldsmithId=${currentGoldsmith?.id || ''}`}
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
      
      {/* Removed simulated notifications section */}
      {/* If you want real notifications, this would be a separate feature to implement */}

    </div>
  );
}

// Helper component for dashboard cards for consistency
interface DashboardActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  linkHref: string;
  linkText: string;
  variant?: "default" | "outline";
  secondaryLinkHref?: string;
  secondaryLinkText?: string;
}

const DashboardActionCard: React.FC<DashboardActionCardProps> = ({ title, description, icon: Icon, linkHref, linkText, variant = "default", secondaryLinkHref, secondaryLinkText }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
    <CardHeader>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-8 w-8 text-primary" />
        <CardTitle className="text-xl text-accent font-heading">{title}</CardTitle>
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

