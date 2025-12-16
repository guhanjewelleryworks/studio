// src/app/customer/reset-password/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LockKeyhole, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetCustomerPasswordWithToken } from '@/actions/customer-actions';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("No reset token found in the URL. Please request a new link.");
      return;
    }
    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetCustomerPasswordWithToken(token, newPassword);
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
        });
      } else {
        setError(result.error || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected server error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
          <CardTitle className="text-3xl text-accent">Password Reset!</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Your password has been successfully changed.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6 pt-4 text-center">
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/login">
              Proceed to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
      <Card className="w-full max-w-md shadow-xl border-primary/15 rounded-xl bg-card">
        <CardHeader className="text-center pt-6 pb-4">
          <LockKeyhole className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-3xl text-accent">Set New Password</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">Create a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-6 pt-4">
            {!token ? (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Invalid Link</AlertTitle>
                    <AlertDescription>No password reset token was found. Please request a new password reset link from the login page.</AlertDescription>
                </Alert>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="Min. 6 characters"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Re-enter your new password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                     <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            )}
        </CardContent>
      </Card>
  );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
            <React.Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                <ResetPasswordForm />
            </React.Suspense>
        </div>
    )
}
