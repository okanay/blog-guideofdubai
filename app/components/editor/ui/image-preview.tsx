import { useState, useEffect } from "react";
import { Images, Eye, X, ImagePlus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import ImageModal from "@/components/image";

interface ImagePreviewProps extends React.ComponentProps<"input"> {
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  hint?: string;
  containerClassName?: string;
}

export const ImagePreview = ({
  label = "Görsel URL",
  isRequired = false,
  errorMessage,
  hint,
  containerClassName,
  ...props
}: ImagePreviewProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL doğrulama fonksiyonu
  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Mevcut değerin geçerli bir URL olup olmadığını kontrol et
  const urlIsInvalid = props.value && !isValidUrl(props.value as string);
  const hasError = errorMessage || urlIsInvalid || imageError;

  // Gösterilecek mesajı belirle
  const displayMessage =
    errorMessage ||
    (imageError ? imageError : urlIsInvalid ? "Geçerli bir URL girin" : hint);

  // Input değerini temizleme fonksiyonu
  const clearValue = () => {
    if (props.onChange) {
      const simulatedEvent = {
        target: {
          name: props.name,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      props.onChange(simulatedEvent);
    }
    setImageError(null);
  };

  // Önizleme işlemleri
  const openPreview = () => {
    if (!props.value || !isValidUrl(props.value as string)) return;
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

  // Resim yöneticisini açma
  const openImageManager = () => {
    setIsModalOpen(true);
  };

  // Resim seçme fonksiyonu
  const handleImageSelect = (image: any) => {
    if (image) {
      const imageUrl = image.url;
      setImageError(null);

      // Orijinal onChange olayını simüle et
      if (props.onChange) {
        const simulatedEvent = {
          target: {
            name: props.name || "",
            value: imageUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        props.onChange(simulatedEvent);
      }
    }
    setIsModalOpen(false);
  };

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
        </div>
      )}

      <div
        className={twMerge(
          "relative flex items-center rounded-md border border-zinc-300 transition-all",
          "focus-within:border-zinc-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100",
          hasError ? "border-red-500 bg-red-50 ring-2 ring-red-100" : "",
        )}
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Images size={18} />
        </div>

        <input
          {...props}
          type="text"
          placeholder={props.placeholder || "https://example.com/image.jpg"}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-10 outline-none",
            props.className || "",
          )}
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {props.value && (
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
            onClick={openImageManager}
            className="flex items-center gap-0.5 rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200 hover:text-blue-700"
            title="Resim yöneticisini aç"
          >
            <ImagePlus size={14} className="mr-1 inline-block" />{" "}
            <span>Galeri</span>
          </button>

          <button
            type="button"
            disabled={!props.value || !isValidUrl(props.value as string)}
            onClick={openPreview}
            className={twMerge(
              "flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700",
              (!props.value || !isValidUrl(props.value as string)) &&
                "cursor-not-allowed opacity-50",
            )}
            title="Görseli önizle"
          >
            <Eye size={14} className="mr-1 inline-block" /> <span>Önizle</span>
          </button>
        </div>
      </div>

      {displayMessage && (
        <p className={`text-xs ${hasError ? "text-red-500" : "text-zinc-500"}`}>
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
                type="button"
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
                src={props.value as string}
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
              <p className="break-all">{props.value}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resim Yöneticisi Modalı */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
        singleSelect={true}
      />
    </div>
  );
};

ImagePreview.displayName = "Blog-ImagePreview";
