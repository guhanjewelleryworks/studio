import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database } from 'lucide-react';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-10 md:py-16 lg:py-24 bg-background"> {/* Reduced py */}
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-14 w-14 mx-auto text-primary mb-3" /> {/* Slightly smaller icon, reduced mb */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary-foreground mb-3"> {/* Reduced mb */}
          Admin Dashboard
        </h1>
        <p className="max-w-[600px] mx-auto text-foreground md:text-xl mb-6"> {/* Reduced mb */}
          Oversee and manage all aspects of the Goldsmith Connect platform, including user data, goldsmith partnerships, orders, and system settings.
        </p>

        <Card className="max-w-md mx-auto shadow-lg bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Admin Access</CardTitle>
            <CardDescription>Restricted access. Secure login required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3"> {/* Reduced space-y */}
             <p className="text-sm text-muted-foreground">
               This central hub provides tools to manage the platform's data and operations:
             </p>
             <ul className="list-disc list-inside text-sm text-left text-foreground space-y-1 pl-3"> {/* Reduced pl, space-y */}
                <li>Customer Account Management (<Users className="inline h-4 w-4 mr-1"/>)</li>
                <li>Goldsmith Partner Management & Verification (<Settings className="inline h-4 w-4 mr-1"/>)</li>
                <li>Order Management & Mediation (<BarChartHorizontal className="inline h-4 w-4 mr-1"/>)</li>
                <li>Facilitate Introductions & Communications</li>
                <li>View & Manage Database Records (<Database className="inline h-4 w-4 mr-1"/>)</li>
                <li>Platform Configuration & Settings</li>
             </ul>
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow mt-3"> {/* Reduced mt */}
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
