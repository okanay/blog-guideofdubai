import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Bir hata oluştu",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-red-100 p-3">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-zinc-900">Hata</h3>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
