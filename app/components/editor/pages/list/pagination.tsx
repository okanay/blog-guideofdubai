import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  offset: number;
  limit: number;
  currentCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  hasMoreBlogs: boolean;
  lastFetchCount: number;
}

export function Pagination({
  total,
  offset,
  limit,
  currentCount,
  onPrevious,
  onNext,
  isLoading,
  currentPage,
  totalPages,
  hasMoreBlogs,
  lastFetchCount,
}: PaginationProps) {
  // Next butonu aktif/pasif durumu kontrolü
  // 1. Son fetch işleminde limit'ten daha az veri geldiyse, başka veri kalmamıştır
  // 2. Yükleme durumundaysa buton devre dışı bırakılır
  const canGoNext = hasMoreBlogs && !isLoading;

  // Previous butonu aktif/pasif durumu kontrolü
  const canGoPrevious = offset > 0 && !isLoading;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
      <p className="text-sm text-zinc-500">
        {`Toplam blog sayısı: ${total}. Gösterilen aralık: ${Math.min(offset + 1, total)}-${Math.min(offset + currentCount, total)}. Sayfa: ${currentPage}/${totalPages || 1}.`}
      </p>

      <div className="flex items-center gap-2">
        {/* Önceki sayfa butonu */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          title="Önceki sayfa"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Sonraki sayfa butonu */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          title="Sonraki sayfa"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
