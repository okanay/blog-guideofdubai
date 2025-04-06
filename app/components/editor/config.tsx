import { useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import HardBreak from "@tiptap/extension-hard-break";
import TextAlign from "@tiptap/extension-text-align";

export const useEditor = (initialContent: string = "") => {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure(),
      GlobalDragHandle.configure({
        dragHandleWidth: 40,
        scrollTreshold: 0,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "prose-highlight",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HardBreak.configure({
        keepMarks: false,
      }),
      Image,
      Underline,
      Subscript,
      Superscript,
      Link,
      TextStyle,
      Color,
      FontFamily,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap-editor-initial",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  return editor;
};
