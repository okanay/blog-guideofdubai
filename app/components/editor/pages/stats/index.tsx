import { useEffect } from "react";
import { useEditorContext } from "@/components/editor/store";
import { StatsHeader } from "./header";
import { StatsFilters } from "./filters";
import { StatsTable } from "./table";
import { StatsQuickView } from "./quick-view";
import { LoadingState, ErrorState } from "../list";

export function StatsPage() {
  const { blogStats, fetchBlogStats, clearStatsFilters } = useEditorContext();
  const { loading, error, filteredData, originalData } = blogStats;

  useEffect(() => {
    fetchBlogStats();
  }, []);

  if (loading && originalData.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchBlogStats(true)} />;
  }

  return (
    <main className="relative container mx-auto space-y-4 overflow-hidden px-4 sm:px-6 lg:px-8">
      <StatsHeader />
      <StatsQuickView />
      <StatsFilters />

      {/* Filtreleme sonucu veri yoksa bilgi göster */}
      {filteredData.length === 0 && originalData.length > 0 ? (
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-zinc-600">
            Filtreleme kriterlerine uygun sonuç bulunamadı.
            <button
              onClick={() => clearStatsFilters()}
              className="text-primary-600 hover:text-primary-700 ml-2 underline"
            >
              Filtreleri temizle
            </button>
          </p>
        </div>
      ) : filteredData.length === 0 && originalData.length === 0 ? (
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-zinc-600">Henüz istatistik verisi bulunmuyor.</p>
        </div>
      ) : (
        <StatsTable />
      )}
    </main>
  );
}
