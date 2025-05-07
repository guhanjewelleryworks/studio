import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Poppins } from 'next/font/google'; // Import Poppins
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import '@/lib/firebase/firebase'; // Initialize Firebase

const geistSans = GeistSans;

// Initialize Poppins font with desired weights and subsets
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // Include ExtraBold (800)
  variable: '--font-poppins', // CSS variable name
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
    <html lang="en" className={cn("h-full antialiased", poppins.variable, geistSans.variable)}>
      <body
        className={cn(
          'min-h-full font-sans flex flex-col text-foreground'
          // Removed geistSans.variable from here as it's on html tag
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
