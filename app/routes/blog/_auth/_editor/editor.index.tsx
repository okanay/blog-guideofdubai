import { CacheModal } from "@/components/editor/pages/cache/modal";
import { useEditorContext } from "@/components/editor/store";
import { Link } from "@/i18n/link";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  ListFilter,
  PlusCircle,
  RefreshCw,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/blog/_auth/_editor/editor/")({
  component: EditorDashboard,
});

// Ana Bileşen
function EditorDashboard() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-white">
      {/* Ana İçerik */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Başlık her durumda görünür */}
          <DashboardTitle />
          <QuickAccessCards />
        </div>
      </main>
    </div>
  );
}

// Dashboard Başlık Bileşeni
const DashboardTitle = () => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-zinc-900">Hoş Geldiniz</h1>
    <p className="mt-1 text-zinc-600">
      Blog içeriklerinizi yönetin ve yeni bloglar oluşturun
    </p>
  </div>
);

// Hızlı Erişim Kartları Bileşeni
const QuickAccessCards = () => (
  <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* Blog Oluştur */}
    <Link
      to="/editor/create"
      className="group border-primary-200 hover:border-primary-300 relative overflow-hidden rounded-xl border-2 border-dashed bg-white p-6 transition-all lg:col-span-2"
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

    {/* İstatistikler */}
    <Link
      to="/editor/stats"
      className="group relative overflow-hidden rounded-xl border border-zinc-100 bg-white p-6 transition-all hover:border-zinc-200"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-zinc-800">
          İstatistikler
        </h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Blog istatistiklerinizi görüntüleyin ve analiz edin
        </p>
      </div>
      <div className="absolute -right-14 -bottom-14 h-32 w-32 rounded-full bg-blue-50 opacity-50 transition-transform group-hover:scale-110"></div>
    </Link>

    {/* Cache Modal */}
    <CacheCard />
  </div>
);

const CacheCard = () => {
  const {
    cacheView: { mode, setMode },
  } = useEditorContext();

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-100 bg-white p-6 transition-all hover:border-zinc-200"
      onClick={() => {
        setMode(true);
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime-50 text-lime-600 transition-colors group-hover:bg-lime-100">
          <RefreshCw className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-zinc-800">
          Cache Kontrol
        </h3>
        <p className="mt-1.5 text-sm text-zinc-500">
          Blogunuzun performansını iyileştirmek için cache kontrolü yapın.
        </p>
      </div>
      <div className="absolute -right-14 -bottom-14 h-32 w-32 rounded-full bg-lime-50 opacity-50 transition-transform group-hover:scale-110"></div>
    </div>
  );
};
