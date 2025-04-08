import { createFileRoute, Outlet } from "@tanstack/react-router";
import editorStyles from "@/components/styles.css?url";
import { seoTranslations } from "@/i18n/languages";

export const Route = createFileRoute("/$lang/_editor")({
  head: ({ params: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.editor.root.title,
        },
        {
          name: "description",
          content: seoData.editor.root.description,
        },
      ],
      links: [
        {
          rel: "preload stylesheet",
          as: "style",
          type: "text/css",
          crossOrigin: "anonymous",
          href: editorStyles,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
