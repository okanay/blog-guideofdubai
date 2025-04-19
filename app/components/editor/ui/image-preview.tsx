import { useState, useRef, useEffect } from "react";
import { Images, Eye, X, Lock, Unlock } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ImagePreviewProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;

  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLInputElement>;

  containerClassName?: string;
}

export const ImagePreview = ({
  ref,
  className,
  label = "Görsel URL",
  value = "",
  onChange,
  placeholder = "https://example.com/image.jpg",
  id,

  isRequired = false,
  isError = false,
  errorMessage,
  hint,

  isAutoMode = false,
  initialAutoMode = false,
  followRef,

  containerClassName,
  ...props
}: ImagePreviewProps) => {
  const [focused, setFocused] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAuto, setIsAuto] = useState(initialAutoMode);
  const [internalValue, setInternalValue] = useState<string>((value as string) || ""); // prettier-ignore

  const elementRef = useRef<HTMLInputElement | null>(null);
  const inputId = id || `image-input-${Math.random().toString(36).substring(2, 9)}`; // prettier-ignore

  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const urlIsInvalid = internalValue && !isValidUrl(internalValue);
  const hasError = isError || urlIsInvalid;

  const status = hasError
    ? "error"
    : imageError
      ? "error"
      : focused
        ? "focused"
        : "default";
  const displayMessage =
    errorMessage ||
    (imageError ? imageError : urlIsInvalid ? "Geçerli bir URL girin" : hint);

  const messageType = hasError || imageError ? "error" : "hint";

  // Referans birleştirme işlevi
  const setRefs = (element: HTMLInputElement | null) => {
    // İç referans için atama
    elementRef.current = element;

    // Dışarıdan gelen ref için atama
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as any).current = element;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuto) return; // Otomatik modda değişiklik engellenir

    const newValue = e.target.value;
    setInternalValue(newValue);

    // URL değiştiğinde hata durumunu sıfırla
    if (imageError) {
      setImageError(null);
    }

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

  const clearValue = () => {
    if (isAuto) return; // Otomatik modda değişiklik engellenir

    setInternalValue("");

    if (onChange) {
      const simulatedEvent = {
        target: {
          name: props.name,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(simulatedEvent);
    }

    setImageError(null);
  };

  const openPreview = () => {
    if (!internalValue || !isValidUrl(internalValue)) return;
    setIsPreviewOpen(true);
    setIsImageLoading(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(null);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError("Görsel yüklenemedi. URL'i kontrol edin.");
  };

  useEffect(() => {
    if (!isAutoMode || !followRef?.current) return;

    // Takip edilen input değiştiğinde dinleme işlevi
    const handleFollowInputChange = () => {
      if (!isAuto || !followRef.current) return;

      const followValue = followRef.current.value;
      if (followValue !== internalValue) {
        setInternalValue(followValue);

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
        className="relative flex items-center rounded-md border border-zinc-300 transition-all data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100 data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100"
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Images size={18} />
        </div>

        <input
          {...props}
          id={inputId}
          ref={setRefs}
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={isAuto}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-10 outline-none",
            isAuto &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
            className,
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {internalValue && !isAuto && (
            <button
              type="button"
              onClick={clearValue}
              className="rounded border border-zinc-200 bg-zinc-100 p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700"
              title="URL'i temizle"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            disabled={!internalValue || !isValidUrl(internalValue)}
            onClick={openPreview}
            className={twMerge(
              "flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700",
              (!internalValue || !isValidUrl(internalValue)) &&
                "cursor-not-allowed opacity-50",
            )}
            title="Görseli önizle"
          >
            <Eye size={14} className="mr-1 inline-block" /> <span>Önizle</span>
          </button>
        </div>
      </div>

      {displayMessage && (
        <p
          data-message-type={messageType}
          className="text-xs data-[message-type=error]:text-red-500 data-[message-type=hint]:text-zinc-500"
        >
          {displayMessage}
        </p>
      )}

      {/* Görsel Önizleme Modalı */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-2 shadow-xl sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-zinc-200 pb-2">
              <h3 className="text-lg font-medium text-zinc-800">
                Görsel Önizleme
              </h3>
              <button
                onClick={closePreview}
                className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-full w-full items-center justify-center">
              {isImageLoading && (
                <div className="flex flex-col items-center p-8 text-zinc-500">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-600"></div>
                  <p className="mt-2 text-sm">Yükleniyor...</p>
                </div>
              )}

              {imageError && !isImageLoading && (
                <div className="flex flex-col items-center p-8 text-red-500">
                  <div className="rounded-full border border-red-200 bg-red-50 p-2">
                    <X size={24} />
                  </div>
                  <p className="mt-2 text-center text-sm">{imageError}</p>
                </div>
              )}

              <img
                src={internalValue}
                alt="Önizleme"
                className={twMerge(
                  "max-h-[70vh] max-w-full rounded-md",
                  (isImageLoading || imageError) && "hidden",
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            <div className="mt-4 text-center text-xs text-zinc-500">
              <p className="break-all">{internalValue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ImagePreview.displayName = "Blog-ImagePreview";
