import { createFileRoute, Outlet } from "@tanstack/react-router";
import { seoTranslations } from "@/i18n/languages";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";
import { AuthProvider } from "@/providers/auth";
import { InitialSessionControl } from "@/providers/auth/initial-session-control";
import { ImageProvider } from "@/components/image/store";
import { getLanguageFromSearch } from "@/i18n/action";

export const Route = createFileRoute("/blog/_auth")({
  loader: async ({ location: { search } }) => {
    const lang = getLanguageFromSearch(search);
    return { lang };
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.root.title,
        },
        {
          name: "description",
          content: seoData.auth.root.description,
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
    <AuthProvider>
      <InitialSessionControl />
      <ImageProvider>
        <Outlet />
      </ImageProvider>
    </AuthProvider>
  );
}
