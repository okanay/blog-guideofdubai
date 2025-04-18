import { createFileRoute, Outlet } from "@tanstack/react-router";
import { seoTranslations } from "@/i18n/languages";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";
import { AuthProvider } from "@/providers/auth";
import ProtectedRoute from "@/providers/auth/protected-route";

export const Route = createFileRoute("/$lang/_auth/_editor")({
  head: ({ params: { lang } }) => {
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
    <ProtectedRoute control="unauthorize" navigateTo="/">
      <Outlet />
    </ProtectedRoute>
  );
}
