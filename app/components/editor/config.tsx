import { useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { FontWeight } from "./renderer/extensions/font-weight";
import { InfoNode } from "./renderer/extensions/info";

export const useEditor = (initialContent: string = "") => {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        hardBreak: {
          keepMarks: false,
        },
      }),
      GlobalDragHandle.configure({
        dragHandleWidth: 40,
        scrollTreshold: 0,
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "prose-highlight",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Underline,
      Subscript,
      Superscript,
      Link,
      TextStyle,
      Color,
      FontFamily,
      FontWeight.configure({
        types: ["textStyle"],
      }),
      InfoNode,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap-editor-initial",
      },
    },
    onUpdate: ({ editor }) => {},
  });

  return editor;
};
