import { X } from "lucide-react";
import { CacheAdminPanel } from "./index";
import { useEditorContext } from "../../store";

export function CacheModal() {
  const {
    cacheView: { mode, setMode },
  } = useEditorContext();

  if (!mode) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setMode(false)}
        />

        {/* Modal */}
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              Cache Management
            </h2>
            <button
              onClick={() => setMode(false)}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <CacheAdminPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
