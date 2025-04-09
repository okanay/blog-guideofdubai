import { Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

export const BlockquoteButton = () => {
  const { editor } = useTiptapContext();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("blockquote"));
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
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      isActive={isActive}
      label="Alıntı"
    >
      <Quote size={16} />
    </MenuButton>
  );
};
