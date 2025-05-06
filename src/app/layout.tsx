import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import '@/lib/firebase/firebase'; // Initialize Firebase

const geistSans = GeistSans;

export const metadata: Metadata = {
  title: 'Goldsmith Connect',
  description: 'Find local artisans and craft your dream jewelry.',
   // Basic favicon setup - ensure favicon.ico is in public folder
  icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={cn(
          'min-h-full font-sans flex flex-col bg-background text-foreground',
          geistSans.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1 pt-0">{children}</main> {/* Removed top padding */}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
