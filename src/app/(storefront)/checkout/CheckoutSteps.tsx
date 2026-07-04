"use client";

import { forwardRef } from "react";
import { Truck, CreditCard, CheckCircle } from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: typeof Truck;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id <= currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted
                    ? "bg-brand-gold text-white"
                    : isActive
                    ? "bg-brand-gold text-white"
                    : "bg-gray-200 text-gray-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? "text-brand-charcoal" : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  isCompleted ? "bg-brand-gold" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}