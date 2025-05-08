// src/app/admin/goldsmiths/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminGoldsmithsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Manage Goldsmith Partners</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-accent font-heading">Goldsmith Partner Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            This is a placeholder page for managing goldsmith partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            In a real application, this area would allow administrators to:
          </p>
          <ul className="list-disc list-inside text-foreground/80 mt-2 space-y-1 text-sm">
            <li>View and approve/reject new goldsmith registrations.</li>
            <li>Manage goldsmith profiles and verification status.</li>
            <li>Oversee goldsmith portfolios and service offerings.</li>
            <li>Monitor partner performance and customer feedback.</li>
            <li>Facilitate communication or mediate issues between goldsmiths and customers.</li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            Functionality for these actions would be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
