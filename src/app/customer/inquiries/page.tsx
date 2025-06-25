// src/app/customer/inquiries/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CustomerInquiriesPage() {
  return (
    <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center">
        <Card className="shadow-lg bg-card border-primary/10 rounded-xl text-center py-12 max-w-lg">
          <CardHeader>
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-accent">This Feature is No Longer Available</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              The customer inquiry system has been streamlined into our custom order request process.
            </CardDescription>
             <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Link href="/customer/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
