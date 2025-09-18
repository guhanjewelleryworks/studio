// src/app/goldsmith-portal/login/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, MailCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { loginGoldsmith, requestGoldsmithPasswordReset } from '@/actions/goldsmith-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function GoldsmithLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setShowResend(false);

    if (!email || !password) {
      toast({
        title: 'Login Failed',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginGoldsmith({ email, password });

      if (!result.success || !result.data) {
        if (result.error === 'Your email address has not been verified.') {
            setShowResend(true);
        }
        toast({
          title: 'Login Failed',
          description: result.error || 'Please check your credentials and try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      const goldsmith = result.data;

      if (typeof window !== "undefined") {
        localStorage.removeItem('currentUser'); 
        
        localStorage.setItem('currentGoldsmithUser', JSON.stringify({
          isLoggedIn: true,
          id: goldsmith.id,
          name: goldsmith.name,
          email: goldsmith.email,
          loginTimestamp: new Date().getTime(), // Add login timestamp for session timeout
        }));
      }

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      window.location.href = '/goldsmith-portal/dashboard';

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleResend = () => {
    toast({
        title: "Resend Verification Email",
        description: "Functionality to resend verification for goldsmiths is pending implementation. Please check your original email."
    });
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage("Please enter your email address.");
      return;
    }
    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage('');

    const result = await requestGoldsmithPasswordReset(forgotPasswordEmail);

    if (result.success) {
      setForgotPasswordMessage(result.message);
    } else {
      setForgotPasswordMessage("An unexpected error occurred. Please try again.");
    }
    
    setIsForgotPasswordLoading(false);
  };

  return (
    <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
        <Card className="w-full max-w-lg shadow-xl border-primary/15 rounded-xl bg-card">
          <CardHeader className="text-center pt-6 pb-4">
            <LogIn className="h-12 w-12 mx-auto text-primary mb-3" />
            <CardTitle className="text-3xl text-accent">Goldsmith Portal Login</CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-sm font-poppins">Access your dashboard to manage your profile and orders.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-6 pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.workshop@example.com"
                  required
                  className="text-base py-2 text-foreground h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5 relative">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="text-base py-2 pr-10 text-foreground h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>

              <div className="text-right pt-0.5">
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                      onClick={() => {
                        setForgotPasswordMessage('');
                        setForgotPasswordEmail('');
                      }}
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground mt-1.5"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? 'Logging in...' : 'Login to Portal'}
              </Button>
            </form>
             
               {showResend && (
                <div className="text-center">
                    <Button type="button" variant="link" className="text-primary" onClick={handleResend}>
                        Resend verification email
                    </Button>
                </div>
                )}

              <p className="text-center text-sm text-muted-foreground pt-4">
                Don&apos;t have a partner account?{' '}
                <Link href="/goldsmith-portal/register" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Register here
                </Link>
              </p>
          </CardContent>
        </Card>
      </div>

       
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle className="text-accent">Forgot Your Password?</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter your registered email address to receive a password reset link.
              </DialogDescription>
            </DialogHeader>
            {forgotPasswordMessage ? (
                 <div className={`p-3 rounded-md text-sm bg-green-100 border border-green-300 text-green-800`}>
                   <div className="flex items-start">
                    <MailCheck className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"/>
                    <p className="whitespace-pre-wrap">{forgotPasswordMessage}</p>
                   </div>
                </div>
            ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-foreground">
                  Registered Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="text-foreground"
                  disabled={isForgotPasswordLoading}
                />
              </div>
              
              <DialogFooter className="sm:justify-start gap-2">
                <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isForgotPasswordLoading}>
                  {isForgotPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isForgotPasswordLoading}>
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
            )}
          </DialogContent>
    </Dialog>
  )
}
