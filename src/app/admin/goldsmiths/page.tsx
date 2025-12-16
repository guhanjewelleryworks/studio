// src/app/admin/goldsmiths/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft, CheckCircle, XCircle, Hourglass, RefreshCw, Loader2, Search, MailWarning, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminGoldsmiths, updateGoldsmithStatus } from '@/actions/goldsmith-actions';
import type { Goldsmith } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function AdminGoldsmithsPage() {
  const { hasPermission, isAccessLoading } = useAdminAccess('canManageGoldsmiths');
  const [goldsmiths, setGoldsmiths] = useState<Goldsmith[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGoldsmiths, setFilteredGoldsmiths] = useState<Goldsmith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const loadGoldsmiths = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminGoldsmiths();
      setGoldsmiths(data || []);
      setFilteredGoldsmiths(data || []);
    } catch (error) {
      console.error("[AdminGoldsmithsPage] Failed to fetch goldsmiths:", error);
      toast({
        title: "Error Loading Data",
        description: "Could not fetch goldsmiths data. Please try refreshing the page or check server logs.",
        variant: "destructive",
      });
      setGoldsmiths([]);
      setFilteredGoldsmiths([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAccessLoading && hasPermission) {
      loadGoldsmiths();
    }
  }, [isAccessLoading, hasPermission]);


  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = goldsmiths.filter(goldsmith => {
        if (!goldsmith) return false;
        const specialtyString = Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(' ') : (goldsmith.specialty || '');
        return (
            (goldsmith.name?.toLowerCase() || '').includes(lowercasedFilter) ||
            (goldsmith.email?.toLowerCase() || '').includes(lowercasedFilter) ||
            (goldsmith.state?.toLowerCase() || '').includes(lowercasedFilter) ||
            (goldsmith.district?.toLowerCase() || '').includes(lowercasedFilter) ||
            specialtyString.toLowerCase().includes(lowercasedFilter)
        );
    });
    setFilteredGoldsmiths(filteredData);
  }, [searchTerm, goldsmiths]);

  const handleUpdateStatus = async (id: string, newStatus: Goldsmith['status']) => {
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
      case 'pending_email_verification':
      case 'pending_verification':
        return 'secondary'; 
      case 'rejected':
        return 'destructive'; 
      default:
        return 'outline'; // Fallback for unknown or undefined status
    }
  };
  
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
            <p className="text-muted-foreground">You do not have the required permissions to manage goldsmiths.</p>
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
          <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, location, specialty..."
                className="w-full pl-10 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading && goldsmiths.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading goldsmiths...</p>
            </div>
          ) : filteredGoldsmiths.length > 0 ? (
            <div className="space-y-4">
              {filteredGoldsmiths.filter(g => g && typeof g === 'object').map((goldsmith) => (
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
                          {typeof goldsmith.status === 'string' ? goldsmith.status.replace(/_/g, ' ') : 'unknown'}
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground px-4 py-2">
                    <p>Contact: {goldsmith.contactPerson || 'N/A'}</p>
                    <p>Phone: {goldsmith.phone || 'N/A'}</p>
                    <p>Location: {goldsmith.district || 'N/A'}, {goldsmith.state || 'N/A'}</p>
                    <p>Specialty: {Array.isArray(goldsmith.specialty) ? goldsmith.specialty.join(', ') : (typeof goldsmith.specialty === 'string' ? goldsmith.specialty : 'N/A')}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-2 flex justify-end gap-2">
                    {goldsmith.status === 'pending_email_verification' && (
                        <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                           <MailWarning className="h-4 w-4" /> Awaiting email verification from user.
                        </div>
                    )}
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
            <p className="text-muted-foreground text-center py-10">{searchTerm ? 'No goldsmiths match your search.' : 'No goldsmiths found.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
