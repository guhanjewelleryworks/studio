// src/app/admin/communications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Search } from 'lucide-react';
import Link from 'next/link';
import { fetchAllPlatformInquiries } from '@/actions/goldsmith-actions';
import type { Inquiry, InquiryStatus } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export default function AdminCommunicationsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllPlatformInquiries();
      setInquiries(data || []);
      setFilteredInquiries(data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      setError("Could not load inquiry data. Please try again.");
      toast({
        title: "Error Loading Inquiries",
        description: "Failed to fetch inquiry data from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = inquiries.filter(inquiry =>
      (inquiry.id?.toLowerCase() || '').includes(lowercasedFilter) ||
      (inquiry.customerName?.toLowerCase() || '').includes(lowercasedFilter) ||
      (inquiry.goldsmithId?.toLowerCase() || '').includes(lowercasedFilter) ||
      (inquiry.message?.toLowerCase() || '').includes(lowercasedFilter)
    );
    setFilteredInquiries(filteredData);
  }, [searchTerm, inquiries]);

  const getStatusBadgeVariant = (status: InquiryStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'admin_review': return 'secondary';
      case 'forwarded_to_goldsmith': return 'outline';
      case 'goldsmith_replied': return 'default'; 
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Customer Inquiries</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadInquiries} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
                Refresh Inquiries
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
          <CardTitle className="text-xl text-accent font-heading">All Customer Inquiries</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all inquiries and introduction requests. Total inquiries: {inquiries.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, customer, goldsmith, or message..."
                className="w-full pl-10 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading inquiries...</p>
            </div>
          ) : error ? (
             <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>
                  {error} Please try refreshing the page or check server logs.
                </AlertDescription>
            </Alert>
          ) : filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Inquiry ID</TableHead>
                    <TableHead className="text-foreground">Customer</TableHead>
                    <TableHead className="text-foreground">Goldsmith ID</TableHead>
                    <TableHead className="text-foreground">Message (Snippet)</TableHead>
                    <TableHead className="text-foreground">Requested At</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{inquiry.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium text-foreground">{inquiry.customerName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{inquiry.goldsmithId.substring(0,8)}...</TableCell>
                      <TableCell className="text-foreground text-xs max-w-xs truncate" title={inquiry.message}>{inquiry.message}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {inquiry.requestedAt ? format(new Date(inquiry.requestedAt), 'PPpp') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(inquiry.status)} className="capitalize text-xs">
                          {inquiry.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View
                        </Button>
                        {/* Add more actions like Update Status, Forward to Goldsmith, etc. */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{searchTerm ? 'No inquiries match your search.' : 'No inquiries found on the platform.'}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{searchTerm ? 'Try adjusting your search terms.' : 'New inquiries from customers will appear here.'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
