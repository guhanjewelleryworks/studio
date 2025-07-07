// src/app/goldsmith-portal/login/page.tsx
'use client';

import { useState, type FormEvent, Fragment } from 'react'; // Added Fragment
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, MailCheck } from 'lucide-react'; // Added MailCheck
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
  DialogClose, // Added DialogClose
} from "@/components/ui/dialog";
import type { NewGoldsmithInput } from '@/types/goldsmith';


export default function GoldsmithLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

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
        // Clear any existing customer session to prevent conflicts
        localStorage.removeItem('currentUser'); 
        
        localStorage.setItem('currentGoldsmithUser', JSON.stringify({
          isLoggedIn: true,
          id: goldsmith.id,
          name: goldsmith.name,
          email: goldsmith.email
        }));
      }

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      // Use window.location.href for a full page reload to ensure header state is updated
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
      // Although the action returns a generic message, handle potential future errors
      setForgotPasswordMessage("An unexpected error occurred. Please try again.");
    }
    
    setIsForgotPasswordLoading(false);
  };

  return (
    <Fragment>
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
                  className="text-base py-2 text-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="text-base py-2 text-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end pt-0.5">
                <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                      onClick={() => {
                        setForgotPasswordMessage(''); // Clear previous message
                        setForgotPasswordEmail(''); // Clear email field
                        setIsForgotPasswordDialogOpen(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card">
                    <DialogHeader>
                      <DialogTitle className="text-accent">Forgot Your Password?</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Enter your registered email address. Since we can't send emails, a reset link will be logged to your server console for developer testing.
                      </DialogDescription>
                    </DialogHeader>
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
                      {forgotPasswordMessage && (
                        <div className={`p-3 rounded-md text-sm bg-green-100 border border-green-300 text-green-800`}>
                           <div className="flex items-center">
                            <MailCheck className="h-5 w-5 mr-2"/>
                            <p>{forgotPasswordMessage}</p>
                           </div>
                        </div>
                      )}
                      <DialogFooter className="sm:justify-start gap-2">
                        <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isForgotPasswordLoading}>
                          {isForgotPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Request Reset Link
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline" disabled={isForgotPasswordLoading}>
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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

              <p className="text-center text-sm text-muted-foreground pt-4">
                Don&apos;t have a partner account?{' '}
                <Link href="/goldsmith-portal/register" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  )
}
