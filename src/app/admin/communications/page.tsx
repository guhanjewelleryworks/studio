// src/app/admin/communications/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminCommunicationsRemovedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6 flex items-center justify-center">
        <Card className="shadow-lg bg-card border-primary/10 rounded-xl text-center py-12 max-w-lg">
          <CardHeader>
            <MessageSquareOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-accent">Communications Feature Removed</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              The "Inquiry" system has been consolidated into the "Custom Order Request" workflow. All new requests from customers will now appear in Order Management.
            </CardDescription>
            <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
