// src/app/verify-email/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { verifyEmail } from '@/actions/customer-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationStatus, setVerificationStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Verifying your email, please wait...');

  React.useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Verification token not found. Please check your link.');
      return;
    }

    const doVerification = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setVerificationStatus('success');
        setMessage(result.message);
      } else {
        setVerificationStatus('error');
        setMessage(result.message);
      }
    };

    doVerification();
  }, [token]);

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/10 rounded-xl bg-card">
      <CardHeader className="text-center pt-8 pb-4">
        {verificationStatus === 'loading' && <Loader2 className="h-14 w-14 mx-auto text-primary mb-3 animate-spin" />}
        {verificationStatus === 'success' && <CheckCircle className="h-14 w-14 mx-auto text-green-500 mb-3" />}
        {verificationStatus === 'error' && <AlertTriangle className="h-14 w-14 mx-auto text-destructive mb-3" />}
        
        <CardTitle className="text-3xl text-accent">
          {verificationStatus === 'loading' && 'Verifying...'}
          {verificationStatus === 'success' && 'Email Verified!'}
          {verificationStatus === 'error' && 'Verification Failed'}
        </CardTitle>
        
        <CardDescription className="text-muted-foreground mt-2 text-base min-h-[40px]">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-4">
        {verificationStatus !== 'loading' && (
          <Button asChild size="lg" className="w-full shadow-md rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/login">Proceed to Login</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


export default function VerifyEmailPage() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
            <React.Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                <VerificationContent />
            </React.Suspense>
        </div>
    );
}
