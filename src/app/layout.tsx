import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Poppins, Open_Sans } from 'next/font/google'; // Import Poppins and Open_Sans
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import '@/lib/firebase/firebase'; // Initialize Firebase

const geistSans = GeistSans;

// Initialize Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins', // CSS variable name
});

// Initialize Open Sans font
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans', // CSS variable name
});

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
    <html lang="en" className={cn("h-full antialiased", poppins.variable, openSans.variable, geistSans.variable)}>
      <body
        className={cn(
          'min-h-full font-sans flex flex-col text-foreground' // font-sans will now default to Open Sans via tailwind.config
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-transparent z-0">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
