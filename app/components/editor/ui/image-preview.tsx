import { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Image as ImageIcon, Eye, X, AlertCircle } from "lucide-react";
import useClickOutside from "@/hooks/use-click-outside";

interface ImagePreviewProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  label?: string;
  isRequired?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  successMessage?: string;
  hint?: string;
  containerClassName?: string;
  onChange?: (url: string) => void;
  value?: string;
}

export const ImagePreview = ({
  ref,
  className,
  label = "Görsel URL",
  isRequired = false,
  isError = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  hint,
  containerClassName,
  id,
  value = "",
  onChange,
  ...props
}: ImagePreviewProps) => {
  const [focused, setFocused] = useState(false);
  const [imageUrl, setImageUrl] = useState(value || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const modalRef = useClickOutside<HTMLDivElement>(
    () => setIsPreviewOpen(false),
    isPreviewOpen,
  );

  const inputId =
    id || `image-preview-${Math.random().toString(36).substring(2, 9)}`;
  const inputRef = useRef<HTMLInputElement>(null);

  // URL doğrulama fonksiyonu - basit bir URL kontrolü yapıyor
  const validateImageUrl = (url: string): boolean => {
    if (!url) return true; // Boş URL geçerli sayılır (zorunlu değilse)

    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "https:"; // Sadece https URL'leri kabul et
    } catch (error) {
      return false;
    }
  };

  // Görsel URL'si değiştiğinde
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    setIsValidUrl(validateImageUrl(newUrl));
    setImageError(null);

    if (onChange) {
      onChange(newUrl);
    }
  };

  // Görsel önizleme modalını aç
  const openPreview = () => {
    if (!imageUrl || !isValidUrl) return;

    setIsPreviewOpen(true);
    setIsImageLoading(true);
  };

  // Görsel önizleme modalını kapat
  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  // Görsel yüklendiğinde
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(null);
  };

  // Görsel yüklenemediğinde
  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError("Görsel yüklenemedi. URL'i kontrol edin.");
  };

  const status =
    isError || !isValidUrl || imageError
      ? "error"
      : isSuccess
        ? "success"
        : focused
          ? "focused"
          : "default";

  const message =
    errorMessage ||
    (imageError
      ? imageError
      : !isValidUrl
        ? "Geçerli bir https görsel URL'i girin"
        : successMessage || hint);

  const messageType =
    isError || !isValidUrl || imageError
      ? "error"
      : isSuccess
        ? "success"
        : "hint";

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        data-status={status}
        className="relative flex items-center rounded-md border border-zinc-300 transition-all data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100 data-[status=focused]:border-zinc-500 data-[status=focused]:ring-2 data-[status=focused]:ring-zinc-100 data-[status=success]:border-green-500 data-[status=success]:ring-2 data-[status=success]:ring-green-100"
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <ImageIcon size={18} />
        </div>

        <input
          {...props}
          id={inputId}
          ref={inputRef}
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-16 pl-9 outline-none",
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
          {/* Temizle butonu */}
          {imageUrl && (
            <button
              type="button"
              onClick={() => {
                setImageUrl("");
                setIsValidUrl(true);
                setImageError(null);
                if (onChange) onChange("");
                inputRef.current?.focus();
              }}
              className="rounded border border-zinc-200 bg-zinc-100 p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700"
              title="URL'i temizle"
            >
              <X size={14} />
            </button>
          )}

          {/* Önizleme butonu */}
          <button
            type="button"
            disabled={!imageUrl || !isValidUrl}
            onClick={openPreview}
            className={twMerge(
              "rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700",
              (!imageUrl || !isValidUrl) && "cursor-not-allowed opacity-50",
            )}
            title="Görseli önizle"
          >
            <Eye size={14} className="mr-1 inline-block" /> Önizle
          </button>
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

      {/* Görsel Önizleme Modalı */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            ref={modalRef}
            className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-2 shadow-xl sm:p-4"
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
                  <AlertCircle size={32} />
                  <p className="mt-2 text-center text-sm">{imageError}</p>
                </div>
              )}

              <img
                src={imageUrl}
                alt="Önizleme"
                className={twMerge(
                  "max-h-[70vh] max-w-full rounded-md transition-opacity",
                  (isImageLoading || imageError) && "hidden",
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>

            <div className="mt-4 text-center text-xs text-zinc-500">
              <p className="break-all">{imageUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ImagePreview.displayName = "Blog-ImagePreview";
