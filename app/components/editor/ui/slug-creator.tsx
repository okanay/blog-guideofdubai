import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Lock, Unlock, RotateCcw, CheckCircle } from "lucide-react";

interface SlugCreatorProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  successMessage?: string;
  hint?: string;
  followRef?: React.RefObject<HTMLInputElement>;
  containerClassName?: string;
  checkSlug?: (slug: string) => Promise<boolean>;
}

export const SlugCreator = ({
  ref,
  className,
  label = "Slug",
  isRequired = false,
  isError = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  hint = "URL'de görünecek benzersiz tanımlayıcı",
  followRef,
  containerClassName,
  checkSlug,
  id,
  value,
  onChange,
  ...props
}: SlugCreatorProps) => {
  const [focused, setFocused] = useState(false);
  const [isAuto, setIsAuto] = useState(true);
  const [slug, setSlug] = useState(value || "");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const status = isError || localError ? "error" : checkResult === false ? "error" : isSuccess || checkResult === true ? "success" : focused ? "focused" : "default"; // prettier-ignore
  const message = errorMessage || localError ? errorMessage || localError : checkResult === false ? "Bu slug zaten kullanımda." : checkResult === true ? "Slug kullanılabilir." : successMessage || hint; // prettier-ignore
  const messageType = isError || localError || checkResult === false ? "error" : isSuccess || checkResult === true ? "success" : "hint"; // prettier-ignore

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = cleanSlug(e.target.value);
    setSlug(newValue);

    // Eğer dışarıdan bir onChange handler verilmişse çağır
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

    setCheckResult(null);
  };

  const toggleMode = () => {
    setIsAuto(!isAuto);
  };

  const regenerateFromTitle = () => {
    if (followRef?.current) {
      const newSlug = cleanSlug(followRef.current.value);
      setSlug(newSlug);
      setCheckResult(null);

      // Eğer dışarıdan bir onChange handler verilmişse çağır
      if (onChange) {
        const simulatedEvent = {
          target: { value: newSlug },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }
  };

  const handleCheckSlug = async () => {
    if (!slug || !checkSlug) return;

    setIsChecking(true);
    setCheckResult(null);

    try {
      const isAvailable = await checkSlug(slug as string);
      setCheckResult(isAvailable);
    } catch (error) {
      setLocalError("Slug kontrolü sırasında bir hata oluştu.");
    } finally {
      setIsChecking(false);
    }
  };

  const cleanSlug = (text: string): string => {
    if (!text) return "";

    return (
      text
        .toLowerCase()
        .trim()
        // Türkçe karakterleri değiştir
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        // Diğer özel karakterleri ve boşlukları değiştir
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
        .replace(/-+/g, "-")
    ); // Birden fazla tireyi tekli tireye dönüştür
  };

  useEffect(() => {
    if (!followRef?.current) return;

    // Başlangıçta mevcut değeri alıp slug'ı ayarla
    if (isAuto && followRef.current.value) {
      setSlug(cleanSlug(followRef.current.value));
    }

    // Başlık input'unda değişiklik olduğunda event listener
    const handleTitleChange = (e: Event) => {
      if (isAuto && e.target) {
        const titleValue = (e.target as HTMLInputElement).value;
        setSlug(cleanSlug(titleValue));

        // Eğer dışarıdan bir onChange handler verilmişse çağır
        if (onChange) {
          const simulatedEvent = {
            target: { value: cleanSlug(titleValue) },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(simulatedEvent);
        }
      }
    };

    // Event listener'ı ekle
    followRef.current.addEventListener("input", handleTitleChange);

    // Cleanup: component unmount olduğunda veya effect değiştiğinde listener'ı kaldır
    return () => {
      followRef.current?.removeEventListener("input", handleTitleChange);
    };
  }, [isAuto, followRef, onChange]);

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
          <button
            type="button"
            onClick={toggleMode}
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
        </div>
      )}

      <div
        data-status={status}
        className="relative flex items-center rounded-md border border-zinc-300 transition-all data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100 data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100 data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100"
      >
        <div className="pointer-events-none absolute left-3 font-medium text-zinc-400 select-none">
          /
        </div>

        <input
          {...props}
          id={inputId}
          ref={ref}
          value={slug}
          onChange={handleInputChange}
          readOnly={isAuto}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-6 outline-none",
            isAuto && "cursor-not-allowed bg-zinc-50 text-zinc-500",
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

        <div className="absolute right-2 flex items-center gap-1.5">
          {followRef && (
            <button
              type="button"
              onClick={regenerateFromTitle}
              className="rounded border border-zinc-200 bg-zinc-100 p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700"
              title="Başlıktan yeniden oluştur"
            >
              <RotateCcw size={14} />
            </button>
          )}

          {checkSlug && (
            <button
              type="button"
              disabled={!slug || isChecking}
              onClick={handleCheckSlug}
              className={twMerge(
                "rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700",
                isChecking && "cursor-wait opacity-70",
                !slug && "cursor-not-allowed opacity-50",
              )}
            >
              {isChecking ? "Kontrol ediliyor..." : "Kontrol Et"}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-1.5">
          {messageType === "success" && (
            <CheckCircle size={12} className="text-green-500" />
          )}
          <p
            data-message-type={messageType}
            className="text-xs data-[message-type=error]:text-red-500 data-[message-type=hint]:text-zinc-500 data-[message-type=success]:text-green-500"
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

SlugCreator.displayName = "Blog-SlugCreator";
