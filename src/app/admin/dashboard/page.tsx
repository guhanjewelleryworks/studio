// src/app/admin/dashboard/page.tsx
'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  Database,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  ShieldCheck,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { 
  fetchAdminCustomers,
  fetchLatestCustomers 
} from '@/actions/customer-actions';
import { 
  fetchAdminGoldsmiths, 
  getPlatformPendingOrderCount, 
  getPlatformPendingInquiriesCount,
  fetchLatestGoldsmiths,
  fetchLatestPlatformOrderRequests,
  fetchLatestPlatformInquiries
} from '@/actions/goldsmith-actions';
import type { Customer, Goldsmith, OrderRequest, Inquiry } from '@/types/goldsmith';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const DashboardCard = ({ title, description, icon: Icon, linkHref, linkText }: { title: string, description: string, icon: React.ElementType, linkHref?: string, linkText?: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10 rounded-xl">
    <CardHeader className="pb-3 pt-4 px-4">
      <div className="flex items-center gap-3 mb-1.5">
        <Icon className="h-7 w-7 text-primary" />
        <CardTitle className="text-xl text-accent font-heading">{title}</CardTitle>
      </div>
      <CardDescription className="text-muted-foreground text-xs leading-relaxed">{description}</CardDescription>
    </CardHeader>
    {linkHref && linkText && (
      <CardContent className="px-4 pb-4 pt-1">
        <Button asChild variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground rounded-md text-xs">
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </CardContent>
    )}
  </Card>
);

interface OverviewStatDisplay {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string; 
  isLoading: boolean;
}

interface ActivityItem {
  id: string;
  type: 'newUser' | 'newGoldsmith' | 'newOrder' | 'newInquiry';
  message: string;
  time: string; // Formatted time (e.g., "2 hours ago")
  timestamp: Date; // Actual timestamp for sorting
  icon: React.ElementType;
  link?: string; // Optional link to view the item
}

const AdminAuthLoader = () => (
  <div className="flex justify-center items-center min-h-screen bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
    <p className="ml-3 text-muted-foreground">Verifying access...</p>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [overviewStats, setOverviewStats] = useState<OverviewStatDisplay[]>([
    { title: "Total Users", value: "0", icon: Users, description: "registered users", isLoading: true },
    { title: "Active Goldsmiths", value: "0", icon: Briefcase, description: "verified partners", isLoading: true },
    { title: "Pending Orders", value: "0", icon: ShoppingCart, description: "require action", isLoading: true },
    { title: "Unread Messages", value: "0", icon: MessageSquare, description: "to review", isLoading: true },
  ]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  useEffect(() => {
    const adminLoggedIn = typeof window !== "undefined" ? localStorage.getItem('isAdminLoggedIn') : null;
    if (adminLoggedIn !== 'true') {
      router.replace('/admin/login?redirect=/admin/dashboard');
    } else {
      setIsCheckingAuth(false); // Authenticated, stop checking
      fetchDashboardData(); // Fetch data only if authenticated
    }
  }, [router]);
  
  const fetchDashboardData = async () => {
    setOverviewStats(prev => prev.map(s => ({ ...s, isLoading: true })));
    setIsActivityLoading(true);

    try {
      const [
        customersData,
        goldsmithsData,
        pendingOrdersCountData,
        pendingInquiriesCountData,
      ] = await Promise.all([
        fetchAdminCustomers(),
        fetchAdminGoldsmiths(),
        getPlatformPendingOrderCount(),
        getPlatformPendingInquiriesCount(),
      ]);

      const totalUsers = (customersData || []).length;
      const activeGoldsmiths = (goldsmithsData || []).filter(g => g && g.status === 'verified').length;

      setOverviewStats([
        { title: "Total Users", value: totalUsers, icon: Users, isLoading: false, description: `${totalUsers} registered` },
        { title: "Active Goldsmiths", value: activeGoldsmiths, icon: Briefcase, isLoading: false, description: `${activeGoldsmiths} verified` },
        { title: "Pending Orders", value: pendingOrdersCountData ?? 0, icon: ShoppingCart, isLoading: false, description: `${pendingOrdersCountData ?? 0} require action` },
        { title: "Unread Messages", value: pendingInquiriesCountData ?? 0, icon: MessageSquare, isLoading: false, description: `${pendingInquiriesCountData ?? 0} to review` },
      ]);
    } catch (error) {
      console.error("Failed to load admin dashboard overview stats:", error);
      setOverviewStats(prevStats => prevStats.map(s => ({ ...s, value: 'Error', isLoading: false, description: 'Data unavailable' })));
    }

    try {
      const [
        latestCustomersData,
        latestGoldsmithsData,
        latestOrdersData,
        latestInquiriesData,
      ] = await Promise.all([
        fetchLatestCustomers(3), 
        fetchLatestGoldsmiths(3), 
        fetchLatestPlatformOrderRequests(3), 
        fetchLatestPlatformInquiries(3), 
      ]);

      const activities: ActivityItem[] = [];

      (latestCustomersData || []).forEach(customer => {
        if (!customer) return;
        const regDate = customer.registeredAt ? new Date(customer.registeredAt) : null;
        if (regDate && !isNaN(regDate.getTime())) {
          activities.push({
            id: `customer-${customer.id}`,
            type: 'newUser',
            message: `New customer '${customer.name || 'N/A'}' registered.`,
            timestamp: regDate,
            time: formatDistanceToNow(regDate, { addSuffix: true }),
            icon: Users,
            link: `/admin/customers`,
          });
        } else {
          console.warn(`[AdminDashboard] Customer ${customer.id || 'Unknown ID'} has invalid or missing registeredAt: ${customer.registeredAt}`);
        }
      });

      (latestGoldsmithsData || []).forEach(goldsmith => {
        if (!goldsmith) return;
        const regDate = goldsmith.registeredAt ? new Date(goldsmith.registeredAt) : null;
        if (regDate && !isNaN(regDate.getTime())) {
          activities.push({
            id: `goldsmith-${goldsmith.id}`,
            type: 'newGoldsmith',
            message: `New goldsmith '${goldsmith.name || 'N/A'}' registered. Status: ${goldsmith.status || 'N/A'}.`,
            timestamp: regDate,
            time: formatDistanceToNow(regDate, { addSuffix: true }),
            icon: Briefcase,
            link: `/admin/goldsmiths`,
          });
        } else {
           console.warn(`[AdminDashboard] Goldsmith ${goldsmith.id || 'Unknown ID'} has invalid or missing registeredAt: ${goldsmith.registeredAt}`);
        }
      });

      (latestOrdersData || []).forEach(order => {
        if (!order) return;
        const reqDate = order.requestedAt ? new Date(order.requestedAt) : null;
        if (reqDate && !isNaN(reqDate.getTime())) {
          activities.push({
            id: `order-${order.id}`,
            type: 'newOrder',
            message: `New order request from '${order.customerName || 'N/A'}' for '${(order.itemDescription || 'N/A').substring(0,20)}...'.`,
            timestamp: reqDate,
            time: formatDistanceToNow(reqDate, { addSuffix: true }),
            icon: ShoppingCart,
            link: `/admin/orders`,
          });
        } else {
          console.warn(`[AdminDashboard] Order ${order.id || 'Unknown ID'} has invalid or missing requestedAt: ${order.requestedAt}`);
        }
      });

      (latestInquiriesData || []).forEach(inquiry => {
        if (!inquiry) return;
        const reqDate = inquiry.requestedAt ? new Date(inquiry.requestedAt) : null;
        if (reqDate && !isNaN(reqDate.getTime())) {
          activities.push({
            id: `inquiry-${inquiry.id}`,
            type: 'newInquiry',
            message: `New inquiry from '${inquiry.customerName || 'N/A'}' for goldsmith ID ${(inquiry.goldsmithId || 'N/A').substring(0,8)}...`,
            timestamp: reqDate,
            time: formatDistanceToNow(reqDate, { addSuffix: true }),
            icon: MessageSquare,
            link: `/admin/communications`,
          });
        } else {
          console.warn(`[AdminDashboard] Inquiry ${inquiry.id || 'Unknown ID'} has invalid or missing requestedAt: ${inquiry.requestedAt}`);
        }
      });
      
      activities.sort((a, b) => {
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          if (isNaN(timeA) && isNaN(timeB)) return 0;
          if (isNaN(timeA)) return 1; 
          if (isNaN(timeB)) return -1;
          return timeB - timeA;
      });
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error("Failed to load admin dashboard recent activities:", error);
      setRecentActivities([]);
    } finally {
      setIsActivityLoading(false);
      setOverviewStats(prev => prev.map(s => ({ ...s, isLoading: false })));
    }
  };

  const handleAdminLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('isAdminLoggedIn');
    }
    toast({ title: "Logged Out", description: "You have been logged out from the admin panel." });
    router.push('/admin/login');
  };

  if (isCheckingAuth) {
    return <AdminAuthLoader />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-accent">Admin Dashboard</h1>
          <p className="text-muted-foreground text-md">Welcome, Admin! Oversee and manage platform operations.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary/30">
                <Bell className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Notifications</span>
            </Button>
             <Button variant="destructive" size="sm" onClick={handleAdminLogout} className="rounded-full text-xs">
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </Button>
        </div>
      </header>

      {/* Overview Stats Section */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map(stat => (
          <Card key={stat.title} className="shadow-md bg-card border-border/50 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3 px-3">
              {stat.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              )}
              <p className="text-[0.7rem] text-muted-foreground/80">{stat.isLoading ? 'Loading...' : stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <Separator className="my-6 bg-border/30" />

      {/* Main Management Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard
          title="Customer Accounts"
          description="Manage customer profiles, view activity, and handle account-related issues."
          icon={Users}
          linkText="Manage Customers"
          linkHref="/admin/customers"
        />
        <DashboardCard
          title="Goldsmith Partners"
          description="Oversee goldsmith profiles, manage verification status, and view partner performance."
          icon={Briefcase}
          linkText="Manage Goldsmiths"
          linkHref="/admin/goldsmiths"
        />
        <DashboardCard
          title="Order Management"
          description="Track custom orders, mediate communications, and manage order statuses."
          icon={ShoppingCart}
          linkText="View Orders"
          linkHref="/admin/orders"
        />
        <DashboardCard
          title="Communications"
          description="Facilitate and monitor introductions and communications between users and goldsmiths."
          icon={MessageSquare}
          linkText="Access Messages"
          linkHref="/admin/communications"
        />
        <DashboardCard
          title="Database Records"
          description="View and manage raw data records for users, goldsmiths, and orders (requires caution)."
          icon={Database}
          linkText="View Database"
          linkHref="/admin/database"
        />
        <DashboardCard
          title="Platform Settings"
          description="Configure global platform settings, manage content, and adjust operational parameters."
          icon={Settings}
          linkText="Configure Settings"
          linkHref="/admin/settings"
        />
      </section>

        <Separator className="my-6 bg-border/30" />

      {/* Recent Activity / Alerts Section */}
      <section className="mt-6">
        <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
            <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-3 mb-1">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl text-accent font-heading">Recent Platform Activity</CardTitle>
                </div>
                 <CardDescription className="text-muted-foreground text-xs">Shows the latest registrations and requests on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-1">
                {isActivityLoading ? (
                   <div className="space-y-2.5">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-start gap-2.5 py-2 px-3 rounded-md border-l-4 border-muted bg-muted/50 animate-pulse">
                        <Loader2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 animate-spin" />
                        <div>
                            <div className="h-4 bg-muted-foreground/30 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length > 0 ? (
                <ul className="space-y-2.5">
                    {recentActivities.map((activity) => (
                    <li key={activity.id} className="flex items-start gap-2.5 py-2 px-3 rounded-md border-l-4 border-primary/60 bg-primary/5 text-xs">
                        <activity.icon className="h-4 w-4 text-primary/80 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-foreground/90">{activity.message}</p>
                            <p className="text-muted-foreground/70 text-[0.65rem] mt-0.5">{activity.time}</p>
                        </div>
                         {activity.link && (
                           <Button variant="ghost" size="xs" asChild className="ml-auto self-center !h-6 !px-1.5 !py-0.5 !text-[0.6rem]">
                              <Link href={activity.link}>View</Link>
                           </Button>
                         )}
                    </li> 
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-muted-foreground text-center py-3">No recent activity to display.</p>
                )}
            </CardContent>
        </Card>
      </section>

      {/* Admin Quick Actions/Notes (Optional) */}
      <section className="mt-6">
        <Card className="bg-card border-border/20 rounded-xl shadow-md">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-md text-accent font-heading flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-primary"/>Admin Notes & Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-1 text-xs text-muted-foreground">
            <p>This is a simulated admin dashboard. In a real application, ensure all actions are logged and proper authorization checks are in place.</p>
            <p className="mt-1.5">Quick links: <Link href="/admin/audit-logs" className="text-primary hover:underline">View Audit Logs</Link> | <Link href="/admin/reports" className="text-primary hover:underline">Generate Reports</Link></p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
