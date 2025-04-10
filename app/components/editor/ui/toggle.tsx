import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ToggleProps {
  id?: string;
  label?: string;
  description?: string;
  hint?: string;
  isRequired?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  state?: boolean;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Toggle = ({
  id,
  label = "",
  description = "",
  hint = "",
  isRequired = false,
  containerClassName,
  labelClassName,
  state,
  setState,
  ...props
}: ToggleProps) => {
  const inputId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  const toggle = () => {
    setState(!state);
  };

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      <div className="flex items-start gap-3">
        <div
          onClick={toggle}
          className="relative flex h-6 w-11 flex-shrink-0 cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id={inputId}
            checked={state}
            className="peer sr-only"
            {...props}
          />
          <span
            className={twMerge(
              "absolute inset-0 rounded-full transition-colors duration-200",
              state ? "bg-primary-500" : "bg-zinc-200",
            )}
          />
          <span
            className={twMerge(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
              state && "translate-x-5",
            )}
          />
        </div>

        {(label || description) && (
          <label
            htmlFor={inputId}
            className={twMerge("flex cursor-pointer flex-col", labelClassName)}
          >
            {label && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-zinc-700">
                  {label}
                  {isRequired && <span className="ml-1 text-red-500">*</span>}
                </span>
              </div>
            )}
            {description && (
              <span className="text-xs text-zinc-500">{description}</span>
            )}
          </label>
        )}
      </div>
    </div>
  );
};

Toggle.displayName = "Blog-Toggle";
