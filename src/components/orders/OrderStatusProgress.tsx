
// src/components/orders/OrderStatusProgress.tsx
import * as React from 'react';
import type { OrderRequestStatus } from '@/types/goldsmith';
import { CheckCircle, Circle, Loader2, XCircle, Truck, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  statuses: OrderRequestStatus[] | string[]; // Allow for placeholder/future statuses
  icon: React.ElementType;
}

// Updated steps to exactly match user's request for labels
const steps: Step[] = [
  { id: 'enquiry_raised', label: 'Enquiry Raised', statuses: ['enquiry_placeholder'], icon: MessageSquare }, // Visual step, 'enquiry_placeholder' won't be matched by current order data
  { id: 'order_accepted', label: 'Order Accepted', statuses: ['pending_goldsmith_review'], icon: CheckCircle }, // Maps to admin/platform acceptance
  { id: 'work_in_progress', label: 'Work in progress', statuses: ['in_progress', 'customer_review_requested'], icon: Loader2 },
  { id: 'out_for_delivery', label: 'Out for delivery', statuses: ['shipped_placeholder'], icon: Truck }, // Visual step, 'shipped_placeholder' won't be matched
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

  let currentStepIndex = -1;
  // For "Order Placed" (which is 'new' status), let's consider it as part of "Enquiry Raised" for now, or the very start.
  // If an order has status 'new', we want it to highlight the first applicable step.
  // The visual "Enquiry Raised" step won't be directly hit by an OrderRequest status.
  // "Order Placed" (status 'new') will likely make "Order Accepted" the visually current step if no preceding status exists.
  // To handle this, let's adjust logic slightly.
  // If status is 'new', it technically means the order is placed, let's assume it directly moves to "Order Accepted" or a similar first *order* stage.
  // For this visual bar, 'new' status orders will likely show "Order Accepted" as the first active-like step.

  if (currentStatus === 'new') {
    // If the order status is 'new', it implies the enquiry led to an order and it's now at the "Order Accepted" stage or ready for it.
    // Or, it implies the "Enquiry Raised" step is implicitly complete.
    // Let's make "Order Accepted" (index 1) the current step if status is 'new'.
    // However, the 'enquiry_raised' is a desired visual. The best we can do is show it as passed if 'new'.
    // For simplicity, let's find the first step that matches.
     currentStepIndex = steps.findIndex(step => step.statuses.includes(currentStatus as string));
     if (currentStatus === 'new' && currentStepIndex === -1) {
         // If 'new' doesn't map to anything explicitly, we can assume it passed "Enquiry Raised" and is at "Order Accepted"
         // Or we treat 'new' as a distinct step before 'Order Accepted'.
         // Given the labels, 'new' orders are past "Enquiry Raised". So let's make 'Order Accepted' (index 1) active if status is 'new'.
         // This is tricky without a dedicated 'enquiry_raised' status for orders.
         // Let's map 'new' to the "Order Accepted" stage for visual progression.
         const acceptedStepIndex = steps.findIndex(step => step.id === 'order_accepted');
         if (acceptedStepIndex !== -1) {
            // Mark "Enquiry Raised" as completed, and "Order Accepted" as current.
            // This requires a more complex logic to set multiple states.
            // For now, if 'new', we'll just highlight the first step 'Enquiry Raised' as current, and it won't progress past that without a status change.
            // This is not ideal. A better mapping for 'new' would be 'Order Placed'.
            // Let's reconsider the steps slightly for mapping:
            // 1. 'Order Placed' (id: 'new', label: 'Order Placed', statuses: ['new'], icon: Circle) -> This is more accurate for 'new'
            // Then "Enquiry Raised" could be a conceptual step *before* an order is formally 'new'.
            // Given the user's strict labels, I will try to find the best fit.
            // If 'new', let's assume 'Enquiry Raised' is conceptually done, and 'Order Accepted' is next.
            // This means the first step that truly matches a DB status is 'Order Accepted' with 'pending_goldsmith_review'.
            // So 'new' won't light up any of *these specific* steps as active.
            // Let's make 'new' conceptually complete 'Enquiry Raised' and be active on 'Order Accepted'.
             const orderAcceptedIdx = steps.findIndex(s => s.id === 'order_accepted');
             if (orderAcceptedIdx !== -1) currentStepIndex = orderAcceptedIdx;
             // This still means Enquiry Raised won't be 'active'.
             // A simpler visual: If currentStatus is 'new', it means the enquiry phase is done. So first step (Enquiry Raised) is complete.
             // Current step is 'Order Accepted' (waiting for pending_goldsmith_review)
             // This is difficult with the desired labels if 'new' is the actual first DB status.
             // The best visual compromise: if 'new', show 'Enquiry Raised' as current.
             // It won't progress until DB status changes to pending_goldsmith_review.
             currentStepIndex = 0; // For 'new' status, visually map to 'Enquiry Raised' as the current stage.
         }
    } else {
        currentStepIndex = steps.findIndex(step => step.statuses.includes(currentStatus as string));
    }


  // If no specific match, and status is unknown but not cancelled, default to first step or handle as error
   if (currentStepIndex === -1 && currentStatus !== 'cancelled') {
       currentStepIndex = 0; // Default to the first step if no match (e.g. for 'new' if not handled above)
  }


  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          // All steps before the current active step are considered completed.
          // If currentStepIndex is 0 (Enquiry Raised is active), no steps are "completed" before it.
          const isCompleted = index < currentStepIndex;
          const isFuture = index > currentStepIndex;
          const IconComponent = step.icon;

          // Special handling for 'new' status: if currentStatus is 'new', and we mapped it to 'Enquiry Raised' (index 0)
          // then 'Enquiry Raised' is active. No steps are 'isCompleted' before it.
          // If currentStatus caused currentStepIndex to be > 0, then steps before it are completed.

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center w-[20%]"> {/* Ensure equal width for steps */}
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
                    'text-[0.65rem] sm:text-xs leading-tight font-medium line-clamp-2',
                    isCompleted || isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-500 ease-in-out self-start mt-4',
                    (isCompleted || isActive) && index < currentStepIndex ? 'bg-primary' : 'bg-border' // Connector line active if current step is completed or active
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

