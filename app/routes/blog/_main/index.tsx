import { BlogPostLayout } from "@/components/main/blog-post-layout";
import { HeroSection } from "@/components/main/hero";
import { PopularBlogSection } from "@/components/main/popular-blog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="py-8 sm:py-12">
      <HeroSection />
      <div className="not-sr-only my-24 sm:my-20" aria-hidden />
      <PopularBlogSection />
      <div className="not-sr-only my-6 sm:my-12" aria-hidden />
      <BlogPostLayout />
    </main>
  );
}
