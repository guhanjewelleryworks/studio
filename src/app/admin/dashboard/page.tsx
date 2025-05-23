// src/app/admin/dashboard/page.tsx
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
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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

// Mock Data
const overviewStats = [
  { title: "Total Users", value: "1,250", icon: Users, trend: "+5% this month" },
  { title: "Active Goldsmiths", value: "78", icon: Briefcase, trend: "+2 new" },
  { title: "Pending Orders", value: "15", icon: ShoppingCart, trend: "3 urgent" },
  { title: "Unread Messages", value: "8", icon: MessageSquare, trend: "New inquiry" },
];

const recentActivity = [
  { message: "New user 'Jane Doe' registered.", time: "2 hours ago", icon: Users },
  { message: "Goldsmith 'Aura & Gold' updated portfolio.", time: "5 hours ago", icon: Briefcase },
  { message: "Order #ORD78901 marked as 'Completed'.", time: "1 day ago", icon: ShoppingCart },
  { message: "New message from 'Customer X' regarding custom design.", time: "2 days ago", icon: MessageSquare },
];

export default function AdminDashboardPage() {
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
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-[0.7rem] text-muted-foreground/80">{stat.trend}</p>
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
          linkHref="/admin/customers" // Placeholder link
        />
        <DashboardCard
          title="Goldsmith Partners"
          description="Oversee goldsmith profiles, manage verification status, and view partner performance."
          icon={Briefcase}
          linkText="Manage Goldsmiths"
          linkHref="/admin/goldsmiths" // Placeholder link
        />
        <DashboardCard
          title="Order Management"
          description="Track custom orders, mediate communications, and manage order statuses."
          icon={ShoppingCart}
          linkText="View Orders"
          linkHref="/admin/orders" // Placeholder link
        />
        <DashboardCard
          title="Communications"
          description="Facilitate and monitor introductions and communications between users and goldsmiths."
          icon={MessageSquare}
          linkText="Access Messages"
          linkHref="/admin/communications" // Placeholder link
        />
        <DashboardCard
          title="Database Records"
          description="View and manage raw data records for users, goldsmiths, and orders (requires caution)."
          icon={Database}
          linkText="View Database"
          linkHref="/admin/database" // Placeholder link
        />
        <DashboardCard
          title="Platform Settings"
          description="Configure global platform settings, manage content, and adjust operational parameters."
          icon={Settings}
          linkText="Configure Settings"
          linkHref="/admin/settings" // Placeholder link
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
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-1">
                {recentActivity.length > 0 ? (
                <ul className="space-y-2.5">
                    {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2.5 py-2 px-3 rounded-md border-l-4 border-primary/60 bg-primary/5 text-xs">
                        <activity.icon className="h-4 w-4 text-primary/80 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-foreground/90">{activity.message}</p>
                            <p className="text-muted-foreground/70 text-[0.65rem] mt-0.5">{activity.time}</p>
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
