// src/app/goldsmith-portal/orders/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function GoldsmithOrdersPage() {
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
      <Card className="max-w-4xl mx-auto shadow-xl bg-card border-primary/10">
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
                <Card key={order.id} className="bg-card/70 border-border/50 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-accent">{order.item} - {order.id}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">For: {order.customerName} | Date: {order.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-sm text-foreground">Amount: <span className="font-semibold">{order.amount}</span></p>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'active' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
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
