import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const RichButtonModal = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between border-b border-zinc-200 pb-2">
          <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default RichButtonModal;
