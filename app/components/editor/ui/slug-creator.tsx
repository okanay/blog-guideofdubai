import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Lock, Unlock, RotateCcw, CheckCircle } from "lucide-react";
import { slugify } from "../helper";

interface SlugCreatorProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  hint?: string;

  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLInputElement>;

  containerClassName?: string;
}

export const SlugCreator = ({
  label = "Slug",
  isRequired = false,
  errorMessage,
  hint = "URL'de görünecek benzersiz tanımlayıcı",

  isAutoMode = true,
  initialAutoMode = true,
  followRef,

  containerClassName,
  ...props
}: SlugCreatorProps) => {
  const [autoMode, setAutoMode] = useState({
    status: isAutoMode,
    value: initialAutoMode,
  });

  // Input değişikliği
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (autoMode.value) return;

    const newValue = slugify(e.target.value);

    if (e.target.value !== newValue) {
      // Değeri slug formatına dönüştür
      e.target.value = newValue;
    }

    // Orijinal onChange olayını çağır
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Başlıktan slug'ı yeniden oluştur
  const regenerateFromTitle = () => {
    if (!followRef?.current) return;

    const sourceValue = followRef.current.value || "";
    const newSlug = slugify(sourceValue);

    // Değişikliği ilet
    if (props.onChange) {
      const simulatedEvent = {
        target: {
          name: props.name,
          value: newSlug,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      props.onChange(simulatedEvent);
    }
  };

  // FollowRef'teki değişikliği takip etmek için
  useEffect(() => {
    if (autoMode.status && autoMode.value && followRef?.current) {
      const handleFollowInputChange = () => {
        const followValue = followRef.current.value;
        const newSlug = slugify(followValue);

        // Değer değiştiyse ve followRef'ten geliyorsa
        if (props.onChange && newSlug !== props.value) {
          // Simulasyon event'i
          const simulatedEvent = {
            target: {
              name: props.name,
              value: newSlug,
            },
          } as any;

          props.onChange(simulatedEvent);
        }
      };

      followRef.current.addEventListener("input", handleFollowInputChange);

      // İlk yükleme için değeri al
      if (followRef.current.value) {
        handleFollowInputChange();
      }

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

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
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
        <div className="pointer-events-none absolute left-3 font-medium text-zinc-400 select-none">
          /
        </div>

        <input
          {...props}
          readOnly={autoMode.value}
          onChange={handleInputChange}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent py-2 pr-14 pl-6 outline-none",
            props.className || "",
          )}
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
        </div>
      </div>

      {(errorMessage || hint) && (
        <div className="flex items-center gap-1.5">
          <p
            className={`text-xs ${errorMessage ? "text-red-500" : "text-zinc-500"}`}
          >
            {errorMessage || hint}
          </p>
        </div>
      )}
    </div>
  );
};

SlugCreator.displayName = "Blog-SlugCreator";
