// src/app/customer/inquiries/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircleSquare, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { fetchCustomerInquiries } from '@/actions/customer-actions';
import type { Inquiry, InquiryStatus } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface CurrentUser {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
}

export default function CustomerInquiriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser: CurrentUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentUser(parsedUser);
        loadInquiries(parsedUser.id);
      } else {
        router.push('/login?redirect=/customer/inquiries');
      }
    } else {
      router.push('/login?redirect=/customer/inquiries');
    }
  }, [router]);

  const loadInquiries = async (customerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedInquiries = await fetchCustomerInquiries(customerId);
      setInquiries(fetchedInquiries);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      setError("Could not load your inquiries. Please try again.");
      toast({ title: "Error", description: "Failed to fetch inquiry history.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: InquiryStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'admin_review': return 'secondary';
      case 'forwarded_to_goldsmith': return 'outline';
      case 'goldsmith_replied': return 'default'; // Consider a success-like variant
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };
  
  if (!currentUser && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
   if (!currentUser && !isLoading) {
    return null; 
  }

  return (
    <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircleSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">My Inquiries</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/customer/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      {isLoading ? (
         <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="shadow-md bg-card border-border/20 rounded-xl animate-pulse">
              <CardHeader><div className="h-6 bg-muted rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-4 bg-muted rounded w-1/2 mb-2"></div><div className="h-4 bg-muted rounded w-full"></div></CardContent>
              <CardFooter><div className="h-8 bg-muted rounded w-1/4"></div></CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Inquiries</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : inquiries.length === 0 ? (
        <Card className="shadow-lg bg-card border-primary/10 rounded-xl text-center py-12">
          <CardHeader>
            <MessageCircleSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-accent">No Inquiries Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              You haven't sent any inquiries yet. Find a goldsmith to connect with!
            </CardDescription>
             <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Link href="/discover">Discover Goldsmiths</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="shadow-md bg-card border-border/20 rounded-xl hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                {/* Assuming you'll add goldsmithName to inquiry if needed, or fetch it */}
                  <CardTitle className="text-lg text-accent font-heading">Inquiry for Goldsmith ID: {inquiry.goldsmithId.substring(0,8)}...</CardTitle>
                  <Badge variant={getStatusBadgeVariant(inquiry.status)} className="capitalize text-xs">
                     {inquiry.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Inquiry ID: {inquiry.id} | Sent: {format(new Date(inquiry.requestedAt), 'PPp')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-foreground/80 pb-4">
                <p className="font-medium text-foreground mb-1">Your Message:</p>
                <p className="line-clamp-3 bg-muted/50 p-2 rounded-md text-xs">{inquiry.message}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                 <Button variant="outline" size="xs" className="text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full">
                  View Conversation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
