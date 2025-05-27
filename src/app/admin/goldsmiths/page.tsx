// src/app/admin/goldsmiths/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft, CheckCircle, XCircle, Hourglass, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminGoldsmiths, updateGoldsmithStatus } from '@/actions/goldsmith-actions';
import type { Goldsmith } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminGoldsmithsPage() {
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const loadGoldsmiths = async () => {
    console.log('[AdminGoldsmithsPage] loadGoldsmiths called');
    setIsLoading(true);
    try {
      const data = await fetchAdminGoldsmiths();
      console.log('[AdminGoldsmithsPage] Fetched data for admin:', data);
      setGoldsmiths(data || []); // Ensure data is an array, default to empty if null/undefined
    } catch (error) {
      console.error("[AdminGoldsmithsPage] Failed to fetch goldsmiths:", error);
      toast({
        title: "Error Loading Data",
        description: "Could not fetch goldsmiths data. Please try refreshing the page or check server logs.",
        variant: "destructive",
      });
      setGoldsmiths([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
      console.log('[AdminGoldsmithsPage] loadGoldsmiths finished');
    }
  };

  useEffect(() => {
    loadGoldsmiths();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Goldsmith['status']) => {
    console.log(`[AdminGoldsmithsPage] handleUpdateStatus called for ID: ${id}, New Status: ${newStatus}`);
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    const result = await updateGoldsmithStatus(id, newStatus);
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Goldsmith status successfully changed to ${newStatus}.`,
      });
      await loadGoldsmiths(); // Refresh the list
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Could not update goldsmith status.",
        variant: "destructive",
      });
    }
    setIsUpdating(prev => ({ ...prev, [id]: false }));
  };

  const getStatusBadgeVariant = (status?: Goldsmith['status'] | string | null) => {
    switch (status) {
      case 'verified':
        return 'default'; 
      case 'pending_verification':
        return 'secondary'; 
      case 'rejected':
        return 'destructive'; 
      default:
        return 'outline'; // Fallback for unknown or undefined status
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Manage Goldsmith Partners</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadGoldsmiths} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
                {isLoading && goldsmiths.length === 0 ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
                Refresh List
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
          <CardTitle className="text-xl text-accent font-heading">Goldsmith Partner Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            Review and manage goldsmith registrations and their statuses. Current goldsmith count: {goldsmiths.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && goldsmiths.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading goldsmiths...</p>
            </div>
          ) : goldsmiths.length > 0 ? (
            <div className="space-y-4">
              {goldsmiths.filter(g => g && typeof g === 'object').map((goldsmith) => ( // Ensure goldsmith is an object
                <Card key={goldsmith.id} className="bg-card/80 border-border/50 shadow-sm rounded-lg">
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg text-accent font-heading">{goldsmith.name || 'Unnamed Goldsmith'}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground pt-0.5">{(goldsmith.email || 'No Email')} | ID: {goldsmith.id}</CardDescription>
                        </div>
                        <Badge 
                          variant={getStatusBadgeVariant(goldsmith.status)} 
                          className="capitalize text-xs"
                        >
                          {typeof goldsmith.status === 'string' ? goldsmith.status.replace('_', ' ') : 'unknown'}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground px-4 py-2">
                    <p>Contact: {goldsmith.contactPerson || 'N/A'}</p>
                    <p>Phone: {goldsmith.phone || 'N/A'}</p>
                    <p>Address: {goldsmith.address || 'N/A'}</p>
                    <p>Specialty: {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : (typeof goldsmith.specialty === 'string' ? goldsmith.specialty : 'N/A')}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-2 flex justify-end gap-2">
                    {goldsmith.status === 'pending_verification' && (
                      <>
                        <Button
                          size="xs"
                          variant="default"
                          onClick={() => handleUpdateStatus(goldsmith.id, 'verified')}
                          disabled={isUpdating[goldsmith.id]}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isUpdating[goldsmith.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <CheckCircle className="mr-1 h-3 w-3" />}
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(goldsmith.id, 'rejected')}
                          disabled={isUpdating[goldsmith.id]}
                        >
                          {isUpdating[goldsmith.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <XCircle className="mr-1 h-3 w-3" />}
                          Reject
                        </Button>
                      </>
                    )}
                    {goldsmith.status === 'verified' && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 dark:text-yellow-400"
                        onClick={() => handleUpdateStatus(goldsmith.id, 'pending_verification')}
                        disabled={isUpdating[goldsmith.id]}
                      >
                        {isUpdating[goldsmith.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <Hourglass className="mr-1 h-3 w-3" />}
                        Mark as Pending
                      </Button>
                    )}
                     {goldsmith.status === 'rejected' && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                        onClick={() => handleUpdateStatus(goldsmith.id, 'pending_verification')}
                        disabled={isUpdating[goldsmith.id]}
                      >
                        {isUpdating[goldsmith.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <RefreshCw className="mr-1 h-3 w-3" />}
                        Re-evaluate (Set to Pending)
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No goldsmiths found. This could mean no goldsmiths are registered yet, or there was an issue loading them.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
