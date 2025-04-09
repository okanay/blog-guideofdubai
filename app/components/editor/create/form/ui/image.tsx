// app/components/editor/create/ui/image-url-input.tsx
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Image, Eye, X, ExternalLink } from "lucide-react";

export interface ImageUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  isRequired?: boolean;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  value,
  onChange,
  label,
  helperText,
  error,
  containerClassName,
  labelClassName,
  isRequired = false,
  id = "image-url-input",
  disabled = false,
  placeholder = "https://example.com/image.jpg",
}) => {
  const [showPreview, setShowPreview] = useState(false);

  // Input stilini ayarla
  const inputStyles = twMerge(
    "w-full rounded-md border bg-white pl-3 pr-10 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2",
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-zinc-300 focus:border-primary-400 focus:ring-primary-100",
    disabled && "bg-zinc-50 text-zinc-500 cursor-not-allowed",
  );

  // URL kontrolü
  const isValidImageUrl = (url: string) => {
    return url.trim() !== "";
  };

  const togglePreview = () => {
    if (isValidImageUrl(value)) {
      setShowPreview(!showPreview);
    }
  };

  return (
    <div className={twMerge("mb-4", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            "mb-1.5 block text-sm font-medium text-zinc-700",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
          <Image size={16} />
        </div>

        <input
          id={id}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={twMerge(inputStyles, "pl-9")}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={helperText ? `${id}-description` : undefined}
          disabled={disabled}
        />

        {value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={togglePreview}
              className={twMerge(
                "rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700",
                !isValidImageUrl(value) && "cursor-not-allowed opacity-50",
              )}
              disabled={!isValidImageUrl(value)}
              aria-label="Görseli önizle"
              title="Görseli önizle"
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Hata mesajı veya yardım metni */}
      {error ? (
        <p className="mt-1 text-xs text-red-500" id={`${id}-error`}>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-zinc-500" id={`${id}-description`}>
          {helperText}
        </p>
      ) : null}

      {/* Önizleme Modalı */}
      {showPreview && (
        <ImagePreviewModal
          imageUrl={value}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

// Görsel Önizleme Modalı
interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageUrl,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError("Görsel yüklenemedi. URL geçersiz olabilir.");
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Başlık */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <h3 className="text-lg font-medium text-zinc-900">Görsel Önizleme</h3>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              title="Yeni sekmede aç"
            >
              <ExternalLink size={18} />
            </a>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              title="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal İçerik */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="flex min-h-64 items-center justify-center rounded-md bg-zinc-100">
            {isLoading && (
              <div className="text-center">
                <div className="border-t-primary-500 inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-300"></div>
                <p className="mt-2 text-sm text-zinc-600">
                  Görsel yükleniyor...
                </p>
              </div>
            )}

            {error && (
              <div className="p-6 text-center">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <X className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <img
              src={imageUrl}
              alt="Önizleme"
              className={twMerge(
                "h-auto max-w-full rounded",
                isLoading && "hidden",
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs break-all text-zinc-500">{imageUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
