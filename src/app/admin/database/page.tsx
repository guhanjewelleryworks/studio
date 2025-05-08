// src/app/admin/database/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminDatabasePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Database Records</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Caution: Direct Database Access</AlertTitle>
        <AlertDescription>
          This area is for advanced administrators only. Incorrect modifications can lead to data loss or platform instability. Proceed with extreme caution.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg bg-card border-destructive/20 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-accent font-heading">Raw Data Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            This is a placeholder page for viewing and managing raw database records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            In a real application, this section would provide tools to:
          </p>
          <ul className="list-disc list-inside text-foreground/80 mt-2 space-y-1 text-sm">
            <li>View records from different database tables/collections (e.g., users, goldsmiths, orders, messages).</li>
            <li>Perform queries and filter data (with appropriate safeguards).</li>
            <li>Export data for reporting or backup purposes.</li>
            <li>Potentially perform manual data corrections under strict supervision (highly discouraged for routine operations).</li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            Access to this area should be highly restricted and all actions logged.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
