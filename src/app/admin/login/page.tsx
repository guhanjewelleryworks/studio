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
import { loginAdmin } from '@/actions/admin-actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // CRITICAL FIX: Always clear the session flag when visiting the login page
    // This prevents a stale flag from causing an automatic redirect.
    if (typeof window !== "undefined") {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminPermissions'); // Clear permissions as well
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginAdmin({ email, password });
      
      if (result.success && result.admin) { 
        if (typeof window !== "undefined") {
          localStorage.setItem('isAdminLoggedIn', 'true');
          // Store permissions instead of just the role
          localStorage.setItem('adminPermissions', JSON.stringify(result.admin.permissions || []));
        }
        toast({
          title: 'Login Successful',
          description: 'Redirecting to the admin dashboard...',
        });
        router.push('/admin/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: result.message,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
       toast({
          title: 'Login Failed',
          description: 'An unexpected server error occurred.',
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
              <Label htmlFor="email" className="text-foreground">Admin Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter admin email" 
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
                placeholder="Enter admin password"
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
