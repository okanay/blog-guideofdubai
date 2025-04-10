import { twMerge } from "tailwind-merge";

interface Props {
  ref: React.RefObject<HTMLInputElement>;
  id?: string;
  label?: string;
  description?: string;
  hint?: string;
  isRequired?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  name?: string;
  isError?: boolean;
  errorMessage?: string;
}

export const Toggle = ({
  ref,
  id,
  label = "",
  description = "",
  hint = "",
  isRequired = false,
  containerClassName,
  labelClassName,
  checked = false,
  onChange,
  onBlur,
  name,
  isError = false,
  errorMessage,
  ...props
}: Props) => {
  const inputId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  const handleToggle = () => {
    if (onChange) {
      onChange(!checked);
    }

    // onBlur'u da çağıralım ki React Hook Form validasyonu çalışsın
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      <div className="flex items-start gap-3">
        <div
          onClick={handleToggle}
          className="relative flex h-6 w-11 flex-shrink-0 cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={(e) => onChange && onChange(e.target.checked)}
            onBlur={onBlur}
            name={name}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <span
            className={twMerge(
              "absolute inset-0 rounded-full transition-colors duration-200",
              checked ? "bg-primary-500" : "bg-zinc-200",
            )}
          />
          <span
            className={twMerge(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
              checked && "translate-x-5",
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

      {(hint || isError) && (
        <div className="mt-1">
          {isError && errorMessage && (
            <p className="text-xs text-red-500">{errorMessage}</p>
          )}
          {hint && !isError && <p className="text-xs text-zinc-500">{hint}</p>}
        </div>
      )}
    </div>
  );
};

Toggle.displayName = "Blog-Toggle";
