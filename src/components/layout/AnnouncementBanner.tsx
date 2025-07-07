'use client';

import { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnnouncementBannerProps {
  text: string;
}

export function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full bg-primary/10 text-primary-foreground py-2 px-4 shadow-md">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-center gap-3">
        <Megaphone className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm font-medium text-foreground text-center flex-grow">
          {text}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-foreground/70 hover:text-foreground hover:bg-black/10"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss announcement</span>
        </Button>
      </div>
    </div>
  );
}
