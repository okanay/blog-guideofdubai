// app/components/editor/create/ui/select.tsx
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<"select">, "children"> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  isRequired?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      containerClassName,
      labelClassName,
      className,
      isRequired = false,
      options = [],
      placeholder,
      ...props
    },
    ref,
  ) => {
    // Hata durumunda border rengi değişecek
    const selectStyles = twMerge(
      "w-full appearance-none rounded-md border bg-white pl-3 pr-10 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2",
      error
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-zinc-300 focus:border-primary-400 focus:ring-primary-100",
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
          <select
            ref={ref}
            className={selectStyles}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              helperText ? `${props.id}-description` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
            <ChevronDown size={16} />
          </div>
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

Select.displayName = "Select";
