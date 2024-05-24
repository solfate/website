"use client";

import clsx from "clsx";
import { Fragment, memo } from "react";

export const OnboardingStepCounter = memo(
  ({
    totalSteps,
    currentStep,
  }: {
    totalSteps: number;
    currentStep: number;
  }) => {
    const steps = new Array(totalSteps).fill("");

    return (
      <div className="flex items-center justify-center gap-1">
        {steps.map((_item, id) => {
          return (
            <Fragment key={id}>
              <div
                className={clsx(
                  "rounded-full cursor-default border flex items-center justify-center text-center p-3 flex-shrink-0 w-10 h-10",
                  currentStep > id
                    ? "bg-red-100 border-red-200"
                    : "bg-white border-gray-200",
                )}
              >
                {id + 1}
              </div>

              {id + 1 < steps.length && (
                <hr className="w-6 border-t-0 border-b border-gray-300" />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  },
);
