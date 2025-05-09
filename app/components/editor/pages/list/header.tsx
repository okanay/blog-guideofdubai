import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/link";
import { useEditorContext } from "@/components/editor/store";

export function BlogListHeader() {
  const {
    statusStates: { blogPosts },
    fetchBlogPosts,
    setBlogPostsQuery,
  } = useEditorContext();

  const isLoading = blogPosts.loading;

  const handleRefresh = () => {
    // Yenileme işleminde offset'i sıfırla ve temiz veri getir
    setBlogPostsQuery({ offset: 0 });
    fetchBlogPosts();
  };

  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/editor/"
              className="bg-primary border-primary-cover text-color-primary flex size-8 flex-shrink-0 items-center justify-center rounded-md border transition-opacity duration-300 hover:opacity-75"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="px-6">
              <h2 className="text-lg font-semibold text-zinc-800 transition-all duration-300">
                Blog Listem
              </h2>
              <p className="line-clamp-1 text-sm text-zinc-500 transition-all duration-300">
                Tüm blog yazılarınızı yönetin
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/editor/create"
              className="bg-primary hover:bg-primary-600 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-colors"
            >
              <Plus size={16} />
              <span>Yeni Blog</span>
            </Link>

            <button
              onClick={handleRefresh}
              className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              disabled={isLoading}
              title="Yenile"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
