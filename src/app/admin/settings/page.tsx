// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft, Megaphone, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchPlatformSettings, updatePlatformSettings } from '@/actions/settings-actions';
import type { PlatformSettings } from '@/types/goldsmith';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function AdminSettingsPage() {
  const { hasPermission, isAccessLoading } = useAdminAccess('canManageSettings');
  const [settings, setSettings] = useState<Partial<PlatformSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const fetchedSettings = await fetchPlatformSettings();
      setSettings(fetchedSettings);
      setIsLoading(false);
    };

    if (!isAccessLoading && hasPermission) {
      loadSettings();
    }
  }, [isAccessLoading, hasPermission]);


  const handleSave = async () => {
    setIsSaving(true);
    const result = await updatePlatformSettings({
      announcementText: settings.announcementText,
      isAnnouncementVisible: settings.isAnnouncementVisible,
    });
    if (result.success) {
      toast({
        title: "Settings Saved",
        description: "Your platform settings have been updated successfully.",
      });
      if (result.data) {
        setSettings(result.data);
      }
    } else {
      toast({
        title: "Error Saving Settings",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
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
            <p className="text-muted-foreground">You do not have the required permissions to manage platform settings.</p>
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
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading text-accent">Platform Settings</h1>
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
          <CardTitle className="text-xl text-accent font-heading">System Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage global settings for the Goldsmith Connect platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Announcement Settings */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Megaphone className="mr-2 h-5 w-5 text-primary/80" /> Platform Announcement
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="announcement-text" className="text-foreground">Announcement Message</Label>
                  <Textarea
                    id="announcement-text"
                    placeholder="Enter your announcement here. It will be displayed in a banner on the homepage."
                    className="text-foreground"
                    value={settings.announcementText || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, announcementText: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label htmlFor="announcement-visible">Show Announcement Banner</Label>
                    <p className="text-xs text-muted-foreground">
                      Toggle to show or hide the announcement on the homepage.
                    </p>
                  </div>
                  <Switch
                    id="announcement-visible"
                    checked={settings.isAnnouncementVisible || false}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isAnnouncementVisible: checked }))}
                  />
                </div>
              </div>
            )}
          </section>

          <div className="pt-4 text-right">
            <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}