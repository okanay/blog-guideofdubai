// app/components/editor/menu/strikethrough.tsx
import { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Strikethrough, PaintBucket, Circle } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { COMMON_COLORS } from "./constants";
import { twMerge } from "tailwind-merge";

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

// Buton bileşeni
export function StrikethroughButton({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Dekorasyon state'i
  const [decoration, setDecoration] = useState({
    style: "solid",
    thickness: "2px",
    color: "#000",
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
      // Tiptap Strikethrough mark'ını kontrol et
      const isStrikethrough = editor.isActive("strikethrough");

      if (!isStrikethrough) {
        updateDecoration({ isActive: false });
        return;
      }

      // Attributes'ları al
      const attrs = editor.getAttributes("strikethrough");

      // State'i güncelle
      updateDecoration({
        style: attrs.style || "solid",
        thickness: attrs.thickness || "2px",
        color: attrs.color || "#000",
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

  // Editörde strikethrough uygula
  const applyStrikethrough = () => {
    editor
      .chain()
      .focus()
      .setStrikethrough({
        style: decoration.style,
        thickness: decoration.thickness,
        color: decoration.color !== "#000" ? decoration.color : null,
      })
      .run();

    // Aktif olarak işaretle
    updateDecoration({ isActive: true });

    // Modalı kapat
    setIsOpen(false);
  };

  // Strikethrough'u kaldır
  const removeStrikethrough = () => {
    editor.chain().focus().unsetStrikethrough().run();

    // Aktif durumunu güncelle
    updateDecoration({ isActive: false });

    // Modalı kapat
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={twMerge(
          "flex size-8 items-center justify-center rounded-md border p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100",
          decoration.isActive
            ? "border-primary-300 bg-primary-50"
            : "border-transparent",
        )}
        title="Üstü Çizili"
      >
        <Strikethrough size={16} />
      </button>

      <RichButtonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Üstü Çizili Biçimlendirme"
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
                    onClick={() => updateDecoration({ style: style.value })}
                    className={twMerge(
                      "relative flex h-10 items-center justify-center rounded border px-2 py-1.5 transition-all",
                      decoration.style === style.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300",
                    )}
                  >
                    <p
                      className="w-full text-center"
                      style={{
                        color: "transparent",
                        textDecorationLine: "line-through",
                        textDecorationThickness: decoration.thickness,
                        textDecorationColor:
                          decoration.color !== "#000"
                            ? decoration.color
                            : "currentColor",
                        textDecorationStyle: style.value as any,
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
                        color: "transparent",
                        textDecorationLine: "line-through",
                        textDecorationThickness: thickness.value,
                        textDecorationColor:
                          decoration.color !== "#000"
                            ? decoration.color
                            : "currentColor",
                        textDecorationStyle: decoration.style as any,
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

                {/* Varsayılan renk */}
                <button
                  onClick={() => updateDecoration({ color: "#000" })}
                  className={twMerge(
                    "relative flex size-8 items-center justify-center rounded-full border",
                    decoration.color === "#000"
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
                    value={decoration.color}
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
                  textDecorationLine: "line-through",
                  textDecorationStyle: decoration.style as any,
                  textDecorationThickness: decoration.thickness,
                  textDecorationColor: decoration.color,
                }}
              >
                Örnek Metin
              </p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            <button
              onClick={removeStrikethrough}
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
                onClick={applyStrikethrough}
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
}
