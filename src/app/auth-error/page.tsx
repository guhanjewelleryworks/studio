'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
      <Card className="w-full max-w-lg shadow-xl border-destructive/20 rounded-xl bg-card">
        <CardHeader className="text-center pt-8 pb-4">
          <AlertTriangle className="h-14 w-14 mx-auto text-destructive mb-3" />
          <CardTitle className="text-3xl text-accent">Account Linking Required</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">
            This email address requires a password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-2 text-center">
          <p className="text-foreground/85 text-base mb-6">
            This email is already registered. To link your Google account, please sign in with your password first.
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
