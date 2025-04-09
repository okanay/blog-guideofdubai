import { Superscript } from "lucide-react";
import { useState, useEffect } from "react";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

export const SuperscriptButton = () => {
  const { editor } = useTiptapContext();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("superscript"));
    };

    // Event listener'ları ekle
    editor.on("selectionUpdate", updateIsActive);
    editor.on("transaction", updateIsActive);

    // İlk durum kontrolü
    updateIsActive();

    // Cleanup
    return () => {
      editor.off("selectionUpdate", updateIsActive);
      editor.off("transaction", updateIsActive);
    };
  }, [editor]);

  return (
    <MenuButton
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
      isActive={isActive}
      label="Üst Simge"
    >
      <Superscript size={16} />
    </MenuButton>
  );
};
