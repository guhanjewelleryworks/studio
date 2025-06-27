// src/app/goldsmith-portal/orders/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Loader2, AlertTriangle, ArrowLeft, CheckCircle, Eye } from 'lucide-react'; // Added Eye
import Link from 'next/link';
import { fetchOrdersForGoldsmith, updateOrderStatus } from '@/actions/goldsmith-actions';
import type { OrderRequest, OrderRequestStatus } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

function GoldsmithOrdersContent() {
  const searchParams = useSearchParams();
  const goldsmithId = searchParams.get('goldsmithId');
  const statusFilter = (searchParams.get('status') as OrderRequestStatus | 'all') || 'all';

  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadOrders = React.useCallback(async () => {
    if (!goldsmithId) {
      setError("Goldsmith ID is missing. Cannot fetch orders.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await fetchOrdersForGoldsmith(goldsmithId, statusFilter);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Failed to fetch orders for goldsmith:", err);
      setError("Could not load orders. Please try refreshing the page.");
      toast({ title: "Error", description: "Failed to fetch orders.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [goldsmithId, statusFilter, toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRequestStatus) => {
    setIsUpdatingStatus(prev => ({...prev, [orderId]: true}));
    try {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            toast({ title: "Status Updated", description: `Order has been moved to '${newStatus.replace(/_/g, ' ')}'.` });
            loadOrders(); // Refresh the list to reflect the change
        } else {
            toast({ title: "Update Failed", description: result.error || "Could not update status.", variant: "destructive" });
        }
    } catch(err) {
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsUpdatingStatus(prev => ({...prev, [orderId]: false}));
    }
  };

  const getStatusBadgeVariant = (status: OrderRequestStatus) => {
    switch (status) {
      case 'new':
      case 'pending_goldsmith_review':
        return 'secondary';
      case 'in_progress':
      case 'artwork_completed':
      case 'customer_review_requested':
        return 'outline';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const titleStatus = statusFilter === 'all' ? 'All' : statusFilter.replace(/_/g, ' ');

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl text-accent capitalize">
                  {titleStatus} Orders
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  View and manage customer orders assigned to you.
                </CardDescription>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground self-start sm:self-center">
              <Link href="/goldsmith-portal/dashboard">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-border/30 pb-4">
            <h4 className="text-sm font-medium text-muted-foreground mr-2">Filter by status:</h4>
            <Button asChild variant={statusFilter === 'pending_goldsmith_review' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs">
              <Link href={`/goldsmith-portal/orders?goldsmithId=${goldsmithId}&status=pending_goldsmith_review`}>New for Review</Link>
            </Button>
            <Button asChild variant={statusFilter === 'in_progress' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs">
              <Link href={`/goldsmith-portal/orders?goldsmithId=${goldsmithId}&status=in_progress`}>In Progress</Link>
            </Button>
            <Button asChild variant={statusFilter === 'completed' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs">
              <Link href={`/goldsmith-portal/orders?goldsmithId=${goldsmithId}&status=completed`}>Completed</Link>
            </Button>
            <Button asChild variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs">
              <Link href={`/goldsmith-portal/orders?goldsmithId=${goldsmithId}&status=all`}>All Orders</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No {titleStatus.toLowerCase()} orders to display at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="bg-card/70 border-border/50 shadow-md rounded-lg">
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg text-accent font-heading">{order.itemDescription}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground pt-0.5">
                                For: {order.customerName} | Requested: {format(new Date(order.requestedAt), 'PPp')}
                            </CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs">
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                  </CardHeader>
                   <CardContent className="px-4 py-2 text-sm text-muted-foreground">
                    <p className="line-clamp-2">{order.details}</p>
                   </CardContent>
                  <CardFooter className="flex justify-end gap-2 px-4 pb-4 pt-2">
                    <Button asChild variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-primary-foreground">
                        <Link href={`/goldsmith-portal/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Details
                        </Link>
                    </Button>
                    {order.status === 'pending_goldsmith_review' && (
                        <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                            disabled={isUpdatingStatus[order.id]}
                        >
                            {isUpdatingStatus[order.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Accept Order
                        </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoldsmithOrdersPage() {
  return (
    <React.Suspense fallback={<LoadingSkeleton />}>
      <GoldsmithOrdersContent />
    </React.Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-card/70 border-border/50 shadow-md rounded-lg">
              <CardHeader className="pb-2 pt-4 px-4">
                <Skeleton className="h-6 w-3/5 mb-1" />
                <Skeleton className="h-3 w-4/5" />
              </CardHeader>
              <CardContent className="flex justify-between items-center px-4 pb-4 pt-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
