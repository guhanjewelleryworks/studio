
// src/app/admin/orders/[orderId]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrderStatusProgress } from '@/components/orders/OrderStatusProgress';
import { fetchOrderRequestById } from '@/actions/customer-actions'; // Reusing from customer actions
import { fetchGoldsmithById, updateOrderStatus } from '@/actions/goldsmith-actions';
import type { OrderRequest, Goldsmith, OrderRequestStatus } from '@/types/goldsmith';
import { Loader2, ArrowLeft, Mail, Phone, ShoppingBag, User, CalendarDays, Edit3, Image as ImageIcon, ShieldCheck, Send, PackageCheck, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { safeFormatDate } from '@/lib/date';
import { Separator } from '@/components/ui/separator';
import NextImage from 'next/image';
import { Label } from '@/components/ui/label'; 
import { Badge } from '@/components/ui/badge'; // Added missing import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PageParams {
  orderId: string;
}

const AdminAuthLoader = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
    <p className="ml-3 text-muted-foreground">Verifying admin access and loading order...</p>
  </div>
);

export default function AdminOrderDetailPage({ params: paramsPromise }: { params: Promise<PageParams> }) {
  const params = use(paramsPromise); 
  const { orderId } = params;
  
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [goldsmith, setGoldsmith] = useState<Goldsmith | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const loginTimestamp = localStorage.getItem('adminLoginTimestamp');
    const now = new Date().getTime();
    const threeHours = 3 * 60 * 60 * 1000;

    if (adminLoggedIn !== 'true' || !loginTimestamp || (now - parseInt(loginTimestamp)) > threeHours) {
        if (loginTimestamp && (now - parseInt(loginTimestamp)) > threeHours) {
            toast({ title: "Session Expired", description: "Your admin session has expired. Please log in again.", variant: "destructive" });
        }
      router.replace(`/admin/login?redirect=/admin/orders/${orderId}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, orderId, toast]);

  useEffect(() => {
    if (!orderId || isCheckingAuth) return; 

    const loadOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await fetchOrderRequestById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          if (fetchedOrder.goldsmithId) {
            const fetchedGoldsmith = await fetchGoldsmithById(fetchedOrder.goldsmithId);
            setGoldsmith(fetchedGoldsmith);
          }
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to load order details for admin:", err);
        setError("Could not load order details. Please try again.");
        toast({ title: "Error", description: "Failed to fetch order details.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, isCheckingAuth, toast]);

  const handleStatusChange = async (newStatus: OrderRequestStatus) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    const result = await updateOrderStatus(order.id, newStatus);
    if (result.success && result.data) {
      setOrder(result.data); // Update local order state
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus.replace(/_/g, ' ')}.`,
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Could not update order status.",
        variant: "destructive",
      });
    }
    setIsUpdatingStatus(false);
  };

  const availableStatuses: OrderRequestStatus[] = [
    'new', 'pending_goldsmith_review', 'in_progress', 'artwork_completed', 
    'customer_review_requested', 'shipped', 'completed', 'cancelled'
  ];


  if (isCheckingAuth || (isLoading && !order)) {
    return <AdminAuthLoader />;
  }

  if (error) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4">
          <Link href="/admin/orders">Back to All Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <p className="text-muted-foreground text-lg">Order details could not be loaded or not found.</p>
         <Button asChild variant="link" className="mt-4">
          <Link href="/admin/orders">Back to All Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Admin - Order Details</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to All Orders
          </Link>
        </Button>
      </header>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Order Info & Status Update */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-accent font-heading">{order.itemDescription}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Order ID: {order.id} | Placed on: {safeFormatDate(order.requestedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Order Progress</h3>
                <OrderStatusProgress currentStatus={order.status} />
              </div>
              <Separator />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">Customer:</h3>
                    <p className="text-sm text-foreground/80">{order.customerName} ({order.customerEmail})</p>
                    {order.customerPhone && <p className="text-sm text-foreground/80">Phone: {order.customerPhone}</p>}
                </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Customer Request Details:</h3>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{order.details || "No specific details provided."}</p>
              </div>
              {order.referenceImage && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Reference Image:</h3>
                  <div className="relative w-full max-w-xs h-auto aspect-square rounded-md overflow-hidden border border-border shadow-sm">
                    <NextImage 
                        src={order.referenceImage} 
                        alt="Order reference image" 
                        fill
                        sizes="(max-width: 640px) 100vw, 320px" 
                        className="object-contain"
                        data-ai-hint="jewelry design custom"
                    />
                  </div>
                </div>
              )}
            </CardContent>
             <CardFooter className="pt-4 flex-col items-start gap-3">
               <p className="text-xs text-muted-foreground">Last Updated: {safeFormatDate(order.updatedAt)}</p>
                <div>
                    <Label htmlFor="order-status" className="text-sm font-semibold text-foreground mb-1.5 block">Update Order Status:</Label>
                    <div className="flex items-center gap-2">
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(value as OrderRequestStatus)} disabled={isUpdatingStatus}>
                            <SelectTrigger id="order-status" className="w-[220px] text-sm text-foreground">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStatuses.map(statusVal => (
                                    <SelectItem key={statusVal} value={statusVal} className="capitalize text-sm">
                                        {statusVal.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => handleStatusChange(order.status)} disabled={isUpdatingStatus || !order} size="sm"> 
                            {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4"/>}
                            <span className="ml-1.5">{isUpdatingStatus ? 'Saving...' : 'Save Status'}</span>
                        </Button>
                    </div>
                </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Goldsmith Info */}
        <div className="md:col-span-1 space-y-6">
          {goldsmith ? (
            <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
              <CardHeader className="items-center text-center p-5">
                <Avatar className="w-20 h-20 mb-3 border-2 border-primary/30 shadow-md">
                  <AvatarImage src={goldsmith.profileImageUrl || `https://placehold.co/120x120.png`} alt={goldsmith.name} data-ai-hint="artisan photo"/>
                  <AvatarFallback>{goldsmith.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg text-accent font-heading">{goldsmith.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{goldsmith.tagline || "Fine Jewelry Artisan"}</CardDescription>
                 <Badge variant="secondary" className="mt-1.5 text-xs">{goldsmith.status.replace('_', ' ')}</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-xs p-5 pt-0">
                 <p className="flex items-center text-foreground/80"><User className="h-3.5 w-3.5 mr-2 text-primary/70" />{goldsmith.contactPerson || "Goldsmith"}</p>
                <p className="flex items-center text-foreground/80"><Mail className="h-3.5 w-3.5 mr-2 text-primary/70" />{goldsmith.email}</p> 
                <p className="flex items-center text-foreground/80"><Phone className="h-3.5 w-3.5 mr-2 text-primary/70" />{goldsmith.phone || "Not available"}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" size="sm" className="w-full text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                  <Link href={`/goldsmith/${goldsmith.id}`} target="_blank">View Full Goldsmith Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
             <Card className="shadow-xl bg-card border-primary/10 rounded-xl p-5">
                <CardTitle className="text-md text-accent font-heading mb-2">No Goldsmith Assigned</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">This order has not been assigned to a specific goldsmith yet or the goldsmith ID is invalid.</CardDescription>
            </Card>
          )}
           <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-accent font-heading flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/>Admin Actions Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                (Placeholder for a log of admin actions related to this order, e.g., status changes, notes added, communication sent.)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    
