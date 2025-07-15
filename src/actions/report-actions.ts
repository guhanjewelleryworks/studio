// src/actions/report-actions.ts
'use server';

import { fetchAdminCustomers } from './customer-actions';
import { fetchAdminGoldsmiths, fetchAllPlatformOrderRequests } from './goldsmith-actions';
import { logAuditEvent } from './audit-log-actions';
import { startOfMonth, isWithinInterval } from 'date-fns';
import type { OrderRequest } from '@/types/goldsmith';

export type ReportData = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: { label: string, value: string | number }[];
}

export type ReportDateRange = {
    from: Date;
    to: Date;
}

// Assume a fixed commission rate for payout calculations. This could be moved to settings later.
const PLATFORM_COMMISSION_RATE = 0.15; // 15%

// Helper function to generate a random price for an order for simulation
const getSimulatedOrderPrice = (orderId: string): number => {
  // Use a simple hash of the order ID to get a deterministic "random" price
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5000 + (hash % 25000); // Generates a price between 5,000 and 30,000
};


export async function generateReport(
    reportType: string,
    dateRange?: ReportDateRange
): Promise<{ success: boolean; data?: ReportData; error?: string }> {
  
  // Log the report generation event
  logAuditEvent(
    `Generated report: ${reportType}`,
    { type: 'admin', id: 'admin_user' }, // Placeholder admin ID
    { dateRange: dateRange ? `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}` : 'All Time' }
  );

  try {
    const orders = await fetchAllPlatformOrderRequests();
    
    // Filter orders based on date range if provided
    const filteredOrders = dateRange
      ? orders.filter(o => isWithinInterval(new Date(o.requestedAt), { start: dateRange.from, end: dateRange.to }))
      : orders;

    switch (reportType) {
      case 'user_activity': {
        let customers = await fetchAdminCustomers();
        
        // Filter customers based on date range if provided
        const filteredCustomers = dateRange
          ? customers.filter(c => c.registeredAt && isWithinInterval(new Date(c.registeredAt), { start: dateRange.from, end: dateRange.to }))
          : customers;
          
        return {
          success: true,
          data: {
            title: 'User Activity Report',
            headers: ["Metric", "Value"],
            rows: [
              ["Total Registered Customers (in range)", filteredCustomers.length],
            ],
          },
        };
      }

      case 'goldsmith_performance': {
        const goldsmiths = await fetchAdminGoldsmiths();
        
        const reportRows = goldsmiths.map(g => {
          const goldsmithOrders = filteredOrders.filter(o => o.goldsmithId === g.id);
          const completedOrders = goldsmithOrders.filter(o => o.status === 'completed').length;
          return [
            g.name,
            g.status,
            goldsmithOrders.length,
            completedOrders,
            `${goldsmithOrders.length > 0 ? ((completedOrders / goldsmithOrders.length) * 100).toFixed(1) : '0.0'}%`
          ];
        });

        return {
          success: true,
          data: {
            title: 'Goldsmith Performance Report',
            headers: ["Goldsmith Name", "Status", "Total Orders Assigned (in range)", "Completed Orders (in range)", "Completion Rate (in range)"],
            rows: reportRows,
          }
        };
      }
      
      case 'sales_summary': {
        const totalOrders = filteredOrders.length;
        const completed = filteredOrders.filter(o => o.status === 'completed').length;
        const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length;
        const inProgress = filteredOrders.filter(o => ['in_progress', 'artwork_completed', 'customer_review_requested', 'shipped'].includes(o.status)).length;
        const pending = filteredOrders.filter(o => ['new', 'pending_goldsmith_review'].includes(o.status)).length;
        
        return {
          success: true,
          data: {
            title: 'Sales Summary Report',
            headers: ["Metric", "Value"],
            rows: [
              ["Total Order Requests (in range)", totalOrders],
              ["Orders Completed (in range)", completed],
              ["Orders Cancelled (in range)", cancelled],
              ["Orders In Progress (in range)", inProgress],
              ["Orders Pending Review (in range)", pending],
            ],
          }
        };
      }
      
      case 'goldsmith_payout': {
        const goldsmiths = await fetchAdminGoldsmiths();

        const completedOrdersInRange = filteredOrders.filter(o => o.status === 'completed');

        const payoutRows = goldsmiths.map(g => {
            const completedGoldsmithOrders = completedOrdersInRange.filter(o => o.goldsmithId === g.id);
            const totalRevenue = completedGoldsmithOrders.reduce((sum, order) => sum + getSimulatedOrderPrice(order.id), 0);
            const commission = totalRevenue * PLATFORM_COMMISSION_RATE;
            const payout = totalRevenue - commission;

            return [
                g.name,
                completedGoldsmithOrders.length,
                `₹${totalRevenue.toFixed(2)}`,
                `₹${commission.toFixed(2)}`,
                `₹${payout.toFixed(2)}`,
            ];
        });
        
         const totalRevenueAll = completedOrdersInRange.reduce((sum, order) => sum + getSimulatedOrderPrice(order.id), 0);
         const totalCommission = totalRevenueAll * PLATFORM_COMMISSION_RATE;
         const totalPayout = totalRevenueAll - totalCommission;

        return {
          success: true,
          data: {
            title: 'Goldsmith Payout Report (Simulated)',
            headers: ["Goldsmith Name", "Completed Orders", "Total Revenue", `Commission (${(PLATFORM_COMMISSION_RATE * 100)}%)`, "Net Payout"],
            rows: payoutRows,
            summary: [
                { label: 'Total Revenue (All Goldsmiths)', value: `₹${totalRevenueAll.toFixed(2)}` },
                { label: 'Total Commission (Platform)', value: `₹${totalCommission.toFixed(2)}` },
                { label: 'Total Payout (All Goldsmiths)', value: `₹${totalPayout.toFixed(2)}` },
            ]
          }
        };
      }
      
       case 'platform_traffic': {
         return { success: false, error: 'Platform Traffic Analysis is not yet implemented.' };
      }


      default:
        return { success: false, error: 'Please select a valid report type.' };
    }
  } catch (error) {
    console.error(`Error generating report '${reportType}':`, error);
    return { success: false, error: 'An unexpected error occurred while generating the report.' };
  }
}
