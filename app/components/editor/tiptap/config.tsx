import { useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { FontWeight } from "./renderer/extensions/font-weight";
import { AlerBox } from "./renderer/extensions/alert-box";
import { FontSize } from "./renderer/extensions/font-size";
import { EnhancedImage } from "./renderer/extensions/image";
import { Underline } from "./renderer/extensions/underline";
import { StrikeThrough } from "./renderer/extensions/strike-through";
import { Highlight } from "./renderer/extensions/highlight";

export const useEditor = (initialContent: string = "") => {
  const editor = useTiptapEditor({
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap-editor-initial",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        hardBreak: {
          keepMarks: false,
        },
        bold: false,
        strike: false,
      }),
      GlobalDragHandle.configure({
        dragHandleWidth: 40,
        scrollTreshold: 0,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontWeight.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        types: ["textStyle"],
      }),
      Underline,
      StrikeThrough,
      Subscript,
      Superscript,
      Link,
      TextStyle,
      EnhancedImage,
      FontFamily,
      AlerBox,
    ],
  });

  return editor;
};
