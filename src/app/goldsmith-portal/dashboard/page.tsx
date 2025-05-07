// src/app/goldsmith-portal/dashboard/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutGrid, 
  UserCog, 
  Package, 
  MessageSquare, 
  GalleryHorizontal, 
  Settings,
  Bell,
  DollarSign,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function GoldsmithDashboardPage() {
  // Simulated data - replace with actual data fetching in a real application
  const goldsmithName = "Artisan Goldworks"; 
  const newOrdersCount = 3;
  const pendingInquiriesCount = 5;
  const profileCompletion = 85; // Percentage

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-heading text-accent">Welcome, {goldsmithName}!</h1>
        <p className="text-muted-foreground text-lg">Manage your workshop and connect with customers.</p>
      </header>

      {/* Overview Stats */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">New Orders</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{newOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">Pending Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingInquiriesCount}</div>
            <p className="text-xs text-muted-foreground">Require your response</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-card border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">Profile Completion</CardTitle>
            <UserCog className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{profileCompletion}%</div>
            <p className="text-xs text-muted-foreground">Keep your profile updated</p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8 bg-border/50" />

      {/* Main Dashboard Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Profile */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <UserCog className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Manage Profile</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Update your workshop details, bio, specialties, and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/goldsmith-portal/profile/edit">Edit Your Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
             <div className="flex items-center gap-3 mb-2">
              <Package className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Order Management</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              View new, active, and completed custom order requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/goldsmith-portal/orders?status=new">View New Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/goldsmith-portal/orders?status=active">Manage Active Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Communication Hub */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Communication Hub</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Respond to customer inquiries and manage conversations.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/goldsmith-portal/messages">Access Messages</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Showcase */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <GalleryHorizontal className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Portfolio Showcase</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Manage images of your work to attract customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/goldsmith-portal/portfolio/manage">Update Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Analytics */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Performance Analytics</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              View insights on profile views, inquiries, and order trends.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/goldsmith-portal/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Settings & Account */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-card border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-accent">Account Settings</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Manage your login credentials, notification preferences, and payment details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/goldsmith-portal/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links / Notifications (Optional) */}
      <section className="mt-10">
          <Card className="shadow-lg bg-card border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                    <Bell className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg text-accent">Recent Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                  {/* Placeholder for notifications list */}
                  <p className="text-sm text-muted-foreground">No new notifications.</p>
                  {/* Example Notification item:
                  <div className="py-2 border-b border-border/30">
                      <p className="text-sm text-foreground">New order request #12345 received.</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div> 
                  */}
              </CardContent>
          </Card>
      </section>
    </div>
  );
}
