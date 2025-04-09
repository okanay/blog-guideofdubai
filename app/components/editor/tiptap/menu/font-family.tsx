import { Type } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectButton } from "./ui/select";
import { useTiptapContext } from "../store";

const FONT_FAMILY_OPTIONS = [
  { label: "Sans Serif", value: "var(--font-custom-sans)" },
  { label: "Serif", value: "var(--font-serif)" },
  { label: "Monospace", value: "var(--font-mono)" },
];

const FontFamilyButton = () => {
  const { editor } = useTiptapContext();
  const [selectedFont, setSelectedFont] = useState("");

  // Editör değiştiğinde veya seçim değiştiğinde aktif fontu güncelle
  useEffect(() => {
    if (!editor) return;

    const updateSelectedFont = () => {
      const currentFont = editor.getAttributes("textStyle").fontFamily || "";
      setSelectedFont(currentFont);
    };

    editor.on("selectionUpdate", updateSelectedFont);
    editor.on("update", updateSelectedFont);

    return () => {
      editor.off("selectionUpdate", updateSelectedFont);
      editor.off("update", updateSelectedFont);
    };
  }, [editor]);

  const handleFontChange = (fontValue: string) => {
    if (fontValue) {
      editor.chain().focus().setFontFamily(fontValue).run();
    } else {
      editor.chain().focus().unsetFontFamily().run();
    }

    setSelectedFont(fontValue);
  };

  return (
    <SelectButton
      options={FONT_FAMILY_OPTIONS}
      value={selectedFont}
      onChange={handleFontChange}
      icon={<Type size={16} />}
      label="Font Seçimi"
      isActive={!!selectedFont}
    />
  );
};

export { FontFamilyButton };
