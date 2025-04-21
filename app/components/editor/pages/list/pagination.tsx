import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  offset: number;
  limit: number;
  currentCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export function Pagination({
  total,
  offset,
  limit,
  currentCount,
  onPrevious,
  onNext,
  isLoading,
}: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
      <p className="text-sm text-zinc-500">
        {`${total} adet blog içinden ${Math.min(offset + 1, total)}-${Math.min(offset + currentCount, total)} arası gösteriliyor`}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={offset === 0}
          className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={offset + currentCount >= total || isLoading}
          className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
