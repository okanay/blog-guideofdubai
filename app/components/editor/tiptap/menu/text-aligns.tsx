import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

export const TextAlignButtons = () => {
  const { editor } = useTiptapContext();
  const [activeAlignment, setActiveAlignment] = useState<string | null>(null);

  // Hizalama butonları yapılandırması
  const alignConfig = useMemo(
    () => [
      {
        Icon: AlignLeft,
        value: "left",
        label: "Sola Hizala",
        command: () => editor.chain().focus().setTextAlign("left").run(),
      },
      {
        Icon: AlignCenter,
        value: "center",
        label: "Ortala",
        command: () => editor.chain().focus().setTextAlign("center").run(),
      },
      {
        Icon: AlignRight,
        value: "right",
        label: "Sağa Hizala",
        command: () => editor.chain().focus().setTextAlign("right").run(),
      },
      {
        Icon: AlignJustify,
        value: "justify",
        label: "İki Yana Yasla",
        command: () => editor.chain().focus().setTextAlign("justify").run(),
      },
    ],
    [editor],
  );

  useEffect(() => {
    const updateActiveAlignment = () => {
      // Tüm olası hizalamaları kontrol et
      const alignment = alignConfig.find((align) =>
        editor.isActive({ textAlign: align.value }),
      );

      setActiveAlignment(alignment ? alignment.value : null);
    };

    // Event listener'ları ekle
    editor.on("selectionUpdate", updateActiveAlignment);
    editor.on("transaction", updateActiveAlignment);

    // İlk durum kontrolü
    updateActiveAlignment();

    // Cleanup
    return () => {
      editor.off("selectionUpdate", updateActiveAlignment);
      editor.off("transaction", updateActiveAlignment);
    };
  }, [editor, alignConfig]);

  return (
    <>
      {alignConfig.map(({ Icon, value, label, command }) => (
        <MenuButton
          key={value}
          onClick={command}
          isActive={activeAlignment === value}
          label={label}
        >
          <Icon size={16} />
        </MenuButton>
      ))}
    </>
  );
};
