import { seoTranslations } from "@/i18n/languages";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { TiptapProvider } from "@/components/editor/tiptap/store";
import { EditBlogHeader } from "@/components/editor/pages/edit/header";
import { EditBlogPage } from "@/components/editor/pages/edit";
import { getLanguageFromSearch } from "@/i18n/action";

export const Route = createFileRoute("/blog/_auth/_editor/editor/edit/$id")({
  loader: async ({ params, location: { search } }) => {
    const id = params.id;
    const lang = getLanguageFromSearch(search);

    if (id === "0" || id === "" || id === undefined || id === null) {
      throw redirect({ replace: true, to: `/${lang}/editor` });
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/blog/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.blog === null || data.blog === undefined) {
        throw redirect({ replace: true, to: `/${lang}/editor` });
      }

      return {
        lang,
        id,
        blog: data.blog,
      };
    } catch (error) {
      throw redirect({ replace: true, to: `/${lang}/editor` });
    }
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.editor.edit.title,
        },
        {
          name: "description",
          content: seoData.auth.editor.edit.description,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { blog } = Route.useLoaderData();

  return (
    <TiptapProvider initialContent={blog?.content?.html || ""}>
      <EditBlogHeader />
      <EditBlogPage initialData={blog} />
    </TiptapProvider>
  );
}
