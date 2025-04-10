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
  enforceMaxLength?: boolean; // Limit zorunluluğunu kontrol etmek için yeni prop
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
  enforceMaxLength = true, // Varsayılan olarak limit zorunlu
  ...props
}: TextareaProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  // Textarea için bir ref oluştur
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const inputId =
    id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  const status = isError ? "error" : isSuccess ? "success" : focused ? "focused" : "default"; // prettier-ignore
  const message = errorMessage || successMessage || hint; // prettier-ignore
  const messageType = isError ? "error" : isSuccess ? "success" : "hint"; // prettier-ignore

  // Karakter sayısını göstermek için kontrol
  const showCount = showCharCount || maxLength !== undefined;

  // Karakter sayısını güncelle
  const updateCharCount = () => {
    if (!textareaRef.current) return;

    const length = textareaRef.current.value.length;
    setCharCount(length);

    // Limit aşıldı mı kontrol et
    if (maxLength !== undefined) {
      setIsLimitExceeded(length > maxLength);
    }
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
      if (maxLength !== undefined) {
        setIsLimitExceeded(length > maxLength);
      }
    }
  }, [value, maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

        // Textarea değerini direkt değiştir (DOM manipülasyonu)
        if (textareaRef.current) {
          textareaRef.current.value = truncatedValue;
        }

        // Yapay event oluştur
        const modifiedEvent = {
          ...e,
          target: {
            ...e.target,
            value: truncatedValue,
          } as HTMLTextAreaElement,
        } as React.ChangeEvent<HTMLTextAreaElement>;

        // Event'i gönder
        if (onChange) {
          onChange(modifiedEvent);
        }
      } else {
        // Uncontrolled component ise doğrudan DOM'u güncelle
        if (textareaRef.current) {
          textareaRef.current.value = newValue.substring(0, maxLength);
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
          id={inputId}
          ref={(node) => {
            // İki ref'i birleştir: harici ref ve kendi ref'imiz
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            textareaRef.current = node;
          }}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          // enforceMaxLength true ise maxLength kullanmıyoruz, kendi mantığımızı uyguluyoruz
          // başta karakter kısıtlaması çift uygulanmasın diye
          maxLength={enforceMaxLength ? undefined : maxLength}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent px-3 py-2 outline-none",
            maxLength !== undefined && "pr-12", // Eğer sağ alt köşede sayaç varsa padding ekle
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

      {/* Limit aşıldı mesajı - enforceMaxLength false ise göster */}
      {isLimitExceeded && !enforceMaxLength && !message && (
        <p className="text-xs text-red-500">Karakter limiti aşıldı.</p>
      )}
    </div>
  );
};

Textarea.displayName = "Blog-Textarea";
