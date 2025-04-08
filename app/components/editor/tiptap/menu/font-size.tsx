import { LetterText } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectButton } from "./ui/select";
import { FONT_SIZE_OPTIONS } from "../renderer/extensions/font-size";
import { useTiptapContext } from "../store";

const FontSizeButton = () => {
  const { editor } = useTiptapContext();
  const [selectedSize, setSelectedSize] = useState("");

  // Editör değiştiğinde veya seçim değiştiğinde aktif font boyutunu güncelle
  useEffect(() => {
    if (!editor) return;

    const updateSelectedSize = () => {
      const currentSize = editor.getAttributes("textStyle").fontSize || "";
      setSelectedSize(currentSize);
    };

    editor.on("selectionUpdate", updateSelectedSize);
    editor.on("update", updateSelectedSize);

    return () => {
      editor.off("selectionUpdate", updateSelectedSize);
      editor.off("update", updateSelectedSize);
    };
  }, [editor]);

  const handleSizeChange = (sizeValue: string) => {
    if (sizeValue && sizeValue !== "default") {
      editor.chain().focus().setFontSize(sizeValue).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
    setSelectedSize(sizeValue);
  };

  // Kullanıcı dostu etiketler içeren seçenekler
  const options = FONT_SIZE_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <SelectButton
      options={options}
      value={selectedSize}
      onChange={handleSizeChange}
      icon={<LetterText size={16} />}
      label="Yazı Boyutu"
      isActive={!!selectedSize}
    />
  );
};

export { FontSizeButton };
