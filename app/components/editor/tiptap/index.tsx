import { Code, Eye, FileText, Pencil } from "lucide-react";
import { EditorProvider, useTiptapContext } from "./store";
import { EditorRichMenu } from "./menu";
import { EditorContent } from "@tiptap/react";
import { RenderJSON } from "./renderer";
import DummyText from "./dummy";

export const TiptapEditor = () => {
  return (
    <EditorProvider initialContent={DummyText}>
      <Editor />
    </EditorProvider>
  );
};

const Editor = () => {
  const { view: { mode, setMode }} = useTiptapContext(); // prettier-ignore

  return (
    <div className="relative">
      <EditorRichMenu />
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="mt-24 flex flex-col gap-4">
          <ViewModeToggle currentMode={mode} setMode={setMode} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-800">
            {mode === "edit" && "Metin Düzenleme"}
            {mode === "preview" && "Ön İzleme"}
            {mode === "json" && "JSON Çıktısı"}
            {mode === "html" && "HTML Çıktısı"}
          </h1>
          <p className="text-sm text-zinc-500">
            {mode === "edit" &&
              "Metninizi düzenlemek için zengin metin editörünü kullanın."}
            {mode === "preview" && "Metninizin son halini görüntüleyin."}
            {mode === "json" && "Metninizin JSON yapısını inceleyin."}
            {mode === "html" && "Metninizin HTML kodunu görüntüleyin."}
          </p>
        </div>
        <div>
          {mode === "edit" && <EditModeContent />}

          {mode === "preview" && <PreviewModeContent />}

          {mode === "json" && <JsonModeContent />}

          {mode === "html" && <HtmlModeContent />}
        </div>
      </div>
    </div>
  );
};

const EditModeContent = () => {
  const { editor } = useTiptapContext();
  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="prose border border-zinc-200 bg-white p-4 focus-within:!border-zinc-300"
    >
      <EditorContent editor={editor} />
    </div>
  );
};

const PreviewModeContent = () => {
  const { editor } = useTiptapContext();
  return (
    <div className="prose border border-transparent bg-white py-4 sm:px-4">
      <RenderJSON json={editor.getJSON()} />
    </div>
  );
};

const JsonModeContent = () => {
  const { editor } = useTiptapContext();
  return (
    <div className="overflow-auto overflow-y-auto rounded-lg bg-zinc-900 p-4 text-sm text-white">
      <pre className="font-mono">
        {JSON.stringify(editor.getJSON(), null, 2)}
      </pre>
    </div>
  );
};

const HtmlModeContent = () => {
  const { editor } = useTiptapContext();
  return (
    <div className="rounded-lg bg-zinc-900 p-4 text-sm text-white">
      <pre className="font-mono text-wrap">
        {JSON.stringify(editor.getHTML(), null, 2)}
      </pre>
    </div>
  );
};

interface ViewModeToggleProps {
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  setMode,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto bg-white">
      <div className="mr-2 text-sm font-medium text-zinc-700">Görünüm:</div>

      <ToggleButton
        mode="edit"
        currentMode={currentMode}
        onClick={() => setMode("edit")}
        icon={<Pencil size={14} />}
        label="Düzenle"
        title="Düzenleme Modu"
      />

      <ToggleButton
        mode="preview"
        currentMode={currentMode}
        onClick={() => setMode("preview")}
        icon={<Eye size={14} />}
        label="Önizleme"
        title="Ön İzleme Modu"
      />

      <ToggleButton
        mode="json"
        currentMode={currentMode}
        onClick={() => setMode("json")}
        icon={<Code size={14} />}
        label="JSON"
        title="JSON Görünümü"
      />

      <ToggleButton
        mode="html"
        currentMode={currentMode}
        onClick={() => setMode("html")}
        icon={<FileText size={14} />}
        label="HTML"
        title="HTML Görünümü"
      />
    </div>
  );
};

interface ToggleButtonProps {
  mode: ViewMode;
  currentMode: ViewMode;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  mode,
  currentMode,
  onClick,
  icon,
  label,
  title,
}) => {
  const isActive = mode === currentMode;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-primary text-color-primary"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
      title={title}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
