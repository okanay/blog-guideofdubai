import { useEffect, useRef, useState } from "react";
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
  autoMode?: boolean;
  initialAutoMode?: boolean;
  syncWithValue?: string;
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
  value = "",
  onChange,
  autoMode = true,
  initialAutoMode = true,
  syncWithValue = "",
  ...props
}: SlugCreatorProps) => {
  const [focused, setFocused] = useState(false);
  const [isAuto, setIsAuto] = useState(initialAutoMode);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [internalValue, setInternalValue] = useState<string>(
    (value as string) || "",
  );

  const elementRef = useRef<HTMLInputElement | null>(null);
  const inputId = id || `slug-${Math.random().toString(36).substring(2, 9)}`;

  const status = isError || localError ? "error" : checkResult === false ? "error" : isSuccess || checkResult === true ? "success" : focused ? "focused" : "default"; // prettier-ignore
  const message = errorMessage || localError ? errorMessage || localError : checkResult === false ? "Bu slug zaten kullanımda." : checkResult === true ? "Slug kullanılabilir." : successMessage || hint; // prettier-ignore
  const messageType = isError || localError || checkResult === false ? "error" : isSuccess || checkResult === true ? "success" : "hint"; // prettier-ignore

  // URL-dostu slug oluşturma fonksiyonu
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

  // Input değişikliği
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuto) return; // Otomatik modda ise değişikliği engelle

    const newValue = cleanSlug(e.target.value);
    setInternalValue(newValue);
    setCheckResult(null);

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
  };

  // Slug kontrolü
  const handleCheckSlug = async () => {
    if (!internalValue || !checkSlug) return;

    setIsChecking(true);
    setCheckResult(null);
    setLocalError(null);

    try {
      const isAvailable = await checkSlug(internalValue);
      setCheckResult(isAvailable);
    } catch (error) {
      setLocalError("Slug kontrolü sırasında bir hata oluştu.");
    } finally {
      setIsChecking(false);
    }
  };

  // Başlıktan slug'ı yeniden oluştur
  const regenerateFromTitle = () => {
    if (!followRef?.current && !syncWithValue) return;

    const sourceValue = syncWithValue || followRef?.current?.value || "";
    const newSlug = cleanSlug(sourceValue);

    setInternalValue(newSlug);
    setCheckResult(null);

    // Eğer dışarıdan bir onChange handler verilmişse çağır
    if (onChange) {
      const simulatedEvent = {
        target: {
          name: props.name,
          value: newSlug,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(simulatedEvent);
    }
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAuto;
    setIsAuto(newAutoMode);

    if (newAutoMode) {
      // Otomatik moda geçince syncWithValue veya followRef değerini al
      const sourceValue = syncWithValue || followRef?.current?.value || "";
      const newSlug = cleanSlug(sourceValue);

      setInternalValue(newSlug);
      setCheckResult(null);

      if (onChange && newSlug !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: newSlug,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }
  };

  // Otomatik mod değişikliğini izle
  useEffect(() => {
    setIsAuto(isAuto);
  }, [isAuto]);

  // syncWithValue değişikliğini izle
  useEffect(() => {
    if (isAuto && syncWithValue !== undefined) {
      const newSlug = cleanSlug(syncWithValue);
      setInternalValue(newSlug);
      setCheckResult(null);

      // Otomatik modda iken değerleri senkronize et
      if (onChange && newSlug !== value) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: newSlug,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }
  }, [isAuto, syncWithValue, onChange, props.name, value]);

  // followRef değişikliğini izle (eğer varsa)
  useEffect(() => {
    if (!followRef?.current || syncWithValue) return;

    // Başlangıçta mevcut değeri alıp slug'ı ayarla
    if (isAuto && followRef.current.value && !internalValue) {
      const newSlug = cleanSlug(followRef.current.value);
      setInternalValue(newSlug);

      if (onChange) {
        const simulatedEvent = {
          target: {
            name: props.name,
            value: newSlug,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(simulatedEvent);
      }
    }

    // Başlık input'unda değişiklik olduğunda event listener
    const handleTitleChange = (e: Event) => {
      if (isAuto && e.target && !syncWithValue) {
        const titleValue = (e.target as HTMLInputElement).value;
        const newSlug = cleanSlug(titleValue);

        setInternalValue(newSlug);
        setCheckResult(null);

        // Eğer dışarıdan bir onChange handler verilmişse çağır
        if (onChange) {
          const simulatedEvent = {
            target: {
              name: props.name,
              value: newSlug,
            },
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
  }, [isAuto, followRef, onChange, syncWithValue, internalValue]);

  // Değer değişikliğini izle
  useEffect(() => {
    // Otomatik modda değilse ve prop'dan gelen value değişirse
    if (!isAuto && value !== undefined && value !== internalValue) {
      setInternalValue(value as string);
    }
  }, [value, isAuto, internalValue]);

  // İlk render için slug'ı ayarla
  useEffect(() => {
    const initialValue = isAuto
      ? cleanSlug(syncWithValue || followRef?.current?.value || "")
      : (value as string) || "";

    setInternalValue(initialValue);
  }, []);

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
        className="relative flex items-center rounded-md border border-zinc-300 transition-all data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100 data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100 data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100"
      >
        <div className="pointer-events-none absolute left-3 font-medium text-zinc-400 select-none">
          /
        </div>

        <input
          {...props}
          id={inputId}
          ref={setRefs}
          value={
            isAuto
              ? cleanSlug(syncWithValue || followRef?.current?.value || "")
              : internalValue
          }
          onChange={handleInputChange}
          readOnly={isAuto}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-6 outline-none",
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
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {(followRef || syncWithValue) && (
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
              disabled={!internalValue || isChecking}
              onClick={handleCheckSlug}
              className={twMerge(
                "rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700",
                isChecking && "cursor-wait opacity-70",
                !internalValue && "cursor-not-allowed opacity-50",
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
