// src/app/goldsmith-portal/analytics/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MessageCircle, ShoppingBag } from 'lucide-react';

// Mock analytics data
const mockAnalytics = {
  profileViews: 1250,
  inquiriesReceived: 75,
  ordersCompleted: 32,
  conversionRate: '2.56%', // (Orders / Profile Views) * 100 or (Orders / Inquiries)
  mostViewedItem: "Custom Diamond Engagement Ring",
};

export default function GoldsmithAnalyticsPage() {
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/70 border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalytics.profileViews}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-card/70 border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">Inquiries Received</CardTitle>
              <MessageCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalytics.inquiriesReceived}</div>
              <p className="text-xs text-muted-foreground">+15 since last week</p>
            </CardContent>
          </Card>
          <Card className="bg-card/70 border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">Orders Completed</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalytics.ordersCompleted}</div>
              <p className="text-xs text-muted-foreground">Conversion Rate: {mockAnalytics.conversionRate}</p>
            </CardContent>
          </Card>
           <Card className="bg-card/70 border-border/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-accent">Most Viewed Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{mockAnalytics.mostViewedItem}</p>
               {/* Placeholder for a chart or more detailed stats */}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
