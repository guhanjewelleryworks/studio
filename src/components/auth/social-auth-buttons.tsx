// src/components/auth/social-auth-buttons.tsx
'use client';

import { Button } from '@/components/ui/button';

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

// Inline SVG for Facebook Icon
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89H8.078V12.376h2.36V10.47c0-2.336 1.393-3.632 3.526-3.632.997 0 1.855.074 2.104.107v2.213H14.89c-1.142 0-1.363.542-1.363 1.333v1.885h2.473l-.32 2.513H13.526v7.008C18.343 21.128 22 16.991 22 12z"></path>
    </svg>
);


interface SocialAuthButtonsProps {
  mode: 'login' | 'signup';
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const handleGoogleAuth = () => {
    // TODO: Implement Google Sign-In/Sign-Up with Firebase
    console.log(`Attempting Google ${mode}`);
    alert(`Google ${mode} not yet implemented.`);
  };

  const handleFacebookAuth = () => {
    // TODO: Implement Facebook Sign-In/Sign-Up with Firebase
    console.log(`Attempting Facebook ${mode}`);
    alert(`Facebook ${mode} not yet implemented.`);
  };

  const buttonTextPrefix = mode === 'login' ? 'Login' : 'Sign up';

  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
        <GoogleIcon />
        {buttonTextPrefix} with Google
      </Button>
      <Button variant="outline" className="w-full" onClick={handleFacebookAuth}>
        <FacebookIcon />
        {buttonTextPrefix} with Facebook
      </Button>
    </div>
  );
}
