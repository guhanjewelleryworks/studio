// src/app/maintenance/page.tsx
import { Hammer } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background text-center px-4">
      <Hammer className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-heading text-accent mb-2">
        Under Maintenance
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.
      </p>
    </div>
  );
}
