import { Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;

  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLInputElement>;

  errorMessage?: string;
  hint?: string;

  maxLength?: number;
}

export const Input = ({
  label,
  isRequired = false,
  isAutoMode = false,
  initialAutoMode = false,
  followRef,
  errorMessage,
  hint,
  maxLength,
  ...props
}: InputProps) => {
  const [autoMode, setAutoMode] = useState({
    status: isAutoMode,
    value: initialAutoMode,
  });

  const hasMaxLength = maxLength !== undefined && maxLength >= 1;
  const [maxLengthState, setMaxLengthState] = useState("idle");

  // Input değerini işleyen ve sadece görsel geri bildirim sağlayan fonksiyon
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      // MaxLength kontrolü - sadece durum değişikliği, değeri kırpmıyoruz
      if (hasMaxLength) {
        const inputValue = e.target.value;

        // Maksimum uzunluğa göre sadece görsel geri bildirim için durum güncellemesi
        const valuePercentage = (inputValue.length / maxLength) * 100;
        if (valuePercentage >= 100) {
          setMaxLengthState("reached");
        } else if (valuePercentage >= 80) {
          setMaxLengthState("warning");
        } else {
          setMaxLengthState("idle");
        }
      }

      // Normal onChange işlemi - değeri olduğu gibi iletiyoruz
      props.onChange(e);
    }
  };

  // FollowRef'teki değişikliği takip etmek için
  useEffect(() => {
    if (autoMode.status && autoMode.value && followRef?.current) {
      const handleFollowInputChange = () => {
        const followValue = followRef.current.value;

        // Input değeri değiştiyse ve followRef'ten geliyorsa
        if (props.onChange && followValue !== props.value) {
          // Simulasyon event'i - değeri olduğu gibi iletiyoruz
          const simulatedEvent = {
            target: {
              name: props.name,
              value: followValue,
            },
          } as any;

          props.onChange(simulatedEvent);
        }
      };

      followRef.current.addEventListener("input", handleFollowInputChange);

      // Cleanup
      return () => {
        followRef.current?.removeEventListener(
          "input",
          handleFollowInputChange,
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
        data-status={"idle"}
        className={twMerge(
          "group relative flex items-center rounded-md border border-zinc-300 transition-all focus-within:border-zinc-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100",
          autoMode.value &&
            "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
          errorMessage ? "border-red-500 bg-red-50" : "",
        )}
      >
        <input
          {...props}
          readOnly={autoMode.value}
          onChange={handleInputChange}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent px-3 py-2 pr-14 outline-none",
            props.className || "",
          )}
        />

        <div className="absolute right-3 flex items-center gap-2">
          {/* Karakter sayacı */}
          {hasMaxLength && (
            <span className={twMerge("text-xs", getCounterColorClass())}>
              {String(props.value || "").length}/{maxLength}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

      {/* Hint - Error yoksa göster */}
      {!errorMessage && hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
};

Input.displayName = "Blog-Input";
