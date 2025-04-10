import { Editor } from "../tiptap";
import { TiptapProvider } from "../tiptap/store";
import { EditorProvider, useEditorContext } from "../store";
import { CreateBlogForm } from "../form";
import { CreateBlogHeader } from "./components/header";
import DummyText from "../tiptap/dummy";

export default function CreateBlogPage() {
  return (
    <EditorProvider>
      <TiptapProvider initialContent={DummyText}>
        <BlogPageContent />
      </TiptapProvider>
    </EditorProvider>
  );
}

function BlogPageContent() {
  const {
    view: { mode },
  } = useEditorContext();

  return (
    <main className="flex min-h-screen flex-col">
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
