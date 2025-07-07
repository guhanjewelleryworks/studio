// src/app/goldsmith-portal/messages/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';
import Link from 'next/link';

export default function GoldsmithMessagesRemovedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6 flex items-center justify-center">
        <Card className="max-w-lg mx-auto shadow-xl bg-card border-primary/10 text-center py-12">
          <CardHeader>
              <MessageSquareOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="text-2xl text-accent">Communication Hub Removed</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              This feature has been streamlined. All new customer requests will now appear in your Order Management dashboard.
            </CardDescription>
             <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Link href="/goldsmith-portal/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
