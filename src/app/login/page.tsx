// src/app/login/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, Loader2 } from 'lucide-react'; // Added Loader2
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { useState, type FormEvent } from 'react'; // Added useState and FormEvent
import { useRouter } from 'next/navigation'; // Added useRouter
import { useToast } from '@/hooks/use-toast'; // Added useToast

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login - Firebase is removed
    console.log("Simulating customer login for:", email);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) { // Basic check
        toast({
          title: "Login Successful (Simulated)",
          description: "Redirecting... (Firebase Auth Removed)",
        });
        // Redirect to homepage or a customer dashboard if one exists
        router.push('/');
    } else {
        toast({
          title: "Login Failed (Simulated)",
          description: "Please enter email and password. (Firebase Auth Removed)",
          variant: "destructive",
        });
        setIsLoading(false);
    }
  };

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
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="text-base text-foreground py-2"
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
                className="text-base text-foreground py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

             <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center space-x-1.5">
                  <Checkbox id="remember-me" />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="#" // Placeholder for "Forgot password"
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

            <Button
              type="submit"
              size="lg"
              className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
            </Button>

            <Separator className="my-5" />
            <SocialAuthButtons mode="login" />


             <p className="text-center text-sm text-muted-foreground pt-3.5">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Sign up here
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Are you a Goldsmith?{' '}
                <Link href="/goldsmith-portal/login" className="font-semibold text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">
                  Login to Goldsmith Portal
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
