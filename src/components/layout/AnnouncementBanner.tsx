'use client';

import { Megaphone } from 'lucide-react';

interface AnnouncementBannerProps {
  text: string;
}

export function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  // The logic to show/hide this banner is now controlled entirely from the parent component (the main page),
  // based on the admin settings. Since the 'X' button is removed, users cannot dismiss it.
  return (
    <div className="relative w-full bg-primary text-primary-foreground py-2 px-4 shadow-md">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-center gap-3">
        <Megaphone className="h-5 w-5 text-primary-foreground shrink-0" />
        <p className="text-sm font-medium text-primary-foreground text-center flex-grow">
          {text}
        </p>
      </div>
    </div>
  );
}
