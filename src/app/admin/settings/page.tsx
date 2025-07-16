// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft, Megaphone, Loader2, ShieldAlert, DollarSign, Gem, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchPlatformSettings, updatePlatformSettings } from '@/actions/settings-actions';
import type { PlatformSettings } from '@/types/goldsmith';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

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
    // Prepare only the intended fields to be updated
    const settingsToUpdate = {
      announcementText: settings.announcementText,
      isAnnouncementVisible: settings.isAnnouncementVisible,
      customerPremiumPriceMonthly: Number(settings.customerPremiumPriceMonthly),
      customerPremiumPriceAnnual: Number(settings.customerPremiumPriceAnnual),
      goldsmithPartnerPriceMonthly: Number(settings.goldsmithPartnerPriceMonthly),
      goldsmithPartnerPriceAnnual: Number(settings.goldsmithPartnerPriceAnnual),
    };
    
    const result = await updatePlatformSettings(settingsToUpdate);

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

          <Separator />

          {/* Pricing Settings */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary/80" /> Pricing Tiers
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4 rounded-lg border p-4 shadow-sm">
                {/* Customer Premium Tier */}
                <div className="space-y-2">
                    <h3 className="font-medium text-foreground flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Customer Premium Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                        <div>
                            <Label htmlFor="customer-monthly">Monthly Price ($)</Label>
                            <Input id="customer-monthly" type="number" value={settings.customerPremiumPriceMonthly ?? ''} onChange={(e) => setSettings(prev => ({ ...prev, customerPremiumPriceMonthly: parseFloat(e.target.value) || 0 }))} />
                        </div>
                         <div>
                            <Label htmlFor="customer-annual">Annual Price ($)</Label>
                            <Input id="customer-annual" type="number" value={settings.customerPremiumPriceAnnual ?? ''} onChange={(e) => setSettings(prev => ({ ...prev, customerPremiumPriceAnnual: parseFloat(e.target.value) || 0 }))} />
                        </div>
                    </div>
                </div>
                
                <Separator className="my-4"/>

                {/* Goldsmith Partner Tier */}
                <div className="space-y-2">
                    <h3 className="font-medium text-foreground flex items-center"><Gem className="h-4 w-4 mr-2 text-blue-500" /> Goldsmith Partner Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                        <div>
                            <Label htmlFor="goldsmith-monthly">Monthly Price ($)</Label>
                            <Input id="goldsmith-monthly" type="number" value={settings.goldsmithPartnerPriceMonthly ?? ''} onChange={(e) => setSettings(prev => ({ ...prev, goldsmithPartnerPriceMonthly: parseFloat(e.target.value) || 0 }))} />
                        </div>
                         <div>
                            <Label htmlFor="goldsmith-annual">Annual Price ($)</Label>
                            <Input id="goldsmith-annual" type="number" value={settings.goldsmithPartnerPriceAnnual ?? ''} onChange={(e) => setSettings(prev => ({ ...prev, goldsmithPartnerPriceAnnual: parseFloat(e.target.value) || 0 }))} />
                        </div>
                    </div>
                </div>
              </div>
            )}
          </section>

          <div className="pt-4 text-right">
            <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
