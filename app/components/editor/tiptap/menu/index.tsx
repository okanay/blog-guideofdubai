// prettier-ignore
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown, ChevronUp, Italic, List, Quote, SeparatorHorizontal, Subscript, Superscript } from "lucide-react";
import { useState } from "react";
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
import { HeadingButtons } from "./headings";

export const EditorRichMenu = () => {
  console.log("render");
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
                <HeadingButtons />
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
