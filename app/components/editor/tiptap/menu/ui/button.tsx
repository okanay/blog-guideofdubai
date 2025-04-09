import { twMerge } from "tailwind-merge";

const MenuButton = ({
  onClick,
  isActive,
  children,
  label,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={label}
      className={twMerge(
        "group relative flex size-8 items-center justify-center rounded-md border transition-all duration-200",
        "hover:border-zinc-300 hover:bg-zinc-100",
        isActive
          ? "text-primary-600 border-zinc-300 bg-zinc-100"
          : "border-transparent text-zinc-700",
      )}
    >
      {children}

      {/* Sabit konumlu tooltip */}
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 translate-y-[10px] rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
};

export default MenuButton;
