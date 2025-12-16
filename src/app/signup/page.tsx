// src/app/signup/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2, MailCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { useState, type FormEvent, useEffect, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveCustomer } from '@/actions/customer-actions';
import type { NewCustomerInput, PlatformSettings } from '@/types/goldsmith';
import { fetchPlatformSettings } from '@/actions/settings-actions';
import { usePathname } from 'next/navigation';

function SignUpPageContent() {
  const { toast } = useToast();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [settings, setSettings] = useState<Partial<PlatformSettings>>({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const fetchedSettings = await fetchPlatformSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Failed to load platform settings:", error);
        toast({
          title: "Error",
          description: "Could not load page settings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
        toast({ title: "Signup Error", description: "Name, email, and password are required.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Signup Error", description: "Passwords do not match.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        toast({ title: "Signup Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    const customerData: NewCustomerInput = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
    };

    try {
        const result = await saveCustomer(customerData);

        if (result.success) {
            toast({ title: "Success!", description: result.message });
            setIsSubmitted(true);
        } else {
             toast({ title: "Signup Failed", description: result.message, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Signup Failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isLoadingSettings) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (isSubmitted) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
          <Card className="w-full max-w-md shadow-xl border-green-500/20 rounded-xl bg-card text-center">
            <CardHeader className="pt-8 pb-4">
                <MailCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-3xl text-accent">Check Your Email</CardTitle>
                <CardDescription className="text-muted-foreground mt-2 text-base">
                    A verification link has been sent to <strong>{email}</strong>.
                </CardDescription>
            </CardHeader>
             <CardContent className="px-6 pb-8">
                <p className="text-foreground/80 mb-6">
                    Please click the link in the email to activate your account. If you don't see it, be sure to check your spam folder.
                </p>
                <Button asChild size="lg" className="w-full shadow-md rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/login">
                    Proceed to Login
                </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      );
  }
  
  if (!settings.allowCustomerRegistration) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
          <Card className="w-full max-w-md text-center shadow-xl border-primary/10 rounded-xl bg-card">
            <CardHeader className="pt-8 pb-4">
                <UserX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="text-3xl text-accent">Registrations Paused</CardTitle>
            </CardHeader>
             <CardContent className="px-6 pb-8">
                <p className="text-foreground/80 mb-6">
                    We are not accepting new customer registrations at this time. Please check back later.
                </p>
                <Button asChild size="lg" className="w-full shadow-md rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/">
                    Return to Homepage
                </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-3">
           <UserPlus className="h-10 w-10 mx-auto text-primary mb-2.5" />
          <CardTitle className="text-3xl text-accent">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Join Goldsmith Connect to discover artisans and craft your story.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" placeholder="e.g., Alex Smith" required className="text-base text-foreground h-11" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="alex.smith@example.com" required className="text-base text-foreground h-11" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Create Password</Label>
              <Input id="password" type="password" placeholder="Min. 6 characters" required className="text-base text-foreground h-11" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Re-enter your password" required className="text-base text-foreground h-11" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
            <Separator className="my-5" />
            <SocialAuthButtons mode="signup" />
            <div className="text-center text-sm text-muted-foreground pt-3.5 space-y-2">
              <p>
                Already have an account?{' '}
                <Link href={`/login?redirect=${pathname}`} className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Login here
                </Link>
              </p>
              <p>
                Are you a Goldsmith?{' '}
                <Link href="/goldsmith-portal/register" className="font-semibold text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">
                  Register your workshop
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <SignUpPageContent />
        </Suspense>
    );
}
