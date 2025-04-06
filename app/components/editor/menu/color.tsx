import { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { PaintBucket, X } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { ZINC_COLORS, PRIMARY_COLORS, COMMON_COLORS } from "./constants";

// Color chip bileşeni - daha zarif ve sade
const ColorChip = ({
  color,
  isActive,
  onClick,
}: {
  color: string;
  isActive?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className="focus:ring-primary-400 relative flex size-6 items-center justify-center rounded-full border border-zinc-200 transition-all hover:scale-110 hover:shadow-sm focus:ring-1 focus:outline-none"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {isActive && (
        <div className="ring-primary-400 absolute inset-0 rounded-full ring-2 ring-offset-1"></div>
      )}
    </button>
  );
};

// Custom Color Button component
type ColorButtonProps = {
  editor: Editor;
};

const ColorButton = ({ editor }: ColorButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleSetColor = (colorValue: string) => {
    editor.chain().focus().setColor(colorValue).run();
    setIsModalOpen(false);
  };

  const handleUnsetColor = () => {
    editor.chain().focus().unsetColor().run();
    setIsModalOpen(false);
  };

  const handleColorPickerClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  // Şu anki aktif renk
  const currentColor = editor.getAttributes("textStyle").color;
  const isActive = !!currentColor;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-pressed={isActive}
        className="flex size-8 items-center justify-center rounded-md border border-transparent p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 aria-pressed:border-zinc-300 aria-pressed:bg-zinc-100"
        style={isActive ? { color: currentColor } : {}}
      >
        <PaintBucket size={16} />
      </button>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Metin Rengi"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Yaygın renkler */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Yaygın Renkler
            </h3>
            <div className="flex flex-wrap justify-start gap-3">
              {COMMON_COLORS.map((color, index) => (
                <ColorChip
                  key={`common-${index}`}
                  color={color.value}
                  isActive={currentColor === color.value}
                  onClick={() => handleSetColor(color.value)}
                />
              ))}
            </div>
          </div>

          {/* Zinc renkleri */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Gri Tonları
            </h3>
            <div className="flex flex-wrap justify-start gap-3">
              {ZINC_COLORS.map((color, index) => (
                <ColorChip
                  key={`zinc-${index}`}
                  color={color.value}
                  isActive={currentColor === color.value}
                  onClick={() => handleSetColor(color.value)}
                />
              ))}
            </div>
          </div>

          {/* Ana renkler - Daha zarif düzen */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Ana Renkler
            </h3>
            <div className="flex flex-wrap justify-start gap-3">
              {PRIMARY_COLORS.map((color, index) => (
                <ColorChip
                  key={`primary-${index}`}
                  color={color.value}
                  isActive={currentColor === color.value}
                  onClick={() => handleSetColor(color.value)}
                />
              ))}
            </div>
          </div>

          {/* Özel renk seçimi - Geliştirilmiş */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Özel Renk
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="relative size-6 cursor-pointer overflow-hidden rounded-full border border-zinc-200 transition-all hover:scale-110"
                onClick={handleColorPickerClick}
                style={{ backgroundColor: customColor }}
              >
                <input
                  ref={colorInputRef}
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <span className="text-xs text-zinc-500">{customColor}</span>
              <button
                onClick={() => handleSetColor(customColor)}
                className="focus:ring-primary-400 w-fit rounded border border-zinc-200 bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                Uygula
              </button>
            </div>
          </div>

          {/* Alt butonlar - Minimal tasarım */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            <button
              onClick={handleUnsetColor}
              className="flex items-center gap-1 rounded-full border border-red-400 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-red-500 focus:ring-1 focus:ring-red-400 focus:outline-none"
            >
              <X size={14} />
              <span>Kaldır</span>
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="focus:ring-primary-400 w-fit rounded-full border border-zinc-200 bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
            >
              Kapat
            </button>
          </div>
        </div>
      </RichButtonModal>
    </>
  );
};

export { ColorButton };
