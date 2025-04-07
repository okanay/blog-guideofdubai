import { Editor } from "@tiptap/react";
import { Bold } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectButton } from "./ui/select";
import { fontWeightOptions } from "../renderer/texts/font-weight";

type Props = {
  editor: Editor;
};

const FontWeightButton: React.FC<Props> = ({ editor }) => {
  const [selectedFont, setSelectedFont] = useState<string | number>("");

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

  const handleFontChange = (fontValue: string | number) => {
    console.log("Font changed to:", fontValue);
    if (fontValue || fontValue !== 0) {
      editor
        .chain()
        .focus()
        .toggleMark("fontWeight", {
          weight: fontWeightOptions[fontValue].label,
          index: fontValue,
        })
        .run();
    } else {
      editor.chain().focus().unsetMark("fontWeight").run();
    }

    setSelectedFont(fontValue);
  };

  const options = Object.values(fontWeightOptions).map((option, index) => ({
    label: option.label,
    value: index,
  }));

  return (
    <SelectButton
      options={options}
      value={selectedFont}
      onChange={handleFontChange}
      icon={<Bold size={16} />}
      label="Yazı Tipi"
      isActive={!!selectedFont}
    />
  );
};

export { FontWeightButton };
