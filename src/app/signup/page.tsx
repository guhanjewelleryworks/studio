// src/app/signup/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { saveCustomer } from '@/actions/customer-actions'; // Import the action
import type { NewCustomerInput } from '@/types/goldsmith';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
        toast({
            title: "Signup Error",
            description: "Name, email, and password are required.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Signup Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        toast({
            title: "Signup Error",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }


    const customerData: NewCustomerInput = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(), // Password will be sent to the server action
    };

    try {
        const result = await saveCustomer(customerData);

        if (result.success && result.data) {
            toast({
              title: "Signup Successful!",
              description: "Your account has been created. Redirecting to login...",
            });
            router.push('/login');
        } else {
             toast({
              title: "Signup Failed",
              description: result.error || "Could not create your account. Please try again.",
              variant: "destructive",
            });
            setIsLoading(false);
        }
    } catch (error) {
        console.error("Signup submission error:", error);
        toast({
          title: "Signup Failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
    }
    // setIsLoading(false); // Already handled in success/error cases typically
  };

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
              <Input
                id="name"
                placeholder="e.g., Alex Smith"
                required
                className="text-base text-foreground py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex.smith@example.com"
                required
                className="text-base text-foreground py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                required
                className="text-base text-foreground py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

             <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                className="text-base text-foreground py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>

            <Separator className="my-5" />
            <SocialAuthButtons mode="signup" />


             <p className="text-center text-sm text-muted-foreground pt-3.5">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Login here
                </Link>
              </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
