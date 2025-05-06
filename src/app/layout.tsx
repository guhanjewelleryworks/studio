import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // This was causing an error, ensure it's installed or remove if not used
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import '@/lib/firebase/firebase'; // Initialize Firebase

const geistSans = GeistSans; 
// const geistMono = GeistMono; 

export const metadata: Metadata = {
  title: 'Goldsmith Connect',
  description: 'Find local artisans and craft your dream jewelry.',
  icons: {
    // Consider adding a favicon later if possible
    // icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          geistSans.variable,
          // geistMono.variable // Remove if GeistMono is not used or installed
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
