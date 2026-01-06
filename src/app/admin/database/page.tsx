
// src/app/admin/database/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminCustomers } from '@/actions/customer-actions';
import { fetchAdminGoldsmiths, fetchAllPlatformOrderRequests } from '@/actions/goldsmith-actions';
import { getLatestStoredPrices } from '@/actions/price-actions';
import type { Customer, Goldsmith, OrderRequest, StoredMetalPrice } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { safeFormatDate } from '@/lib/date';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useAdminAccess } from '@/hooks/useAdminAccess';

type TabValue = 'customers' | 'goldsmiths' | 'orders' | 'prices';

export default function AdminDatabasePage() {
  const { hasPermission, isAccessLoading } = useAdminAccess('canViewDatabase');
  const [activeTab, setActiveTab] = useState<TabValue>('customers');
  const [data, setData] = useState<{
    customers: Omit<Customer, 'password' | '_id'>[];
    goldsmiths: Goldsmith[];
    orders: OrderRequest[];
    prices: StoredMetalPrice[];
  }>({ customers: [], goldsmiths: [], orders: [], prices: [] });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [customersData, goldsmithsData, ordersData, pricesData] = await Promise.all([
        fetchAdminCustomers(),
        fetchAdminGoldsmiths(),
        fetchAllPlatformOrderRequests(),
        getLatestStoredPrices(),
      ]);
      setData({
        customers: customersData || [],
        goldsmiths: goldsmithsData || [],
        orders: ordersData || [],
        prices: pricesData || [],
      });
    } catch (err) {
      console.error("Failed to fetch database records:", err);
      setError("Could not load data from one or more collections. Please try again.");
      toast({
        title: "Error Loading Data",
        description: "Failed to fetch records from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAccessLoading && hasPermission) {
      loadAllData();
    }
  }, [isAccessLoading, hasPermission]);


  useEffect(() => {
    const sourceData = data[activeTab] || [];
    if (!searchTerm) {
      setFilteredData(sourceData);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = sourceData.filter(item => 
      JSON.stringify(item).toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
  }, [searchTerm, activeTab, data]);
  
  const renderTable = (collection: TabValue) => {
    const headers: string[] = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading records...</p>
        </div>
      );
    }
    
    if (filteredData.length === 0) {
        return (
            <div className="text-center py-10">
                <Database className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{searchTerm ? 'No records match your search.' : `No records found in ${collection}.`}</p>
            </div>
        );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <TableHead key={header} className="text-foreground capitalize">{header.replace(/([A-Z])/g, ' $1')}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id || index}>
                {headers.map(header => (
                  <TableCell key={header} className="text-xs text-muted-foreground font-mono whitespace-pre-wrap max-w-xs break-words">
                    {renderCellContent(item[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  const renderCellContent = (content: any): React.ReactNode => {
    if (content instanceof Date || (typeof content === 'string' && !isNaN(Date.parse(content)))) {
        return safeFormatDate(content);
    }
    if (typeof content === 'object' && content !== null) {
        return JSON.stringify(content, null, 2);
    }
    if (typeof content === 'string' && (content.startsWith('http') || content.startsWith('data:image'))) {
        return (
            <a href={content} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 truncate block">
                {content.substring(0, 40)}...
            </a>
        );
    }
    return String(content);
  }

  if (isAccessLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="container py-8 text-center">
        <Card className="max-w-md mx-auto shadow-lg bg-card border-destructive/20">
          <CardHeader>
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have the required permissions to view the database.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Database Records</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadAllData} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Refresh Data
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
          <CardTitle className="text-xl text-accent font-heading">Raw Data Viewer</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a collection to view its raw documents. Use search to filter records across all fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="goldsmiths">Goldsmiths</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="prices">Metal Prices</TabsTrigger>
                </TabsList>
                
                <div className="my-4 flex items-center gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={`Search all fields in ${activeTab}... (case-insensitive)`}
                            className="w-full pl-10 text-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <TabsContent value="customers">{renderTable('customers')}</TabsContent>
                <TabsContent value="goldsmiths">{renderTable('goldsmiths')}</TabsContent>
                <TabsContent value="orders">{renderTable('orders')}</TabsContent>
                <TabsContent value="prices">{renderTable('prices')}</TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    