import { AlertTriangle } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";
import { useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: string;
}

export function DeleteModal({ isOpen, onClose, blogId }: DeleteModalProps) {
  const { deleteBlog } = useEditorContext();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!blogId || blogId === "empty") return;

    setIsDeleting(true);
    try {
      const success = await deleteBlog(blogId);
      if (success) {
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-zinc-900">
              Blog Silinecek
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            disabled={isDeleting}
          >
            İptal
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
