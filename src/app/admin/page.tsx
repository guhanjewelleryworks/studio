import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Settings, BarChartHorizontal, Database, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  return (
    <div className="flex flex-col items-center py-8 md:py-10 lg:py-12 bg-gradient-to-br from-secondary/20 to-background min-h-[calc(100vh-8rem)]"> {/* Adjusted py and gradient, reduced min-h */}
      <div className="container px-4 md:px-6 text-center">
        <ShieldCheck className="h-14 w-14 mx-auto text-primary mb-3" /> {/* Increased size and margin */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-3"> {/* Changed to text-foreground, adjusted size and margin */}
          Admin Dashboard
        </h1>
        <p className="max-w-[700px] mx-auto text-foreground/75 md:text-lg mb-6 leading-relaxed"> {/* Adjusted max-w, opacity, size, and margin */}
          Oversee and manage all aspects of the Goldsmith Connect platform. This central hub provides tools for user data management, goldsmith partnerships, order facilitation, and system settings.
        </p>

        <Card className="max-w-lg mx-auto shadow-xl bg-card border-primary/20 rounded-xl"> {/* Adjusted max-w */}
          <CardHeader className="pt-6 pb-3"> {/* Adjusted padding */}
            <CardTitle className="text-2xl text-foreground">Platform Management Tools</CardTitle> {/* Changed to text-foreground, adjusted size */}
            <CardDescription className="text-foreground/70 text-sm mt-0.5">Secure access to critical platform operations.</CardDescription> {/* Adjusted margin */}
          </CardHeader>
          <CardContent className="space-y-3.5 px-6 pb-6 pt-1.5"> {/* Adjusted padding and spacing */}
             <p className="text-sm text-muted-foreground text-left"> {/* Increased font size */}
               Key administrative functions include:
             </p>
             <ul className="list-none text-left text-foreground space-y-2 pl-1"> {/* Adjusted spacing */}
                <li className="flex items-center text-base"><Users className="h-4 w-4 mr-2.5 text-primary"/>Customer Account Management</li> {/* Increased font size and icon margin */}
                <li className="flex items-center text-base"><Briefcase className="h-4 w-4 mr-2.5 text-primary"/>Goldsmith Partner Management & Verification</li>
                <li className="flex items-center text-base"><BarChartHorizontal className="h-4 w-4 mr-2.5 text-primary"/>Order Management & Mediation</li>
                <li className="flex items-center text-base"><MessageSquare className="h-4 w-4 mr-2.5 text-primary"/>Facilitate Introductions & Communications</li>
                <li className="flex items-center text-base"><Database className="h-4 w-4 mr-2.5 text-primary"/>View & Manage Database Records</li>
                <li className="flex items-center text-base"><Settings className="h-4 w-4 mr-2.5 text-primary"/>Platform Configuration & Settings</li>
             </ul>
            <Button asChild size="lg" className={cn(buttonVariants({variant: 'premium'}), "w-full shadow-lg hover:shadow-xl transition-shadow mt-5 rounded-full text-base py-3")}> {/* Increased size, margin and padding */}
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
