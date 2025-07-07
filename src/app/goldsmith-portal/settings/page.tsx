// src/app/goldsmith-portal/settings/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { changeGoldsmithPassword } from '@/actions/goldsmith-actions';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentGoldsmithUser {
  isLoggedIn: boolean;
  id: string;
  email: string;
}

export default function GoldsmithSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<CurrentGoldsmithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('currentGoldsmithUser');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.isLoggedIn && user.id && user.email) {
        setCurrentUser(user);
        setIsLoading(false);
      } else {
        router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/settings');
      }
    } else {
      router.push('/goldsmith-portal/login?redirect=/goldsmith-portal/settings');
    }
  }, [router]);

  const handlePasswordChangeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser?.id) return;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({ title: "Validation Error", description: "All password fields are required.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Validation Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Validation Error", description: "New password must be at least 8 characters long.", variant: "destructive" });
      return;
    }

    setIsSavingPassword(true);
    try {
      const result = await changeGoldsmithPassword(currentUser.id, currentPassword, newPassword);
      if (result.success) {
        toast({ title: "Password Changed", description: "Your password has been successfully updated." });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast({ title: "Password Change Failed", description: result.error || "Could not change password.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({ title: "Password Change Failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSavingPassword(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

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
           <CardTitle className="text-xl text-accent">Login & Security</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your login credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form className="space-y-4" onSubmit={handlePasswordChangeSubmit}>
            <div>
              <Label htmlFor="current-email" className="text-foreground">Current Email</Label>
              <Input 
                id="current-email" 
                type="email" 
                value={currentUser?.email || ''} 
                readOnly 
                className="bg-muted/50 text-muted-foreground" 
              />
            </div>
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                placeholder="Enter current password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isSavingPassword}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password (min. 8 characters)</Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isSavingPassword}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isSavingPassword}
              />
            </div>
            <div className="flex justify-end">
                <Button type="submit" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground" disabled={isSavingPassword}>
                    {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
