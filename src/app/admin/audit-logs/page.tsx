// src/app/admin/audit-logs/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

// Mock audit log data
const mockAuditLogs = [
  { id: 'log001', timestamp: '2024-08-01 10:15:30', user: 'admin_user', action: 'Updated platform settings: Maintenance Mode ON', ipAddress: '192.168.1.10' },
  { id: 'log002', timestamp: '2024-08-01 09:45:12', user: 'admin_user', action: 'Approved goldsmith registration: Aura & Gold', ipAddress: '192.168.1.10' },
  { id: 'log003', timestamp: '2024-07-31 17:22:05', user: 'system_process', action: 'Database backup completed successfully', ipAddress: 'N/A' },
  { id: 'log004', timestamp: '2024-07-31 15:03:50', user: 'jane.doe@example.com', action: 'Customer password reset initiated', ipAddress: '203.0.113.45' },
];


export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Audit Logs</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <Card className="shadow-lg bg-card border-primary/10 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-accent font-heading">System Activity Records</CardTitle>
          <CardDescription className="text-muted-foreground">
            This is a placeholder page for viewing audit logs. In a real application, it would show a chronological record of significant system activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4 flex items-center gap-2">
                <Input type="search" placeholder="Search logs (e.g., user, action, IP)..." className="flex-grow text-foreground" />
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>

          {mockAuditLogs.length > 0 ? (
            <div className="space-y-3 overflow-x-auto">
              <table className="min-w-full divide-y divide-border/30">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-foreground uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-foreground uppercase tracking-wider">User/Process</th>
                    <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-foreground uppercase tracking-wider">Action</th>
                    <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium text-foreground uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border/20">
                  {mockAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">{log.timestamp}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-foreground">{log.user}</td>
                      <td className="px-3 py-3 text-xs text-foreground">{log.action}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No audit logs available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
