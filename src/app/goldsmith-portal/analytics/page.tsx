// src/app/goldsmith-portal/analytics/page.tsx
'use client'; // Make it a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MessageCircle, ShoppingBag, Loader2, AlertTriangle } from 'lucide-react';
import { fetchGoldsmithById } from '@/actions/goldsmith-actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
}

interface AnalyticsData {
  profileViews: number;
  inquiriesReceived: number;
  ordersCompleted: number;
  conversionRate: string;
  mostViewedItem: string;
}

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
      if (parsedUser.isLoggedIn && parsedUser.id) {
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
        const goldsmithProfile = await fetchGoldsmithById(currentUser.id);

        if (!goldsmithProfile) {
          throw new Error("Could not retrieve your goldsmith profile.");
        }
        
        const ordersCompleted = goldsmithProfile.ordersCompleted || 0;
        
        // Inquiry system has been removed, so this data is now simulated for display.
        const inquiriesReceived = 72; // Mocked value
        
        let conversionRate = '0.00%';
        if (inquiriesReceived > 0) {
          conversionRate = ((ordersCompleted / inquiriesReceived) * 100).toFixed(2) + '%';
        }

        setAnalyticsData({
          ordersCompleted,
          inquiriesReceived,
          conversionRate: `${conversionRate} (demo)`,
          profileViews: 1250, // Mocked value
          mostViewedItem: "Custom Diamond Engagement Ring", // Mocked value
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

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl text-accent">Performance Analytics</CardTitle>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Inquiries Received (Simulated)"
                    value={analyticsData?.inquiriesReceived ?? '...'}
                    icon={MessageCircle}
                    description="Total customer inquiries (demo data)."
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Orders Completed"
                    value={analyticsData?.ordersCompleted ?? '...'}
                    icon={ShoppingBag}
                    description={`Conversion Rate: ${analyticsData?.conversionRate ?? '...'}`}
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Profile Views (Simulated)"
                    value={analyticsData?.profileViews ?? '...'}
                    icon={Eye}
                    description="+20.1% from last month (demo data)"
                    isLoading={isLoading}
                />
                <Card className="bg-card/70 border-border/50 shadow-md">
                    <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-accent">Most Viewed Item (Simulated)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <p className="text-lg font-semibold text-foreground">{analyticsData?.mostViewedItem ?? '...'}</p>}
                    </CardContent>
                </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
