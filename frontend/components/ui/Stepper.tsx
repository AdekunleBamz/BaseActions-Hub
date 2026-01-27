"use client";

import { useState, useEffect, useCallback } from "react";

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "dots" | "numbers";
  showLabels?: boolean;
  allowClickNavigation?: boolean;
  className?: string;
}

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
  error?: boolean;
}

type StepStatus = "completed" | "current" | "upcoming" | "error";

/**
 * Stepper - Progress indicator for multi-step flows
 */
export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  variant = "default",
  showLabels = true,
  allowClickNavigation = false,
  className = "",
}: StepperProps) {
  const getStepStatus = (index: number): StepStatus => {
    if (steps[index].error) return "error";
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  const handleStepClick = (index: number) => {
    if (allowClickNavigation && onStepClick) {
      // Only allow clicking completed or current steps
      if (index <= currentStep) {
        onStepClick(index);
      }
    }
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`
        flex ${isHorizontal ? "flex-row items-start" : "flex-col"}
        ${className}
      `}
      role="list"
      aria-label="Progress steps"
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const isClickable = allowClickNavigation && index <= currentStep;

        return (
          <div
            key={step.id}
            className={`
              flex ${isHorizontal ? "flex-col items-center flex-1" : "flex-row items-start"}
              ${!isLast && !isHorizontal ? "pb-8" : ""}
            `}
          >
            {/* Step indicator and connector */}
            <div
              className={`
                flex ${isHorizontal ? "flex-row items-center w-full" : "flex-col items-center"}
              `}
            >
              {/* Step indicator */}
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  relative z-10 flex items-center justify-center
                  ${variant === "dots" ? "w-4 h-4" : "w-10 h-10"}
                  rounded-full transition-all duration-300
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                  ${getStepIndicatorStyles(status, variant)}
                `}
                aria-current={status === "current" ? "step" : undefined}
                role="listitem"
                aria-label={`Step ${index + 1}: ${step.label}${step.optional ? " (optional)" : ""}`}
              >
                {variant === "dots" ? null : variant === "numbers" ? (
                  status === "completed" ? (
                    <CheckIcon />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )
                ) : status === "completed" ? (
                  <CheckIcon />
                ) : status === "error" ? (
                  <ErrorIcon />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}

                {/* Pulse animation for current step */}
                {status === "current" && (
                  <span
                    className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`
                    ${isHorizontal ? "flex-1 h-0.5 mx-2" : "w-0.5 flex-1 my-2 ml-5"}
                    transition-colors duration-500
                    ${status === "completed" ? "bg-blue-500" : "bg-gray-700"}
                  `}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Labels */}
            {showLabels && (
              <div
                className={`
                  ${isHorizontal ? "mt-3 text-center" : "ml-4 flex-1"}
                `}
              >
                <p
                  className={`
                    font-medium text-sm
                    ${status === "current" ? "text-blue-400" : ""}
                    ${status === "completed" ? "text-white" : ""}
                    ${status === "upcoming" ? "text-gray-500" : ""}
                    ${status === "error" ? "text-red-400" : ""}
                  `}
                >
                  {step.label}
                  {step.optional && (
                    <span className="ml-1 text-gray-500 font-normal">(optional)</span>
                  )}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getStepIndicatorStyles(status: StepStatus, variant: string): string {
  const base = "border-2";

  if (variant === "dots") {
    switch (status) {
      case "completed":
        return "bg-blue-500";
      case "current":
        return "bg-blue-500 ring-4 ring-blue-500/30";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-700";
    }
  }

  switch (status) {
    case "completed":
      return `${base} border-blue-500 bg-blue-500 text-white`;
    case "current":
      return `${base} border-blue-500 bg-blue-500/20 text-blue-400`;
    case "error":
      return `${base} border-red-500 bg-red-500/20 text-red-400`;
    default:
      return `${base} border-gray-600 bg-gray-800 text-gray-500`;
  }
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/**
 * useStepper - Hook for managing stepper state
 */
export function useStepper(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const markCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
  }, [initialStep]);

  return {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    markCompleted,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    completedSteps: Array.from(completedSteps),
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
}

/**
 * StepperContent - Wrapper for step content with animations
 */
interface StepperContentProps {
  currentStep: number;
  children: React.ReactNode[];
  className?: string;
}

export function StepperContent({
  currentStep,
  children,
  className = "",
}: StepperContentProps) {
  const [displayStep, setDisplayStep] = useState(currentStep);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    if (currentStep !== displayStep) {
      setDirection(currentStep > displayStep ? "right" : "left");
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayStep(currentStep);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep, displayStep]);

  const translateClass = isAnimating
    ? direction === "right"
      ? "-translate-x-4 opacity-0"
      : "translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`
          transition-all duration-300 ease-out
          ${translateClass}
        `}
      >
        {children[displayStep]}
      </div>
    </div>
  );
}
