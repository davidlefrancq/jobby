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
      {/* Stepper Header */}
      <ul className="flex flex-wrap justify-between gap-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center gap-x-2 shrink basis-0 flex-1 group ${step.status}`}
          >
            <span className="min-w-7 min-h-7 inline-flex items-center text-xs align-middle">
              <span
                className={`
                  size-7 flex justify-center items-center shrink-0 rounded-full font-medium
                  ${
                    step.status === "active" || step.status === "processing"
                      ? "bg-blue-600 text-white"
                      : step.status === "success"
                      ? "bg-teal-500 text-white"
                      : step.status === "error"
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-800 dark:bg-neutral-700 dark:text-white"
                  }
                `}
              >
                {getStepIcon(step.status, index)}
              </span>
              <span className="ms-2 text-sm font-medium text-gray-800 dark:text-white">
                {step.label}
              </span>
            </span>
            {index < steps.length - 1 && (
              <div className="w-full h-px flex-1 bg-gray-200 dark:bg-neutral-700"></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
