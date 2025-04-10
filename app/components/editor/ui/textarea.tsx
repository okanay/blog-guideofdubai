import { Lock, Unlock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  successMessage?: string;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
  containerClassName?: string;
  enforceMaxLength?: boolean;
  autoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLTextAreaElement>;
  onValueSync?: (value: string) => void;
  syncWithValue?: string;
}

export const Textarea = ({
  ref,
  className,
  label,
  isRequired = false,
  isError = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  hint,
  maxLength,
  showCharCount = false,
  containerClassName,
  id,
  defaultValue,
  value,
  onChange,
  autoMode = false,
  initialAutoMode = false,
  followRef,
  enforceMaxLength = true,
  onValueSync,
  syncWithValue,
  ...props
}: TextareaProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isAuto, setIsAuto] = useState(initialAutoMode);
  const [internalValue, setInternalValue] = useState<string>(
    (value as string) || (defaultValue as string) || "",
  );

  const elementRef = useRef<HTMLTextAreaElement | null>(null);
  const inputId =
    id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

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
  const setRefs = (element: HTMLTextAreaElement | null) => {
    // İç referans için atama
    elementRef.current = element;

    // Dışarıdan gelen ref için atama
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
        element;
    }
  };

  // onChange işleyicisi
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      } as React.ChangeEvent<HTMLTextAreaElement>;

      onChange(simulatedEvent);
    }

    // Varsa onValueSync callback'ini çağır
    if (onValueSync) {
      onValueSync(newValue);
    }
  };

  // Otomatik mod değişikliğini izle
  useEffect(() => {
    setIsAuto(isAuto);
  }, [isAuto]);

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
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange(simulatedEvent);
      }

      // Varsa onValueSync callback'ini çağır
      if (onValueSync) {
        onValueSync(syncWithValue);
      }
    }
  }, [isAuto, syncWithValue, onChange, props.name, value, onValueSync]);

  // followRef değişikliğini izle (eğer varsa)
  useEffect(() => {
    if (
      isAuto &&
      followRef?.current &&
      followRef.current.value !== internalValue
    ) {
      const followedValue = followRef.current.value;
      setInternalValue(followedValue);
      setCharCount(followedValue.length);

      // Otomatik modda iken değerleri senkronize et
      if (onChange && followedValue !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: followedValue,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange(simulatedEvent);
      }

      // Varsa onValueSync callback'ini çağır
      if (onValueSync) {
        onValueSync(followedValue);
      }
    }
  }, [
    isAuto,
    followRef?.current?.value,
    onChange,
    props.name,
    value,
    onValueSync,
    internalValue,
  ]);

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
      ? syncWithValue || followRef?.current?.value || ""
      : (value as string) || (defaultValue as string) || "";

    setCharCount(initialValue?.length || 0);
    setInternalValue(initialValue || "");
  }, []);

  // Otomatik mod değiştiğinde yapılacak işlemler
  const toggleAutoMode = () => {
    const newAutoMode = !isAuto;
    setIsAuto(newAutoMode);

    if (newAutoMode) {
      // Otomatik moda geçince syncWithValue veya followRef değerini al
      const syncValue = syncWithValue || followRef?.current?.value || "";
      setInternalValue(syncValue);
      setCharCount(syncValue?.length || 0);

      if (onChange && syncValue !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: syncValue,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>;

        onChange(simulatedEvent);
      }

      // Varsa onValueSync callback'ini çağır
      if (onValueSync) {
        onValueSync(syncValue);
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
          "relative overflow-hidden rounded-md border border-zinc-300 transition-all",
          "data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100",
          "data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100",
          "data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100",
          isLimitExceeded &&
            !enforceMaxLength &&
            "border-red-500 ring-2 ring-red-100",
        )}
      >
        <textarea
          {...props}
          ref={setRefs}
          id={inputId}
          value={
            isAuto
              ? syncWithValue || followRef?.current?.value || ""
              : internalValue
          }
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          onChange={handleOnChange}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent px-3 py-2 outline-none",
            maxLength !== undefined && "pr-12",
            isAuto &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
            className,
          )}
          readOnly={isAuto}
        />

        {/* Sağ alt köşede karakter sayacı (opsiyonel) */}
        {showCount && (
          <div className="absolute right-2 bottom-2 text-xs opacity-70">
            <span
              className={twMerge(
                isLimitExceeded && !enforceMaxLength
                  ? "font-medium text-red-500"
                  : charCount >= (maxLength || 0) * 0.9
                    ? "text-amber-500"
                    : "text-zinc-500",
              )}
            >
              {charCount}
              {maxLength !== undefined && `/${maxLength}`}
            </span>
          </div>
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

      {/* Limit aşıldı mesajı */}
      {isLimitExceeded && !enforceMaxLength && !message && (
        <p className="text-xs text-red-500">Karakter limiti aşıldı.</p>
      )}
    </div>
  );
};

Textarea.displayName = "Blog-Textarea";
