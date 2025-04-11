import { CreateBlogForm } from "../form";
import { DEFAULT_BLOG_FORM_VALUES } from "../form/default";
import { useTiptapContext } from "../tiptap/store";

import * as fs from "node:fs";
import { createServerFn } from "@tanstack/react-start";

const filePath = "public/blog.json";

const writeBlog = createServerFn({ method: "POST" })
  .validator((data: Blog) => data)
  .handler(async ({ data }) => {
    await fs.promises.writeFile(filePath, JSON.stringify(data));
  });

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();

  const handleOnSubmit = async (data: FormSchema) => {
    const json: Blog = {
      id: "1",
      groupId: data.seoSlug,
      slug: data.seoSlug,
      metadata: {
        title: data.seoTitle,
        description: data.seoDescription,
        image: data.seoImage,
        canonical: data.isCanonical,
        alternatives: [],
      },
      content: {
        title: data.blogTitle,
        description: data.blogDescription,
        readTime: data.readTime,
        tags: data.tags,
        categories: data.categories,
        html: editor?.getHTML() || "",
      },
      stats: {
        views: 0,
      },
      language: data.language as Language,
      status: data.status as BlogStatus,
      featured: data.featured,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      version: 1,
    };

    await writeBlog({ data: json });
  };

  return (
    <CreateBlogForm
      initialValues={DEFAULT_BLOG_FORM_VALUES}
      submitLabel="Blog Oluştur"
      initialAutoMode={true}
      onSubmit={handleOnSubmit}
    />
  );
};
