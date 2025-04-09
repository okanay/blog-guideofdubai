import { createFileRoute, Outlet } from "@tanstack/react-router";
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
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
