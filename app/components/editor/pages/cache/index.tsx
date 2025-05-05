import { useState, useEffect } from "react";
import {
  Database,
  Trash2,
  RefreshCw,
  Server,
  Clock,
  HardDrive,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { cacheService, CacheStats } from "./cache";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth";

export function CacheAdminPanel() {
  const { user } = useAuth();
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  if (user?.role !== "Admin") {
    return null;
  }

  const fetchCacheStats = async () => {
    try {
      setLoading(true);
      const response = await cacheService.getStats();
      if (response.success) {
        setCacheStats(response.stats);
      }
    } catch (error) {
      toast.error("Cache istatistikleri alınamadı", {
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm("Cache'i temizlemek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setClearing(true);
      const response = await cacheService.clearCache();
      if (response.success) {
        toast.success("Cache başarıyla temizlendi");
        await fetchCacheStats();
      }
    } catch (error) {
      toast.error("Cache temizlenemedi", {
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
      });
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchCacheStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cacheStatus = cacheStats?.totalItems ? "active" : "empty";
  const isHealthy = cacheStats && cacheStats.expiredItems === 0;

  // Toplam boyut ayrı ve sade gösterilecek
  const totalSize =
    cacheStats?.totalSize === 0 ? "Boş" : cacheStats?.totalSizeHuman || "-";

  // Öne çıkan metrikler (toplam, aktif, süresi dolan, özel TTL, verimlilik)
  const stats = [
    {
      label: "Toplam Öğe",
      value: cacheStats?.totalItems.toLocaleString() || "0",
      icon: Server,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Aktif Öğe",
      value: cacheStats?.activeItems.toLocaleString() || "0",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Süresi Dolan",
      value: cacheStats?.expiredItems.toLocaleString() || "0",
      icon: Activity,
      color: cacheStats?.expiredItems ? "text-amber-600" : "text-emerald-600",
      bg: cacheStats?.expiredItems ? "bg-amber-50" : "bg-emerald-50",
    },
    {
      label: "Özel TTL'li",
      value: cacheStats?.itemsWithCustomTTL.toLocaleString() || "0",
      icon: Clock,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Verimlilik",
      value: cacheStats?.memoryEfficiency || "N/A",
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Ortalama Boyut",
      value: cacheStats?.avgItemSize || "-",
      icon: Database,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Başlık ve aksiyonlar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Önbellek Yönetimi
            </h3>
            <p className="text-xs text-zinc-500">
              Sistem önbelleğini izleyin ve yönetin
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchCacheStats}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </button>
          <button
            onClick={handleClearCache}
            disabled={clearing || loading}
            className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white shadow-sm transition-all hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 className={`h-3 w-3 ${clearing ? "animate-pulse" : ""}`} />
            Temizle
          </button>
        </div>
      </div>

      {/* Sistem Sağlığı */}
      <div
        className={`flex items-center gap-3 rounded-lg border p-3 shadow-sm ${
          isHealthy
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div>
          {isHealthy ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 text-amber-600" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {isHealthy ? "Sistem Sağlıklı" : "Dikkat Gerekiyor"}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                cacheStatus === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {cacheStatus === "active" ? "Aktif" : "Boş"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            {isHealthy
              ? "Tüm sistemler sorunsuz çalışıyor."
              : "Süresi dolmuş öğeler mevcut, önbelleği kontrol edin."}
          </p>
        </div>
      </div>

      {/* Toplam Boyut */}
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
        <HardDrive className="h-4 w-4 text-fuchsia-600" />
        <span className="text-xs text-zinc-500">Toplam Boyut</span>
        <span className="text-sm font-semibold text-zinc-900">{totalSize}</span>
      </div>

      {/* İstatistikler Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-2`}
          >
            <div className={`rounded-md p-1 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500">{stat.label}</span>
              <span className="text-sm font-semibold break-all text-zinc-900">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Operasyonel Bilgiler */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-md bg-zinc-50 px-2 py-1">
          <span className="text-xs text-zinc-600">Sağlayıcı</span>
          <span className="text-xs font-medium text-zinc-900">
            Bellek Önbelleği
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-zinc-50 px-2 py-1">
          <span className="text-xs text-zinc-600">Uptime</span>
          <span className="text-xs font-medium text-zinc-900">
            {cacheStats?.uptimeHuman || "-"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-zinc-50 px-2 py-1">
          <span className="text-xs text-zinc-600">Default TTL</span>
          <span className="text-xs font-medium text-zinc-900">
            {cacheStats?.ttl || "-"}
          </span>
        </div>
      </div>

      {/* Detaylar Tablosu */}
      {cacheStats?.details && cacheStats.details.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold text-zinc-900">
            <Database className="h-3 w-3 text-blue-400" />
            Önbellek Detayları
          </h4>
          <div className="max-h-40 overflow-x-auto overflow-y-auto rounded-md border border-zinc-200 bg-white">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-2 py-1 text-left font-semibold text-zinc-700">
                    Key
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-zinc-700">
                    Yaş
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-zinc-700">
                    Süre Sonu
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-zinc-700">
                    Boyut
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-zinc-700">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {cacheStats.details.map((item) => (
                  <tr key={item.key}>
                    <td className="max-w-xs truncate px-2 py-1 font-mono text-[10px] text-zinc-700 hover:text-wrap">
                      {item.key}
                    </td>
                    <td className="px-2 py-1">{item.ageHuman}</td>
                    <td className="px-2 py-1">{item.expiresInHuman}</td>
                    <td className="px-2 py-1">{item.sizeHuman}</td>
                    <td className="px-2 py-1">
                      {item.isExpired ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-medium text-amber-700">
                          <XCircle className="h-3 w-3" />
                          Süresi Doldu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Aktif
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
