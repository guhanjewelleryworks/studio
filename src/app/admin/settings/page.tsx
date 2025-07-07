// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft, ToggleLeft, Palette, Percent, Megaphone, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchPlatformSettings, updatePlatformSettings } from '@/actions/settings-actions';
import type { PlatformSettings } from '@/types/goldsmith';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettingsPage() {
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
    loadSettings();
  }, []);

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

          <Separator />
          
          {/* ... other settings sections ... */}
          <section>
            <h2 className="text-lg font-semibold text-muted-foreground/70 mb-3 flex items-center">
              <ToggleLeft className="mr-2 h-5 w-5 text-muted-foreground/50" /> General Platform Settings (Simulated)
            </h2>
            <div className="space-y-4 opacity-50">
              <div>
                <Label htmlFor="platform-name" className="text-foreground">Platform Name</Label>
                <Input id="platform-name" defaultValue="Goldsmith Connect" className="text-foreground" disabled/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode" className="text-foreground">Maintenance Mode</Label>
                <Switch id="maintenance-mode" disabled/>
              </div>
            </div>
          </section>
          
          <Separator />

           {/* Commission/Fees (Placeholder) */}
          <section>
            <h2 className="text-lg font-semibold text-muted-foreground/70 mb-3 flex items-center">
              <Percent className="mr-2 h-5 w-5 text-muted-foreground/50" /> Commission & Fees (Simulated)
            </h2>
            <div className="space-y-4 opacity-50">
                <div>
                    <Label htmlFor="platform-fee" className="text-foreground">Platform Fee (%)</Label>
                    <Input id="platform-fee" type="number" defaultValue="5" className="text-foreground" disabled/>
                </div>
                 <p className="text-xs text-muted-foreground">
                (Simulated: Configure rates for platform services.)
              </p>
            </div>
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
