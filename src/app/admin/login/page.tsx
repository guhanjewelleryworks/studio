// src/app/admin/login/page.tsx
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (typeof window !== "undefined") {
      const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
      if (adminLoggedIn === 'true') {
        router.replace('/admin/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate admin credentials check
    if (username === 'admin' && password === 'password') { 
      if (typeof window !== "undefined") {
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      toast({
        title: 'Login Successful (Simulated)',
        description: 'Redirecting to the admin dashboard...',
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: 'Login Failed (Simulated)',
        description: 'Invalid username or password. Please try "admin" and "password".',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/20 to-background">
      <Card className="w-full max-w-lg shadow-xl border-destructive/30 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4"> 
           <ShieldAlert className="h-14 w-14 mx-auto text-destructive mb-3" /> 
          <CardTitle className="text-3xl text-accent">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">Restricted Access. Authorized Personnel Only.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6 pt-4"> 
          <form className="space-y-4" onSubmit={handleSubmit}> 
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-foreground">Username or Email</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="admin" 
                required 
                className="text-base py-2 text-foreground"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading} 
              /> 
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="password"
                required 
                className="text-base py-2 text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              /> 
            </div>

            <Button 
              type="submit" 
              variant="destructive" 
              size="lg" 
              className="w-full shadow-md hover:shadow-lg transition-shadow rounded-full text-base py-3 mt-2"
              disabled={isLoading}
            > 
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Secure Login
            </Button>

              <p className="text-center text-sm text-muted-foreground pt-4"> 
                 For security reasons, password recovery options are limited.
                 <br /> Contact system administrator if you have issues logging in.
                 <br />
                 <Link href="/" className="underline hover:text-primary transition-colors">Return to Homepage</Link>
              </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
