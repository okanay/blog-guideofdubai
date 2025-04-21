import { Editor } from "@tiptap/react";

export const ConvertFormSchemaToCreateData = (
  data: BlogFormSchema,
  editor: Editor,
) => {
  return {
    groupId: data.groupId,
    slug: data.slug,
    metadata: {
      title: data.metadata.title,
      description: data.metadata.description,
      image: data.metadata.image,
    },
    content: {
      title: data.content.title,
      description: data.content.description,
      image: data.content.image,
      readTime: data.content.readTime,
      html: editor.getHTML(),
      json: JSON.stringify(editor?.getJSON()),
    },
    tags: data.tags.map((tag) => tag.name),
    categories: data.categories.map((category) => category.name),
    language: data.language,
    status: data.status,
    featured: data.featured,
  };
};

export const ConvertFormSchemaToUpdateData = (
  id: string,
  data: BlogFormSchema,
  editor: Editor,
) => {
  return {
    id,
    groupId: data.groupId,
    slug: data.slug,
    metadata: {
      title: data.metadata.title,
      description: data.metadata.description,
      image: data.metadata.image,
    },
    content: {
      title: data.content.title,
      description: data.content.description,
      image: data.content.image,
      readTime: data.content.readTime,
      html: editor.getHTML(),
      json: JSON.stringify(editor?.getJSON()),
    },
    tags: data.tags.map((tag) => tag.name),
    categories: data.categories.map((category) => category.name),
    language: data.language,
    featured: data.featured,
  };
};

export const ConvertBlogSchemaToFormSchema = (
  data: BlogSchema,
): BlogFormSchema => {
  return {
    groupId: data.groupId,
    slug: data.slug,
    language: data.language,
    featured: data.featured,
    status: data.status,
    metadata: {
      title: data.metadata.title,
      description: data.metadata.description,
      image: data.metadata.image,
    },
    content: {
      title: data.content.title,
      description: data.content.description,
      image: data.content.image,
      readTime: data.content.readTime,
      html: data.content.html,
      json: data.content.json,
    },
    categories: data.categories || [],
    tags: data.tags || [],
  };
};
