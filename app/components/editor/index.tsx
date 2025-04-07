import { useState } from "react";
import { useEditor } from "./config";
import { EditorContent } from "@tiptap/react";
import { EditorRichMenu } from "./menu";
import { RenderJSON } from "./renderer";
import { Code, Eye, FileJson, Pencil } from "lucide-react";

export const EditorPage = () => {
  const initialContent = `Merhaba...`;
  const editor = useEditor(initialContent);
  const [editorMode, setEditorMode] = useState<"editor" | "preview" | "json">(
    "editor",
  );

  return (
    <div className="relative py-4">
      <EditorRichMenu editor={editor} />

      {/* Toggle butonları */}
      <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-1 px-4">
        <div className="mr-2 text-sm font-medium text-zinc-700">Görünüm:</div>

        <button
          onClick={() => setEditorMode("editor")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            editorMode === "editor"
              ? "bg-primary text-color-primary"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
          title="Düzenleme Modu"
        >
          <Pencil size={14} />
          <span>Düzenle</span>
        </button>

        <button
          onClick={() => setEditorMode("preview")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            editorMode === "preview"
              ? "bg-primary text-color-primary"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
          title="Ön İzleme Modu"
        >
          <Eye size={14} />
          <span>Önizleme</span>
        </button>

        <button
          onClick={() => setEditorMode("json")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            editorMode === "json"
              ? "bg-primary text-color-primary"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
          title="JSON Görünümü"
        >
          <Code size={14} />
          <span>JSON</span>
        </button>
      </div>

      <div className="mx-auto my-8 flex max-w-5xl flex-col gap-4 px-4 py-6">
        {/* Editör başlığı */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-zinc-800">
            {editorMode === "editor" && "Metin Düzenleme"}
            {editorMode === "preview" && "Ön İzleme"}
            {editorMode === "json" && "JSON Çıktısı"}
          </h1>
          <p className="text-sm text-zinc-500">
            {editorMode === "editor" &&
              "Metninizi düzenlemek için zengin metin editörünü kullanın."}
            {editorMode === "preview" && "Metninizin son halini görüntüleyin."}
            {editorMode === "json" && "Metninizin JSON yapısını inceleyin."}
          </p>
        </div>

        {/* İçerik alanı */}
        <div className="rounded-sm">
          {/* Düzenleme modu */}
          {editorMode === "editor" && (
            <div className="prose border border-zinc-200 bg-white p-4 focus-within:!border-zinc-300">
              <EditorContent editor={editor} />
            </div>
          )}

          {/* Önizleme modu */}
          {editorMode === "preview" && (
            <div className="prose max-w-none p-4">
              <RenderJSON json={editor.getJSON()} />
            </div>
          )}

          {/* JSON modu */}
          {editorMode === "json" && (
            <div className="max-h-72 overflow-auto overflow-y-auto rounded-lg bg-zinc-900 p-4 text-sm text-white">
              <pre className="font-mono">
                {JSON.stringify(editor.getJSON(), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Mod açıklaması */}
        <div className="rounded bg-zinc-50 p-3 text-xs text-zinc-600">
          {editorMode === "editor" && (
            <div className="flex items-center gap-2">
              <Pencil size={14} className="flex-shrink-0 text-zinc-400" />
              <span className="text-balance">
                Düzenleme modunda metin içeriğinizi özgürce düzenleyebilirsiniz.
                Zengin metin özellikleri için alt menüyü kullanın.
              </span>
            </div>
          )}

          {editorMode === "preview" && (
            <div className="flex items-center gap-2">
              <Eye size={14} className="flex-shrink-0 text-zinc-400" />
              <span className="text-balance">
                Önizleme modunda içeriğiniz son kullanıcının göreceği şekilde
                görüntülenir. Tüm biçimlendirmeler ve özel içerikler bu modda
                görünür.
              </span>
            </div>
          )}

          {editorMode === "json" && (
            <div className="flex items-center gap-2">
              <FileJson size={14} className="flex-shrink-0 text-zinc-400" />
              <span className="text-balance">
                JSON modunda içeriğinizin teknik yapısını görebilirsiniz. Bu mod
                geliştiriciler için faydalıdır.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
