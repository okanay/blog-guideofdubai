import { useEditor } from "./config";
import { EditorContent } from "@tiptap/react";
import { EditorRichMenu } from "./menu";
import { InfoNodeEditorRender } from "@/components/editor/info-node";
import React from "react";
import { RenderJSON } from "./renderer";

export const EditorPage = () => {
  const initialContent = `Merhaba...`;
  const editor = useEditor(initialContent);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 py-12">
      <EditorRichMenu editor={editor} />
      <div className="prose rounded border border-zinc-400 p-2">
        <EditorContent editor={editor} />
      </div>
      <div className="prose">
        <RenderJSON json={editor.getJSON()} />
      </div>
    </div>
  );
};
