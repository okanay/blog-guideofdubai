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
      data-tooltip-id="editor-tooltip"
      data-tooltip-content={label}
      className="aria-pressed:text-primary-600 flex size-8 items-center justify-center rounded-md border border-transparent p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 aria-pressed:border-zinc-300 aria-pressed:bg-zinc-100"
    >
      {children}
    </button>
  );
};

export default MenuButton;
