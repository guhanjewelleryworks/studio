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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'min-h-full font-sans antialiased flex flex-col', // Ensure body is flex column and takes full height
          geistSans.variable,
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background"> {/* This div should encompass Header, main, and Footer */}
          <Header />
          <main className="flex-1">{children}</main> {/* flex-1 allows main to grow and push footer down */}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
