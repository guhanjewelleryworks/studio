// src/app/admin/audit-logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { fetchAuditLogs } from '@/actions/audit-log-actions';
import type { AuditLog } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogs();
      setLogs(data || []);
      setFilteredLogs(data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Could not load audit log data. Please try again.");
      toast({
        title: "Error Loading Logs",
        description: "Failed to fetch audit log data from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = logs.filter(log =>
      (log.action.toLowerCase() || '').includes(lowercasedFilter) ||
      (log.actor.id.toLowerCase() || '').includes(lowercasedFilter)
    );
    setFilteredLogs(filteredData);
  }, [searchTerm, logs]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Audit Logs</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadLogs} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
                Refresh
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
          <CardTitle className="text-xl text-accent font-heading">System Activity Records</CardTitle>
          <CardDescription className="text-muted-foreground">
            A chronological record of significant platform activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4 flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by action or actor ID..."
                    className="w-full pl-10 text-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                    <Filter className="mr-2 h-4 w-4" /> Filters (Simulated)
                </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading logs...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Loading Data</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : filteredLogs.length > 0 ? (
              <div className="space-y-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Timestamp</TableHead>
                      <TableHead className="text-foreground">Actor</TableHead>
                      <TableHead className="text-foreground">Action</TableHead>
                      <TableHead className="text-foreground">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-foreground font-mono">{log.actor.type}:{log.actor.id}</TableCell>
                        <TableCell className="text-xs text-foreground">{log.action}</TableCell>
                        <TableCell className="whitespace-pre-wrap text-xs text-muted-foreground font-mono max-w-xs break-words">
                            {log.details ? JSON.stringify(log.details, null, 2) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
                <div className="text-center py-10">
                    <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{searchTerm ? 'No logs match your search.' : 'No audit logs found.'}</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
