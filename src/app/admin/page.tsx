import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database } from 'lucide-react';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary-foreground mb-4">
          Admin Dashboard
        </h1>
        <p className="max-w-[600px] mx-auto text-foreground md:text-xl mb-8">
          Oversee and manage all aspects of the Goldsmith Connect platform, including user data, goldsmith partnerships, orders, and system settings.
        </p>

        <Card className="max-w-md mx-auto shadow-lg bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Admin Access</CardTitle>
            <CardDescription>Restricted access. Secure login required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
               This central hub provides tools to manage the platform's data and operations:
             </p>
             <ul className="list-disc list-inside text-sm text-left text-foreground space-y-1 pl-4">
                <li>Customer Account Management (<Users className="inline h-4 w-4 mr-1"/>)</li>
                <li>Goldsmith Partner Management & Verification (<Settings className="inline h-4 w-4 mr-1"/>)</li>
                <li>Order Management & Mediation (<BarChartHorizontal className="inline h-4 w-4 mr-1"/>)</li>
                <li>Facilitate Introductions & Communications</li>
                <li>View & Manage Database Records (<Database className="inline h-4 w-4 mr-1"/>)</li>
                <li>Platform Configuration & Settings</li>
             </ul>
             {/* TODO: Add actual admin dashboard links/components here after login */}
             {/* Example: <Link href="/admin/users">Manage Users</Link> */}
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow mt-4">
              <Link href="/admin/login">
                <span>Admin Login</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}