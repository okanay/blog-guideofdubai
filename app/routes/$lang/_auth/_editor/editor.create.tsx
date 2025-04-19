import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";
import { EditorProvider } from "@/components/editor/store";
import { TiptapProvider } from "@/components/editor/tiptap/store";
import { CreateBlogHeader } from "@/components/editor/create/header";
import { CreateBlogPage } from "@/components/editor/create";
import { DEFAULT_BLOG_FORM_VALUES } from "@/components/editor/form/default";
import DummyText from "@/components/editor/tiptap/dummy";

export const Route = createFileRoute("/$lang/_auth/_editor/editor/create")({
  head: ({ params: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.editor.create.title,
        },
        {
          name: "description",
          content: seoData.auth.editor.create.description,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EditorProvider initialFormValues={DEFAULT_BLOG_FORM_VALUES}>
      <TiptapProvider initialContent={DummyText}>
        <CreateBlogHeader />
        <CreateBlogPage />
      </TiptapProvider>
    </EditorProvider>
  );
}
