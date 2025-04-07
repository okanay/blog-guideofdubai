import { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Underline, Type, PaintBucket, Circle } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { COMMON_COLORS } from "./constants";
import { twMerge } from "tailwind-merge";

// Dekorasyon tipleri ve stil seçenekleri
const DECORATION_TYPES = [
  { value: "underline", label: "Alta Çizgi", icon: Underline },
  { value: "overline", label: "Üste Çizgi", icon: Underline, rotate: true },
  { value: "line-through", label: "Üstü Çizili", icon: Type },
];

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

// Dekorasyon state tipi tanımı
interface DecorationState {
  type: string;
  style: string;
  thickness: string;
  color: string;
  offset: string;
  isActive: boolean;
}

// Buton bileşeni
export function TextDecorationButton({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Dekorasyon state'i
  const [decoration, setDecoration] = useState<DecorationState>({
    type: "underline",
    style: "solid",
    thickness: "2px",
    color: "#000",
    offset: "3px",
    isActive: false,
  });

  // State güncelleme yardımcı fonksiyonu
  const updateDecoration = (updates: Partial<DecorationState>) => {
    setDecoration((prev) => ({ ...prev, ...updates }));
  };

  // Editördeki mevcut dekorasyon durumunu izle
  useEffect(() => {
    if (!editor) return;

    const updateFromEditor = () => {
      // Tiptap altı çizili mark'ını kontrol et
      const isUnderline = editor.isActive("underline");

      // TextStyle içindeki dekorasyon durumunu kontrol et
      const textStyle = editor.getAttributes("textStyle");
      const textDecoration = textStyle.textDecoration;

      // Aktif dekorasyon
      const isActive = isUnderline || !!textDecoration;

      // Hiçbir dekorasyon yoksa, sadece aktif durumu güncelle
      if (!isActive) {
        updateDecoration({ isActive: false });
        return;
      }

      // Dekorasyon tipini belirle
      let type = "underline";
      if (textDecoration) {
        if (textDecoration.includes("underline")) type = "underline";
        else if (textDecoration.includes("overline")) type = "overline";
        else if (textDecoration.includes("line-through")) type = "line-through";
      }

      // Diğer özellikleri güncelle
      updateDecoration({
        type,
        style: textStyle.textDecorationStyle || "solid",
        thickness: textStyle.textDecorationThickness || "2px",
        color: textStyle.textDecorationColor || "currentColor",
        offset: textStyle.textUnderlineOffset || "3px",
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

  // Editörde dekorasyonu uygula
  const applyDecoration = () => {
    // Stil özellikleri
    const styleProps = {
      textDecoration: decoration.type,
      textDecorationStyle: decoration.style,
      textDecorationThickness: decoration.thickness,
      textDecorationColor: decoration.color,
    };

    // Underline için offset ekle
    if (decoration.type === "underline") {
      styleProps["textUnderlineOffset"] = decoration.offset;
    }

    // TextStyle mark'ını uygula
    editor.chain().focus().setMark("textStyle", styleProps).run();

    // Aktif olarak işaretle
    updateDecoration({ isActive: true });

    // Modalı kapat
    setIsOpen(false);
  };

  // Dekorasyonu kaldır
  const removeDecoration = () => {
    // Altı çiziliyi kaldır
    if (editor.isActive("underline")) {
      editor.chain().focus().unsetMark("underline").run();
    }

    // TextStyle özelliklerini temizle
    editor
      .chain()
      .focus()
      .setMark("textStyle", {
        textDecoration: null,
        textDecorationStyle: null,
        textDecorationThickness: null,
        textDecorationColor: null,
        textUnderlineOffset: null,
      })
      .run();

    // Aktif durumunu güncelle
    updateDecoration({ isActive: false });

    // Modalı kapat
    setIsOpen(false);
  };

  // Aktif dekorasyon göstergesi
  const isDecorationActive = decoration.isActive;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={twMerge(
          "flex size-8 items-center justify-center rounded-md border p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100",
          isDecorationActive
            ? "border-primary-300 bg-primary-50"
            : "border-transparent",
        )}
      >
        <Underline size={16} />
      </button>

      <RichButtonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Metin Dekorasyonu"
      >
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Dekorasyon Tipi */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-700">
                Dekorasyon Tipi
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {DECORATION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateDecoration({ type: type.value })}
                    className={twMerge(
                      "flex flex-col items-center justify-center gap-2 rounded-md border p-3 transition-all",
                      decoration.type === type.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-zinc-200 bg-zinc-100 hover:border-zinc-300",
                    )}
                  >
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <type.icon
                        size={18}
                        className={type.rotate ? "rotate-180 transform" : ""}
                      />
                    </div>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
                        textDecorationLine: "underline",

                        textDecorationThickness: decoration.thickness,
                        textDecorationColor:
                          decoration.color !== "currentColor"
                            ? decoration.color
                            : "#000",
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
                        color: "transparent",
                        textDecorationLine: "underline",
                        textDecorationThickness: thickness.value,
                        textDecorationColor:
                          decoration.color !== "currentColor"
                            ? decoration.color
                            : "#000",
                        textDecorationStyle: decoration.style as any,
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

            {/* Offset - Sadece underline için */}
            {decoration.type === "underline" && (
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
                          textDecorationColor:
                            decoration.color !== "currentColor"
                              ? decoration.color
                              : "currentColor",
                          textDecorationStyle: decoration.style as any,
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
            )}

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
                  onClick={() => updateDecoration({ color: "currentColor" })}
                  className={twMerge(
                    "relative flex size-8 items-center justify-center rounded-full border",
                    decoration.color === "currentColor"
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
                      decoration.color !== "currentColor"
                        ? decoration.color
                        : "#000000"
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
                style={
                  {
                    textDecorationLine: decoration.type,
                    textDecorationStyle: decoration.style,
                    textDecorationThickness: decoration.thickness,
                    textDecorationColor: decoration.color,
                    textUnderlineOffset:
                      decoration.type === "underline"
                        ? decoration.offset
                        : undefined,
                  } as any
                }
              >
                Örnek Metin
              </p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            <button
              onClick={removeDecoration}
              className="flex items-center gap-1 rounded-full border border-red-400 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-red-600"
            >
              Kaldır
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-fit rounded-full border border-zinc-200 bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100"
              >
                İptal
              </button>
              <button
                onClick={applyDecoration}
                className="border-primary-500 bg-primary-500 hover:bg-primary-600 w-fit rounded-full border px-6 py-2 text-sm font-medium text-white transition-all"
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
