// src/app/admin/dashboard/page.tsx
'use client'; 

import { useEffect, useState } from 'react';
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

export default function AdminDashboardPage() {
  const [overviewStats, setOverviewStats] = useState<OverviewStatDisplay[]>([
    { title: "Total Users", value: "0", icon: Users, description: "registered users", isLoading: true },
    { title: "Active Goldsmiths", value: "0", icon: Briefcase, description: "verified partners", isLoading: true },
    { title: "Pending Orders", value: "0", icon: ShoppingCart, description: "require action", isLoading: true },
    { title: "Unread Messages", value: "0", icon: MessageSquare, description: "to review", isLoading: true },
  ]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setOverviewStats(prev => prev.map(s => ({ ...s, isLoading: true })));
      setIsActivityLoading(true);
      try {
        const [
          customersData,
          goldsmithsData,
          pendingOrdersCountData,
          pendingInquiriesCountData,
          latestCustomersData,
          latestGoldsmithsData,
          latestOrdersData,
          latestInquiriesData,
        ] = await Promise.all([
          fetchAdminCustomers(),
          fetchAdminGoldsmiths(),
          getPlatformPendingOrderCount(),
          getPlatformPendingInquiriesCount(),
          fetchLatestCustomers(3), // Fetch latest 3 customers
          fetchLatestGoldsmiths(3), // Fetch latest 3 goldsmiths
          fetchLatestPlatformOrderRequests(3), // Fetch latest 3 orders
          fetchLatestPlatformInquiries(3), // Fetch latest 3 inquiries
        ]);

        const totalUsers = customersData.length;
        const activeGoldsmiths = goldsmithsData.filter(g => g.status === 'verified').length;

        setOverviewStats([
          { title: "Total Users", value: totalUsers, icon: Users, isLoading: false, description: `${totalUsers} registered` },
          { title: "Active Goldsmiths", value: activeGoldsmiths, icon: Briefcase, isLoading: false, description: `${activeGoldsmiths} verified` },
          { title: "Pending Orders", value: pendingOrdersCountData, icon: ShoppingCart, isLoading: false, description: `${pendingOrdersCountData} require action` },
          { title: "Unread Messages", value: pendingInquiriesCountData, icon: MessageSquare, isLoading: false, description: `${pendingInquiriesCountData} to review` },
        ]);

        // Process recent activities
        const activities: ActivityItem[] = [];

        latestCustomersData.forEach(customer => {
          activities.push({
            id: `customer-${customer.id}`,
            type: 'newUser',
            message: `New customer '${customer.name}' registered.`,
            timestamp: new Date(customer.registeredAt),
            time: formatDistanceToNow(new Date(customer.registeredAt), { addSuffix: true }),
            icon: Users,
            link: `/admin/customers`, // General link for now
          });
        });

        latestGoldsmithsData.forEach(goldsmith => {
          activities.push({
            id: `goldsmith-${goldsmith.id}`,
            type: 'newGoldsmith',
            message: `New goldsmith '${goldsmith.name}' registered.`,
            timestamp: new Date(goldsmith.registeredAt), // Assuming registeredAt is added
            time: formatDistanceToNow(new Date(goldsmith.registeredAt), { addSuffix: true }),
            icon: Briefcase,
            link: `/admin/goldsmiths`, // General link for now
          });
        });

        latestOrdersData.forEach(order => {
          activities.push({
            id: `order-${order.id}`,
            type: 'newOrder',
            message: `New order request from '${order.customerName}' for '${order.itemDescription.substring(0,20)}...'.`,
            timestamp: new Date(order.requestedAt),
            time: formatDistanceToNow(new Date(order.requestedAt), { addSuffix: true }),
            icon: ShoppingCart,
            link: `/admin/orders`, // General link for now
          });
        });

        latestInquiriesData.forEach(inquiry => {
          activities.push({
            id: `inquiry-${inquiry.id}`,
            type: 'newInquiry',
            message: `New inquiry from '${inquiry.customerName}' for goldsmith ID ${inquiry.goldsmithId.substring(0,8)}...`,
            timestamp: new Date(inquiry.requestedAt),
            time: formatDistanceToNow(new Date(inquiry.requestedAt), { addSuffix: true }),
            icon: MessageSquare,
            link: `/admin/communications`, // General link for now
          });
        });
        
        // Sort all activities by timestamp descending and take top 5
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setRecentActivities(activities.slice(0, 5));

      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
        setOverviewStats(prevStats => prevStats.map(s => ({ ...s, value: 'Error', isLoading: false, description: 'Data unavailable' })));
        setRecentActivities([]);
      } finally {
        setIsActivityLoading(false);
        // Ensure overview stats loading is also false
        setOverviewStats(prev => prev.map(s => ({ ...s, isLoading: false })));
      }
    };

    fetchDashboardData();
  }, []);

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
             <Button variant="destructive" size="sm" asChild className="rounded-full text-xs">
                <Link href="/">
                    <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
                </Link>
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
