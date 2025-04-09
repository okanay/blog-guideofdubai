import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  successMessage?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = ({
  ref,
  className,
  label,
  isRequired,
  isError,
  isSuccess,
  errorMessage,
  successMessage,
  hint,
  startIcon,
  endIcon,
  containerClassName,
  id,
  ...props
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const status = isError ? "error" : isSuccess ? "success" : focused ? "focused" : "default"; // prettier-ignore
  const message = errorMessage || successMessage || hint; // prettier-ignore
  const messageType = isError ? "error" : isSuccess ? "success" : "hint"; // prettier-ignore

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        data-status={status}
        className="relative flex items-center rounded-md border border-zinc-300 transition-all data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100 data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100 data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100"
      >
        {startIcon && (
          <div className="absolute left-3 text-zinc-500">{startIcon}</div>
        )}

        <input
          {...props}
          id={inputId}
          ref={ref}
          className={twMerge(
            "w-full rounded-md bg-transparent px-3 py-2 outline-none",
            startIcon && "pl-9",
            endIcon && "pr-9",
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />

        {endIcon && (
          <div className="absolute right-3 text-zinc-500">{endIcon}</div>
        )}
      </div>

      {message && (
        <p
          data-message-type={messageType}
          className="text-xs data-[message-type=error]:text-red-500 data-[message-type=hint]:text-zinc-500 data-[message-type=success]:text-green-500"
        >
          {message}
        </p>
      )}
    </div>
  );
};

Input.displayName = "Blog-Input";
