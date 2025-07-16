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
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchPlatformSettings();
  
  // New Maintenance Mode Logic
  const cookieStore = cookies();
  const maintenanceCookie = cookieStore.get('maintenance_mode');

  if (settings.isMaintenanceModeEnabled && !maintenanceCookie) {
    // Set the cookie if maintenance mode is on and the cookie isn't set.
    // The middleware will use this cookie on the *next* request to redirect.
    cookies().set('maintenance_mode', 'true', { path: '/' });
    // For the current request, perform the redirect directly from the server.
    redirect('/maintenance');
  } else if (!settings.isMaintenanceModeEnabled && maintenanceCookie) {
    // Clear the cookie if maintenance mode is off and the cookie is present.
    cookies().delete('maintenance_mode');
  }


  return (
    <html lang="en" className={cn("h-full antialiased", poppins.variable, playfairDisplay.variable, geistSans.variable)}>
      <body
        className={cn(
          'min-h-full font-body flex flex-col text-foreground'
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col bg-transparent z-0">
            <div className="sticky top-0 z-50">
              <Header />
              {settings.isAnnouncementVisible && settings.announcementText && (
                <AnnouncementBanner text={settings.announcementText} />
              )}
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
