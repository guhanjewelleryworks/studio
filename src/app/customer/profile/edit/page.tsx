// src/app/customer/profile/edit/page.tsx
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, UserCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomerById, updateCustomerProfile } from '@/actions/customer-actions';
import type { Customer } from '@/types/goldsmith';
import Link from 'next/link';

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
  // Email editing is often complex due to verification, so we'll display it as read-only for now.
  // const [email, setEmail] = useState(''); 

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        // setEmail(data.email); 
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser?.id || !name.trim()) {
      toast({ title: "Validation Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const result = await updateCustomerProfile(currentUser.id, { name: name.trim() });
      if (result.success && result.data) {
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
        // Update localStorage if name changed
        if (currentUser.name !== result.data.name) {
            localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, name: result.data.name }));
        }
        setCustomerData(result.data); // Update local state with new data
        router.refresh(); // Refresh to potentially update header if name changed
      } else {
        toast({ title: "Update Failed", description: result.error || "Could not update profile.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({ title: "Update Failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
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
    <div className="container py-8 px-4 md:px-6 min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-secondary/10 to-background">
       <header className="mb-6 flex items-center justify-between">
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

      <Card className="max-w-2xl mx-auto shadow-xl bg-card border-primary/10 rounded-xl">
        <CardHeader className="text-center pt-6 pb-4">
          <UserCircle className="h-16 w-16 mx-auto text-primary mb-3" />
          <CardTitle className="text-2xl text-accent">Update Your Information</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">Keep your details current.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                required
                className="text-base text-foreground py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
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
            
            {/* Placeholder for Password Change - requires more complex flow */}
            {/* <div className="space-y-1.5">
              <Label className="text-foreground">Password</Label>
              <Button type="button" variant="outline" className="w-full">Change Password</Button>
            </div> */}

            <Button
              type="submit"
              size="lg"
              className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
