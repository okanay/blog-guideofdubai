import { twMerge } from "tailwind-merge";

interface ModeButtonProps {
  mode: "form" | "editor";
  currentMode: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function ModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: ModeButtonProps) {
  const isActive = mode === currentMode;

  return (
    <button
      onClick={onClick}
      className={twMerge(
        "relative flex h-9 items-center gap-1.5 px-3 text-xs font-medium transition-all",
        isActive
          ? "bg-primary border-primary-cover text-color-primary"
          : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>

      {isActive && (
        <span className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5" />
      )}
    </button>
  );
}
