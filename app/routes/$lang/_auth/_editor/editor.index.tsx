// app/routes/$lang/_auth/_editor/editor.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/i18n/link";
import { useTranslation } from "react-i18next";
import {
  ListFilter,
  PlusCircle,
  LogOut,
  Search,
  Bell,
  Users,
  Folder,
  BookOpen,
  FilePlus2,
  CircleUser,
} from "lucide-react";
import { useAuth } from "@/providers/auth";
import { useNavigate } from "@/i18n/navigate";
import { useState } from "react";

export const Route = createFileRoute("/$lang/_auth/_editor/editor/")({
  component: EditorDashboard,
});

function EditorDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Header */}
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
              {/* Arama */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Blog ara..."
                    className="w-full rounded-full border border-zinc-100 bg-zinc-50 py-1.5 pr-4 pl-9 text-sm text-zinc-900 focus:border-zinc-200 focus:ring-0 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Kullanıcı */}
              <div className="flex items-center gap-3">
                <div className="size-9 overflow-hidden rounded-full border border-zinc-100">
                  {user?.username ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
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
                  <p className="text-xs text-zinc-500">
                    {user?.role || "Editor"}
                  </p>
                </div>
              </div>

              {/* Çıkış */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                {isLoggingOut ? (
                  <span>Çıkış yapılıyor...</span>
                ) : (
                  <>
                    <span className="hidden sm:inline-block">Çıkış Yap</span>
                    <LogOut className="inline-block h-4 w-4 sm:hidden" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[90vh]">
        {/* Sidebar */}
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
              </nav>
            </div>
          </div>
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Başlık ve Açıklama */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-zinc-900">
                {t("editor.dashboard.title", "Hoş Geldiniz")}
              </h1>
              <p className="mt-1 text-zinc-600">
                {t(
                  "editor.dashboard.subtitle",
                  "Blog içeriklerinizi yönetin ve yeni bloglar oluşturun.",
                )}
              </p>
            </div>

            {/* İçerik Oluşturma / Hızlı Erişim */}
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
                  <h3 className="mt-4 text-lg font-medium text-zinc-800">
                    Tüm Bloglar
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-500">
                    Tüm blog yazılarınızı görüntüleyin ve yönetin
                  </p>
                </div>
                <div className="absolute -right-14 -bottom-14 h-32 w-32 rounded-full bg-zinc-50 opacity-50 transition-transform group-hover:scale-110"></div>
              </Link>

              {/* Son Düzenlenenler */}
              <div className="rounded-xl border border-zinc-100 bg-white p-6">
                <h3 className="mb-4 text-base font-medium text-zinc-800">
                  Son Düzenlenen
                </h3>
                <div className="space-y-3"></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Dashboard Footer */}
      <footer className="border-t border-zinc-100 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500">
              &copy; 2025 Guide Of Dubai. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/support"
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                Destek
              </Link>
              <Link
                to="/docs"
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                Dokümantasyon
              </Link>
              <Link
                to="/terms"
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                Şartlar
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-zinc-500 hover:text-zinc-800"
              >
                Gizlilik
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
