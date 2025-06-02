
// src/components/orders/OrderStatusProgress.tsx
'use client';

import type { OrderRequestStatus } from '@/types/goldsmith';
import { CheckCircle, Circle, Loader2, XCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: OrderRequestStatus | 'visual_review' | 'visual_final_review'; // Added visual steps for mapping
  label: string;
  statuses: OrderRequestStatus[];
}

const steps: Step[] = [
  { id: 'new', label: 'Order Placed', statuses: ['new'] },
  { id: 'pending_goldsmith_review', label: 'Admin Review', statuses: ['pending_goldsmith_review'] },
  { id: 'in_progress', label: 'In Production', statuses: ['in_progress'] },
  { id: 'customer_review_requested', label: 'Goldsmith Review', statuses: ['customer_review_requested'] },
  { id: 'completed', label: 'Completed', statuses: ['completed'] },
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
    if (steps[i].statuses.includes(currentStatus)) {
      currentStepIndex = i;
      break;
    }
  }
  // If status is not directly mapped, infer based on typical flow (e.g. if it's 'in_progress', all previous steps are done)
  // This logic primarily relies on the `currentStepIndex` correctly identifying the current stage.

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0',
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' : '',
                    isActive ? 'bg-primary/20 border-primary text-primary animate-pulse' : '',
                    isFuture ? 'bg-muted border-border text-muted-foreground' : ''
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Circle className="w-3 h-3" /> // Placeholder for future steps
                  )}
                </div>
                <p
                  className={cn(
                    'mt-1.5 text-[0.65rem] leading-tight font-medium',
                    isCompleted || isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-500 ease-in-out',
                     // If current step is completed, or the next step is active/completed, then the line is primary
                    (isCompleted && index + 1 <= currentStepIndex) || (isActive && index +1 <= currentStepIndex)  ? 'bg-primary' : 'bg-border'
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
