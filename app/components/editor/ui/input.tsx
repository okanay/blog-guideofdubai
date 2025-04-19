import { Lock, Unlock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  isSuccess?: boolean;

  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLInputElement>;

  errorMessage?: string;
  successMessage?: string;
  hint?: string;

  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  showCharCount?: boolean;
  enforceMaxLength?: boolean;
  maxLength?: number;
}

export const Input = ({
  ref,
  className,
  label,
  id,
  value,
  defaultValue,
  onChange,

  isRequired = false,
  isError = false,
  isSuccess = false,

  isAutoMode = false,
  initialAutoMode = false,
  followRef,

  errorMessage,
  successMessage,
  hint,

  startIcon,
  endIcon,

  showCharCount = false,
  enforceMaxLength = true,
  maxLength,
  ...props
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [internalValue, setInternalValue] = useState<string>((value as string) || (defaultValue as string) || ""); // prettier-ignore
  const [isAuto, setIsAuto] = useState<boolean>(initialAutoMode);
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

  useEffect(() => {
    const initialValue = value ? (value as string).slice(0, maxLength) : "";
    setInternalValue(initialValue);
    setCharCount(initialValue?.length || 0);
  }, [value, maxLength]);

  useEffect(() => {
    if (!isAutoMode || !followRef?.current) return;

    // Takip edilen input değiştiğinde dinleme işlevi
    const handleFollowInputChange = () => {
      if (!isAuto || !followRef.current) return;

      const followValue = followRef.current.value;
      if (followValue !== internalValue) {
        setInternalValue(followValue);
        setCharCount(followValue.length);

        // React Hook Form için onChange olayını tetikle
        if (onChange) {
          const simulatedEvent = {
            target: {
              name: props.name,
              value: followValue,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(simulatedEvent);
        }
      }
    };

    // İlk yükleme için değeri al
    if (isAuto && followRef.current) {
      const initialFollowValue = followRef.current.value;
      setInternalValue(initialFollowValue);
      setCharCount(initialFollowValue.length);

      if (onChange && initialFollowValue !== internalValue) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: initialFollowValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }

    // input event listener kullanarak gerçek zamanlı takip et
    followRef.current.addEventListener("input", handleFollowInputChange);

    // Temizleme fonksiyonu
    return () => {
      followRef.current?.removeEventListener("input", handleFollowInputChange);
    };
  }, [isAuto, followRef, onChange, props.name]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isAutoMode && (
            <button
              type="button"
              onClick={() => setIsAuto(!isAuto)}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
            >
              {isAuto ? (
                <>
                  <Lock size={12} /> Düzenlemeyi Aç
                </>
              ) : (
                <>
                  <Unlock size={12} /> Otomatik Düzenle
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
          value={internalValue}
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
