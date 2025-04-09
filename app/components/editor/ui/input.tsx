// app/components/editor/create/ui/input.tsx
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      containerClassName,
      labelClassName,
      className,
      startIcon,
      endIcon,
      isRequired = false,
      ...props
    },
    ref,
  ) => {
    // Hata durumunda border rengi değişecek
    const inputStyles = twMerge(
      "w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2",
      error
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-zinc-300 focus:border-primary-400 focus:ring-primary-100",
      startIcon && "pl-9",
      endIcon && "pr-9",
      className,
    );

    return (
      <div className={twMerge("mb-4", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={twMerge(
              "mb-1.5 block text-sm font-medium text-zinc-700",
              labelClassName,
            )}
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            className={inputStyles}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              helperText ? `${props.id}-description` : undefined
            }
            {...props}
          />

          {endIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
              {endIcon}
            </div>
          )}
        </div>

        {/* Hata mesajı veya yardım metni */}
        {error ? (
          <p className="mt-1 text-xs text-red-500" id={`${props.id}-error`}>
            {error}
          </p>
        ) : helperText ? (
          <p
            className="mt-1 text-xs text-zinc-500"
            id={`${props.id}-description`}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
