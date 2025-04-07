import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
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
  const [isMenuVisible, setIsMenuVisible] = useState(true);

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
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-1000">
      <div className="pointer-events-auto w-full border-b border-zinc-200 bg-zinc-100 transition-all duration-300 ease-in-out">
        <div className="mx-auto w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-12">
            <h1 className="text-color-font text-xs font-semibold">
              Metin Editörü
            </h1>

            <div className="flex items-center space-x-1">
              {Categories.map((category) => (
                <div key={category.value} className="group relative">
                  <button
                    className={twMerge(
                      `rounded-md px-2 py-1 text-xs font-semibold`,
                      isCategoryActive(category)
                        ? "bg-zinc-800 text-zinc-50"
                        : "text-color-font border border-zinc-200 bg-zinc-50",
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    {<category.icon className="size-3.5" />}
                  </button>

                  {/* Hover ile görünen tooltip */}
                  <div className="pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {category.label}
                  </div>
                </div>
              ))}

              <div className="group relative ml-1 hidden">
                <button
                  aria-hidden={isMenuVisible}
                  className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                  onClick={toggleMenuVisibility}
                >
                  <ChevronDown
                    className={`size-3.5 transition-all duration-300 ${isMenuVisible ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Hover ile görünen tooltip */}
                <div className="pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {isMenuVisible ? "Gizle" : "Göster"}
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden={!isMenuVisible}
            className="grid grid-rows-[1fr] transition-all duration-300 aria-hidden:grid-rows-[0fr] aria-hidden:overflow-hidden"
          >
            <div
              aria-hidden={!isMenuVisible}
              className="min-h-0 overflow-hidden border-t border-zinc-200 bg-white px-4 py-2 transition-all duration-300 aria-hidden:py-0 sm:px-12"
            >
              <div
                style={{ scrollbarWidth: "thin" }}
                className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto"
              >
                {/* Başlık Butonları - types kategorisine ait */}
                <div
                  className={`flex items-center gap-x-2 ${isHidden("types") ? "hidden" : ""}`}
                >
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

                {/* Ayırıcı çizgi */}
                <div
                  className={`mx-1 h-6 border-l border-zinc-300 ${isHidden("types") ? "hidden" : ""}`}
                ></div>

                {/* İçerik Tipi Butonları - types kategorisine ait */}
                <div
                  className={`flex items-center gap-x-2 ${isHidden("types") ? "hidden" : ""}`}
                >
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

                {/* Ayırıcı çizgi */}
                <div
                  className={`mx-1 h-6 border-l border-zinc-300 ${isHidden("types") || isHidden("format") ? "hidden" : ""}`}
                ></div>

                {/* Biçimlendirme Butonları - format kategorisine ait */}
                <div
                  className={`flex items-center gap-x-2 ${isHidden("format") ? "hidden" : ""}`}
                >
                  <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    label="İtalik"
                  >
                    <Italic size={16} />
                  </MenuButton>
                  <FontWeightButton editor={editor} />
                  <FontSizeButton editor={editor} />
                  <TextDecorationButton editor={editor} />
                  <FontFamilyButton editor={editor} />
                  <ColorButton editor={editor} />
                </div>

                {/* Ayırıcı çizgi */}
                <div
                  className={`mx-1 h-6 border-l border-zinc-300 ${isHidden("format") || isHidden("all") ? "hidden" : ""}`}
                ></div>

                {/* Hizalama Butonları - format kategorisinin bir parçası */}
                <div
                  className={`flex items-center gap-x-2 ${isHidden("format") ? "hidden" : ""}`}
                >
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

                {/* Ayırıcı çizgi */}
                <div
                  className={`mx-1 h-6 border-l border-zinc-300 ${isHidden("format") || isHidden("special") ? "hidden" : ""}`}
                ></div>

                {/* Özel Modüller - special kategorisine ait */}
                <div
                  className={`flex items-center gap-x-2 ${isHidden("special") ? "hidden" : ""}`}
                >
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
