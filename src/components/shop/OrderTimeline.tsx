"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface OrderTimelineProps {
  financialStatus: string;
  fulfillmentStatus: string;
  processedAt: string;
  trackingUrl?: string;
}

interface TimelineStep {
  label: string;
  complete: boolean;
  date?: string;
}

export function OrderTimeline({
  financialStatus,
  fulfillmentStatus,
  processedAt,
  trackingUrl,
}: OrderTimelineProps) {
  const isPaid = financialStatus === "PAID";
  const isShipped =
    fulfillmentStatus === "PARTIALLY_FULFILLED" || !!trackingUrl;
  const isFulfilled = fulfillmentStatus === "FULFILLED";

  const formattedDate = new Date(processedAt).toLocaleDateString("es-UY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const steps: TimelineStep[] = [
    {
      label: "Pedido recibido",
      complete: true,
      date: formattedDate,
    },
    {
      label: "Pago confirmado",
      complete: isPaid,
    },
    {
      label: "En preparación",
      complete: isPaid && (fulfillmentStatus === "UNFULFILLED" || isShipped || isFulfilled),
    },
    {
      label: "Enviado",
      complete: isShipped || isFulfilled,
    },
    {
      label: "Entregado",
      complete: isFulfilled,
    },
  ];

  // Find the index of the last completed step (current step)
  let currentStepIndex = -1;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].complete) {
      currentStepIndex = i;
      break;
    }
  }

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const isCurrent = index === currentStepIndex;
        const isComplete = step.complete;
        const isLast = index === steps.length - 1;
        // Line between this step and the next
        const nextStepComplete = !isLast && steps[index + 1]?.complete;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="flex items-start gap-4"
          >
            {/* Circle + Line column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div className="relative flex items-center justify-center">
                {isCurrent && (
                  <span className="absolute inset-0 w-4 h-4 rounded-full bg-[#21645d]/20 animate-ping" />
                )}
                <div
                  className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isComplete
                      ? "bg-[#21645d]"
                      : "bg-white border-2 border-slate-300"
                  }`}
                >
                  {isComplete && (
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`w-0.5 h-8 transition-colors ${
                    nextStepComplete || (isComplete && steps[index + 1]?.complete)
                      ? "bg-[#21645d]"
                      : isComplete
                        ? "bg-[#21645d]/30"
                        : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-medium leading-4 ${
                  isComplete ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
              {step.date && isComplete && (
                <p className="text-xs text-slate-500 mt-1">{step.date}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
