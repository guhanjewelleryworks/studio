// src/app/goldsmith-portal/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Lock, Bell, CreditCard, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GoldsmithSettingsPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-8 px-4 md:px-6">
       <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Account Settings</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/goldsmith-portal/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <Card className="max-w-3xl mx-auto shadow-xl bg-card border-primary/10">
        <CardHeader>
          <CardDescription className="text-muted-foreground">
            Manage your login credentials, notification preferences, and payment details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Login Credentials */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><Lock className="mr-2 h-5 w-5 text-primary/80" />Login & Security</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-email" className="text-foreground">Current Email</Label>
                <Input id="current-email" type="email" defaultValue="artisan.goldworks@example.com" readOnly className="bg-muted/50 text-muted-foreground" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">Update Password</Button>
            </div>
          </section>

          {/* Notification Preferences */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><Bell className="mr-2 h-5 w-5 text-primary/80" />Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-order-notifications" className="text-foreground">New Order Notifications</Label>
                <Switch id="new-order-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="message-notifications" className="text-foreground">New Message Notifications</Label>
                <Switch id="message-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="platform-updates" className="text-foreground">Platform Updates & News</Label>
                <Switch id="platform-updates" />
              </div>
            </div>
          </section>

          {/* Payment Details (Placeholder) */}
          <section>
             <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary/80" />Payment Details</h3>
             <p className="text-sm text-muted-foreground">
                Manage how you receive payments for completed orders. (Integration with a payment provider like Stripe or PayPal would be needed here).
             </p>
             <Button variant="outline" className="mt-3 border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">Connect Payment Method</Button>
          </section>
          
          <div className="pt-4 text-right">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
