import { ArrowLeft, FileText, PencilRuler } from "lucide-react";
import { EditorRichMenu } from "../../tiptap/menu";
import { useEditorContext } from "../../store";
import { ModeButton } from "./view-mode-btn";
import { Link } from "@/i18n/link";

export function CreateBlogHeader() {
  const {
    view: { mode, setMode },
  } = useEditorContext();

  // Mod değiştirme işlevi
  const changeMode = (newMode: "form" | "editor") => {
    if (mode !== newMode) {
      setMode(newMode);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-100 shadow-sm">
      {/* Ana header kısmı - her zaman görünür */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
        {/* Sol kısım: Geri butonu ve başlık */}
        <div className="flex items-center gap-2">
          <Link
            to="/editor/"
            className="bg-primary border-primary-cover text-color-primary flex size-8 flex-shrink-0 items-center justify-center rounded-md border transition-opacity duration-300 hover:opacity-75"
          >
            <ArrowLeft size={18} />
          </Link>

          <ModeTitle mode={mode} />
        </div>

        <div className="flex flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
          <ModeButton
            mode="form"
            currentMode={mode}
            onClick={() => changeMode("form")}
            icon={<FileText size={16} />}
            label="Form"
          />
          <ModeButton
            mode="editor"
            currentMode={mode}
            onClick={() => changeMode("editor")}
            icon={<PencilRuler size={16} />}
            label="Editör"
          />
        </div>
      </div>

      {/* Editör menüsü - sadece editor modunda göster */}
      {mode === "editor" && <EditorRichMenu />}
    </header>
  );
}

interface ModeTitleProps {
  mode: BlogViewMode;
}

export function ModeTitle({ mode }: ModeTitleProps) {
  const title = mode === "form" ? "Blog Detayları" : "Metin Editörü";

  const description =
    mode === "form"
      ? "Blog yazınızın başlığı, açıklaması ve diğer detaylarını ayarlayın."
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
