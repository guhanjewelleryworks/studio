
// src/components/orders/OrderStatusProgress.tsx
'use client';

import * as React from 'react';
import type { OrderRequestStatus } from '@/types/goldsmith';
import { CheckCircle, Circle, Loader2, XCircle, Truck } from 'lucide-react'; // Added Truck icon
import { cn } from '@/lib/utils';

interface Step {
  id: string; // Allow for visual-only step IDs
  label: string;
  statuses: OrderRequestStatus[] | string[]; // Allow for placeholder statuses
  icon: React.ElementType;
}

// Updated steps to match user's request more closely
const steps: Step[] = [
  { id: 'new', label: 'Order Placed', statuses: ['new'], icon: Circle },
  { id: 'pending_goldsmith_review', label: 'Order Accepted', statuses: ['pending_goldsmith_review'], icon: CheckCircle }, // Tentative mapping
  { id: 'in_progress', label: 'Work in Progress', statuses: ['in_progress', 'customer_review_requested'], icon: Loader2 },
  { id: 'visual_shipping', label: 'Out for Delivery', statuses: ['shipped_placeholder'], icon: Truck }, // Visual step, 'shipped_placeholder' won't be matched by current data
  { id: 'completed', label: 'Order Delivered', statuses: ['completed'], icon: CheckCircle },
];

interface OrderStatusProgressProps {
  currentStatus: OrderRequestStatus;
}

export const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({ currentStatus }) => {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center p-3 my-2 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
        <XCircle className="w-5 h-5 mr-2" />
        Order Cancelled
      </div>
    );
  }

  let currentStepIndex = -1;
  for (let i = 0; i < steps.length; i++) {
    // Check if currentStatus is one of the statuses for this step
    if (steps[i].statuses.includes(currentStatus as string)) { 
      currentStepIndex = i;
      break;
    }
  }
  // If no specific match, and status is unknown but not cancelled, default to first step or handle as error
   if (currentStepIndex === -1 && currentStatus !== 'cancelled') {
    // Default to a state where it's at least "Order Placed" if it's a known "new" status
    if (currentStatus === 'new') currentStepIndex = 0;
    // Else, it implies an unknown status for the progress bar logic
  }


  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isFuture = index > currentStepIndex;
          const IconComponent = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center w-[20%]"> {/* Ensure equal width for steps */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 mb-1', // Added mb-1
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' : '',
                    isActive ? 'bg-primary/20 border-primary text-primary' : '', // Removed animate-pulse for active, icon will spin
                    isFuture ? 'bg-muted border-border text-muted-foreground' : ''
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive && IconComponent === Loader2 ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <IconComponent className={cn("w-4 h-4", isActive && IconComponent !== Loader2 ? "text-primary" : "")} />
                  )}
                </div>
                <p
                  className={cn(
                    'text-[0.65rem] sm:text-xs leading-tight font-medium line-clamp-2', // Added line-clamp
                    isCompleted || isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-500 ease-in-out self-start mt-4', // Align progress line with icon center
                    (isCompleted && index < currentStepIndex) ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
