import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-12 md:py-20 lg:py-24 bg-gradient-to-br from-secondary/30 to-background min-h-[calc(100vh-10rem)]">
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-primary-foreground mb-4">
          Admin Dashboard
        </h1>
        <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl mb-8 leading-relaxed">
          Oversee and manage all aspects of the Goldsmith Connect platform. This central hub provides tools for user data management, goldsmith partnerships, order facilitation, and system settings.
        </p>

        <Card className="max-w-lg mx-auto shadow-xl bg-card border-primary/20 rounded-xl">
          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-2xl text-primary-foreground">Platform Management Tools</CardTitle>
            <CardDescription className="text-foreground/70">Secure access to critical platform operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8 pt-2">
             <p className="text-sm text-muted-foreground text-left">
               Key administrative functions include:
             </p>
             <ul className="list-none text-left text-foreground space-y-2.5 pl-1">
                <li className="flex items-center"><Users className="h-5 w-5 mr-3 text-primary"/>Customer Account Management</li>
                <li className="flex items-center"><Briefcase className="h-5 w-5 mr-3 text-primary"/>Goldsmith Partner Management & Verification</li>
                <li className="flex items-center"><BarChartHorizontal className="h-5 w-5 mr-3 text-primary"/>Order Management & Mediation</li>
                <li className="flex items-center"><MessageSquare className="h-5 w-5 mr-3 text-primary"/>Facilitate Introductions & Communications</li>
                <li className="flex items-center"><Database className="h-5 w-5 mr-3 text-primary"/>View & Manage Database Records</li>
                <li className="flex items-center"><Settings className="h-5 w-5 mr-3 text-primary"/>Platform Configuration & Settings</li>
             </ul>
            <Button asChild size="lg" className={cn(buttonVariants({variant: 'premium'}), "w-full shadow-lg hover:shadow-xl transition-shadow mt-6 rounded-full text-base py-3")}>
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
