// src/components/orders/OrderStatusProgress.tsx
import * as React from 'react';
import type { OrderRequestStatus } from '@/types/goldsmith';
import { CheckCircle, Circle, Loader2, XCircle, Truck, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  statuses: OrderRequestStatus[]; 
  icon: React.ElementType;
}

// Updated steps to match user's desired flow and map new statuses
const steps: Step[] = [
  { id: 'enquiry_raised', label: 'Enquiry Raised', statuses: ['new'], icon: MessageSquare },
  { id: 'order_accepted', label: 'Order Accepted', statuses: ['pending_goldsmith_review'], icon: CheckCircle }, // Admin validates & moves to goldsmith for review
  { id: 'work_in_progress', label: 'Work in progress', statuses: ['in_progress', 'customer_review_requested', 'artwork_completed'], icon: Loader2 }, // Includes when artwork is finished by smith
  { id: 'out_for_delivery', label: 'Out for delivery', statuses: ['shipped'], icon: Truck },
  { id: 'order_delivered', label: 'Order delivered', statuses: ['completed'], icon: CheckCircle },
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

  let currentStepIndex = steps.findIndex(step => step.statuses.includes(currentStatus));

   // If status is 'new', it's "Enquiry Raised". If status is 'artwork_completed', it's part of "Work in Progress".
   // If 'shipped', it's "Out for Delivery".
   // This logic should correctly find the step index.

  if (currentStepIndex === -1) {
      // Fallback for any status not explicitly in the main flow steps but not 'cancelled'
      // For example, if an old status that's not in the new steps list appears
      console.warn(`[OrderStatusProgress] Unknown or unmapped status: ${currentStatus}. Defaulting to first step visually.`);
      currentStepIndex = 0; 
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
              <div className="flex flex-col items-center text-center w-[19%]"> {/* Adjusted width slightly for 5 items */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 mb-1',
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' : '',
                    isActive ? 'bg-primary/20 border-primary text-primary' : '',
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
                    'text-[0.65rem] sm:text-xs leading-tight font-medium line-clamp-2', // Ensure text can wrap if needed
                    isCompleted || isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-1.5 transition-colors duration-500 ease-in-out self-start mt-4', // Reduced mx for tighter packing
                    (isCompleted || (isActive && index < currentStepIndex)) ? 'bg-primary' : 'bg-border' 
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
