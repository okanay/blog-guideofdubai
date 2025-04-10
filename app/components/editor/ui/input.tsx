import { useState, useRef, useEffect } from "react";
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
  maxLength?: number;
  showCharCount?: boolean;
  enforceMaxLength?: boolean;
}

export const Input = ({
  ref,
  className,
  label,
  isRequired = false,
  isError = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  hint,
  startIcon,
  endIcon,
  containerClassName,
  id,
  value,
  defaultValue,
  onChange,
  maxLength,
  showCharCount = false,
  enforceMaxLength = true,
  ...props
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const status = isError ? "error" : isSuccess ? "success" : focused ? "focused" : "default"; // prettier-ignore
  const message = errorMessage || successMessage || hint; // prettier-ignore
  const messageType = isError ? "error" : isSuccess ? "success" : "hint"; // prettier-ignore

  // Karakter sayısını göstermek için kontrol
  const showCount = showCharCount || maxLength !== undefined;
  const isLimitExceeded = maxLength !== undefined && charCount > maxLength;

  // Karakter sayısını güncelle
  const updateCharCount = () => {
    if (!inputRef.current) return;

    const length = inputRef.current.value.length;
    setCharCount(length);
  };

  // İlk yükleme veya değer değişikliğinde karakter sayısını güncelle
  useEffect(() => {
    // Component mount olduğunda karakter sayısını güncelle
    updateCharCount();

    // eğer controlled component ise (value prop'u varsa),
    // value değiştiğinde karakter sayısını güncelle
    if (value !== undefined) {
      const length = String(value).length;
      setCharCount(length);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Eğer limit zorunluysa ve limit aşılıyorsa, yazıyı limitle sınırla
    if (
      enforceMaxLength &&
      maxLength !== undefined &&
      newValue.length > maxLength
    ) {
      // Controlled component ise event'i düzenle
      if (value !== undefined) {
        // Değeri maxLength'e göre kes
        const truncatedValue = newValue.substring(0, maxLength);

        // Input değerini direkt değiştir (DOM manipülasyonu)
        if (inputRef.current) {
          inputRef.current.value = truncatedValue;
        }

        // Yapay event oluştur
        const modifiedEvent = {
          ...e,
          target: {
            ...e.target,
            value: truncatedValue,
          } as HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>;

        // Event'i gönder
        if (onChange) {
          onChange(modifiedEvent);
        }
      } else {
        // Uncontrolled component ise doğrudan DOM'u güncelle
        if (inputRef.current) {
          inputRef.current.value = newValue.substring(0, maxLength);
          updateCharCount();
        }
      }
    } else {
      // Normal durumda
      updateCharCount();
      if (onChange) {
        onChange(e);
      }
    }
  };

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
        </div>
      )}

      <div
        data-status={status}
        className={twMerge(
          "relative flex items-center rounded-md border border-zinc-300 transition-all",
          "data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100",
          "data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100",
          "data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100",
          isLimitExceeded &&
            !enforceMaxLength &&
            "border-red-500 ring-2 ring-red-100",
        )}
      >
        {startIcon && (
          <div className="absolute left-3 text-zinc-500">{startIcon}</div>
        )}

        <input
          {...props}
          id={inputId}
          ref={(node) => {
            // İki ref'i birleştir: harici ref ve kendi ref'imiz
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          // enforceMaxLength true ise maxLength kullanmıyoruz, kendi mantığımızı uyguluyoruz
          maxLength={enforceMaxLength ? undefined : maxLength}
          className={twMerge(
            "w-full rounded-md bg-transparent px-3 py-2 outline-none",
            startIcon && "pl-9",
            (endIcon || showCount) && "pr-9",
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

        <div className="absolute right-3 flex items-center gap-2">
          {/* Karakter sayacı - input içinde sağda (opsiyonel) */}
          {showCount && maxLength !== undefined && (
            <span
              className={twMerge(
                "text-xs",
                isLimitExceeded && !enforceMaxLength
                  ? "font-medium text-red-500"
                  : charCount >= maxLength * 0.9
                    ? "text-amber-500"
                    : "text-zinc-400",
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}

          {/* Endicon*/}
          {endIcon && <div className="text-zinc-500">{endIcon}</div>}
        </div>
      </div>

      {message && (
        <p
          data-message-type={messageType}
          className="text-xs data-[message-type=error]:text-red-500 data-[message-type=hint]:text-zinc-500 data-[message-type=success]:text-green-500"
        >
          {message}
        </p>
      )}

      {/* Limit aşıldı mesajı */}
      {isLimitExceeded && !enforceMaxLength && !message && (
        <p className="text-xs text-red-500">Karakter limiti aşıldı.</p>
      )}
    </div>
  );
};

Input.displayName = "Blog-Input";
