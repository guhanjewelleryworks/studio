// src/app/admin/orders/page.tsx
// Server wrapper: force dynamic and fetch fresh orders/goldsmiths on every request
export const dynamic = 'force-dynamic';

import React from 'react';
import AdminOrdersClient from './AdminOrdersClient';
import { fetchAllPlatformOrderRequests, fetchAdminGoldsmiths } from '@/actions/goldsmith-actions';

// normalize helper
function normalizeOrders(orderData: any[]) {
  return (orderData || []).map(o => ({
    ...o,
    id: o.id ?? (o._id ? String(o._id) : undefined)
  }));
}

export default async function AdminOrdersServerWrapper() {
  try {
    // run server actions here (server-side) so results are fresh
    const [orderData, goldsmithData] = await Promise.all([
      fetchAllPlatformOrderRequests(),
      fetchAdminGoldsmiths()
    ]);

    const normalizedOrders = normalizeOrders(orderData);

    // pass the initial data into the client component as props
    return (
      <AdminOrdersClient
        initialOrders={normalizedOrders}
        initialGoldsmiths={goldsmithData || []}
      />
    );
  } catch (err) {
    // fail safe: render client with empty arrays but log server-side
    console.error('Server wrapper fetch failed for /admin/orders', err);
    return <AdminOrdersClient initialOrders={[]} initialGoldsmiths={[]} />;
  }
}
