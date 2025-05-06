import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-8 md:py-10 lg:py-12 bg-gradient-to-br from-secondary/30 to-background min-h-[calc(100vh-7rem)]">
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2.5" />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-primary-foreground mb-2.5">
          Admin Dashboard
        </h1>
        <p className="max-w-[650px] mx-auto text-foreground/80 md:text-base mb-5 leading-relaxed">
          Oversee and manage all aspects of the Goldsmith Connect platform. This central hub provides tools for user data management, goldsmith partnerships, order facilitation, and system settings.
        </p>

        <Card className="max-w-md mx-auto shadow-xl bg-card border-primary/20 rounded-xl">
          <CardHeader className="pt-5 pb-2.5">
            <CardTitle className="text-xl text-primary-foreground">Platform Management Tools</CardTitle>
            <CardDescription className="text-foreground/70 text-sm">Secure access to critical platform operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 pt-1">
             <p className="text-xs text-muted-foreground text-left">
               Key administrative functions include:
             </p>
             <ul className="list-none text-left text-foreground space-y-1.5 pl-1">
                <li className="flex items-center text-sm"><Users className="h-3.5 w-3.5 mr-2 text-primary"/>Customer Account Management</li>
                <li className="flex items-center text-sm"><Briefcase className="h-3.5 w-3.5 mr-2 text-primary"/>Goldsmith Partner Management & Verification</li>
                <li className="flex items-center text-sm"><BarChartHorizontal className="h-3.5 w-3.5 mr-2 text-primary"/>Order Management & Mediation</li>
                <li className="flex items-center text-sm"><MessageSquare className="h-3.5 w-3.5 mr-2 text-primary"/>Facilitate Introductions & Communications</li>
                <li className="flex items-center text-sm"><Database className="h-3.5 w-3.5 mr-2 text-primary"/>View & Manage Database Records</li>
                <li className="flex items-center text-sm"><Settings className="h-3.5 w-3.5 mr-2 text-primary"/>Platform Configuration & Settings</li>
             </ul>
            <Button asChild size="default" className={cn(buttonVariants({variant: 'premium'}), "w-full shadow-lg hover:shadow-xl transition-shadow mt-4 rounded-full text-sm py-2")}>
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
