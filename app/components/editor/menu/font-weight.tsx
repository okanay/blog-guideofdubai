// app/components/editor/menu/font-weight.tsx
import { Editor } from "@tiptap/react";
import { Bold } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectButton } from "./ui/select";

const fontWeightOptions = {
  0: {
    value: "400",
    label: "Normal",
  },
  1: {
    value: "500",
    label: "Medium",
  },
  2: {
    value: "600",
    label: "Semi Bold",
  },
  3: {
    value: "700",
    label: "Bold",
  },
  4: {
    value: "800",
    label: "Extra Bold",
  },
};

type Props = {
  editor: Editor;
};

const FontWeightButton: React.FC<Props> = ({ editor }) => {
  const [selectedFont, setSelectedFont] = useState<string | number>("");

  useEffect(() => {
    if (!editor) return;

    const updateSelectedFont = () => {
      const fontWeight = editor.getAttributes("textStyle").fontWeight;
      // Ağırlık değerini index'e çeviriyoruz
      if (fontWeight) {
        const index = Object.values(fontWeightOptions).findIndex(
          (option) => option.value === fontWeight,
        );
        setSelectedFont(index >= 0 ? index : "");
      } else {
        setSelectedFont("");
      }
    };

    editor.on("selectionUpdate", updateSelectedFont);
    editor.on("update", updateSelectedFont);

    return () => {
      editor.off("selectionUpdate", updateSelectedFont);
      editor.off("update", updateSelectedFont);
    };
  }, [editor]);

  const handleFontChange = (fontValue: string | number) => {
    if (fontValue || fontValue === 0) {
      const index =
        typeof fontValue === "number"
          ? fontValue
          : parseInt(fontValue as string);
      const weight = fontWeightOptions[index].value;

      // Artık setFontWeight komutunu kullanıyoruz
      editor.chain().focus().setFontWeight(weight).run();
    } else {
      editor.chain().focus().unsetFontWeight().run();
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
