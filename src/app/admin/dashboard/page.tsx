
// src/app/admin/dashboard/page.tsx
'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  ShoppingCart,
  Hourglass,
  Database,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  MessageSquare,
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { fetchLatestCustomers, fetchAdminCustomers } from '@/actions/customer-actions';
import { getUnarchivedContactSubmissionsCount } from '@/actions/contact-actions';
import { 
  fetchAdminGoldsmiths, 
  getPlatformPendingOrderCount, 
  fetchLatestGoldsmiths,
  fetchLatestPlatformOrderRequests,
} from '@/actions/goldsmith-actions';
import { fetchUnreadAdminNotifications, markAllAdminNotificationsAsRead } from '@/actions/notification-actions';
import type { Customer, Goldsmith, OrderRequest, AdminNotification } from '@/types/goldsmith';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DashboardCard = ({ title, description, icon: Icon, linkHref, linkText, notificationCount }: { title: string, description: string, icon: React.ElementType, linkHref?: string, linkText?: string, notificationCount?: number }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10 rounded-xl">
    <CardHeader className="pb-3 pt-4 px-4 relative">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-3">
            <Icon className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl text-accent font-heading">{title}</CardTitle>
        </div>
         {notificationCount && notificationCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center rounded-full text-xs animate-pulse">
                {notificationCount}
            </Badge>
        )}
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
  type: 'newUser' | 'newGoldsmith' | 'newOrder';
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
    { title: "Pending Goldsmiths", value: "0", icon: Hourglass, description: "awaiting verification", isLoading: true },
  ]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  // Card Notification Counts State
  const [unreadContactCount, setUnreadContactCount] = useState(0);

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchDashboardData = async () => {
    // This function now fetches both stats and notifications
    setIsActivityLoading(true);
    setOverviewStats(prev => prev.map(s => ({ ...s, isLoading: true })));

    try {
      const [
        customersData,
        goldsmithsData,
        pendingOrdersCountData,
        notificationsData,
        unreadContactsCountData, // Fetch new count
      ] = await Promise.all([
        fetchAdminCustomers(),
        fetchAdminGoldsmiths(),
        getPlatformPendingOrderCount(),
        fetchUnreadAdminNotifications(),
        getUnarchivedContactSubmissionsCount(), // New action call
      ]);

      // Handle stats
      const totalUsers = (customersData || []).length;
      const activeGoldsmiths = (goldsmithsData || []).filter(g => g && g.status === 'verified').length;
      const pendingGoldsmiths = (goldsmithsData || []).filter(g => g && g.status === 'pending_verification').length;

      setOverviewStats([
        { title: "Total Users", value: totalUsers, icon: Users, isLoading: false, description: `${totalUsers} registered` },
        { title: "Active Goldsmiths", value: activeGoldsmiths, icon: Briefcase, isLoading: false, description: `${activeGoldsmiths} verified` },
        { title: "Pending Orders", value: pendingOrdersCountData ?? 0, icon: ShoppingCart, isLoading: false, description: `${pendingOrdersCountData ?? 0} require action` },
        { title: "Pending Goldsmiths", value: pendingGoldsmiths, icon: Hourglass, isLoading: false, description: `${pendingGoldsmiths} awaiting verification` },
      ]);
      
      // Handle notifications
      setNotifications(notificationsData || []);
      setUnreadCount((notificationsData || []).length);
      setUnreadContactCount(unreadContactsCountData || 0); // Set new count
      
    } catch (error) {
      console.error("Failed to load admin dashboard overview stats:", error);
      setOverviewStats(prevStats => prevStats.map(s => ({ ...s, value: 'Error', isLoading: false, description: 'Data unavailable' })));
      setNotifications([]);
      setUnreadCount(0);
      setUnreadContactCount(0);
    }

    try {
      const [
        latestCustomersData,
        latestGoldsmithsData,
        latestOrdersData,
      ] = await Promise.all([
        fetchLatestCustomers(3), 
        fetchLatestGoldsmiths(3), 
        fetchLatestPlatformOrderRequests(3), 
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


  useEffect(() => {
    const adminLoggedIn = typeof window !== "undefined" ? localStorage.getItem('isAdminLoggedIn') : null;
    if (adminLoggedIn !== 'true') {
      router.replace('/admin/login?redirect=/admin/dashboard');
    } else {
      setIsCheckingAuth(false);
      fetchDashboardData();
    }
  }, [router]);
  
  const handleAdminLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('isAdminLoggedIn');
    }
    toast({ title: "Logged Out", description: "You have been logged out from the admin panel." });
    router.push('/admin/login');
  };

  const handleMarkNotificationsRead = async (isOpen: boolean) => {
    if (isOpen && unreadCount > 0) {
      // Optimistically update the UI
      setUnreadCount(0);
      // Call the server action to update the database
      const result = await markAllAdminNotificationsAsRead();
      if (!result.success) {
        // If it fails, maybe show a toast and refetch to get the real count
        toast({ title: "Error", description: "Could not mark notifications as read.", variant: "destructive" });
        fetchDashboardData();
      }
    }
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
            <DropdownMenu onOpenChange={handleMarkNotificationsRead}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full border-border hover:bg-secondary/30">
                    <Bell className="h-5 w-5 text-muted-foreground"/>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                           {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <DropdownMenuItem key={notif.id} asChild>
                      <Link href={notif.link} className="flex flex-col items-start gap-1 p-2">
                        <p className="text-xs text-foreground whitespace-normal">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    You're all caught up!
                  </div>
                )}
                 {notifications.length > 0 && (
                    <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/audit-logs" className="justify-center text-xs text-primary">View All Activity</Link>
                    </DropdownMenuItem>
                    </>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
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
          description="View and manage messages submitted through the public contact form."
          icon={MessageSquare}
          linkText="View Messages"
          linkHref="/admin/communications"
          notificationCount={unreadContactCount}
        />
         <DashboardCard
          title="Manage Admins"
          description="Add, view, and manage administrator accounts and their roles for the platform."
          icon={Users2}
          linkText="Manage Admins"
          linkHref="/admin/admins"
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
            <p>Quick links: <Link href="/admin/audit-logs" className="text-primary hover:underline">View Audit Logs</Link> | <Link href="/admin/reports" className="text-primary hover:underline">Generate Reports</Link> | <Link href="/admin/database" className="text-primary hover:underline">View Database</Link></p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
