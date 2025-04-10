import { Lock, Unlock } from "lucide-react";
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
  autoMode?: boolean;
  initialAutoMode?: boolean;
  syncWithValue?: string;
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
  autoMode = false,
  initialAutoMode = false,
  syncWithValue,
  showCharCount = false,
  enforceMaxLength = true,
  ...props
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isAuto, setIsAuto] = useState(initialAutoMode);
  const [internalValue, setInternalValue] = useState<string>(
    (value as string) || (defaultValue as string) || "",
  );

  const elementRef = useRef<HTMLInputElement | null>(null);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const showCount = showCharCount || maxLength !== undefined;
  const isLimitExceeded = maxLength !== undefined && charCount > maxLength;

  const status = isError
    ? "error"
    : isSuccess
      ? "success"
      : focused
        ? "focused"
        : "default";
  const message = errorMessage || successMessage || hint;
  const messageType = isError ? "error" : isSuccess ? "success" : "hint";

  // Referans birleştirme işlevi
  const setRefs = (element: HTMLInputElement | null) => {
    // İç referans için atama
    elementRef.current = element;

    // Dışarıdan gelen ref için atama
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current =
        element;
    }
  };

  // onChange işleyicisi
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuto) return; // Otomatik modda ise değişikliği engelle

    let newValue = e.target.value;

    // Karakter sınırlaması uygula
    if (enforceMaxLength && maxLength !== undefined) {
      newValue = newValue.slice(0, maxLength);
    }

    setInternalValue(newValue);
    setCharCount(newValue.length);

    // Orijinal onChange olayını simüle et
    if (onChange) {
      const simulatedEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(simulatedEvent);
    }
  };

  // syncWithValue değişikliğini izle
  useEffect(() => {
    if (isAuto && syncWithValue !== undefined) {
      setInternalValue(syncWithValue);
      setCharCount(syncWithValue?.length || 0);

      // Otomatik modda iken değerleri senkronize et
      if (onChange && syncWithValue !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: syncWithValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }
  }, [isAuto, syncWithValue, onChange, props.name, value]);

  // Değer değişikliğini izle
  useEffect(() => {
    // Otomatik modda değilse ve kontrollü bileşen ise
    if (!isAuto && value !== undefined && value !== internalValue) {
      setInternalValue(value as string);
      setCharCount((value as string)?.length || 0);
    }
  }, [value, isAuto, internalValue]);

  // İlk render için karakter sayacını ayarla
  useEffect(() => {
    const initialValue = isAuto
      ? syncWithValue
      : (value as string) || (defaultValue as string) || "";
    setCharCount(initialValue?.length || 0);
    setInternalValue(initialValue || "");
  }, []);

  // Otomatik mod değiştiğinde yapılacak işlemler
  const toggleAutoMode = () => {
    const newAutoMode = !isAuto;
    setIsAuto(newAutoMode);

    if (newAutoMode) {
      // Otomatik moda geçince syncWithValue değerini al
      setInternalValue(syncWithValue || "");
      setCharCount(syncWithValue?.length || 0);

      if (onChange && syncWithValue !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: syncWithValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
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
          {autoMode && (
            <button
              type="button"
              onClick={toggleAutoMode}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
            >
              {isAuto ? (
                <>
                  <Lock size={12} /> Otomatik
                </>
              ) : (
                <>
                  <Unlock size={12} /> Manuel
                </>
              )}
            </button>
          )}
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
          ref={setRefs}
          value={isAuto ? syncWithValue || "" : internalValue}
          onChange={handleOnChange}
          className={twMerge(
            "w-full rounded-md bg-transparent px-3 py-2 outline-none",
            startIcon && "pl-9",
            (endIcon || showCount) && "pr-9",
            isAuto &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
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
          readOnly={isAuto}
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
