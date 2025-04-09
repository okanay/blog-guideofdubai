// app/components/editor/create/ui/checkbox.tsx
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      containerClassName,
      labelClassName,
      className,
      ...props
    },
    ref,
  ) => {
    // Checkbox stilini ayarla
    const checkboxStyles = twMerge(
      "h-4 w-4 rounded border-zinc-300 text-primary-500 focus:ring-primary-200",
      error && "border-red-300",
      className,
    );

    return (
      <div className={twMerge("mb-4 flex items-start", containerClassName)}>
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            ref={ref}
            className={checkboxStyles}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              helperText ? `${props.id}-description` : undefined
            }
            {...props}
          />
        </div>
        <div className="ml-2">
          <label
            htmlFor={props.id}
            className={twMerge(
              "text-sm font-medium text-zinc-700",
              error && "text-red-500",
              labelClassName,
            )}
          >
            {label}
          </label>

          {/* Hata mesajı veya yardım metni */}
          {error ? (
            <p className="text-xs text-red-500" id={`${props.id}-error`}>
              {error}
            </p>
          ) : helperText ? (
            <p className="text-xs text-zinc-500" id={`${props.id}-description`}>
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
