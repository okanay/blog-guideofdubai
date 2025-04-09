import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react"; // prettier-ignore
import { useState, useEffect, useMemo } from "react";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

export const HeadingButtons = () => {
  const { editor } = useTiptapContext();
  const [activeHeadingLevel, setActiveHeadingLevel] = useState(0);

  // Heading bileşenlerini ve konfigürasyonlarını önbelleğe al
  const headingConfig = useMemo(
    () => [
      { Icon: Heading1, level: 1, label: "Başlık 1" },
      { Icon: Heading2, level: 2, label: "Başlık 2" },
      { Icon: Heading3, level: 3, label: "Başlık 3" },
      { Icon: Heading4, level: 4, label: "Başlık 4" },
      { Icon: Heading5, level: 5, label: "Başlık 5" },
      { Icon: Heading6, level: 6, label: "Başlık 6" },
    ],
    [],
  );

  useEffect(() => {
    const updateActiveHeading = () => {
      // Önce paragraf kontrolü - paragraf aktifse heading aktif olamaz
      if (editor.isActive("paragraph")) {
        setActiveHeadingLevel(0);
        return;
      }

      // Aktif heading seviyesini bul
      const level =
        [1, 2, 3, 4, 5, 6].find((level) =>
          editor.isActive("heading", { level }),
        ) || 0;

      setActiveHeadingLevel(level);
    };

    // Event listener'ları ekle
    editor.on("selectionUpdate", updateActiveHeading);
    editor.on("transaction", updateActiveHeading);

    // İlk durum kontrolü
    updateActiveHeading();

    // Cleanup
    return () => {
      editor.off("selectionUpdate", updateActiveHeading);
      editor.off("transaction", updateActiveHeading);
    };
  }, [editor]);

  return (
    <>
      {headingConfig.map(({ Icon, level, label }) => (
        <MenuButton
          key={level}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as any })
              .run()
          }
          isActive={activeHeadingLevel === level}
          label={label}
        >
          <Icon size={16} />
        </MenuButton>
      ))}
    </>
  );
};
