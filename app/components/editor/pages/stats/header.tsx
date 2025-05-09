import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/link";
import { useEditorContext } from "@/components/editor/store";

export function StatsHeader() {
  const { blogStats, refreshStats } = useEditorContext();
  const { loading } = blogStats;

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
                Blog İstatistikleri
              </h2>
              <p className="line-clamp-1 text-sm text-zinc-500 transition-all duration-300">
                Blog performansınızı analiz edin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    </header>
  );
}
