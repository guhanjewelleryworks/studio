
// src/app/customer/orders/[orderId]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrderStatusProgress } from '@/components/orders/OrderStatusProgress';
import { fetchOrderRequestById } from '@/actions/customer-actions';
import { fetchGoldsmithById } from '@/actions/goldsmith-actions';
import type { OrderRequest, Goldsmith } from '@/types/goldsmith';
import { Loader2, ArrowLeft, Mail, Phone, ShoppingBag, User, CalendarDays, Edit3, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { safeFormatDate } from '@/lib/date';
import { Separator } from '@/components/ui/separator';
import NextImage from 'next/image';

interface PageParams {
  orderId: string;
}

export default function CustomerOrderDetailPage({ params: paramsPromise }: { params: Promise<PageParams> }) {
  const params = use(paramsPromise);
  const { orderId } = params;
  
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [goldsmith, setGoldsmith] = useState<Goldsmith | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?redirect=/customer/orders/${orderId}`);
    }

    if (status === 'authenticated' && session?.user?.id && orderId) {
      const loadOrderDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedOrder = await fetchOrderRequestById(orderId);
          if (fetchedOrder) {
            // Ensure the order belongs to the current customer
            if (session?.user?.id && fetchedOrder.customerId !== session.user.id) {
               setError("You are not authorized to view this order.");
               setOrder(null);
               setGoldsmith(null);
               return;
            }
            setOrder(fetchedOrder);
            if (fetchedOrder.goldsmithId) {
              const fetchedGoldsmith = await fetchGoldsmithById(fetchedOrder.goldsmithId);
              setGoldsmith(fetchedGoldsmith);
            }
          } else {
            setError("Order not found.");
          }
        } catch (err) {
          console.error("Failed to load order details:", err);
          setError("Could not load order details. Please try again.");
          toast({ title: "Error", description: "Failed to fetch order details.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };

      loadOrderDetails();
    }
  }, [orderId, session, status, router, toast]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6 text-center">
        <p className="text-destructive text-lg">{error}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/customer/orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6 text-center">
        <p className="text-muted-foreground text-lg">Order details could not be loaded.</p>
         <Button asChild variant="link" className="mt-4">
          <Link href="/customer/orders">Back to My Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-8">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Order Details</h1>
          </div>
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
            <Link href="/customer/orders">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to My Orders
            </Link>
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Order Info */}
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
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Your Request Details:</h3>
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
              <CardFooter className="pt-4">
                 <p className="text-xs text-muted-foreground">Last Updated: {safeFormatDate(order.updatedAt)}</p>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Goldsmith Info & Actions */}
          <div className="md:col-span-1 space-y-6">
            {goldsmith && (
              <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
                <CardHeader className="items-center text-center p-5">
                  <Avatar className="w-20 h-20 mb-3 border-2 border-primary/30 shadow-md">
                    <AvatarImage src={goldsmith.profileImageUrl || `https://placehold.co/120x120.png`} alt={goldsmith.name} data-ai-hint="artisan photo" />
                    <AvatarFallback>{goldsmith.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg text-accent font-heading">{goldsmith.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{goldsmith.tagline || "Fine Jewelry Artisan"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs p-5 pt-0">
                   <p className="flex items-center text-foreground/80"><User className="h-3.5 w-3.5 mr-2 text-primary/70" />{goldsmith.contactPerson || "Goldsmith"}</p>
                  {/* Display brokered/admin contact info if direct contact isn't allowed yet */}
                  <p className="flex items-center text-foreground/80"><Mail className="h-3.5 w-3.5 mr-2 text-primary/70" />Contact via Platform Admin</p> 
                  {/* <p className="flex items-center text-foreground/80"><Phone className="h-3.5 w-3.5 mr-2 text-primary/70" />{goldsmith.phone || "Not available"}</p> */}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                    <Link href={`/goldsmith/${goldsmith.id}`}>View Goldsmith Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
            <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-accent font-heading">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">If you have questions about this order, please contact support.</p>
                <Button asChild variant="default" size="sm" className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">
                    <Mail className="mr-2 h-3.5 w-3.5" /> Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

    