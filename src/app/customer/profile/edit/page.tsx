// src/app/customer/profile/edit/page.tsx
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, UserCircle, Loader2, ArrowLeft, Lock, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomerById, updateCustomerProfile, changeCustomerPassword } from '@/actions/customer-actions';
import type { Customer } from '@/types/goldsmith';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CurrentUser {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
}

export default function EditCustomerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [customerData, setCustomerData] = useState<Omit<Customer, 'password' | '_id'> | null>(null);
  
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser: CurrentUser = JSON.parse(user);
      if (parsedUser.isLoggedIn && parsedUser.id) {
        setCurrentUser(parsedUser);
        fetchCustomerData(parsedUser.id);
      } else {
        router.push('/login?redirect=/customer/profile/edit');
      }
    } else {
      router.push('/login?redirect=/customer/profile/edit');
    }
  }, [router]);

  const fetchCustomerData = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCustomerById(id);
      if (data) {
        setCustomerData(data);
        setName(data.name);
      } else {
        toast({ title: "Error", description: "Could not fetch profile data.", variant: "destructive" });
        router.push('/customer/dashboard');
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      toast({ title: "Error", description: "Failed to load profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser?.id || !name.trim()) {
      toast({ title: "Validation Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSavingProfile(true);
    try {
      const result = await updateCustomerProfile(currentUser.id, { name: name.trim() });
      if (result.success && result.data) {
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
        if (currentUser.name !== result.data.name) {
            localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, name: result.data.name }));
        }
        setCustomerData(result.data);
        router.refresh(); 
      } else {
        toast({ title: "Update Failed", description: result.error || "Could not update profile.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({ title: "Update Failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

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
    if (newPassword.length < 6) {
      toast({ title: "Validation Error", description: "New password must be at least 6 characters long.", variant: "destructive" });
      return;
    }

    setIsSavingPassword(true);
    try {
      const result = await changeCustomerPassword(currentUser.id, currentPassword, newPassword);
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
  
  if (isLoading || !customerData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
       <header className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Edit className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-heading text-accent">Edit Your Profile</h1>
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground">
          <Link href="/customer/dashboard">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
          <CardHeader className="text-center pt-6 pb-4">
            <UserCircle className="h-16 w-16 mx-auto text-primary mb-3" />
            <CardTitle className="text-2xl text-accent">Update Your Information</CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm">Keep your details current.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <form className="space-y-5" onSubmit={handleProfileSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  required
                  className="text-base text-foreground py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSavingProfile}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground">Email Address (Cannot be changed)</Label>
                <Input
                  id="email"
                  type="email"
                  readOnly
                  className="text-base text-muted-foreground bg-muted/50 py-2"
                  value={customerData.email}
                  disabled
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        <Card className="shadow-xl bg-card border-primary/10 rounded-xl">
          <CardHeader className="text-center pt-6 pb-4">
            <Lock className="h-12 w-12 mx-auto text-primary mb-3" />
            <CardTitle className="text-2xl text-accent">Change Password</CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm">Update your account password.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
             <Alert variant="destructive" className="mb-4 text-xs">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Security Warning!</AlertTitle>
                <AlertDescription>
                  This platform currently uses plain text passwords for demonstration purposes. 
                  <strong>Do not use real or sensitive passwords.</strong> In a production application, passwords must be securely hashed.
                </AlertDescription>
            </Alert>
            <form className="space-y-5" onSubmit={handlePasswordChangeSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Your current password"
                  required
                  className="text-base text-foreground py-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-foreground">New Password (min. 6 characters)</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  required
                  className="text-base text-foreground py-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword" className="text-foreground">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  className="text-base text-foreground py-2"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground mt-2"
                disabled={isSavingPassword}
              >
                {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
