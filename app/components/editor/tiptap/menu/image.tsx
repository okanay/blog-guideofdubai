import { useState, useRef, useEffect } from "react";
import {
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LayoutGrid,
} from "lucide-react";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

// Görsel boyut ve hizalama tipleri
type ImageSize = "small" | "medium" | "large" | "fullscreen";
type ImageAlignment = "left" | "center" | "right";
type ImageFit = "cover" | "contain" | "fill" | "none";

// Boyut seçenekleri
const SIZE_OPTIONS = [
  { value: "small", label: "Küçük", width: "40%" },
  { value: "medium", label: "Orta", width: "70%" },
  { value: "large", label: "Büyük", width: "100%" },
  { value: "fullscreen", label: "Tam Ekran", width: "120%" },
];

// Hizalama seçenekleri
const ALIGNMENT_OPTIONS = [
  { value: "left", label: "Sol", icon: AlignLeft },
  { value: "center", label: "Merkez", icon: AlignCenter },
  { value: "right", label: "Sağ", icon: AlignRight },
];

// Object-fit seçenekleri
const OBJECT_FIT_OPTIONS = [
  {
    value: "cover",
    label: "Kapla",
    description: "Görsel alanı tamamen kaplar",
  },
  {
    value: "contain",
    label: "Sığdır",
    description: "Görsel tam olarak sığdırılır",
  },
  {
    value: "fill",
    label: "Doldur",
    description: "Görsel alana zorla doldurulur",
  },
  { value: "none", label: "Orjinal", description: "Orjinal boyutunda kalır" },
];

const EnhancedImageButton = () => {
  const { editor } = useTiptapContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");
  const [size, setSize] = useState<ImageSize>("medium");
  const [alignment, setAlignment] = useState<ImageAlignment>("center");
  const [objectFit, setObjectFit] = useState<ImageFit>("cover");
  const [caption, setCaption] = useState("");
  const [validationError, setValidationError] = useState("");

  // URL güvenlik kontrolü
  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "https:") {
        setValidationError("Sadece https protokolü desteklenmektedir");
        return false;
      }

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

  // Modal açılınca eğer zaten bir enhancedImage içindeysek, mevcut bilgileri al
  const handleOpenModal = () => {
    if (isActive) {
      const attrs = editor.getAttributes("enhancedImage");
      setImageUrl(attrs.src || "");
      setAltText(attrs.alt || "");
      setTitle(attrs.title || "");
      setSize(attrs.size || "fullscreen");
      setAlignment(attrs.alignment || "center");
      setObjectFit(attrs.objectFit || "cover");
      setCaption(attrs.caption || "");
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };

  // Gelişmiş görsel ekle
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;

    // URL kontrolü
    if (!isValidUrl(imageUrl.trim())) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "enhancedImage",
        attrs: {
          src: imageUrl,
          alt: altText || "Görsel",
          title: title || null,
          size: size,
          alignment: alignment,
          objectFit: objectFit,
          caption: caption || "",
        },
      })
      .run();

    resetForm();
    setIsModalOpen(false);
  };

  // Form sıfırlama
  const resetForm = () => {
    setImageUrl("");
    setAltText("");
    setTitle("");
    setSize("fullscreen");
    setAlignment("center");
    setObjectFit("cover");
    setCaption("");
    setValidationError("");
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("enhancedImage"));
    };

    editor.on("selectionUpdate", updateIsActive);
    editor.on("transaction", updateIsActive);
    return () => {
      editor.off("selectionUpdate", updateIsActive);
      editor.off("transaction", updateIsActive);
    };
  }, [editor]);

  return (
    <>
      <MenuButton
        onClick={handleOpenModal}
        isActive={isActive}
        label="Görsel Ekle"
      >
        <Image size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gelişmiş Görsel"
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Görsel URL'i */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Görsel URL'i
            </h3>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              autoFocus
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
          </div>

          {/* Alt Text ve Başlık */}
          <div className="flex flex-col gap-4 p-1">
            <div>
              <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
                Başlık (Opsiyonel)
              </h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Fare üzerine gelince görünen metin"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Alt Yazı */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Alt Yazı (Caption)
            </h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Görsel için açıklayıcı alt yazı (opsiyonel)"
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              rows={2}
            />
          </div>

          {/* Boyut Seçimi */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">Boyut</h3>
            <div className="grid grid-cols-4 gap-3">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSize(option.value as ImageSize)}
                  className={`flex flex-col items-center gap-2 rounded-md border p-3 transition-all ${
                    size === option.value
                      ? `border-primary-500 bg-primary-50`
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <div
                    className="h-6 w-full rounded bg-zinc-200"
                    style={{ width: option.width }}
                  ></div>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hizalama Seçimi */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">Hizalama</h3>
            <div className="grid grid-cols-3 gap-3">
              {ALIGNMENT_OPTIONS.map((option) => {
                const AlignIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setAlignment(option.value as ImageAlignment)}
                    className={`flex flex-col items-center gap-2 rounded-md border p-3 transition-all ${
                      alignment === option.value
                        ? `border-primary-500 bg-primary-50`
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                    }`}
                  >
                    <AlignIcon size={18} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Object-fit Seçimi */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Görsel Sığdırma
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {OBJECT_FIT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setObjectFit(option.value as ImageFit)}
                  className={`flex flex-col items-center gap-2 rounded-md border p-3 transition-all ${
                    objectFit === option.value
                      ? `border-primary-500 bg-primary-50`
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <LayoutGrid size={18} />
                  <div className="text-center">
                    <span className="block text-xs font-medium">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-[10px] text-zinc-500">
                      {option.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Alt butonlar */}
          <div className="flex justify-end border-t border-zinc-100 pt-3">
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 rounded-md border border-zinc-200 bg-zinc-50 px-6 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertImage}
                className="focus:ring-primary-400 border-primary-500 bg-primary-500 hover:bg-primary-600 rounded-md border px-6 py-1.5 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
                disabled={!imageUrl.trim() || !!validationError}
              >
                {isActive ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </>
  );
};

export { EnhancedImageButton };
