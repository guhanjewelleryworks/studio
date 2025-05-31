// src/app/customer/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { fetchCustomerOrders } from '@/actions/customer-actions';
import type { OrderRequest, OrderRequestStatus } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CurrentUser {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser: CurrentUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentUser(parsedUser);
        loadOrders(parsedUser.id);
      } else {
        router.push('/login?redirect=/customer/orders');
      }
    } else {
      router.push('/login?redirect=/customer/orders');
    }
  }, [router]);

  const loadOrders = async (customerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await fetchCustomerOrders(customerId);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Could not load your orders. Please try again.");
      toast({ title: "Error", description: "Failed to fetch order history.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadgeVariant = (status: OrderRequestStatus) => {
    switch (status) {
      case 'new': return 'default'; // Blue or primary
      case 'pending_goldsmith_review': return 'secondary'; // Yellow or orange
      case 'in_progress': return 'outline'; // A distinct color, maybe purple
      case 'completed': return 'default'; // Green (using default as success for now)
      case 'cancelled': return 'destructive'; // Red
      case 'customer_review_requested': return 'secondary'; // Amber/Yellow
      default: return 'outline';
    }
  };

  if (!currentUser && isLoading) { // Show loader only if currentUser is not yet set and still loading
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  if (!currentUser && !isLoading) { // If loading finished and still no user, means redirection is happening or failed
    return null; // Or a message, but redirection should handle it.
  }


  return (
    <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">My Orders</h1>
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
          <AlertTitle>Error Loading Orders</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : orders.length === 0 ? (
        <Card className="shadow-lg bg-card border-primary/10 rounded-xl text-center py-12">
          <CardHeader>
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-accent">No Orders Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              You haven't placed any custom orders yet. Explore goldsmiths and start creating!
            </CardDescription>
            <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <Link href="/discover">Discover Goldsmiths</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md bg-card border-border/20 rounded-xl hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-accent font-heading">{order.itemDescription}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs">
                     {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Order ID: {order.id} | Requested: {format(new Date(order.requestedAt), 'PPp')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-foreground/80 pb-4">
                <p className="line-clamp-2">{order.details}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button variant="outline" size="xs" className="text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
