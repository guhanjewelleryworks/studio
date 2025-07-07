// src/actions/report-actions.ts
'use server';

import { fetchAdminCustomers } from './customer-actions';
import { fetchAdminGoldsmiths, fetchAllPlatformOrderRequests } from './goldsmith-actions';
import { logAuditEvent } from './audit-log-actions';
import { startOfMonth } from 'date-fns';

export type ReportData = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: { label: string, value: string | number }[];
}

export async function generateReport(reportType: string): Promise<{ success: boolean; data?: ReportData; error?: string }> {
  
  // Log the report generation event
  logAuditEvent(
    `Generated report: ${reportType}`,
    { type: 'admin', id: 'admin_user' } // Placeholder admin ID
  );

  try {
    switch (reportType) {
      case 'user_activity': {
        const customers = await fetchAdminCustomers();
        const now = new Date();
        const startOfThisMonth = startOfMonth(now);
        
        const newCustomersThisMonth = customers.filter(c => 
            c.registeredAt && new Date(c.registeredAt) >= startOfThisMonth
        ).length;

        return {
          success: true,
          data: {
            title: 'User Activity Report',
            headers: ["Metric", "Value"],
            rows: [
              ["Total Registered Customers", customers.length],
              [`New Customers This Month (${now.toLocaleString('default', { month: 'long' })})`, newCustomersThisMonth],
            ],
          },
        };
      }

      case 'goldsmith_performance': {
        const [goldsmiths, orders] = await Promise.all([
          fetchAdminGoldsmiths(),
          fetchAllPlatformOrderRequests()
        ]);
        
        const reportRows = goldsmiths.map(g => {
          const goldsmithOrders = orders.filter(o => o.goldsmithId === g.id);
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
            headers: ["Goldsmith Name", "Status", "Total Orders Assigned", "Completed Orders", "Completion Rate"],
            rows: reportRows,
          }
        };
      }
      
      case 'sales_summary': {
        const orders = await fetchAllPlatformOrderRequests();
        const totalOrders = orders.length;
        const completed = orders.filter(o => o.status === 'completed').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const inProgress = orders.filter(o => ['in_progress', 'artwork_completed', 'customer_review_requested', 'shipped'].includes(o.status)).length;
        const pending = orders.filter(o => ['new', 'pending_goldsmith_review'].includes(o.status)).length;
        
        return {
          success: true,
          data: {
            title: 'Sales Summary Report',
            headers: ["Metric", "Value"],
            rows: [
              ["Total Order Requests", totalOrders],
              ["Orders Completed", completed],
              ["Orders Cancelled", cancelled],
              ["Orders In Progress", inProgress],
              ["Orders Pending Review", pending],
            ],
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
