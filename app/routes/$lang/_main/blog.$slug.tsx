import { RenderJSON } from "@/components/editor/tiptap/renderer";
import { BlogTOC } from "@/components/editor/tiptap/renderer/toc";
import { createFileRoute, redirect } from "@tanstack/react-router";

// Blog sayfasının ana route tanımlaması
export const Route = createFileRoute("/$lang/_main/blog/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;
    const lang = params.lang;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/blog?slug=${slug}&lang=${lang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.blog === null || data.blog === undefined) {
        throw redirect({ replace: true, to: `/${lang}/not-found` });
      }

      return {
        lang,
        slug,
        blog: data.blog,
      };
    } catch (error) {
      throw redirect({ replace: true, to: `/${lang}/not-found` });
    }
  },
  head: ({ loaderData: { blog } }) => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
      ],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { blog } = Route.useLoaderData();

  return (
    <main className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      {/* İçerik */}
      <article className="prose max-w-5xl flex-1">
        <RenderJSON json={JSON.parse(blog.content.json) || {}} />
      </article>
      {/* TOC */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <BlogTOC htmlContainerSelector=".prose" />
      </aside>
    </main>
  );
}
