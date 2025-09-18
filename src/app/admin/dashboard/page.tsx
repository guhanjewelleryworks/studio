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
  ClipboardList,
  RefreshCw,
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
import type { Customer, Goldsmith, OrderRequest, AdminNotification, Permission } from '@/types/goldsmith';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  linkHref: string;
  linkText: string;
  notificationCount?: number;
  permission?: Permission; // Add permission prop
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState({
    totalUsers: { value: 0, isLoading: true },
    activeGoldsmiths: { value: 0, isLoading: true },
    pendingOrders: { value: 0, isLoading: true },
    pendingGoldsmiths: { value: 0, isLoading: true },
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const hasPermission = (perm: Permission) => permissions.includes(perm);

  const DashboardCard = ({ title, description, icon: Icon, linkHref, linkText, notificationCount, permission }: DashboardCardProps) => {
    if (permission && !hasPermission(permission)) {
      return null; // Don't render the card if the user doesn't have permission
    }
    
    return (
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
  };
  
  const fetchDashboardData = async () => {
    setIsActivityLoading(true);
    setIsDashboardLoading(true);
    setOverviewStats(prev => ({
      totalUsers: { ...prev.totalUsers, isLoading: true },
      activeGoldsmiths: { ...prev.activeGoldsmiths, isLoading: true },
      pendingOrders: { ...prev.pendingOrders, isLoading: true },
      pendingGoldsmiths: { ...prev.pendingGoldsmiths, isLoading: true },
    }));

    try {
      const [
        customersData,
        goldsmithsData,
        pendingOrdersCountData,
        notificationsData,
        unreadContactsCountData,
        latestCustomersData,
        latestGoldsmithsData,
        latestOrdersData,
      ] = await Promise.all([
        fetchAdminCustomers(),
        fetchAdminGoldsmiths(),
        getPlatformPendingOrderCount(),
        fetchUnreadAdminNotifications(),
        getUnarchivedContactSubmissionsCount(),
        fetchLatestCustomers(3),
        fetchLatestGoldsmiths(3),
        fetchLatestPlatformOrderRequests(3),
      ]);
      
      setOverviewStats({
        totalUsers: { value: (customersData || []).length, isLoading: false },
        activeGoldsmiths: { value: (goldsmithsData || []).filter(g => g.status === 'verified').length, isLoading: false },
        pendingOrders: { value: pendingOrdersCountData ?? 0, isLoading: false },
        pendingGoldsmiths: { value: (goldsmithsData || []).filter(g => g.status === 'pending_verification').length, isLoading: false },
      });
      
      setNotifications(notificationsData || []);
      setUnreadCount((notificationsData || []).length);
      setUnreadContactCount(unreadContactsCountData || 0);
      
      const activities: any[] = [];
      (latestCustomersData || []).forEach(c => activities.push({ type: 'customer', data: c, timestamp: new Date(c.registeredAt) }));
      (latestGoldsmithsData || []).forEach(g => activities.push({ type: 'goldsmith', data: g, timestamp: new Date(g.registeredAt) }));
      (latestOrdersData || []).forEach(o => activities.push({ type: 'order', data: o, timestamp: new Date(o.requestedAt) }));
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error("Failed to load admin dashboard data:", error);
      toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
    } finally {
      setIsActivityLoading(false);
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const storedPerms = localStorage.getItem('adminPermissions');
    const loginTimestamp = localStorage.getItem('adminLoginTimestamp');
    const now = new Date().getTime();
    const threeHours = 3 * 60 * 60 * 1000;

    if (adminLoggedIn !== 'true' || !storedPerms || !loginTimestamp || (now - parseInt(loginTimestamp)) > threeHours) {
        if (loginTimestamp && (now - parseInt(loginTimestamp)) > threeHours) {
            toast({ title: "Session Expired", description: "Your admin session has expired. Please log in again.", variant: "destructive" });
        }
      router.replace('/admin/login?redirect=/admin/dashboard');
    } else {
      setPermissions(JSON.parse(storedPerms));
      setIsCheckingAuth(false);
      fetchDashboardData();
    }
  }, [router, toast]);
  
  const handleAdminLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminPermissions');
    localStorage.removeItem('adminLoginTimestamp');
    toast({ title: "Logged Out", description: "You have been logged out from the admin panel." });
    router.push('/admin/login');
  };

  const handleMarkNotificationsRead = async (isOpen: boolean) => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
      await markAllAdminNotificationsAsRead();
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
            <Button onClick={fetchDashboardData} variant="outline" size="icon" className="rounded-full border-border hover:bg-secondary/30" disabled={isDashboardLoading}>
                {isDashboardLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/> : <RefreshCw className="h-5 w-5 text-muted-foreground"/>}
                <span className="sr-only">Refresh Dashboard</span>
            </Button>
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

      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-md bg-card border-border/50 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3 px-3">
              {overviewStats.totalUsers.isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="text-2xl font-bold text-foreground">{overviewStats.totalUsers.value}</div>}
              <p className="text-[0.7rem] text-muted-foreground/80">registered users</p>
            </CardContent>
          </Card>
           <Card className="shadow-md bg-card border-border/50 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Goldsmiths</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3 px-3">
              {overviewStats.activeGoldsmiths.isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="text-2xl font-bold text-foreground">{overviewStats.activeGoldsmiths.value}</div>}
              <p className="text-[0.7rem] text-muted-foreground/80">verified partners</p>
            </CardContent>
          </Card>
           <Card className="shadow-md bg-card border-border/50 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3 px-3">
              {overviewStats.pendingOrders.isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="text-2xl font-bold text-foreground">{overviewStats.pendingOrders.value}</div>}
              <p className="text-[0.7rem] text-muted-foreground/80">require action</p>
            </CardContent>
          </Card>
           <Card className="shadow-md bg-card border-border/50 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Goldsmiths</CardTitle>
              <Hourglass className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3 px-3">
              {overviewStats.pendingGoldsmiths.isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <div className="text-2xl font-bold text-foreground">{overviewStats.pendingGoldsmiths.value}</div>}
              <p className="text-[0.7rem] text-muted-foreground/80">awaiting verification</p>
            </CardContent>
          </Card>
      </section>
      
      <Separator className="my-6 bg-border/30" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard title="Customer Accounts" description="Manage customer profiles, view activity, and handle account-related issues." icon={Users} linkText="Manage Customers" linkHref="/admin/customers" permission="canManageCustomers" />
        <DashboardCard title="Goldsmith Partners" description="Oversee goldsmith profiles, manage verification status, and view partner performance." icon={Briefcase} linkText="Manage Goldsmiths" linkHref="/admin/goldsmiths" permission="canManageGoldsmiths" />
        <DashboardCard title="Order Management" description="Track custom orders, mediate communications, and manage order statuses." icon={ShoppingCart} linkText="View Orders" linkHref="/admin/orders" permission="canManageOrders" />
        <DashboardCard title="Communications" description="View and manage messages submitted through the public contact form." icon={MessageSquare} linkText="View Messages" linkHref="/admin/communications" notificationCount={unreadContactCount} permission="canManageCommunications" />
        <DashboardCard title="Manage Admins" description="Add, view, and manage administrator accounts and their roles for the platform." icon={Users2} linkText="Manage Admins" linkHref="/admin/admins" permission="canManageAdmins" />
        <DashboardCard title="Platform Settings" description="Configure global platform settings, manage content, and adjust operational parameters." icon={Settings} linkText="Configure Settings" linkHref="/admin/settings" permission="canManageSettings" />
      </section>

      <Separator className="my-6 bg-border/30" />

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
                      <li key={`${activity.type}-${activity.data.id}`} className="flex items-start gap-2.5 py-2 px-3 rounded-md border-l-4 border-primary/60 bg-primary/5 text-xs">
                        {activity.type === 'customer' && <Users className="h-4 w-4 text-primary/80 mt-0.5 shrink-0" />}
                        {activity.type === 'goldsmith' && <Briefcase className="h-4 w-4 text-primary/80 mt-0.5 shrink-0" />}
                        {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-primary/80 mt-0.5 shrink-0" />}
                        <div>
                            <p className="text-foreground/90">
                              {activity.type === 'customer' && `New customer '${activity.data.name}' registered.`}
                              {activity.type === 'goldsmith' && `New goldsmith '${activity.data.name}' registered. Status: ${activity.data.status}.`}
                              {activity.type === 'order' && `New order from '${activity.data.customerName}' for '${activity.data.itemDescription.substring(0, 25)}...'.`}
                            </p>
                            <p className="text-muted-foreground/70 text-[0.65rem] mt-0.5">{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</p>
                        </div>
                      </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-muted-foreground text-center py-3">No recent activity to display.</p>
                )}
            </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="bg-card border-border/20 rounded-xl shadow-md">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-md text-accent font-heading flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-primary"/>Admin Notes & Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-1 text-xs text-muted-foreground space-x-2">
            {hasPermission('canViewAuditLogs') && <Link href="/admin/audit-logs" className="text-primary hover:underline">View Audit Logs</Link>}
            {hasPermission('canGenerateReports') && <Link href="/admin/reports" className="text-primary hover:underline">Generate Reports</Link>}
            {hasPermission('canViewDatabase') && <Link href="/admin/database" className="text-primary hover:underline">View Database</Link>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
