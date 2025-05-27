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

const mockNotifications = [
  { id: 1, message: "New order request #ORD12345 received.", time: "2 hours ago", read: false },
  { id: 2, message: "Customer Inquiry: 'Can you make a custom ring?'", time: "1 day ago", read: false },
  { id: 3, message: "Profile view increased by 15% this week.", time: "3 days ago", read: true },
];

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
    goldsmithName: "Artisan Goldworks",
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
        const allVerifiedGoldsmiths = await fetchAllGoldsmiths(); 
        const activeGoldsmith = allVerifiedGoldsmiths.length > 0 ? allVerifiedGoldsmiths[0] : null;
        setCurrentGoldsmith(activeGoldsmith);

        if (activeGoldsmith) {
          const [ordersCount, inquiriesCount] = await Promise.all([
            getNewOrderCountForGoldsmith(activeGoldsmith.id),
            getPendingInquiriesCountForGoldsmith(activeGoldsmith.id)
          ]);

          setStats(prevStats => ({
            ...prevStats,
            goldsmithName: activeGoldsmith.name,
            profileCompletion: calculateProfileCompletion(activeGoldsmith),
            newOrdersCount: ordersCount,
            pendingInquiriesCount: inquiriesCount,
          }));
        } else {
           toast({
            title: "Simulation Info",
            description: "Displaying default dashboard data. No verified goldsmith found for dynamic content.",
            variant: "default",
          });
          setStats(prevStats => ({
            ...prevStats,
            goldsmithName: "Default Artisan",
            profileCompletion: calculateProfileCompletion(null),
            newOrdersCount: 0,
            pendingInquiriesCount: 0,
          }));
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error",
          description: "Could not load dashboard data.",
          variant: "destructive",
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
            {isLoading ? <Loader2 className="h-8 w-8 animate-spin inline-block" /> : `Welcome, ${stats.goldsmithName}!`}
          </h1>
          <p className="text-muted-foreground text-lg">Manage your workshop and connect with customers.</p>
        </div>
        <Button variant="destructive" size="sm" asChild className="text-xs rounded-full">
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
          linkHref="/goldsmith-portal/profile/edit"
          linkText="Edit Your Profile"
          variant="outline"
        />
        <DashboardActionCard
          title="Order Management"
          description="View new, active, and completed custom order requests."
          icon={Package}
          linkHref="/goldsmith-portal/orders?status=new" 
          linkText="View New Orders"
          variant="default"
          secondaryLinkHref="/goldsmith-portal/orders?status=active"
          secondaryLinkText="Manage Active Orders"
        />
        <DashboardActionCard
          title="Communication Hub"
          description="Respond to customer inquiries and manage conversations."
          icon={MessageSquare}
          linkHref="/goldsmith-portal/messages"
          linkText="Access Messages"
          variant="default"
        />
        <DashboardActionCard
          title="Portfolio Showcase"
          description="Manage images of your work to attract customers."
          icon={GalleryHorizontal}
          linkHref="/goldsmith-portal/portfolio/manage"
          linkText="Update Portfolio"
          variant="outline"
        />
        <DashboardActionCard
          title="Performance Analytics"
          description="View insights on profile views, inquiries, and order trends."
          icon={BarChart3}
          linkHref="/goldsmith-portal/analytics"
          linkText="View Analytics"
          variant="outline"
        />
        <DashboardActionCard
          title="Account Settings"
          description="Manage login, notifications, and payment details."
          icon={Settings}
          linkHref="/goldsmith-portal/settings"
          linkText="Go to Settings"
          variant="outline"
        />
      </section>

      {/* Notifications Section - Still Mocked */}
      <section className="mt-10">
          <Card className="shadow-lg bg-card border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                    <Bell className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg text-accent font-heading">Recent Notifications (Simulated)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                     <div className="space-y-3">
                        {[1,2,3].map(i => <Loader2 key={i} className="h-5 w-5 animate-spin text-muted-foreground" />)}
                     </div>
                  ) : mockNotifications.length > 0 ? (
                    <ul className="space-y-3">
                      {mockNotifications.map(notification => (
                        <li key={notification.id} className={`py-2.5 px-3 rounded-md border-l-4 ${notification.read ? 'border-border/30 bg-card/50' : 'border-primary bg-primary/5'}`}>
                            <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                        </li> 
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No new notifications.</p>
                  )}
              </CardContent>
          </Card>
      </section>
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
