import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
// import { FloatingContactButton } from '@/components/layout/FloatingContactButton'; // Added import
import '@/lib/firebase/firebase'; // Initialize Firebase

const geistSans = GeistSans;

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins', 
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
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
    <html lang="en" className={cn("h-full antialiased", poppins.variable, playfairDisplay.variable, geistSans.variable)}>
      <body
        className={cn(
          'min-h-full font-body flex flex-col text-foreground'
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-transparent z-0">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingContactButton /> {/* Added component */}
        <Toaster />
      </body>
    </html>
  );
}
