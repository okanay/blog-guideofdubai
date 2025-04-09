import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronUp,
  Eye,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  Pickaxe,
  Quote,
  SeparatorHorizontal,
  Subscript,
  Superscript,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useTiptapContext } from "../store";
import { AlertBoxButton } from "./alert-box";
import { FontFamilyButton } from "./font-family";
import { FontSizeButton } from "./font-size";
import { FontWeightButton } from "./font-weight";
import { HighlightButton } from "./highlight";
import { EnhancedImageButton } from "./image";
import { LinkButton } from "./link";
import { StrikeThroughButton } from "./strike-through";
import MenuButton from "./ui/button";
import { UnderlineButton } from "./underline";

export const EditorRichMenu = () => {
  const { editor } = useTiptapContext();
  const [hidden, setHidden] = useState(false);

  return (
    <div className="sticky top-0 right-0 z-40">
      <div className="sticky w-full border-b border-zinc-200 bg-zinc-100">
        <div className="mx-auto w-full">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1">
            <h1 className="text-color-font text-xs font-semibold">
              Metin Editörü
            </h1>

            <button
              onClick={() => setHidden(!hidden)}
              className={`flex w-20 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                !hidden
                  ? "bg-primary text-color-primary"
                  : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
              }`}
            >
              {hidden ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              <span>{hidden ? "Gizli" : "Göster"}</span>
            </button>
          </div>

          <div
            aria-hidden={hidden}
            className="border-t border-zinc-200 bg-white py-2 transition-[padding_,border] duration-300 aria-hidden:border-t-0 aria-hidden:py-0"
          >
            <div
              aria-hidden={hidden}
              className="mx-auto grid max-w-5xl grid-rows-[1fr] bg-white px-4 transition-[grid_template_rows] duration-300 aria-hidden:grid-rows-[0fr]"
            >
              <div className="custom-scrollbar flex min-h-0 max-w-5xl flex-wrap items-center justify-start gap-1">
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 1 })}
                  label="Başlık 1"
                >
                  <Heading1 size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 2 })}
                  label="Başlık 2"
                >
                  <Heading2 size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 3 })}
                  label="Başlık 3"
                >
                  <Heading3 size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 4 })}
                  label="Başlık 4"
                >
                  <Heading4 size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 5 })}
                  label="Başlık 5"
                >
                  <Heading5 size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 6 })}
                  label="Başlık 6"
                >
                  <Heading6 size={16} />
                </MenuButton>

                <EnhancedImageButton />
                <LinkButton />
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                  label="Alıntı"
                >
                  <Quote size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                  label="Madde İşaretli Liste"
                >
                  <List size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  isActive={editor.isActive("subscript")}
                  label="Alt Simge"
                >
                  <Subscript size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleSuperscript().run()
                  }
                  isActive={editor.isActive("superscript")}
                  label="Üst Simge"
                >
                  <Superscript size={16} />
                </MenuButton>

                {/* Biçimlendirme Butonları - format kategorisine ait */}

                <MenuButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  label="İtalik"
                >
                  <Italic size={16} />
                </MenuButton>
                <FontWeightButton />
                <FontSizeButton />
                <UnderlineButton />
                <StrikeThroughButton />
                <FontFamilyButton />
                <HighlightButton />

                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                  label="Sola Hizala"
                >
                  <AlignLeft size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                  label="Ortala"
                >
                  <AlignCenter size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                  label="Sağa Hizala"
                >
                  <AlignRight size={16} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  isActive={editor.isActive({ textAlign: "justify" })}
                  label="İki Yana Yasla"
                >
                  <AlignJustify size={16} />
                </MenuButton>

                <AlertBoxButton />
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                  isActive={false}
                  label="Yatay Çizgi"
                >
                  <SeparatorHorizontal size={16} />
                </MenuButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
