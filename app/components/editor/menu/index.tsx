import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronUp,
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
import { ColorButton } from "./color";
import { FontFamilyButton } from "./font-family";
import { FontWeightButton } from "./font-weight";
import { ImageButton } from "./image";
import { LinkButton } from "./link";
import MenuButton from "./ui/button";
import { twMerge } from "tailwind-merge";
import { useIsActive } from "@/hooks/use-isActive";
import { FontSizeButton } from "./font-size";
import { TextDecorationButton } from "./text-decoration";
import { AlertBoxButton } from "./alert-box";
import { useState } from "react";

type Props = {
  editor: Editor;
};

export const EditorRichMenu = ({ editor }: Props) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Menüyü göster/gizle
  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const Categories = [
    { label: "Hepsini Göster", value: "all", icon: SeparatorHorizontal },
    { label: "Tip", value: "types", icon: Heading },
    { label: "Biçim", value: "format", icon: Bold },
    { label: "Özel Modüller", value: "special", icon: Pickaxe },
  ];

  const { isHidden, isCategoryActive, toggleCategory } = useIsActive(
    Categories,
    Categories[0],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-1000">
      <div className="pointer-events-auto absolute bottom-0 left-0 w-full bg-white py-4">
        <div className="mx-auto flex w-full max-w-lg flex-col border border-zinc-200 bg-white sm:rounded-lg">
          <div className="text-color-primary pointer-events-auto flex items-center justify-between bg-zinc-700 px-2 py-2 sm:rounded-t-lg">
            <h1 className="text-xs font-semibold">Metin Editörü</h1>
            <div className="flex items-center justify-end gap-3">
              {Categories.map((category) => (
                <div key={category.value} className="group relative">
                  <button
                    className={twMerge(
                      `rounded-md px-2 py-1 text-xs font-semibold`,
                      isCategoryActive(category)
                        ? "text-color-font bg-zinc-50"
                        : "text-color-font-invert bg-zinc-600",
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    {<category.icon className="size-3.5" />}
                  </button>

                  {/* Hover ile görünen tooltip */}
                  <div className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {category.label}
                  </div>
                </div>
              ))}

              <div className="group relative">
                <button
                  aria-hidden={isMenuVisible}
                  className="bg-primary rounded-md px-2 py-1 text-xs font-semibold"
                  onClick={toggleMenuVisibility}
                >
                  <ChevronDown
                    className="size-3.5 transition-all duration-300 aria-hidden:rotate-180"
                    aria-hidden={isMenuVisible}
                  />
                </button>

                {/* Hover ile görünen tooltip */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {isMenuVisible ? "Gizle" : "Göster"}
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden={isMenuVisible}
            className="grid grid-rows-[1fr] transition-all aria-hidden:grid-rows-[0fr] aria-hidden:overflow-hidden aria-hidden:py-0 sm:[&>div]:last:rounded-b-lg"
          >
            <div className="flex min-h-0 w-full flex-col items-center gap-1 overflow-hidden">
              <div
                aria-hidden={isHidden("types")}
                className="relative grid w-full grid-rows-[1fr] bg-zinc-50 px-1 py-1 transition-all duration-300 aria-hidden:grid-rows-[0fr] aria-hidden:overflow-hidden aria-hidden:py-0"
              >
                <div className="flex min-h-0 w-full items-center gap-1 overflow-hidden">
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
                </div>
              </div>

              <div
                aria-hidden={isHidden("types")}
                className="relative grid w-full grid-rows-[1fr] overflow-hidden p-1 transition-all duration-300 aria-hidden:grid-rows-[0fr]"
              >
                <div className="flex min-h-0 w-full items-center gap-1 overflow-hidden">
                  <ImageButton editor={editor} />
                  <LinkButton editor={editor} />
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
                    onClick={() =>
                      editor.chain().focus().toggleSubscript().run()
                    }
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
                </div>
              </div>

              <div
                aria-hidden={isHidden("format")}
                className="relative grid w-full grid-rows-[1fr] bg-zinc-50 px-1 py-1 transition-all duration-300 aria-hidden:grid-rows-[0fr] aria-hidden:overflow-hidden aria-hidden:py-0"
              >
                <div className="flex min-h-0 w-full items-center gap-1 overflow-hidden">
                  <FontWeightButton editor={editor} />
                  <FontSizeButton editor={editor} />
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    label="İtalik"
                  >
                    <Italic size={16} />
                  </MenuButton>
                  <TextDecorationButton editor={editor} />{" "}
                  <FontFamilyButton editor={editor} />
                  <ColorButton editor={editor} />
                </div>
              </div>

              <div
                aria-hidden={isHidden("format")}
                className="relative grid w-full grid-rows-[1fr] overflow-hidden p-1 transition-all duration-300 aria-hidden:grid-rows-[0fr]"
              >
                <div className="flex min-h-0 w-full items-center gap-1 overflow-hidden">
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
                </div>
              </div>

              <div
                aria-hidden={isHidden("special")}
                className="relative grid w-full grid-rows-[1fr] bg-zinc-50 px-1 py-1 transition-all duration-300 aria-hidden:grid-rows-[0fr] aria-hidden:overflow-hidden aria-hidden:py-0"
              >
                <div className="flex min-h-0 w-full items-center gap-1 overflow-hidden">
                  <AlertBoxButton editor={editor} />
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
    </div>
  );
};
