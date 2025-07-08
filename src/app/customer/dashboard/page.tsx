// src/app/customer/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, ShoppingBag, Edit, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchCustomerOrders } from '@/actions/customer-actions';
import type { OrderRequest } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CurrentUser {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
}

interface DashboardStats {
  orderCount: number;
  notificationCount: number;
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  linkHref: string;
  linkText: string;
  notificationCount?: number;
}

const DashboardActionCard: React.FC<DashboardActionCardProps> = ({ title, description, icon: Icon, linkHref, linkText, notificationCount }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10 rounded-xl">
    <CardHeader>
      <div className="flex items-center justify-between gap-3 mb-2">
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
      <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ orderCount: 0, notificationCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentUser(parsedUser);
      } else {
        router.push('/login?redirect=/customer/dashboard');
      }
    } else {
      router.push('/login?redirect=/customer/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (currentUser?.id) {
      const loadStats = async () => {
        setIsLoading(true);
        try {
          const orders = await fetchCustomerOrders(currentUser.id as string);
          const notificationCount = orders.filter(
            o => o.status === 'customer_review_requested' || o.status === 'shipped'
          ).length;
          setStats({
            orderCount: orders.length,
            notificationCount,
          });
        } catch (error) {
          console.error("Failed to load dashboard stats:", error);
          toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      loadStats();
    }
  }, [currentUser, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
    // Force re-render of header, etc.
    window.location.reload(); 
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-accent">Welcome, {currentUser.name}!</h1>
          <p className="text-muted-foreground text-lg">Manage your profile, orders, and inquiries.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground rounded-full">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      {/* Overview Stats */}
      <section className="mb-8 grid grid-cols-1 max-w-sm">
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">My Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-foreground">{stats.orderCount}</div>}
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardActionCard
          title="Edit Profile"
          description="Update your personal information."
          icon={Edit}
          linkHref="/customer/profile/edit"
          linkText="Go to Profile"
        />
        <DashboardActionCard
          title="View Orders"
          description="Track your custom order requests."
          icon={ShoppingBag}
          linkHref="/customer/orders"
          linkText="See Order History"
          notificationCount={stats.notificationCount}
        />
      </section>
    </div>
  );
}
