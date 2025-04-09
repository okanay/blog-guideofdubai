import { Highlighter, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

// Hazır stil setleri
// Hazır stil setleri
const PRESET_STYLES = [
  {
    name: "Temiz",
    style: {
      backgroundColor: "",
      padding: "0rem 0rem",
      borderRadius: "0rem",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "",
      textColor: "",
    },
  },
  {
    name: "Mavi Kutu",
    style: {
      backgroundColor: "#EFF6FF",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.5rem",
      borderWidth: "1",
      borderStyle: "solid",
      borderColor: "#3B82F6",
      textColor: "#1E40AF",
    },
  },
  {
    name: "Kırmızı Uyarı",
    style: {
      backgroundColor: "#FEF2F2",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.25rem",
      borderWidth: "1",
      borderStyle: "dashed",
      borderColor: "#EF4444",
      textColor: "#B91C1C",
    },
  },
  {
    name: "Yeşil Not",
    style: {
      backgroundColor: "#ECFDF5",
      padding: "0.35rem 0.65rem",
      borderRadius: "0.25rem",
      borderWidth: "1",
      borderStyle: "solid",
      borderColor: "#10B981",
      textColor: "#047857",
    },
  },
  // Yeni eklenen stiller
  {
    name: "Sarı Vurgu",
    style: {
      backgroundColor: "#FFFBEB",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.25rem",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "",
      textColor: "#92400E",
    },
  },
  {
    name: "Mor Panel",
    style: {
      backgroundColor: "#F5F3FF",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.5rem",
      borderWidth: "1",
      borderStyle: "solid",
      borderColor: "#8B5CF6",
      textColor: "#5B21B6",
    },
  },
  {
    name: "Gri Çerçeve",
    style: {
      backgroundColor: "transparent",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.5rem",
      borderWidth: "1",
      borderStyle: "solid",
      borderColor: "#71717A",
      textColor: "#3F3F46",
    },
  },
];

// Border radius seçenekleri
const BORDER_RADIUS_OPTIONS = [
  { value: "0", label: "Köşeli" },
  { value: "0.25rem", label: "Mini" },
  { value: "0.5rem", label: "Normal" },
  { value: "0.75rem", label: "Geniş" },
  { value: "9999px", label: "Yuvarlak" },
];

// Border style seçenekleri
const BORDER_STYLE_OPTIONS = [
  { value: "none", label: "Yok" },
  { value: "solid", label: "Düz" },
  { value: "dashed", label: "Kesik" },
  { value: "dotted", label: "Noktalı" },
];

export const HighlightButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgColorPickerRef = useRef<HTMLInputElement>(null);
  const borderColorPickerRef = useRef<HTMLInputElement>(null);
  const textColorPickerRef = useRef<HTMLInputElement>(null);

  const [currentStyle, setCurrentStyle] = useState({
    backgroundColor: "",
    paddingX: "0.5",
    paddingY: "0.25",
    borderRadius: "0rem",
    borderWidth: "0",
    borderStyle: "none",
    borderColor: "",
    textColor: "",
  });

  // Modal açıldığında mevcut highlight özellikleri varsa al
  const handleOpenModal = () => {
    if (editor.isActive("highlight")) {
      const attrs = editor.getAttributes("highlight");

      // Padding ayrıştırma
      let paddingX = "0.5";
      let paddingY = "0.25";
      if (attrs.padding) {
        const parts = attrs.padding.split(/\s+/);
        if (parts.length >= 2) {
          paddingY = parts[0].replace("rem", "");
          paddingX = parts[1].replace("rem", "");
        }
      }

      // Border ayrıştırma
      let borderWidth = "1";
      let borderStyle = "none";
      let borderColor = "#000000";

      if (attrs.border) {
        const borderParts = attrs.border.split(/\s+/);
        if (borderParts.length >= 3) {
          borderWidth = borderParts[0].replace("px", "");
          borderStyle = borderParts[1];
          borderColor = borderParts[2];
        }
      }

      setCurrentStyle({
        backgroundColor: attrs.backgroundColor || "#FFFBEB",
        paddingX,
        paddingY,
        borderRadius: attrs.borderRadius || "0.25rem",
        borderWidth,
        borderStyle,
        borderColor,
        textColor: attrs.color || "#000000", // Metin rengini mevcut niteliklerden al
      });
    }
    setIsModalOpen(true);
  };

  // Hazır stili uygula
  const applyPresetStyle = (preset: (typeof PRESET_STYLES)[0]) => {
    const { style } = preset;

    // Padding ayrıştırma
    let paddingX = "0.5";
    let paddingY = "0.25";
    if (style.padding) {
      const parts = style.padding.split(/\s+/);
      if (parts.length >= 2) {
        paddingY = parts[0].replace("rem", "");
        paddingX = parts[1].replace("rem", "");
      }
    }

    setCurrentStyle({
      backgroundColor: style.backgroundColor,
      paddingX,
      paddingY,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      borderStyle: style.borderStyle,
      borderColor: style.borderColor,
      textColor: style.textColor || "#000000", // Metin rengini hazır stilden al
    });
  };

  // Highlight'ı uygula
  const applyHighlight = () => {
    // Padding ve border oluşturma
    const padding = `${currentStyle.paddingY}rem ${currentStyle.paddingX}rem`;
    const border =
      currentStyle.borderStyle !== "none"
        ? `${currentStyle.borderWidth}px ${currentStyle.borderStyle} ${currentStyle.borderColor}`
        : "";

    // Editor'a uygula
    editor
      .chain()
      .focus()
      .setHighlight({
        backgroundColor: currentStyle.backgroundColor,
        padding,
        borderRadius: currentStyle.borderRadius,
        border,
        color: currentStyle.textColor, // Metin rengini highlight özelliklerine ekle
      })
      .run();

    setIsModalOpen(false);
  };

  // Highlight'ı kaldır
  const removeHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
    setIsModalOpen(false);
  };

  // Style güncellemesi
  const updateStyle = (updates: Partial<typeof currentStyle>) => {
    setCurrentStyle((prev) => ({ ...prev, ...updates }));
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("textStyle"));
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
      <MenuButton onClick={handleOpenModal} isActive={isActive} label="Vurgula">
        <Highlighter size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Metin Vurgulama"
      >
        <div className="flex flex-col gap-y-5">
          {/* Hazır Stil Setleri */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Hazır Stiller
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_STYLES.map((preset, index) => (
                <button
                  key={`preset-${index}`}
                  onClick={() => applyPresetStyle(preset)}
                  className="flex items-center justify-center rounded border border-zinc-200 bg-zinc-50 py-2 text-sm hover:bg-zinc-100"
                >
                  <span
                    className="mx-2 inline-block px-2 py-1"
                    style={{
                      backgroundColor: preset.style.backgroundColor,
                      padding: preset.style.padding,
                      borderRadius: preset.style.borderRadius,
                      border:
                        preset.style.borderWidth !== "0"
                          ? `${preset.style.borderWidth}px ${preset.style.borderStyle} ${preset.style.borderColor}`
                          : undefined,
                      color: preset.style.textColor, // Metin rengini önizlemede kullan
                    }}
                  >
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {/* Arkaplan Rengi */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Arkaplan Rengi
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="relative size-8 cursor-pointer overflow-hidden rounded border border-zinc-200"
                  style={{ backgroundColor: currentStyle.backgroundColor }}
                  onClick={() => bgColorPickerRef.current?.click()}
                >
                  <input
                    ref={bgColorPickerRef}
                    type="color"
                    value={currentStyle.backgroundColor}
                    onChange={(e) =>
                      updateStyle({ backgroundColor: e.target.value })
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <span className="flex-1 text-sm text-zinc-600">
                  {currentStyle.backgroundColor}
                </span>
              </div>
            </div>

            {/* Text Rengi */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Metin Rengi
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="relative size-8 cursor-pointer overflow-hidden rounded border border-zinc-200"
                  style={{ backgroundColor: currentStyle.textColor }}
                  onClick={() => textColorPickerRef.current?.click()}
                >
                  <input
                    ref={textColorPickerRef}
                    type="color"
                    value={currentStyle.textColor}
                    onChange={(e) => updateStyle({ textColor: e.target.value })}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <span className="flex-1 text-sm text-zinc-600">
                  {currentStyle.textColor}
                </span>
              </div>
            </div>
          </div>

          {/* Padding Ayarları */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              İç Boşluk (rem)
            </h3>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col">
                <label className="mb-1 text-xs text-zinc-500">Dikey (Y)</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.05"
                  value={currentStyle.paddingY}
                  onChange={(e) => updateStyle({ paddingY: e.target.value })}
                  className="w-full rounded border border-zinc-200 px-3 py-1.5 text-sm"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <label className="mb-1 text-xs text-zinc-500">Yatay (X)</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  step="0.05"
                  value={currentStyle.paddingX}
                  onChange={(e) => updateStyle({ paddingX: e.target.value })}
                  className="w-full rounded border border-zinc-200 px-3 py-1.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Köşe Yuvarlaklığı */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Köşe Yuvarlaklığı
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {BORDER_RADIUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateStyle({ borderRadius: option.value })}
                  className={twMerge(
                    "flex flex-col items-center justify-center rounded border py-2 text-xs transition-all",
                    currentStyle.borderRadius === option.value
                      ? "border-primary-500 bg-primary-50 font-medium"
                      : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100",
                  )}
                >
                  <div
                    className="mb-1 h-5 w-10 border border-zinc-300 bg-zinc-100"
                    style={{ borderRadius: option.value }}
                  ></div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Kenarlık Ayarları */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Kenarlık Ayarları
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Kenarlık Kalınlığı */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-zinc-500">
                  Kalınlık (px)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={currentStyle.borderWidth}
                  onChange={(e) => updateStyle({ borderWidth: e.target.value })}
                  className="w-full rounded border border-zinc-200 px-3 py-1.5 text-sm"
                />
              </div>

              {/* Kenarlık Stili */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-zinc-500">Stil</label>
                <select
                  value={currentStyle.borderStyle}
                  onChange={(e) => updateStyle({ borderStyle: e.target.value })}
                  className="w-full rounded border border-zinc-200 px-3 py-1.5 text-sm"
                >
                  {BORDER_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kenarlık Rengi */}
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-zinc-500">Renk</label>
                <div className="flex h-[34px] items-center gap-2 rounded border border-zinc-200 bg-white px-2">
                  <div
                    className="relative size-5 cursor-pointer overflow-hidden rounded border border-zinc-200"
                    style={{ backgroundColor: currentStyle.borderColor }}
                    onClick={() => borderColorPickerRef.current?.click()}
                  >
                    <input
                      ref={borderColorPickerRef}
                      type="color"
                      value={currentStyle.borderColor}
                      onChange={(e) =>
                        updateStyle({ borderColor: e.target.value })
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <span className="text-sm text-zinc-600">
                    {currentStyle.borderColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Önizleme */}
          <div className="mt-2 rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-center text-lg">
              <span
                style={{
                  backgroundColor: currentStyle.backgroundColor,
                  padding: `${currentStyle.paddingY}rem ${currentStyle.paddingX}rem`,
                  borderRadius: currentStyle.borderRadius,
                  border:
                    currentStyle.borderStyle !== "none"
                      ? `${currentStyle.borderWidth}px ${currentStyle.borderStyle} ${currentStyle.borderColor}`
                      : undefined,
                  color: currentStyle.textColor, // Önizlemede metin rengini uygula
                }}
              >
                Örnek Metin
              </span>
            </p>
          </div>

          {/* Butonlar */}
          <div className="mt-2 flex justify-between border-t border-zinc-100 pt-4">
            <button
              onClick={removeHighlight}
              className="flex items-center gap-1 rounded border border-red-400 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-red-600 focus:ring-1 focus:ring-red-400 focus:outline-none"
            >
              <X size={14} />
              <span>Kaldır</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 w-fit rounded border border-zinc-200 bg-zinc-50 px-6 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={applyHighlight}
                className="border-primary-500 bg-primary-500 hover:bg-primary-600 focus:ring-primary-400 w-fit rounded border px-6 py-1.5 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </>
  );
};
