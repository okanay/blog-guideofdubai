import { API_URL } from "@/components/editor/helper";
import { BlogPostLayout } from "@/components/main/blog-post-layout";
import { HeroSection } from "@/components/main/hero";
import { FeaturedBlogSection } from "@/components/main/popular-blog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/_main/")({
  loader: async () => {
    try {
      const recentPostsURL = API_URL + "/blog/recent?limit=4";
      const featuredPostsURL = API_URL + "/blog/featured";
      const mostViewedPostsURL =
        API_URL + "/blog/most-viewed?limit=5&language=en&period=month"; // all, day, week, month, year

      // Üç isteği paralel olarak gerçekleştir
      const [
        recentPostsResponse,
        featuredPostsResponse,
        mostViewedPostsResponse,
      ] = await Promise.all([
        fetch(recentPostsURL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(featuredPostsURL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(mostViewedPostsURL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
      ]);

      // Eğer herhangi bir istek başarısız olursa hata fırlatır
      if (
        !recentPostsResponse.ok ||
        !featuredPostsResponse.ok ||
        !mostViewedPostsResponse.ok
      ) {
        throw new Error("Fetch işlemi başarısız oldu");
      }

      // JSON yanıtlarını paralel olarak işle
      const [recentPostsData, featuredPostsData, mostViewedPostsData] =
        await Promise.all([
          recentPostsResponse.json(),
          featuredPostsResponse.json(),
          mostViewedPostsResponse.json(),
        ]);

      return {
        recentPosts: recentPostsData.blogs as BlogPostCardView[],
        featuredPosts: featuredPostsData.blogs as BlogPostCardView[],
        mostViewedPosts: mostViewedPostsData.blogs as BlogPostCardView[],
      };
    } catch (error) {
      return {
        recentPosts: [],
        featuredPosts: [],
        mostViewedPosts: [],
      };
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="py-8 sm:py-12">
      <HeroSection />
      <div className="not-sr-only my-24 sm:my-20" aria-hidden />
      <FeaturedBlogSection />
      <div className="not-sr-only my-6 sm:my-12" aria-hidden />
      <BlogPostLayout />
    </main>
  );
}
