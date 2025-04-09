// app/components/editor/create/ui/textarea.tsx
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  isRequired?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      containerClassName,
      labelClassName,
      className,
      isRequired = false,
      maxLength,
      showCharCount = false,
      value = "",
      ...props
    },
    ref,
  ) => {
    // Hata durumunda border rengi değişecek
    const textareaStyles = twMerge(
      "w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2",
      error
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-zinc-300 focus:border-primary-400 focus:ring-primary-100",
      className,
    );

    // Karakter sayımı
    const charCount = typeof value === "string" ? value.length : 0;
    const showCount = showCharCount || maxLength !== undefined;

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

        <textarea
          ref={ref}
          className={textareaStyles}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={helperText ? `${props.id}-description` : undefined}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        {/* Hata mesajı veya yardım metni */}
        <div className="mt-1 flex justify-between">
          <div>
            {error ? (
              <p className="text-xs text-red-500" id={`${props.id}-error`}>
                {error}
              </p>
            ) : helperText ? (
              <p
                className="text-xs text-zinc-500"
                id={`${props.id}-description`}
              >
                {helperText}
              </p>
            ) : null}
          </div>

          {/* Karakter sayımı */}
          {showCount && (
            <div className="text-xs text-zinc-500">
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
