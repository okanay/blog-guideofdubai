import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react"; // prettier-ignore
import MenuButton from "./ui/button";

type Props = {
  editor: Editor;
};

const HeaderButtons: React.FC<Props> = ({ editor }) => {
  return (
    <>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        label="Başlık 1"
      >
        <Heading1 size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        label="Başlık 2"
      >
        <Heading2 size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        label="Başlık 3"
      >
        <Heading3 size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        isActive={editor.isActive("heading", { level: 4 })}
        label="Başlık 4"
      >
        <Heading4 size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        isActive={editor.isActive("heading", { level: 5 })}
        label="Başlık 5"
      >
        <Heading5 size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        isActive={editor.isActive("heading", { level: 6 })}
        label="Başlık 6"
      >
        <Heading6 size={16} />
      </MenuButton>
    </>
  );
};

export default HeaderButtons;
