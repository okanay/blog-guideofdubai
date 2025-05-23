import { twMerge } from "tailwind-merge";

interface Props {
  mode: "form" | "editor";
  currentMode: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function ToggleModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: Props) {
  const isActive = mode === currentMode;

  const handleOnClick = () => {
    window.scrollTo(0, 0);
    onClick();
  };

  return (
    <button
      onClick={handleOnClick}
      className={twMerge(
        "relative flex h-12 items-center gap-2 px-4 text-xs font-medium transition-all",
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
