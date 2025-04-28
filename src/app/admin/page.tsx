import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal } from 'lucide-react';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary-foreground mb-4">
          Admin Dashboard
        </h1>
        <p className="max-w-[600px] mx-auto text-foreground md:text-xl mb-8">
          Manage users, goldsmiths, orders, and system settings for Goldsmith Connect.
        </p>

        <Card className="max-w-md mx-auto shadow-lg bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Admin Access</CardTitle>
            <CardDescription>Secure login required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Placeholder Login/Info */}
            <p className="text-sm text-muted-foreground">
              This portal provides tools to oversee the entire Goldsmith Connect platform. Functionality includes:
            </p>
             <ul className="list-disc list-inside text-sm text-left text-foreground space-y-1 pl-4">
                <li>User Account Management (<Users className="inline h-4 w-4 mr-1"/>)</li>
                <li>Goldsmith Partner Management (<Settings className="inline h-4 w-4 mr-1"/>)</li>
                <li>Order Oversight & Analytics (<BarChartHorizontal className="inline h-4 w-4 mr-1"/>)</li>
                <li>Platform Configuration</li>
             </ul>
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow">
              <Link href="/admin/login">
                Admin Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
