import { Link } from "@/i18n/link";
import { ArrowLeft, FileText, PencilRuler } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";
import { EditorRichMenu } from "@/components/editor/tiptap/menu";
import { ToggleModeButton } from "@/components/editor/ui/toggle-mode-btn";

export function EditBlogHeader() {
  const { view } = useEditorContext();

  // Mod değiştirme işlevi
  const changeMode = (newMode: "form" | "editor") => {
    if (view.mode !== newMode) {
      view.setMode(newMode);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-100 shadow-sm">
      {/* Ana header kısmı - her zaman görünür */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
        {/* Sol kısım: Geri butonu ve başlık */}
        <div className="flex items-center gap-2">
          <Link
            to="/editor/list"
            className="bg-primary border-primary-cover text-color-primary flex size-8 flex-shrink-0 items-center justify-center rounded-md border transition-opacity duration-300 hover:opacity-75"
          >
            <ArrowLeft size={18} />
          </Link>

          <ModeTitle mode={view.mode} />
        </div>

        <div className="flex flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
          <ToggleModeButton
            mode="form"
            currentMode={view.mode}
            onClick={() => changeMode("form")}
            icon={<FileText size={16} />}
            label="Form"
          />
          <ToggleModeButton
            mode="editor"
            currentMode={view.mode}
            onClick={() => changeMode("editor")}
            icon={<PencilRuler size={16} />}
            label="Editör"
          />
        </div>
      </div>

      {/* Editör menüsü - sadece editor modunda göster */}
      {view.mode === "editor" && <EditorRichMenu />}
    </header>
  );
}

interface ModeTitleProps {
  mode: BlogViewMode;
}

export function ModeTitle({ mode }: ModeTitleProps) {
  const title = mode === "form" ? "Blog Düzenleme" : "Metin Editörü";

  const description =
    mode === "form"
      ? "Blog yazınızın başlığı, açıklaması ve diğer detaylarını düzenleyin."
      : "İçeriği zengin metin editörü ile düzenleyin.";

  return (
    <div className="px-6 py-4">
      <h2 className="text-lg font-semibold text-zinc-800 transition-all duration-300">
        {title}
      </h2>
      <p className="line-clamp-1 text-sm text-zinc-500 transition-all duration-300">
        {description}
      </p>
    </div>
  );
}
