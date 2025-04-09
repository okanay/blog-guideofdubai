// app/components/editor/menu/-underline.tsx
import { useState, useRef, useEffect } from "react";
import { Underline, Type, PaintBucket, Circle } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { COMMON_COLORS } from "./constants";
import { twMerge } from "tailwind-merge";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

// Dekorasyon stilleri ve seçenekleri
const LINE_STYLES = [
  { value: "solid", label: "Düz" },
  { value: "dashed", label: "Kesik" },
  { value: "dotted", label: "Noktalı" },
  { value: "double", label: "Çift" },
  { value: "wavy", label: "Dalgalı" },
];

const LINE_THICKNESS = [
  { value: "1px", label: "İnce" },
  { value: "2px", label: "Normal" },
  { value: "3px", label: "Kalın" },
];

// Offset değerleri (sadece underline için)
const OFFSET_VALUES = [
  { value: "1px", label: "Yakın" },
  { value: "3px", label: "Orta" },
  { value: "5px", label: "Uzak" },
];

// currentColor için özel bir değer kullanıyoruz (null ya da özel bir string)
const CURRENT_COLOR_VALUE = "current";

// Buton bileşeni
export const UnderlineButton = () => {
  const { editor } = useTiptapContext();
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Dekorasyon state'i
  const [decoration, setDecoration] = useState({
    underlineStyle: "solid",
    thickness: "2px",
    color: CURRENT_COLOR_VALUE, // varsayılan olarak currentColor
    offset: "3px",
    isActive: false,
  });

  // State güncelleme yardımcı fonksiyonu
  const updateDecoration = (updates: Partial<typeof decoration>) => {
    setDecoration((prev) => ({ ...prev, ...updates }));
  };

  // Editördeki mevcut dekorasyon durumunu izle
  useEffect(() => {
    if (!editor) return;

    const updateFromEditor = () => {
      // Tiptap Underline mark'ını kontrol et
      const isUnderlined = editor.isActive("underline");

      if (!isUnderlined) {
        updateDecoration({ isActive: false });
        return;
      }

      // Attributes'ları al
      const attrs = editor.getAttributes("underline");

      // State'i güncelle - renk null ise currentColor olarak ayarla
      updateDecoration({
        underlineStyle: attrs.underlineStyle || "solid",
        thickness: attrs.thickness || "2px",
        color: attrs.color || CURRENT_COLOR_VALUE,
        offset: attrs.offset || "3px",
        isActive: true,
      });
    };

    // Seçim veya içerik değiştiğinde güncelle
    editor.on("selectionUpdate", updateFromEditor);
    editor.on("update", updateFromEditor);

    // İlk yükleme için bir kez kontrol et
    updateFromEditor();

    // Temizlik fonksiyonu
    return () => {
      editor.off("selectionUpdate", updateFromEditor);
      editor.off("update", updateFromEditor);
    };
  }, [editor]);

  // Editörde underline uygula
  const applyUnderline = () => {
    editor
      .chain()
      .focus()
      .setUnderline({
        underlineStyle: decoration.underlineStyle,
        thickness: decoration.thickness,
        // Eğer currentColor değeri ise null gönder, değilse seçilen rengi gönder
        color:
          decoration.color !== CURRENT_COLOR_VALUE ? decoration.color : null,
        offset: decoration.offset,
      })
      .run();

    // Aktif olarak işaretle
    updateDecoration({ isActive: true });

    // Modalı kapat
    setIsOpen(false);
  };

  // Underline'ı kaldır
  const removeUnderline = () => {
    editor.chain().focus().unsetUnderline().run();

    // Aktif durumunu güncelle
    updateDecoration({ isActive: false });

    // Modalı kapat
    setIsOpen(false);
  };

  // Geçerli renk gösterimini belirle
  const getDisplayColor = (colorValue: string) => {
    return colorValue === CURRENT_COLOR_VALUE ? "currentColor" : colorValue;
  };

  return (
    <>
      <MenuButton
        onClick={() => setIsOpen(true)}
        isActive={editor.isActive("underline")}
        label="Alt Çizgi"
      >
        <Underline size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Alt Çizgi Biçimlendirme"
      >
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Çizgi Stili */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Çizgi Stili
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {LINE_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateDecoration({ underlineStyle: style.value })
                    }
                    className={twMerge(
                      "relative flex h-10 items-center justify-center rounded border px-2 py-1.5 transition-all",
                      decoration.underlineStyle === style.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300",
                    )}
                  >
                    <p
                      className="w-full text-center"
                      style={{
                        textDecorationLine: "underline",
                        textDecorationThickness: decoration.thickness,
                        textDecorationColor: getDisplayColor(decoration.color),
                        textDecorationStyle: style.value as any,
                        textUnderlineOffset: "2px",
                      }}
                    >
                      abc
                    </p>
                    <span className="absolute -bottom-5 text-[10px] font-medium text-zinc-500">
                      {style.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Çizgi Kalınlığı */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Kalınlık
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {LINE_THICKNESS.map((thickness) => (
                  <button
                    key={thickness.value}
                    onClick={() =>
                      updateDecoration({ thickness: thickness.value })
                    }
                    className={twMerge(
                      "relative flex h-10 items-center justify-center rounded border px-3 py-1.5 transition-all",
                      decoration.thickness === thickness.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300",
                    )}
                  >
                    <p
                      className="w-full text-center"
                      style={{
                        textDecorationLine: "underline",
                        textDecorationThickness: thickness.value,
                        textDecorationColor: getDisplayColor(decoration.color),
                        textDecorationStyle: decoration.underlineStyle as any,
                        textUnderlineOffset: "3px",
                      }}
                    >
                      abc
                    </p>
                    <span className="absolute -bottom-5 text-[10px] font-medium text-zinc-500">
                      {thickness.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Çizgi Mesafesi */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Çizgi Mesafesi
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {OFFSET_VALUES.map((offset) => (
                  <button
                    key={offset.value}
                    onClick={() => updateDecoration({ offset: offset.value })}
                    className={twMerge(
                      "relative flex h-12 flex-col items-center justify-center rounded border px-1 py-1.5 transition-all",
                      decoration.offset === offset.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300",
                    )}
                  >
                    <p
                      className="text-center"
                      style={{
                        textDecorationLine: "underline",
                        textDecorationThickness: decoration.thickness,
                        textDecorationColor: getDisplayColor(decoration.color),
                        textDecorationStyle: decoration.underlineStyle as any,
                        textUnderlineOffset: offset.value,
                      }}
                    >
                      abc
                    </p>
                    <span className="absolute -bottom-5 text-[10px] font-medium text-zinc-500">
                      {offset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Renk Seçimi */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">Renk</h3>
              <div className="flex flex-wrap gap-2">
                {/* Renkler */}
                {COMMON_COLORS.slice(0, 6).map((color, index) => (
                  <button
                    key={`color-${index}`}
                    onClick={() => updateDecoration({ color: color.value })}
                    className={twMerge(
                      "relative size-8 rounded-full border border-zinc-200",
                      decoration.color === color.value
                        ? "ring-primary-500 ring-2 ring-offset-1"
                        : "",
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                ))}

                {/* Varsayılan renk (currentColor) */}
                <button
                  onClick={() =>
                    updateDecoration({ color: CURRENT_COLOR_VALUE })
                  }
                  className={twMerge(
                    "relative flex size-8 items-center justify-center rounded-full border",
                    decoration.color === CURRENT_COLOR_VALUE
                      ? "border-primary-500 ring-primary-300 ring-2"
                      : "border-zinc-300",
                  )}
                >
                  <Circle size={16} className="text-zinc-700" />
                  <span className="absolute -bottom-5 text-[10px] font-medium text-nowrap text-zinc-500">
                    Metin Rengi
                  </span>
                </button>

                {/* Özel renk */}
                <div
                  className="relative size-8 cursor-pointer overflow-hidden rounded-full border border-zinc-200 hover:scale-105"
                  onClick={() => colorPickerRef.current?.click()}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PaintBucket size={14} />
                  </div>
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={
                      decoration.color === CURRENT_COLOR_VALUE
                        ? "#000000"
                        : decoration.color
                    }
                    onChange={(e) =>
                      updateDecoration({ color: e.target.value })
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
              </div>
            </div>

            {/* Önizleme */}
            <div className="mt-2 rounded-md border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Önizleme
              </h3>
              <p
                className="text-center text-lg text-zinc-800"
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: decoration.underlineStyle as any,
                  textDecorationThickness: decoration.thickness,
                  textDecorationColor: getDisplayColor(decoration.color),
                  textUnderlineOffset: decoration.offset,
                }}
              >
                Örnek Metin
              </p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            <button
              onClick={removeUnderline}
              className="flex items-center gap-1 rounded border border-red-400 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-red-600"
            >
              Kaldır
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-fit rounded border border-zinc-200 bg-zinc-50 px-6 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100"
              >
                İptal
              </button>
              <button
                onClick={applyUnderline}
                className="border-primary-500 bg-primary-500 hover:bg-primary-600 w-fit rounded border px-6 py-1.5 text-sm font-medium text-white transition-all"
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
