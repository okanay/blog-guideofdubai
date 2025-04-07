import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import useClickOutside from "@/hooks/use-click-outside";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
};

const RichButtonModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[80vh]",
}: Props) => {
  const ref = useClickOutside<HTMLDivElement>(() => onClose());
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div
        ref={ref}
        className={twMerge(
          "relative flex w-full flex-col rounded-lg bg-white shadow-lg",
          maxWidth,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{ scrollbarWidth: "thin" }}
          className={twMerge(
            "scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent overflow-y-auto p-4",
            maxHeight,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default RichButtonModal;
