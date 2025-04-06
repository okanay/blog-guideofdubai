import { Editor } from "@tiptap/react";
import { Info, List, Quote, SeparatorHorizontal, Subscript, Superscript, TypeIcon } from "lucide-react"; // prettier-ignore
import HeaderButtons from "./headers";
import { ImageButton } from "./image";
import { LinkButton } from "./link";
import MarksButtons from "./marks";
import TextAlignButtons from "./text-aligns";
import MenuButton from "./ui/button";
import Divider from "./ui/divider-x";

type Props = {
  editor: Editor;
};

export const EditorRichMenu = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-zinc-400 bg-white p-2">
      <HeaderButtons editor={editor} />
      <Divider />
      <MarksButtons editor={editor} />
      <Divider />
      <TextAlignButtons editor={editor} />
      <Divider />
      <ImageButton editor={editor} />
      <LinkButton editor={editor} />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        label="Alıntı"
      >
        <Quote size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        label="Madde İşaretli Liste"
      >
        <List size={16} />
      </MenuButton>
      <Divider />

      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        label="Yatay Çizgi"
      >
        <SeparatorHorizontal size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive("subscript")}
        label="Alt"
      >
        <Subscript size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive("superscript")}
        label="Üst"
      >
        <Superscript size={16} />
      </MenuButton>
      <MenuButton
        onClick={() =>
          editor.commands.setNode("infoNode", {
            type: "information",
            title: "test",
          })
        }
        isActive={editor.isActive("infoNode")}
        label="Bilgi"
      >
        <Info size={16} />
      </MenuButton>
      <MenuButton
        onClick={() => {
          const isActive = editor.isActive("fontWeight");
          if (isActive) {
            editor.chain().focus().unsetMark("fontWeight").run();
          } else {
            editor
              .chain()
              .focus()
              .toggleMark("fontWeight", { family: "font-bold", index: 6 })
              .run();
          }
        }}
        isActive={editor.isActive("fontWeight")}
        label="fontWeight"
      >
        <TypeIcon size={16} />
      </MenuButton>
    </div>
  );
};
