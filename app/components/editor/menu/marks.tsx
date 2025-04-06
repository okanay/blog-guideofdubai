import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript } from "lucide-react"; // prettier-ignore
import MenuButton from "./ui/button";
import { ColorButton } from "./color";
import { FontFamilyButton } from "./font-family";

type Props = {
  editor: Editor;
};

const MarksButtons: React.FC<Props> = ({ editor }) => {
  return (
    <>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        label="Kalın"
      >
        <Bold size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        label="İtalik"
      >
        <Italic size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        label="Altı Çizili"
      >
        <Underline size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        label="Üst Çizili"
      >
        <Strikethrough size={16} />
      </MenuButton>
      <FontFamilyButton editor={editor} />
      <ColorButton editor={editor} />
    </>
  );
};

export default MarksButtons;
