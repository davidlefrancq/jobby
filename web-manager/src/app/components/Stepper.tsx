import { IStep, StepStatus } from "@/types/IStep";
import React from "react";

interface StepperProps {
  steps: IStep[];
}

export const Stepper = ({ steps }: StepperProps) => {
  const getStepIcon = (status: StepStatus, index: number) => {
    switch (status) {
      case "success":
        return (
          <svg className="shrink-0 size-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "error":
        return (
          <svg className="shrink-0 size-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M18 6 6 18 M6 6l12 12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "processing":
        return (
          <span
            className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full"
            role="status"
            aria-label="Loading"
          />
        );
      default:
        return <span>{index + 1}</span>;
    }
  };

  return (
    <div className="w-full">

      <ul className="relative flex flex-row gap-x-2 max-w-lg mx-auto">
        {/* Stepper items */}
        {steps.map((step, index) => (
          <li key={index} className="shrink basis-0 flex-1 group">
            <div className="min-w-12 min-h-7 w-full inline-flex items-center text-xs align-middle">
              {/* Stepper index */}
              <span className={`
                size-7
                flex
                justify-center
                items-center
                shrink-0
                font-medium
                rounded-full
                ${step.status === "success" && "bg-green-700 text-white"}
                ${step.status === "error" && "bg-red-500 text-white"}
                ${step.status === "processing" && "bg-blue-600 text-white"}
                ${step.status === "active" && "bg-blue-600 text-white"}
                ${step.status === "default" && "bg-gray-300 text-gray-800 dark:bg-neutral-700 dark:text-white"}
              `}>
                {getStepIcon(step.status, index)}
              </span>
              {/* Stepper label */}
              <span className="ms-2 text-sm font-medium text-gray-800 dark:text-white hidden lg:inline-block">
                {step.label}
              </span>
              {/* Line between items */}
              <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-neutral-700"></div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};
