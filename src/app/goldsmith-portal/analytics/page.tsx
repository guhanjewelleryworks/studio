// src/app/goldsmith-portal/analytics/page.tsx
'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Eye, ShoppingBag, Percent, Loader2, AlertTriangle, ListChecks, ArrowLeft } from 'lucide-react';
import { fetchGoldsmithById, fetchOrdersForGoldsmith } from '@/actions/goldsmith-actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { OrderRequest, OrderRequestStatus } from '@/types/goldsmith';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
import Link from 'next/link';

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
  loginTimestamp: number;
}

interface AnalyticsData {
  profileViews: number;
  totalOrders: number;
  ordersCompleted: number;
  completionRate: number;
  mostFrequentItem: string;
  orderStatusBreakdown: { status: string; count: number }[];
}

const chartConfig = {
  count: {
    label: "Orders",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const StatCard = ({ title, value, icon: Icon, description, isLoading }: { title: string, value: string | number, icon: React.ElementType, description: string, isLoading: boolean }) => (
     <Card className="bg-card/70 border-border/50 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-foreground">{value}</div>}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
 );

export default function GoldsmithAnalyticsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<CurrentGoldsmithUser | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentGoldsmithUser');
    if (user) {
      const parsedUser: CurrentGoldsmithUser = JSON.parse(user);
      const oneHour = 60 * 60 * 1000;
      const sessionExpired = new Date().getTime() - parsedUser.loginTimestamp > oneHour;
      if (parsedUser.isLoggedIn && parsedUser.id && !sessionExpired) {
        setCurrentUser(parsedUser);
      } else {
        router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/analytics');
      }
    } else {
      router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/analytics');
    }
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;

    const loadAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [goldsmithProfile, allOrders] = await Promise.all([
          fetchGoldsmithById(currentUser.id),
          fetchOrdersForGoldsmith(currentUser.id, 'all') // Fetch all orders
        ]);

        if (!goldsmithProfile) {
          throw new Error("Could not retrieve your goldsmith profile.");
        }
        
        const totalOrders = allOrders.length;
        const completedOrders = allOrders.filter(o => o.status === 'completed');
        const ordersCompleted = completedOrders.length;
        const completionRate = totalOrders > 0 ? (ordersCompleted / totalOrders) * 100 : 0;
        const profileViews = goldsmithProfile.profileViews || 0;
        
        let mostFrequentItem = "N/A";
        if (completedOrders.length > 0) {
            const descriptionCounts = completedOrders.reduce((acc, order) => {
                const desc = order.itemDescription || "Unnamed Item";
                acc[desc] = (acc[desc] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            if (Object.keys(descriptionCounts).length > 0) {
              mostFrequentItem = Object.keys(descriptionCounts).reduce((a, b) => 
                descriptionCounts[a] > descriptionCounts[b] ? a : b
              );
            }
        }
        
        const inProgressStatuses: OrderRequestStatus[] = ['in_progress', 'artwork_completed', 'customer_review_requested', 'shipped'];
        const statusCounts = allOrders
          .filter(o => inProgressStatuses.includes(o.status))
          .reduce((acc, order) => {
            const friendlyStatus = order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            acc[friendlyStatus] = (acc[friendlyStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const orderStatusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

        setAnalyticsData({
          profileViews,
          totalOrders,
          ordersCompleted,
          completionRate,
          mostFrequentItem,
          orderStatusBreakdown,
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Failed to load analytics data:", err);
        setError(`Could not load your analytics. ${errorMessage}`);
        toast({ title: "Error", description: "Failed to fetch analytics data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [currentUser, toast]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <header className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Performance Analytics</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/goldsmith-portal/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <CardDescription className="text-muted-foreground">
            Insights into your profile views, customer inquiries, and order trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Analytics</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                      title="Total Orders"
                      value={analyticsData?.totalOrders ?? '...'}
                      icon={ShoppingBag}
                      description="Total orders assigned to you."
                      isLoading={isLoading}
                  />
                  <StatCard 
                      title="Orders Completed"
                      value={analyticsData?.ordersCompleted ?? '...'}
                      icon={ListChecks}
                      description="Orders successfully completed."
                      isLoading={isLoading}
                  />
                  <StatCard 
                      title="Completion Rate"
                      value={`${analyticsData?.completionRate.toFixed(1) ?? '...'}%`}
                      icon={Percent}
                      description="Percentage of orders completed."
                      isLoading={isLoading}
                  />
                  <StatCard 
                      title="Profile Views"
                      value={analyticsData?.profileViews ?? '...'}
                      icon={Eye}
                      description="Times your profile was viewed."
                      isLoading={isLoading}
                  />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border/50 shadow-md">
                    <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-accent">Most Popular Item Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <p className="text-lg font-semibold text-foreground truncate" title={analyticsData?.mostFrequentItem}>{analyticsData?.mostFrequentItem ?? '...'}</p>}
                        <p className="text-xs text-muted-foreground">Based on completed orders.</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/70 border-border/50 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-accent">Live Order Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[150px]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : analyticsData && analyticsData.orderStatusBreakdown.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[150px] w-full">
                                <RechartsBarChart
                                    accessibilityLayer
                                    data={analyticsData.orderStatusBreakdown}
                                    layout="vertical"
                                    margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="status"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        width={110}
                                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                </RechartsBarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[150px]">
                                <p className="text-sm text-muted-foreground">No active orders to display.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
