import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";
import { EditorProvider } from "@/components/editor/store";
import { TiptapProvider } from "@/components/editor/tiptap/store";
import { CreateBlogHeader } from "@/components/editor/create/header";
import { CreateBlogPage } from "@/components/editor/create";

import * as fs from "node:fs";
const blogPath = "public/blog.json";

async function readBlog() {
  return await fs.promises.readFile(blogPath, "utf-8");
}

export const Route = createFileRoute("/$lang/_editor/editor/create")({
  loader: async () => await readBlog(),
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

function RouteComponent() {
  const state = Route.useLoaderData();
  const data = JSON.parse(state);

  return (
    <EditorProvider>
      <TiptapProvider initialContent={data.content.html}>
        <CreateBlogHeader />
        <CreateBlogPage />
      </TiptapProvider>
    </EditorProvider>
  );
}
