import { RenderJSON } from "@/components/editor/tiptap/renderer";
import { BlogTOC } from "@/components/blog/toc";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ACTIVE_LANGUAGE_DICTONARY } from "@/i18n/config";
import { getLanguageFromSearch } from "@/i18n/action";
import { ImageGalleryOverlay } from "@/components/blog/img-gallery-overlay";
import { AlternateLanguageDetect } from "@/components/blog/alternate-language-pop-up";
import { RelatedBlogs } from "@/components/blog/related-blog-card";
import { IncreaseViewTracker } from "@/components/blog/view-tracker";

export const Route = createFileRoute("/blog/_main/$slug")({
  loader: async ({ params, location: { search }, ...others }) => {
    const slug = params.slug;
    const lang = getLanguageFromSearch(search);

    // Önceki sonuçları saklayacak değişken
    let blogData = null;

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

      // Blog bulunamadıysa 404 sayfasına yönlendir
      if (!data.success || !data.blog) {
        throw new Error("Blog not found");
      }

      // Herşey normal, veriyi döndür
      blogData = {
        lang: lang,
        slug: slug,
        blog: data.blog,
        alternatives: data.alternatives || [],
      };

      return blogData;
    } catch (error) {
      // Fetch hatası olduğunda, eğer blog verisi bulunamadıysa 404'e yönlendir
      if (!blogData) {
        return redirect({
          to: `/blog/not-found`,
        });
      }

      // Blog verisi varsa, onu döndür
      return blogData;
    }
  },
  head: ({ loaderData }) => {
    const { blog, lang, alternatives } = loaderData;
    const API_URL = import.meta.env.VITE_APP_CANONICAL_URL;
    const sitename = import.meta.env.VITE_APP_SITE_NAME;

    // Metadata
    const metadata = blog?.metadata || {};
    const content = blog?.content || {};
    const blogLanguage = blog?.language || lang || "en";
    const blogSlug = blog?.slug;

    // Canonical URL (her zaman gösterilen blogun kendi slug'ı ve dili)
    const canonicalUrl = `${API_URL}/blog/${blogSlug}?lang=${blogLanguage}`;
    const title = metadata.title ? `${metadata.title} | ${sitename}` : sitename;
    const description = metadata.description || content.description || "";
    const image =
      metadata.image ||
      content.image ||
      `https://images.project-test.info/1.webp`;

    const locale =
      ACTIVE_LANGUAGE_DICTONARY.find((l) => l.value === blogLanguage)?.seo
        .locale || "en_US";

    const tags = (blog.tags || []).map((c) => c.value || "Activities");

    const categories = (blog.categories || []).map(
      (c) => c.value || "Activities",
    );

    const keywords = [...tags, ...categories].join(", ");

    const alternateLinks = (alternatives || []).map((alt) => ({
      rel: "alternate",
      href: `${API_URL}/blog/${alt.slug}?lang=${alt.language}`,
      hrefLang: alt.language,
    }));

    return {
      title,
      meta: [
        { charSet: "utf-8" },
        { title: title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: canonicalUrl },
        { property: "og:locale", content: locale },
        { property: "og:site_name", content: sitename },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
        ...alternateLinks,
      ],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { blog, lang, alternatives } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
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

      {/* İlgili Bloglar Bölümü */}
      <AlternateLanguageDetect blog={blog} alternatives={alternatives} />
      <RelatedBlogs blog={blog} lang={lang} />
      <IncreaseViewTracker blogId={blog.id} />
      <ImageGalleryOverlay />
    </div>
  );
}

export default BlogPage;
