import { CacheModal } from "@/components/editor/pages/cache/modal";
import { EditorProvider, useEditorContext } from "@/components/editor/store";
import dragModuleStyles from "@/components/editor/tiptap/drag-styles.css?url";
import { getLanguageFromSearch } from "@/i18n/action";
import { seoTranslations } from "@/i18n/languages";
import { Link } from "@/i18n/link";
import { useAuth } from "@/providers/auth";
import ProtectedRoute from "@/providers/auth/protected-route";
import {
  createFileRoute,
  Outlet,
  useMatchRoute,
  useRouterState,
} from "@tanstack/react-router";
import {
  BarChart3,
  CircleUser,
  FilePlus2,
  Folder,
  Home,
  LogOut,
  RefreshCw,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/blog/_auth/_editor")({
  loader: async ({ location: { search } }) => {
    const lang = getLanguageFromSearch(search);
    return { lang };
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.editor.root.title,
        },
        {
          name: "description",
          content: seoData.auth.editor.root.description,
        },
      ],
      links: [
        {
          rel: "preload stylesheet",
          as: "style",
          type: "text/css",
          crossOrigin: "anonymous",
          href: dragModuleStyles,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute control="unauthorize" navigateTo="/login">
      <EditorProvider>
        {/* Header her zaman görünür */}
        <Header />
        <CacheModal />

        <div className="flex">
          {/* Sidebar her zaman görünür */}
          <Sidebar />
          <Outlet />
        </div>
      </EditorProvider>
    </ProtectedRoute>
  );
}

// 1. Header Bileşeni - Her durumda görünecek
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
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
};

// 2. Sidebar Bileşeni - Her durumda görünecek
const Sidebar = () => {
  // useRouterState hook'u rota değişikliklerinde bileşenin yeniden render edilmesini sağlar
  // const routerState = useRouterState();
  const matchRoute = useMatchRoute();

  // useMemo kullanmadan doğrudan hesaplama
  const zenModeRoutes = ["/blog/editor/create", "/blog/editor/edit"];
  const isZenMode = zenModeRoutes.some(
    (route) =>
      matchRoute({ to: route }) ||
      matchRoute({ to: `${route}/$postId`, fuzzy: true }),
  );

  // Sidebar animasyonu için durum
  const [isSidebarHidden, setIsSidebarHidden] = useState(isZenMode);

  // isZenMode değiştiğinde animasyon için gecikme ekleyelim
  useEffect(() => {
    if (isZenMode) {
      setIsSidebarHidden(true);
    } else {
      setIsSidebarHidden(false);
    }
  }, [isZenMode]);

  return (
    <aside
      className={`relative z-20 hidden shrink-0 transform overflow-hidden border-r border-zinc-100 bg-white transition-all duration-300 ease-in-out md:block ${
        isSidebarHidden
          ? "w-0 -translate-x-full opacity-0 lg:-translate-x-full"
          : "w-64 translate-x-0 opacity-100"
      }`}
    >
      <div className="sticky top-0 flex h-full w-64 flex-col">
        <div className="p-4">
          <h2 className="px-3 py-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            İçerik Yönetimi
          </h2>
          <nav className="mt-2 space-y-1">
            <Link
              to="/editor"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
              active="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 focus:bg-primary-100 focus:text-primary-700"
            >
              <Home className="mr-3 h-5 w-5" />
              <span>Editör Paneli</span>
            </Link>

            <Link
              to="/editor/create"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
              active="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 focus:bg-primary-100 focus:text-primary-700"
            >
              <FilePlus2 className="mr-3 h-5 w-5" />
              <span>Yeni Blog Oluştur</span>
            </Link>

            <Link
              to="/editor/list"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
              active="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 focus:bg-primary-100 focus:text-primary-700"
            >
              <Folder className="mr-3 h-5 w-5" />
              <span>Tüm Bloglar</span>
            </Link>

            <Link
              to="/editor/featured"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
              active="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 focus:bg-primary-100 focus:text-primary-700"
            >
              <Star className="mr-3 h-5 w-5" />
              <span>Öne Çıkanlar</span>
            </Link>

            <Link
              to="/editor/stats"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
              active="bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 focus:bg-primary-100 focus:text-primary-700"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <span>İstatistikler</span>
            </Link>

            <CacheModalSideLink />
          </nav>
        </div>
      </div>
    </aside>
  );
};

const CacheModalSideLink = () => {
  const {
    cacheView: { mode, setMode },
  } = useEditorContext();

  return (
    <button
      onClick={() => setMode(!mode)}
      className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900"
    >
      <RefreshCw className="mr-3 h-5 w-5" />
      <span>Cache Kontrol</span>
    </button>
  );
};

export default Sidebar;
