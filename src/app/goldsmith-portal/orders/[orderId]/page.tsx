
// src/app/goldsmith-portal/orders/[orderId]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { OrderStatusProgress } from '@/components/orders/OrderStatusProgress';
import { fetchOrderRequestById } from '@/actions/customer-actions'; // Reusing from customer actions
import { updateOrderStatus } from '@/actions/goldsmith-actions';
import type { OrderRequest, OrderRequestStatus } from '@/types/goldsmith';
import { Loader2, ArrowLeft, Mail, Phone, ShoppingBag, User, CalendarDays, Edit3, Image as ImageIcon, ShieldCheck, Send, PackageCheck, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { safeFormatDate } from '@/lib/date';
import { Separator } from '@/components/ui/separator';
import NextImage from 'next/image';
import { Label } from '@/components/ui/label';
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

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
  loginTimestamp: number;
}

const GoldsmithAuthLoader = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
    <p className="ml-3 text-muted-foreground">Verifying access and loading order...</p>
  </div>
);

export default function GoldsmithOrderDetailPage({ params: paramsPromise }: { params: Promise<PageParams> }) {
  const params = use(paramsPromise); 
  const { orderId } = params;
  
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentGoldsmithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


  useEffect(() => {
    const user = localStorage.getItem('currentGoldsmithUser');
    if (user) {
        const parsedUser: CurrentGoldsmithUser = JSON.parse(user);
        const oneHour = 60 * 60 * 1000;
        const sessionExpired = new Date().getTime() - parsedUser.loginTimestamp > oneHour;
        if (parsedUser.isLoggedIn && parsedUser.id && !sessionExpired) {
            setCurrentUser(parsedUser);
        } else {
            router.replace(`/goldsmith-portal/login?redirect=/goldsmith-portal/orders/${orderId}`);
        }
    } else {
        router.replace(`/goldsmith-portal/login?redirect=/goldsmith-portal/orders/${orderId}`);
    }
  }, [router, orderId]);

  useEffect(() => {
    if (!orderId || !currentUser?.id) return; 

    const loadOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await fetchOrderRequestById(orderId);
        if (fetchedOrder) {
          // Security Check: Ensure the order belongs to the logged-in goldsmith
          if (fetchedOrder.goldsmithId !== currentUser.id) {
            setError("You are not authorized to view this order.");
            setOrder(null);
            return;
          }
          setOrder(fetchedOrder);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to load order details for goldsmith:", err);
        setError("Could not load order details. Please try again.");
        toast({ title: "Error", description: "Failed to fetch order details.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, currentUser, toast]);

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
  
  // Goldsmiths should have a focused set of statuses they can set
  const availableStatuses: OrderRequestStatus[] = [
    'in_progress', 'artwork_completed', 
    'customer_review_requested', 'shipped', 'completed', 'cancelled'
  ];


  if (!currentUser || (isLoading && !order)) {
    return <GoldsmithAuthLoader />;
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
          <Link href="/goldsmith-portal/orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <p className="text-muted-foreground text-lg">Order details could not be loaded or not found.</p>
         <Button asChild variant="link" className="mt-4">
          <Link href="/goldsmith-portal/orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Order Details</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href={`/goldsmith-portal/orders?goldsmithId=${currentUser.id}`}>
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
                    <p className="text-sm text-foreground/80">{order.customerName}</p>
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

        {/* Right Column: Helper Info */}
        <div className="md:col-span-1 space-y-6">
           <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-accent font-heading flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/>Admin Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                If you have any issues with this order or need to communicate with the customer, please contact the platform administrator. All communication is mediated to ensure a secure process.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full mt-3 text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                  <Link href="/contact?subject=OrderHelp">Contact Admin</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    