import { Editor } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import MenuButton from "./ui/button";

type TextAlignButtonsProps = {
  editor: Editor;
};

const TextAlignButtons: React.FC<TextAlignButtonsProps> = ({ editor }) => {
  return (
    <>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        label="Sola Hizala"
      >
        <AlignLeft size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        label="Ortala"
      >
        <AlignCenter size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        label="Sağa Hizala"
      >
        <AlignRight size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        label="İki Yana Yasla"
      >
        <AlignJustify size={16} />
      </MenuButton>
    </>
  );
};

export default TextAlignButtons;
