import { RenderJSON } from "@/components/editor/tiptap/renderer";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_main/blog/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;
    const lang = params.lang;

    if (slug === "0" || slug === "" || slug === undefined || slug === null) {
      throw redirect({ replace: true, to: `/${lang}/not-found` });
    }

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
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <div className="prose mx-auto max-w-5xl py-12">
      <RenderJSON json={JSON.parse(data?.blog?.content?.json) || {}} />
    </div>
  );
}
