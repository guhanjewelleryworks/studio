
// src/app/customer/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Loader2, ArrowLeft, AlertTriangle, Eye } from 'lucide-react'; // Added Eye icon
import Link from 'next/link';
import { fetchCustomerOrders } from '@/actions/customer-actions';
import type { OrderRequest, OrderRequestStatus } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OrderStatusProgress } from '@/components/orders/OrderStatusProgress'; 
import { Separator } from '@/components/ui/separator';

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
      case 'new': return 'default'; 
      case 'pending_goldsmith_review': return 'secondary';
      case 'in_progress': return 'outline'; 
      case 'completed': return 'default'; 
      case 'cancelled': return 'destructive';
      case 'customer_review_requested': return 'secondary';
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
    <div className="container max-w-screen-xl py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
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
          {[1, 2].map(i => (
            <Card key={i} className="shadow-md bg-card border-border/20 rounded-xl animate-pulse">
              <CardHeader className="p-4"><div className="h-6 bg-muted rounded w-3/4"></div><div className="h-4 bg-muted rounded w-1/2 mt-1"></div></CardHeader>
              <CardContent className="p-4"><div className="h-10 bg-muted rounded w-full mb-3"></div><div className="h-4 bg-muted rounded w-full"></div><div className="h-4 bg-muted rounded w-5/6 mt-1"></div></CardContent>
              <CardFooter className="p-4"><div className="h-8 bg-muted rounded w-1/4"></div></CardFooter>
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
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-lg bg-card border-primary/10 rounded-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <CardTitle className="text-lg sm:text-xl text-accent font-heading mb-1 sm:mb-0">{order.itemDescription}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs px-2.5 py-1 rounded-full self-start sm:self-center">
                     {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Order ID: {order.id.substring(0,18)}... | Requested: {format(new Date(order.requestedAt), 'PPp')}
                </CardDescription>
              </CardHeader>
              
              <Separator className="bg-border/30"/>

              <CardContent className="p-4 sm:p-5">
                <OrderStatusProgress currentStatus={order.status} />
                {order.details && (
                   <>
                    <Separator className="my-3 bg-border/20"/>
                    <p className="text-xs text-foreground/80 mt-2 line-clamp-2"><span className="font-medium text-foreground">Details:</span> {order.details}</p>
                   </>
                )}
              </CardContent>

              <Separator className="bg-border/30"/>
              
              <CardFooter className="p-4 sm:p-5 flex justify-end">
                <Button asChild variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground rounded-full text-xs">
                  <Link href={`/customer/orders/${order.id}`}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                     View Order Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
