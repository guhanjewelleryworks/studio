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
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({}); // Track updating status per goldsmith
  const { toast } = useToast();

  const loadGoldsmiths = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminGoldsmiths();
      setGoldsmiths(data);
    } catch (error) {
      console.error("Failed to fetch goldsmiths:", error);
      toast({
        title: "Error",
        description: "Could not fetch goldsmiths data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoldsmiths();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Goldsmith['status']) => {
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    const result = await updateGoldsmithStatus(id, newStatus);
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Goldsmith status successfully changed to ${newStatus}.`,
      });
      loadGoldsmiths(); // Refresh the list
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Could not update goldsmith status.",
        variant: "destructive",
      });
    }
    setIsUpdating(prev => ({ ...prev, [id]: false }));
  };

  const getStatusBadgeVariant = (status: Goldsmith['status']) => {
    switch (status) {
      case 'verified':
        return 'default'; // Primary color (usually green if theme is set up that way)
      case 'pending_verification':
        return 'secondary'; // Secondary color (e.g., yellow/orange)
      case 'rejected':
        return 'destructive'; // Destructive color (e.g., red)
      default:
        return 'outline';
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
            Review and manage goldsmith registrations and their statuses.
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
              {goldsmiths.map((goldsmith) => (
                <Card key={goldsmith.id} className="bg-card/80 border-border/50 shadow-sm rounded-lg">
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg text-accent font-heading">{goldsmith.name}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground pt-0.5">{goldsmith.email} | ID: {goldsmith.id}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(goldsmith.status)} className="capitalize text-xs">
                            {goldsmith.status.replace('_', ' ')}
                        </Badge>
                    </div>
                  </CardHeader>
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
            <p className="text-muted-foreground text-center py-10">No goldsmiths found or none pending verification.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
