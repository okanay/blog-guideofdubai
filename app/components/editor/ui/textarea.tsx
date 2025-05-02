import { Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  isRequired?: boolean;

  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLTextAreaElement>;

  errorMessage?: string;
  hint?: string;
  successMessage?: string;

  maxLength?: number;
  enforceMaxLength?: boolean;
}

export const Textarea = ({
  label,
  isRequired = false,
  isAutoMode = false,
  initialAutoMode = false,
  followRef,
  errorMessage,
  hint,
  successMessage,
  maxLength,
  enforceMaxLength = true,
  ...props
}: TextareaProps) => {
  // Input bileşenindeki gibi tek bir autoMode state kullanımı
  const [autoMode, setAutoMode] = useState({
    status: isAutoMode,
    value: initialAutoMode,
  });

  const hasMaxLength = maxLength !== undefined && maxLength >= 1;
  const [maxLengthState, setMaxLengthState] = useState("idle");

  // Değer takibi için basit bir fonksiyon
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) {
      // Karakter limiti kontrolü
      if (hasMaxLength) {
        const inputValue = e.target.value;
        const valueLength = inputValue.length;

        // MaxLength kontrolü - enforceMaxLength aktifse değeri kırp
        if (enforceMaxLength && valueLength > maxLength) {
          e.target.value = inputValue.slice(0, maxLength);
        }

        // Görsel geri bildirim için durum güncellemesi
        const valuePercentage = (valueLength / maxLength) * 100;
        if (valuePercentage >= 100) {
          setMaxLengthState("reached");
        } else if (valuePercentage >= 80) {
          setMaxLengthState("warning");
        } else {
          setMaxLengthState("idle");
        }
      }

      // Normal onChange işlemi
      props.onChange(e);
    }
  };

  // FollowRef'teki değişikliği takip etmek için
  useEffect(() => {
    if (autoMode.status && autoMode.value && followRef?.current) {
      const handleFollowTextareaChange = () => {
        const followValue = followRef.current.value;

        // Textarea değeri değiştiyse ve followRef'ten geliyorsa
        if (props.onChange && followValue !== props.value) {
          // Simulasyon event'i
          const simulatedEvent = {
            target: {
              name: props.name,
              value: followValue,
            },
          } as any;

          props.onChange(simulatedEvent);
        }
      };

      followRef.current.addEventListener("input", handleFollowTextareaChange);

      // Cleanup
      return () => {
        followRef.current?.removeEventListener(
          "input",
          handleFollowTextareaChange,
        );
      };
    }
  }, [
    autoMode.status,
    autoMode.value,
    followRef,
    props.name,
    props.onChange,
    props.value,
  ]);

  // Karakter sayacı renk sınıfı
  const getCounterColorClass = () => {
    switch (maxLengthState) {
      case "reached":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-zinc-500";
    }
  };

  // Mesaj durumuna göre sınıf belirleme
  const getMessageClass = () => {
    if (errorMessage) return "text-red-500";
    if (successMessage) return "text-green-500";
    return "text-zinc-500";
  };

  // Container için sınıf belirleme
  const getContainerClass = () => {
    let baseClass =
      "relative overflow-hidden rounded-md border border-zinc-300 transition-all";

    if (errorMessage) {
      return twMerge(baseClass, "border-red-500 bg-red-50");
    }

    if (successMessage) {
      return twMerge(baseClass, "border-green-500 ring-2 ring-green-100");
    }

    return baseClass;
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isAutoMode && (
            <button
              type="button"
              onClick={() =>
                setAutoMode((prev) => ({ ...prev, value: !prev.value }))
              }
              className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-800"
            >
              {autoMode.value ? (
                <>
                  <Lock size={12} className="text-amber-500" /> Düzenlemeyi Aç
                </>
              ) : (
                <>
                  <Unlock size={12} className="text-green-500" /> Otomatik
                  Düzenle
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div
        className={twMerge(
          "group relative flex items-center rounded-md border border-zinc-300 transition-all focus-within:border-zinc-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100",
          autoMode.value &&
            "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
          errorMessage ? "border-red-500 bg-red-50" : "",
        )}
      >
        <textarea
          {...props}
          readOnly={autoMode.value}
          onChange={handleTextareaChange}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent px-3 py-2 pr-14 outline-none",
            props.className || "",
          )}
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {/* Karakter sayacı */}
          {hasMaxLength && (
            <span className={twMerge("text-xs", getCounterColorClass())}>
              {String(props.value || "").length}/{maxLength}
            </span>
          )}
        </div>
      </div>

      {/* Mesajlar - Birini göster */}
      {(errorMessage || successMessage || hint) && (
        <p className={twMerge("text-xs", getMessageClass())}>
          {errorMessage || successMessage || hint}
        </p>
      )}
    </div>
  );
};

Textarea.displayName = "Blog-Textarea";
