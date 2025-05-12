// src/app/goldsmith-portal/orders/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

function GoldsmithOrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'all';

  // Mock data for orders based on status
  const mockOrders = [
    { id: 'ORD12345', customerName: 'Alice Wonderland', item: 'Custom Gold Necklace', date: '2024-07-28', status: 'new', amount: '$1200' },
    { id: 'ORD12346', customerName: 'Bob The Builder', item: 'Engraved Silver Bracelet', date: '2024-07-25', status: 'active', amount: '$450' },
    { id: 'ORD12347', customerName: 'Charlie Brown', item: 'Diamond Engagement Ring', date: '2024-07-22', status: 'completed', amount: '$3500' },
    { id: 'ORD12348', customerName: 'Diana Prince', item: 'Platinum Earrings', date: '2024-07-29', status: 'new', amount: '$750' },
    { id: 'ORD12349', customerName: 'Edward Scissorhands', item: 'Restoration of Antique Brooch', date: '2024-07-15', status: 'active', amount: '$300' },
  ];

  const filteredOrders = status === 'all' ? mockOrders : mockOrders.filter(order => order.status === status);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl text-accent">
              Order Management ({status.charAt(0).toUpperCase() + status.slice(1)})
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            View and manage customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="bg-card/70 border-border/50 shadow-md rounded-lg">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-lg text-accent font-heading">{order.item} - {order.id}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground pt-0.5">For: {order.customerName} | Date: {order.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center px-4 pb-4 pt-1">
                    <p className="text-sm text-foreground">Amount: <span className="font-semibold">{order.amount}</span></p>
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      order.status === 'new' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      order.status === 'active' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                      'bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-foreground text-center py-4">
              No {status} orders to display at this time.
            </p>
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
