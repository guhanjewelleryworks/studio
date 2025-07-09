// src/app/login/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, Loader2, Eye, EyeOff, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signIn, useSession } from 'next-auth/react';
import { resendVerificationEmail } from '@/actions/customer-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { requestCustomerPasswordReset } from '@/actions/customer-actions';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // State for forgot password dialog
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // FIX: Redirect if already logged in
  React.useEffect(() => {
    if (status === 'authenticated') {
      const redirectUrl = searchParams.get('redirect') || '/customer/dashboard';
      router.replace(redirectUrl);
    }
  }, [status, router, searchParams]);


  React.useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'CredentialsSignin') {
        toast({
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
        });
    } else if (error) {
         toast({
            title: 'Login Error',
            description: 'An unexpected error occurred during login. Please try again.',
            variant: 'destructive',
        });
    }
  }, [searchParams, toast]);


  const handleResend = async () => {
    setIsResending(true);
    const result = await resendVerificationEmail(email);
    toast({
      title: "Request Sent",
      description: result.message
    });
    setIsResending(false);
  };
  
  const handleRequestReset = async (e: FormEvent) => {
      e.preventDefault();
      setIsRequestingReset(true);
      setResetMessage('');

      const result = await requestCustomerPasswordReset(forgotPasswordEmail);
      
      setResetMessage(result.message);
      setIsRequestingReset(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResend(false);

    if (!email.trim() || !password.trim()) {
      toast({ title: "Login Error", description: "Please enter both email and password.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password.trim(),
      });

      if (result?.error) {
        setIsLoading(false);
        if (result.error === 'NOT_VERIFIED') {
          setShowResend(true);
          toast({ title: "Email Not Verified", description: "Please check your inbox for a verification link.", variant: "destructive" });
        } else {
          toast({ title: "Login Failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
        }
      } else if (result?.ok) {
        toast({ title: "Login Successful!", description: `Welcome back! Redirecting...` });
        const redirectUrl = searchParams.get('redirect') || '/customer/dashboard';
        router.push(redirectUrl); // FIX: Use router.push for proper client-side navigation
      }

    } catch (error) {
      toast({ title: "Login Failed", description: "An unexpected error occurred.", variant: "destructive" });
      setIsLoading(false);
    }
  };
  
  // FIX: Show loader while session is loading or user is being redirected
  if (status === 'loading' || status === 'authenticated') {
      return (
          <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-3">
          <LogIn className="h-10 w-10 mx-auto text-primary mb-2.5" />
          <CardTitle className="text-3xl text-accent">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Log in to continue your Goldsmith Connect journey.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-3">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="text-base text-foreground py-2" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>

            <div className="space-y-1.5 relative">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required className="text-base text-foreground py-2 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center space-x-1.5">
                <Checkbox id="remember-me" />
                <label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">Remember me</label>
              </div>
              <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                        onClick={() => {
                            setResetMessage('');
                            setForgotPasswordEmail('');
                            setIsForgotPasswordOpen(true);
                        }}
                    >
                        Forgot password?
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-accent">Forgot Your Password?</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Enter your email to receive a password reset link. Check your inbox (and spam folder) for the email.
                        </DialogDescription>
                    </DialogHeader>
                    {resetMessage ? (
                        <div className="p-3 rounded-md text-sm bg-green-100 border border-green-300 text-green-800">
                            <div className="flex items-center">
                                <MailCheck className="h-5 w-5 mr-2"/>
                                <p>{resetMessage}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestReset} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="forgot-email" className="text-foreground">Your Email</Label>
                                <Input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    required
                                    className="text-foreground"
                                    disabled={isRequestingReset}
                                />
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isRequestingReset}>
                                    {isRequestingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
            </div>

            <Button type="submit" size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
            </Button>

            {showResend && (
              <div className="text-center">
                <Button type="button" variant="link" className="text-primary" onClick={handleResend} disabled={isResending}>
                  {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Resend verification email
                </Button>
              </div>
            )}

            <Separator className="my-5" />
            <SocialAuthButtons mode="login" />
            <p className="text-center text-sm text-muted-foreground pt-3.5">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">Sign up here</Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Are you a Goldsmith?{' '}
              <Link href="/goldsmith-portal/login" className="font-semibold text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">Login to Goldsmith Portal</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
