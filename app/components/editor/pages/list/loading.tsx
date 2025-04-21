export function LoadingState() {
  return (
    <div className="my-12 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-zinc-200"></div>
        <p className="mt-2 text-sm text-zinc-500">Bloglar yükleniyor...</p>
      </div>
    </div>
  );
}
