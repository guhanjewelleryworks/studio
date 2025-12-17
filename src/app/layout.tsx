
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '@/components/auth/AuthProvider';
import { fetchPlatformSettings } from '@/actions/settings-actions';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';

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
  title: 'Goldsmiths Connect',
  description: 'Find local artisans and craft your dream jewelry.',
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchPlatformSettings();

  return (
    <html lang="en" className={cn("h-full antialiased", poppins.variable, playfairDisplay.variable, geistSans.variable)} suppressHydrationWarning={true}>
      <body className={cn('min-h-full font-body flex flex-col text-foreground')}>
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col bg-transparent z-0">
            {/* header + optional announcement — header is full-bleed but inner content constrained */}
            <div className="sticky top-0 z-50">
              <Header />
              {settings.isAnnouncementVisible && settings.announcementText && (
                <AnnouncementBanner text={settings.announcementText} />
              )}
            </div>

            {/* Main content — children are free to be full width or constrained as they see fit */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer — full-bleed background; inner content constrained inside Footer component */}
            <Footer />
          </div>

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
