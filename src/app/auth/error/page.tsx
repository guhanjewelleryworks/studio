// src/app/auth/error/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const router = useRouter();
    
    const [isSigningOut, setIsSigningOut] = React.useState(false);

    const getErrorMessage = () => {
        switch(error) {
            case 'Configuration':
                return 'There is a problem with the server configuration. This can happen if an account was deleted and you tried to sign in again with the same social provider.';
            case 'AccessDenied':
                return 'You do not have permission to sign in. Please contact support if you believe this is an error.';
            case 'Verification':
                // This can happen with email provider if the token is invalid
                return 'The sign-in link is no longer valid. It may have been used already or expired.';
            case 'CredentialsSignin':
                return 'Login failed. Please check your email and password and try again.';
            default:
                return 'An unexpected error occurred during sign-in. This could be due to a temporary issue or a problem with your account data.';
        }
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut({ redirect: false }); // Sign out without redirecting
        router.push('/login'); // Manually redirect to login page
    };

    return (
         <Card className="w-full max-w-lg shadow-xl border-destructive/30 rounded-xl bg-card">
            <CardHeader className="text-center pt-8 pb-4">
                <AlertTriangle className="h-14 w-14 mx-auto text-destructive mb-3" />
                <CardTitle className="text-3xl text-accent">Authentication Error</CardTitle>
                <CardDescription className="text-muted-foreground mt-2 text-base min-h-[40px]">
                    {getErrorMessage()}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4 space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                    To resolve this, you can try signing out completely and then attempting to log in again.
                </p>
                <Button onClick={handleSignOut} size="lg" className="w-full" variant="destructive" disabled={isSigningOut}>
                    {isSigningOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                    {isSigningOut ? 'Signing Out...' : 'Sign Out & Try Again'}
                </Button>
                <Button asChild variant="link" className="w-full">
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export default function AuthErrorPage() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-10 bg-gradient-to-br from-secondary/30 to-background">
            <React.Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                <AuthErrorContent />
            </React.Suspense>
        </div>
    );
}
