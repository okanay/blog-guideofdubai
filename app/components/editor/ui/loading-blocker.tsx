type LoadingProps = {
  loading: boolean;
  label: string;
};

export const LoadingBlocker = ({ loading, label }: LoadingProps) => {
  return (
    <div
      aria-disabled={loading}
      className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center bg-gray-950/10 opacity-0 backdrop-blur-sm aria-disabled:pointer-events-auto aria-disabled:opacity-100"
    >
      {loading && (
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 animate-spin text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v3m0 9v3m7.5-7.5h-3m-9 0H4.5m15.364-6.364l-2.121 2.121m-9.9 9.9l-2.121 2.121m0-14.142l2.121 2.121m9.9 9.9l2.121 2.121"
            />
          </svg>
          <span className="mt-2 text-sm text-gray-700">
            {label || "Blog Oluşturuluyor, Lütfen Bekleyin..."}
          </span>
        </div>
      )}
    </div>
  );
};
