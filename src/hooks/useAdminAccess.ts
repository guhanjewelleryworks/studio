// src/hooks/useAdminAccess.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Permission } from '@/types/goldsmith';
import { useToast } from './use-toast';

export function useAdminAccess(requiredPermission: Permission) {
  const [isAccessLoading, setIsAccessLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
      if (adminLoggedIn !== 'true') {
        router.replace('/admin/login');
        return;
      }
      
      const storedPermsString = localStorage.getItem('adminPermissions');
      if (storedPermsString) {
        const permissions: Permission[] = JSON.parse(storedPermsString);
        const canAccess = permissions.includes(requiredPermission);
        setHasPermission(canAccess);
        if (!canAccess) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to view this page.",
            variant: "destructive",
          });
          // Don't redirect here, let the page component handle showing the access denied message.
        }
      } else {
        setHasPermission(false);
         toast({
            title: "Permissions Error",
            description: "Could not verify your permissions. Please log in again.",
            variant: "destructive",
          });
        router.replace('/admin/login');
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setHasPermission(false);
      router.replace('/admin/login');
    } finally {
      setIsAccessLoading(false);
    }
  }, [requiredPermission, router, toast]);

  return { hasPermission, isAccessLoading };
}