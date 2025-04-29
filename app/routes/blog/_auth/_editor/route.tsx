import { createFileRoute, Outlet } from "@tanstack/react-router";
import { seoTranslations } from "@/i18n/languages";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";
import ProtectedRoute from "@/providers/auth/protected-route";
import { EditorProvider } from "@/components/editor/store";
import { getLanguageFromSearch } from "@/i18n/action";

export const Route = createFileRoute("/blog/_auth/_editor")({
  loader: async ({ location: { search } }) => {
    const lang = getLanguageFromSearch(search);
    return { lang };
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.editor.root.title,
        },
        {
          name: "description",
          content: seoData.auth.editor.root.description,
        },
      ],
      links: [
        {
          rel: "preload stylesheet",
          as: "style",
          type: "text/css",
          crossOrigin: "anonymous",
          href: dragModuleStyles,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute control="unauthorize" navigateTo="/login">
      <EditorProvider>
        <Outlet />
      </EditorProvider>
    </ProtectedRoute>
  );
}
