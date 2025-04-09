// app/components/editor/create/index.tsx
import { twMerge } from "tailwind-merge";
import { Link } from "@/i18n/link";
import { ArrowLeft, FileText, PencilRuler } from "lucide-react";
import { Editor } from "../tiptap";
import { EditorRichMenu } from "../tiptap/menu";
import { EditorProvider } from "../tiptap/store";
import { CreateBlogForm } from "./form";
import { CreateBlogProvider, useCreateBlog } from "./store";
import DummyText from "../tiptap/dummy";

export default function CreateBlogPage() {
  return (
    <CreateBlogProvider>
      <EditorProvider initialContent={DummyText}>
        <BlogPageContent />
      </EditorProvider>
    </CreateBlogProvider>
  );
}

function BlogPageContent() {
  const {
    view: { mode },
  } = useCreateBlog();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header bileşeni her zaman görünür */}
      <CreateBlogHeader />

      <div className="relative overflow-hidden bg-white pb-8">
        <div
          data-visible={mode === "form"}
          className="w-full px-4 transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <CreateBlogForm />
        </div>

        <div
          data-visible={mode === "editor"}
          className="w-full transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <Editor />
        </div>
      </div>
    </main>
  );
}

export function CreateBlogHeader() {
  const {
    view: { mode, setMode },
  } = useCreateBlog();

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

          <ModeTitle />
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

// Mod değiştirme butonları için bileşen
interface ModeButtonProps {
  mode: "form" | "editor";
  currentMode: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: ModeButtonProps) {
  const isActive = mode === currentMode;

  return (
    <button
      onClick={onClick}
      className={twMerge(
        "relative flex h-9 items-center gap-1.5 px-3 text-xs font-medium transition-all",
        isActive
          ? "bg-primary border-primary-cover text-color-primary"
          : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>

      {isActive && (
        <span className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5" />
      )}
    </button>
  );
}

// app/components/editor/create/mode-title.tsx
interface ModeTitleProps {
  className?: string;
}

export function ModeTitle({ className }: ModeTitleProps) {
  const {
    view: { mode },
  } = useCreateBlog();

  // Mode değerine göre başlık metni
  const title = mode === "form" ? "Blog Detayları" : "Metin Editörü";

  // Mode değerine göre açıklama metni
  const description =
    mode === "form"
      ? "Blog yazınızın başlığı, açıklaması ve diğer detaylarını ayarlayın."
      : "İçeriği zengin metin editörü ile düzenleyin.";

  return (
    <div className={twMerge("px-6 py-4", className)}>
      <h2 className="text-lg font-semibold text-zinc-800 transition-all duration-300">
        {title}
      </h2>
      <p className="line-clamp-1 text-sm text-zinc-500 transition-all duration-300">
        {description}
      </p>
    </div>
  );
}
