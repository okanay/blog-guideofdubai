import CreateBlogPage from "@/components/editor/create";
import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";

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
      links: [],
    };
  },
  component: CreateBlogPage,
});
