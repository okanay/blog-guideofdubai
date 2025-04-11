import { Editor } from "../tiptap";
import { TiptapProvider } from "../tiptap/store";
import { EditorProvider, useEditorContext } from "../store";
import { CreateBlogHeader } from "./header";
import { CreateBlogAction } from "./action";
import DummyText from "../tiptap/dummy";

export function RouteComponent() {
  return (
    <EditorProvider>
      <TiptapProvider initialContent={DummyText}>
        <CreateBlogHeader />
        <CreateBlogPage />
      </TiptapProvider>
    </EditorProvider>
  );
}

function CreateBlogPage() {
  const { view } = useEditorContext();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative overflow-hidden bg-white pb-8">
        <div
          data-visible={view.mode === "form"}
          className="w-full px-4 transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <CreateBlogAction />
        </div>

        <div
          data-visible={view.mode === "editor"}
          className="w-full transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <Editor />
        </div>
      </div>
    </main>
  );
}
