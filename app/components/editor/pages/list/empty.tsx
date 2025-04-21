import { Link } from "@/i18n/link";
import { Plus, XCircle } from "lucide-react";

export function EmptyState() {
  return (
    <div className="my-12 flex flex-col items-center justify-center">
      <div className="rounded-full bg-zinc-100 p-3">
        <XCircle size={32} className="text-zinc-400" />
      </div>
      <p className="mt-2 text-lg font-medium text-zinc-700">Blog bulunamadı</p>
      <p className="text-zinc-500">
        Hiç blog yazısı bulunamadı veya filtrelere uyan sonuç yok.
      </p>
      <Link
        to="/editor/create"
        className="bg-primary hover:bg-primary-600 mt-4 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-colors"
      >
        <Plus size={16} />
        <span>Yeni Blog Oluştur</span>
      </Link>
    </div>
  );
}
