// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft, ToggleLeft, Palette, Percent } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function AdminSettingsPage() {
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
            This is a placeholder page for configuring global platform settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <ToggleLeft className="mr-2 h-5 w-5 text-primary/80" /> General Platform Settings
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-name" className="text-foreground">Platform Name</Label>
                <Input id="platform-name" defaultValue="Goldsmith Connect" className="text-foreground"/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode" className="text-foreground">Maintenance Mode</Label>
                <Switch id="maintenance-mode" />
              </div>
            </div>
          </section>

          <Separator />

          {/* Theme & Appearance */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary/80" /> Theme & Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary-color" className="text-foreground">Primary Color (Hex)</Label>
                <Input id="primary-color" defaultValue="#F78FB3" className="text-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                (Simulated: In a real app, changing this would require recompiling CSS or dynamic CSS variable updates.)
              </p>
            </div>
          </section>

          <Separator />

          {/* Commission/Fees (Placeholder) */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Percent className="mr-2 h-5 w-5 text-primary/80" /> Commission & Fees
            </h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="platform-fee" className="text-foreground">Platform Fee (%)</Label>
                    <Input id="platform-fee" type="number" defaultValue="5" className="text-foreground" />
                </div>
                 <p className="text-xs text-muted-foreground">
                (Simulated: Configure rates for platform services.)
              </p>
            </div>
          </section>

          <div className="pt-4 text-right">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
