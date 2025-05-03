import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/i18n/link";
import {
  ListFilter,
  PlusCircle,
  LogOut,
  Folder,
  FilePlus2,
  CircleUser,
  Loader2,
  AlertCircle,
  RefreshCw,
  Star,
} from "lucide-react";
import { useAuth } from "@/providers/auth";

export const Route = createFileRoute("/blog/_auth/_editor/editor/")({
  component: EditorDashboard,
});

// 9. Ana Bileşen - Farklı durumlar için render edecek
function EditorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header her zaman görünür */}
      <Header user={user} logout={logout} />

      <div className="mx-auto flex min-h-[90vh] max-w-7xl">
        {/* Sidebar her zaman görünür */}
        <Sidebar />

        {/* Ana İçerik - Duruma göre değişir */}
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Başlık her durumda görünür */}
            <DashboardTitle />

            <QuickAccessCards />
          </div>
        </main>
      </div>
    </div>
  );
}

// 1. Header Bileşeni - Her durumda görünecek
const Header = ({ user, logout }) => (
  <header className="border-b border-zinc-100 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="Guide of Dubai - Return to homepage"
            className="transition-opacity duration-300 focus:opacity-75 focus:outline-none"
          >
            <img
              src="/images/brand.svg"
              alt="Guide of Dubai Brand Logo"
              loading="eager"
              className="h-10 w-fit"
              width="120"
              height="40"
            />
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {/* Kullanıcı */}
          <div className="flex items-center gap-3">
            <div className="size-9 overflow-hidden rounded-full border border-zinc-100">
              {user?.username ? (
                <img
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=d71923&color=fff`}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                  <CircleUser className="h-5 w-5 text-zinc-400" />
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-zinc-800">
                {user?.username || "Kullanıcı"}
              </p>
            </div>
          </div>

          {/* Çıkış */}
          <button
            onClick={logout}
            className="rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            <span className="hidden sm:inline-block">Çıkış Yap</span>
            <LogOut className="inline-block h-4 w-4 sm:hidden" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

// 2. Sidebar Bileşeni - Her durumda görünecek
const Sidebar = () => (
  <aside className="hidden w-64 border-r border-zinc-100 bg-white lg:block">
    <div className="sticky top-0 flex h-full flex-col">
      <div className="p-4">
        <h2 className="px-3 py-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          İçerik Yönetimi
        </h2>
        <nav className="mt-2 space-y-1">
          <Link
            to="/editor/create"
            className="group bg-primary-50 text-primary-600 flex items-center rounded-lg px-3 py-2 text-sm font-medium"
          >
            <FilePlus2 className="mr-3 h-5 w-5" />
            <span>Yeni Blog Oluştur</span>
          </Link>
          <Link
            to="/editor/list"
            className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <Folder className="mr-3 h-5 w-5" />
            <span>Tüm Bloglar</span>
          </Link>
          <Link
            to="/editor/featured"
            className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <Star className="mr-3 h-5 w-5" />
            <span>Öne Çıkanlar</span>
          </Link>
        </nav>
      </div>
    </div>
  </aside>
);

// 3. Dashboard Başlık Bileşeni
const DashboardTitle = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-zinc-900">Hoş Geldiniz</h1>
    <p className="mt-1 text-zinc-600">
      Blog içeriklerinizi yönetin ve yeni bloglar oluşturun
    </p>
  </div>
);

// 4. Hızlı Erişim Kartları Bileşeni - LOADED durumunda
const QuickAccessCards = () => (
  <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* Blog Oluştur */}
    <Link
      to="/editor/create"
      className="group border-primary-200 hover:border-primary-300 relative overflow-hidden rounded-xl border-2 border-dashed bg-white p-6 transition-all"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-primary-50 text-primary-600 group-hover:bg-primary-100 flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
          <PlusCircle className="h-8 w-8" />
        </div>
        <h3 className="text-primary-600 mt-4 text-lg font-medium">
          Yeni Blog Oluştur
        </h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Yeni bir blog yazısı oluşturmak için tıklayın
        </p>
      </div>
      <div className="bg-primary-50 absolute -right-14 -bottom-14 h-32 w-32 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
    </Link>

    {/* Tüm Blogları Görüntüle */}
    <Link
      to="/editor/list"
      className="group relative overflow-hidden rounded-xl border border-zinc-100 bg-white p-6 transition-all hover:border-zinc-200"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-zinc-100">
          <ListFilter className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-zinc-800">Tüm Bloglar</h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Tüm blog yazılarınızı görüntüleyin ve yönetin
        </p>
      </div>
      <div className="absolute -right-14 -bottom-14 h-32 w-32 rounded-full bg-zinc-50 opacity-50 transition-transform group-hover:scale-110"></div>
    </Link>

    {/* Featured Bloglar */}
    <Link
      to="/editor/featured"
      className="group relative overflow-hidden rounded-xl border border-zinc-100 bg-white p-6 transition-all hover:border-zinc-200"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 transition-colors group-hover:bg-yellow-100">
          <Star className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-zinc-800">Öne Çıkanlar</h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Öne çıkan blog yazılarınızı görüntüleyin ve yönetin
        </p>
      </div>
      <div className="absolute -right-14 -bottom-14 h-32 w-32 rounded-full bg-yellow-50 opacity-50 transition-transform group-hover:scale-110"></div>
    </Link>
  </div>
);

// 5. Yükleniyor (Loading) Bileşeni
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center space-y-4 py-16">
    <Loader2 className="text-primary-500 h-12 w-12 animate-spin" />
    <p className="text-lg font-medium text-zinc-600">İçerik yükleniyor...</p>
  </div>
);

// 6. Boş Durum (Empty) Bileşeni
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
      <Folder className="h-10 w-10 text-zinc-400" />
    </div>
    <div className="max-w-md space-y-2">
      <h3 className="text-lg font-medium text-zinc-800">Henüz blog yok</h3>
      <p className="text-zinc-500">
        Şu anda hiç blog bulunmuyor. İlk blogunuzu oluşturmak için aşağıdaki
        butona tıklayabilirsiniz.
      </p>
    </div>
    <Link
      to="/editor/create"
      className="bg-primary-600 hover:bg-primary-700 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Yeni Blog Oluştur
    </Link>
  </div>
);

// 7. Hata Durumu (Error) Bileşeni
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
      <AlertCircle className="h-10 w-10 text-red-500" />
    </div>
    <div className="max-w-md space-y-2">
      <h3 className="text-lg font-medium text-zinc-800">
        İçerik yüklenirken bir hata oluştu
      </h3>
      <p className="text-zinc-500">
        Blog içerikleri yüklenirken bir sorun oluştu. Lütfen tekrar deneyin veya
        daha sonra tekrar kontrol edin.
      </p>
    </div>
    <button
      onClick={onRetry}
      className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Yeniden Dene
    </button>
  </div>
);
