import { useState, forwardRef, useEffect } from "react";
import { Images, Eye, X, Lock, Unlock } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ImagePreviewProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
  autoMode?: boolean;
  initialAutoMode?: boolean;
  syncWithValue?: string;
}

export const ImagePreview = forwardRef<HTMLInputElement, ImagePreviewProps>(
  (
    {
      id,
      label = "Görsel URL",
      value = "",
      onChange,
      placeholder = "https://example.com/image.jpg",
      isRequired = false,
      isError = false,
      errorMessage,
      hint,
      className,
      containerClassName,
      autoMode = false,
      initialAutoMode = false,
      syncWithValue = "",
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isAuto, setIsAuto] = useState(initialAutoMode);
    const [internalValue, setInternalValue] = useState(value);

    // URL doğrulama fonksiyonu - basit bir URL kontrolü yapıyor
    const isValidUrl = (url: string): boolean => {
      if (!url) return true;
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isAuto) return; // Otomatik modda değişiklik engellenir

      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);

      // URL değiştiğinde hata durumunu sıfırla
      if (imageError) {
        setImageError(null);
      }
    };

    const clearValue = () => {
      if (isAuto) return; // Otomatik modda değişiklik engellenir

      setInternalValue("");
      onChange?.("");
      setImageError(null);
    };

    // Otomatik modu değiştir
    const toggleMode = () => {
      const newAutoMode = !isAuto;
      setIsAuto(newAutoMode);

      if (newAutoMode) {
        // Otomatik moda geçince syncWithValue değerini al
        setInternalValue(syncWithValue);
        onChange?.(syncWithValue);
      }
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

    // syncWithValue değişikliğini izle
    useEffect(() => {
      if (isAuto && syncWithValue !== undefined) {
        setInternalValue(syncWithValue);
        if (onChange && syncWithValue !== value) {
          onChange(syncWithValue);
        }
      }
    }, [isAuto, syncWithValue, value, onChange]);

    // Component ilk yüklendiğinde veya value değiştiğinde
    useEffect(() => {
      if (!isAuto && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value, isAuto, internalValue]);

    const inputId =
      id || `image-input-${Math.random().toString(36).substring(2, 9)}`;
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
            {...rest}
            id={inputId}
            ref={ref}
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
              <Eye size={14} className="mr-1 inline-block" />{" "}
              <span>Önizle</span>
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
  },
);

ImagePreview.displayName = "ImagePreview";
