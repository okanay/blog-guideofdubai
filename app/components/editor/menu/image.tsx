import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Image } from "lucide-react";
import RichButtonModal from "./ui/modal";

// Custom Image Button component
type ImageButtonProps = {
  editor: Editor;
};

const ImageButton = ({ editor }: ImageButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [validationError, setValidationError] = useState("");

  // URL güvenlik kontrolü
  const isValidUrl = (url: string): boolean => {
    try {
      // URL oluştur
      const parsedUrl = new URL(url);

      // Sadece https protokolü kontrolü
      if (parsedUrl.protocol !== "https:") {
        setValidationError("Sadece https protokolü desteklenmektedir");
        return false;
      }

      // Resim uzantısı kontrolü (opsiyonel)
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const hasValidExtension = validExtensions.some((ext) =>
        parsedUrl.pathname.toLowerCase().endsWith(ext),
      );

      if (!hasValidExtension) {
        setValidationError(
          "Geçerli bir resim URL'i giriniz (jpg, png, gif, webp, svg)",
        );
        return false;
      }

      setValidationError("");
      return true;
    } catch (error) {
      setValidationError("Geçersiz URL formatı");
      return false;
    }
  };

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;

    // URL kontrolü
    if (!isValidUrl(imageUrl.trim())) return;

    // Resmi ekle
    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
        alt: altText || "Resim",
      })
      .run();

    // Formu sıfırla ve modalı kapat
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setImageUrl("");
    setAltText("");
    setValidationError("");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Resim Ekle"
        className="flex size-8 items-center justify-center rounded-md border border-transparent p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 aria-pressed:border-zinc-300 aria-pressed:bg-zinc-100"
      >
        <Image size={16} />
      </button>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Resim Ekle"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Resim URL'i */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Görsel URL'i
            </h3>
            <input
              id="image-url"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              autoFocus
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationError}
              </p>
            )}
          </div>

          {/* Alt Text */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Alternatif Metin (Alt)
            </h3>
            <input
              id="alt-text"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Resim açıklaması (erişilebilirlik için)"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Görsel yüklenemediğinde gösterilecek ve ekran okuyucular
              tarafından okunacak metin
            </p>
          </div>

          {/* Alt butonlar */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="focus:ring-primary-400 w-fit rounded-full border border-zinc-200 bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertImage}
                className="focus:ring-primary-400 w-fit rounded-full border border-blue-500 bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!imageUrl.trim() || !!validationError}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </>
  );
};

export { ImageButton };
