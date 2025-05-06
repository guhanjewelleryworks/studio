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
          'min-h-full font-sans flex flex-col text-foreground', // Removed bg-background, as body has bg image now
          geistSans.variable
        )}
      >
        {/* This div acts as the content container on top of the ::before pseudo-element overlay */}
        <div className="relative flex min-h-dvh flex-col bg-transparent z-0"> 
          <Header />
          <main className="flex-1 pt-0">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
