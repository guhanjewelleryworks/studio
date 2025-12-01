// src/app/admin/orders/AdminOrdersClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Send, Eye, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { fetchAllPlatformOrderRequests, updateOrderStatus, fetchAdminGoldsmiths } from '@/actions/goldsmith-actions';
import type { OrderRequest, OrderRequestStatus, Goldsmith } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useAdminAccess } from '@/hooks/useAdminAccess';

type Props = {
  initialOrders?: any[];
  initialGoldsmiths?: any[];
};

export default function AdminOrdersClient({ initialOrders = [], initialGoldsmiths = [] }: Props) {
  const { hasPermission, isAccessLoading } = useAdminAccess('canManageOrders');
  
  // Initialize state from server-provided props
  const [orders, setOrders] = useState<OrderRequest[]>(() => initialOrders as OrderRequest[]);
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>(() => initialGoldsmiths as Goldsmith[]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<OrderRequest[]>(() => initialOrders as OrderRequest[]);
  const [isLoading, setIsLoading] = useState(false); // Only for manual refresh
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const getGoldsmithName = useCallback((goldsmithId: string) => {
    if (!goldsmithId) return 'Unassigned';
    // Defensive lookup
    const goldsmith = goldsmiths.find(g => g.id === goldsmithId || String((g as any)._id) === goldsmithId);
    return goldsmith ? goldsmith.name : 'N/A';
  }, [goldsmiths]);
  
  // Manual refresh logic
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orderData, goldsmithData] = await Promise.all([
        fetchAllPlatformOrderRequests(),
        fetchAdminGoldsmiths()
      ]);
      
      const normalizedOrders = (orderData || []).map((o: any) => ({
        ...o,
        id: o.id ?? (o._id ? String(o._id) : undefined)
      }));

      setOrders(normalizedOrders);
      setGoldsmiths(goldsmithData || []);
    } catch (err) {
      console.error("Failed to refresh orders or goldsmiths:", err);
      setError("Could not refresh data. Please try again.");
      toast({
        title: "Error Refreshing Data",
        description: "Failed to fetch fresh data from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // This effect now only handles client-side filtering
    try {
      if (!searchTerm) {
        setFilteredOrders(orders);
        return;
      }
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = orders.filter(order => {
          const goldsmithName = getGoldsmithName(order.goldsmithId).toLowerCase();
          return (
              (order.id?.toLowerCase() || '').includes(lowercasedFilter) ||
              (order.customerName?.toLowerCase() || '').includes(lowercasedFilter) ||
              goldsmithName.includes(lowercasedFilter) ||
              (order.itemDescription?.toLowerCase() || '').includes(lowercasedFilter)
          );
      });
      setFilteredOrders(filteredData);
    } catch (filterError) {
        console.error("Error during filtering:", filterError);
        setError("An error occurred while filtering orders.");
        setFilteredOrders(orders); // Fallback to showing all orders
    }
  }, [searchTerm, orders, goldsmiths, getGoldsmithName]);


  const handleUpdateStatus = async (orderId: string, newStatus: OrderRequestStatus) => {
    setIsUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success && result.data) {
      toast({
        title: "Order Status Updated",
        description: `Order ${orderId.substring(0,8)}... status changed to ${newStatus.replace(/_/g, ' ')}.`,
      });
      // Refresh data to get the latest state
      await loadData();
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Could not update order status.",
        variant: "destructive",
      });
    }
    setIsUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
  };

  const getStatusBadgeVariant = (status: OrderRequestStatus) => {
    switch (status) {
      case 'new': return 'default'; 
      case 'pending_goldsmith_review': return 'secondary';
      case 'in_progress': return 'outline'; 
      case 'artwork_completed': return 'outline'; 
      case 'customer_review_requested': return 'secondary';
      case 'shipped': return 'default'; 
      case 'completed': return 'default'; 
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (isAccessLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="container py-8 text-center">
        <Card className="max-w-md mx-auto shadow-lg bg-card border-destructive/20">
          <CardHeader>
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have the required permissions to manage orders.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Order Management</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadData} variant="outline" size="sm" disabled={isLoading || Object.values(isUpdatingStatus).some(s => s)} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
                Refresh Orders
            </Button>
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
        </div>
      </header>

      <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-accent font-heading">All Customer Order Requests</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all order requests placed on the platform. Total orders: {orders.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, customer, goldsmith, item..."
                className="w-full pl-10 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading && orders.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading orders...</p>
            </div>
          ) : error ? (
             <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>
                  {error} Please try refreshing the page or check server logs.
                </AlertDescription>
            </Alert>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Order ID</TableHead>
                    <TableHead className="text-foreground">Customer</TableHead>
                    <TableHead className="text-foreground">Goldsmith</TableHead>
                    <TableHead className="text-foreground">Item</TableHead>
                    <TableHead className="text-foreground">Requested At</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{order.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium text-foreground">{order.customerName}</TableCell>
                      <TableCell className="text-foreground text-xs">{getGoldsmithName(order.goldsmithId)}</TableCell>
                      <TableCell className="text-foreground text-xs max-w-[200px] truncate" title={order.itemDescription}>{order.itemDescription}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {order.requestedAt ? format(new Date(order.requestedAt), 'PPpp') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs">
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1 pr-2">
                        <Button asChild variant="ghost" size="xs" className="text-primary hover:text-primary/80 text-xs h-7 px-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Link>
                        </Button>
                        {order.status === 'new' && (
                          <Button
                            variant="outline"
                            size="xs"
                            className="text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700 text-xs h-7 px-2"
                            onClick={() => handleUpdateStatus(order.id, 'pending_goldsmith_review')}
                            disabled={isUpdatingStatus[order.id]}
                          >
                            {isUpdatingStatus[order.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <Send className="mr-1 h-3 w-3" />}
                            Mark for Goldsmith Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{searchTerm ? 'No orders match your search.' : 'No order requests found.'}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{searchTerm ? 'Try adjusting your search terms.' : 'New order requests from customers will appear here.'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
