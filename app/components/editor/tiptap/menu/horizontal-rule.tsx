import { SeparatorHorizontal } from "lucide-react";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

export const HorizontalRuleButton = () => {
  const { editor } = useTiptapContext();

  return (
    <MenuButton
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      isActive={false} // Yatay çizgi için isActive her zaman false olacak
      label="Yatay Çizgi"
    >
      <SeparatorHorizontal size={16} />
    </MenuButton>
  );
};
