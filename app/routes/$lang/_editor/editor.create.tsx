import { RouteComponent } from "@/components/editor/create";
import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";

export const Route = createFileRoute("/$lang/_editor/editor/create")({
  head: ({ params: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.editor.create.title,
        },
        {
          name: "description",
          content: seoData.editor.create.description,
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
