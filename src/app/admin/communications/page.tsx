// src/app/admin/communications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, RefreshCw, Loader2, AlertTriangle, Archive, Phone, Inbox, Undo } from 'lucide-react';
import Link from 'next/link';
import {
  fetchContactSubmissions,
  archiveContactSubmission,
  fetchArchivedContactSubmissions, // New import
  unarchiveContactSubmission,     // New import
} from '@/actions/contact-actions';
import type { ContactSubmission } from '@/types/goldsmith';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubmissionCard = ({ submission, onArchive, onUnarchive, isArchiving, isUnarchiving }: {
  submission: ContactSubmission;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  isArchiving?: boolean;
  isUnarchiving?: boolean;
}) => (
    <Card className="shadow-md bg-card border-border/50">
        <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-accent">{submission.subject}</CardTitle>
                <Badge variant="secondary" className="text-xs">{format(new Date(submission.submittedAt), 'PPpp')}</Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground pt-1">
                From: {submission.name} ({submission.email})
                <span className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1.5" />
                    {submission.phone}
                </span>
            </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-3">
            <p className="text-sm text-foreground whitespace-pre-wrap">{submission.message}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 flex justify-end bg-muted/30">
            {onArchive && (
                <Button 
                    size="sm" 
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 dark:text-yellow-400"
                    onClick={() => onArchive(submission.id)}
                    disabled={isArchiving}
                >
                    {isArchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Archive className="mr-2 h-4 w-4"/>}
                    {isArchiving ? 'Archiving...' : 'Archive Message'}
                </Button>
            )}
            {onUnarchive && (
                 <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                    onClick={() => onUnarchive(submission.id)}
                    disabled={isUnarchiving}
                >
                    {isUnarchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Undo className="mr-2 h-4 w-4"/>}
                    {isUnarchiving ? 'Restoring...' : 'Restore to Inbox'}
                </Button>
            )}
        </CardFooter>
    </Card>
);

export default function AdminCommunicationsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [archivedSubmissions, setArchivedSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchiving, setIsArchiving] = useState<Record<string, boolean>>({});
  const [isUnarchiving, setIsUnarchiving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [inboxData, archivedData] = await Promise.all([
        fetchContactSubmissions(),
        fetchArchivedContactSubmissions(),
      ]);
      setSubmissions(inboxData || []);
      setArchivedSubmissions(archivedData || []);
    } catch (err) {
      console.error("Failed to fetch contact submissions:", err);
      setError("Could not load messages. Please try again.");
      toast({
        title: "Error Loading Messages",
        description: "Failed to fetch data from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleArchive = async (id: string) => {
    setIsArchiving(prev => ({...prev, [id]: true}));
    const result = await archiveContactSubmission(id);
    if(result.success) {
      toast({ title: "Message Archived", description: "The message has been moved to the archive."});
      const itemToMove = submissions.find(s => s.id === id);
      if (itemToMove) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setArchivedSubmissions(prev => [itemToMove, ...prev].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
      }
    } else {
      toast({ title: "Archive Failed", description: result.error || "Could not archive the message.", variant: "destructive"});
    }
    setIsArchiving(prev => ({...prev, [id]: false}));
  }
  
  const handleUnarchive = async (id: string) => {
    setIsUnarchiving(prev => ({...prev, [id]: true}));
    const result = await unarchiveContactSubmission(id);
    if(result.success) {
      toast({ title: "Message Restored", description: "The message has been moved back to the inbox."});
       const itemToMove = archivedSubmissions.find(s => s.id === id);
      if (itemToMove) {
        setArchivedSubmissions(prev => prev.filter(s => s.id !== id));
        setSubmissions(prev => [itemToMove, ...prev].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
      }
    } else {
      toast({ title: "Restore Failed", description: result.error || "Could not restore the message.", variant: "destructive"});
    }
    setIsUnarchiving(prev => ({...prev, [id]: false}));
  }

  const renderSubmissionList = (list: ContactSubmission[], type: 'inbox' | 'archived') => {
    if (isLoading) {
       return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading messages...</p>
        </div>
      );
    }
     if (list.length > 0) {
      return (
        <div className="space-y-4">
          {list.map(sub => (
            <SubmissionCard 
              key={sub.id} 
              submission={sub} 
              onArchive={type === 'inbox' ? handleArchive : undefined}
              onUnarchive={type === 'archived' ? handleUnarchive : undefined}
              isArchiving={isArchiving[sub.id]}
              isUnarchiving={isUnarchiving[sub.id]}
            />
          ))}
        </div>
      );
    }
     return (
       <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {type === 'inbox' ? 'Your inbox is empty.' : 'No archived messages.'}
          </p>
      </div>
     )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-6 px-4 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Contact Messages</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={loadSubmissions} variant="outline" size="sm" disabled={isLoading} className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
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

       {error ? (
          <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      ) : (
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mb-4">
            <TabsTrigger value="inbox">Inbox ({submissions.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedSubmissions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="inbox">
            {renderSubmissionList(submissions, 'inbox')}
          </TabsContent>
          <TabsContent value="archived">
            {renderSubmissionList(archivedSubmissions, 'archived')}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
