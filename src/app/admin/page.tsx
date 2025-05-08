
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-8 md:py-10 bg-gradient-to-br from-secondary/20 to-background min-h-[calc(100vh-8rem)]">
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2.5" />
        <h1 className="font-heading text-accent mb-2.5"> 
          Admin Dashboard
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mb-5 leading-relaxed">
          Oversee and manage all aspects of the Goldsmith Connect platform. This central hub provides tools for user data management, goldsmith partnerships, order facilitation, and system settings.
        </p>

        <Card className="max-w-lg mx-auto shadow-xl bg-card border-primary/20 rounded-xl">
          <CardHeader className="pt-5 pb-2.5">
            <CardTitle className="text-2xl text-accent">Platform Management Tools</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-0.5">Secure access to critical platform operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 pt-1">
             <p className="text-sm text-muted-foreground text-left">
               Key administrative functions include:
             </p>
             <ul className="list-none text-left text-foreground space-y-1.5 pl-1">
                <li className="flex items-center text-base"><Users className="h-4 w-4 mr-2 text-primary"/>Customer Account Management</li>
                <li className="flex items-center text-base"><Briefcase className="h-4 w-4 mr-2 text-primary"/>Goldsmith Partner Management & Verification</li>
                <li className="flex items-center text-base"><BarChartHorizontal className="h-4 w-4 mr-2 text-primary"/>Order Management & Mediation</li>
                <li className="flex items-center text-base"><MessageSquare className="h-4 w-4 mr-2 text-primary"/>Facilitate Introductions & Communications</li>
                <li className="flex items-center text-base"><Database className="h-4 w-4 mr-2 text-primary"/>View & Manage Database Records</li>
                <li className="flex items-center text-base"><Settings className="h-4 w-4 mr-2 text-primary"/>Platform Configuration & Settings</li>
             </ul>
            {/* This button now links to /admin/login. The login page will handle redirection to /admin/dashboard */}
            <Button asChild size="lg" className={cn(buttonVariants({variant: 'default'}), "w-full shadow-lg hover:shadow-xl transition-shadow mt-4 rounded-full text-base py-3 bg-primary text-primary-foreground hover:bg-primary/90")}>
              <Link href="/admin/login">
                <span>Access Admin Portal</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
