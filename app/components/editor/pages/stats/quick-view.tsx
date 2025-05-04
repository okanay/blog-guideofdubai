import { Eye, TrendingUp, Languages } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";
import { useState } from "react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";

export function StatsQuickView() {
  const { blogStats } = useEditorContext();
  const { filteredData } = blogStats;
  const [viewPeriod, setViewPeriod] = useState<"all" | "24h" | "7d" | "30d">(
    "all",
  );

  // Görüntülenme hesaplamaları
  const calculateViews = (period: string) => {
    if (period === "all") {
      return {
        views: filteredData.reduce((acc, stat) => acc + stat.views, 0),
        count: filteredData.length,
      };
    }

    const now = new Date();
    let timeLimit = 0;

    switch (period) {
      case "24h":
        timeLimit = 24 * 60 * 60 * 1000;
        break;
      case "7d":
        timeLimit = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        timeLimit = 30 * 24 * 60 * 60 * 1000;
        break;
    }

    const periodData = filteredData.filter((stat) => {
      const lastViewed = new Date(stat.lastViewedAt);
      const diff = now.getTime() - lastViewed.getTime();
      return diff < timeLimit;
    });

    return {
      views: periodData.reduce((acc, stat) => acc + stat.views, 0),
      count: periodData.length,
    };
  };

  const currentViewData = calculateViews(viewPeriod);

  // En popüler blog
  const mostViewed = filteredData.reduce(
    (max, stat) => (stat.views > (max?.views || 0) ? stat : max),
    null as (typeof filteredData)[0] | null,
  );

  // En son görüntülenen blog
  const mostRecent = filteredData.reduce(
    (latest, stat) => {
      if (!latest) return stat;
      const latestDate = new Date(latest.lastViewedAt);
      const statDate = new Date(stat.lastViewedAt);
      return statDate > latestDate ? stat : latest;
    },
    null as (typeof filteredData)[0] | null,
  );

  // Bugünkü görüntülenme
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dil dağılımı
  const languageDistribution = getLanguageDistribution(filteredData);

  const mainCards = [
    {
      title: "Görüntülenme İstatistikleri",
      component: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-600">
              Görüntülenme Dönemi
            </p>
            <select
              value={viewPeriod}
              onChange={(e) =>
                setViewPeriod(e.target.value as typeof viewPeriod)
              }
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tüm Zamanlar</option>
              <option value="24h">Son 24 Saat</option>
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
            </select>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900">
              {currentViewData.views.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {currentViewData.count} aktif blog
            </p>
          </div>
        </div>
      ),
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500/10",
      textColor: "text-blue-700",
    },
    {
      title: "Dil Dağılımı",
      component: (
        <div className="space-y-3">
          {languageDistribution.map((lang, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${lang.color}`} />
                <span className="text-sm font-medium text-zinc-700">
                  {lang.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900">
                  {lang.views.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500">
                  ({lang.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      ),
      icon: Languages,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500/10",
      textColor: "text-purple-700",
    },
    {
      title: "En Popüler Blog",
      component: (
        <div className="space-y-2">
          <p
            className="line-clamp-2 text-base font-semibold text-zinc-900"
            title={mostViewed?.title}
          >
            {mostViewed?.title || "Veri yok"}
          </p>
          {mostViewed && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Görüntülenme</span>
              <span className="font-bold text-zinc-900">
                {mostViewed.views.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ),
      icon: TrendingUp,
      color: "from-rose-500 to-rose-600",
      bgColor: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-500/10",
      textColor: "text-rose-700",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mainCards.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:shadow-md"
        >
          {/* Arkaplan gradient efekti */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-30 transition-opacity duration-300 group-hover:opacity-50`}
          />

          {/* Başlık ve ikon */}
          <div className="relative flex items-center justify-between border-b border-zinc-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-zinc-900">
              {card.title}
            </h3>
            <div className={`rounded-lg ${card.iconBg} p-2`}>
              <card.icon className={`h-5 w-5 ${card.textColor}`} />
            </div>
          </div>

          {/* İçerik */}
          <div className="relative p-6">{card.component}</div>
        </div>
      ))}
    </div>
  );
}

function getLanguageDistribution(data: any[]) {
  const languages = data.reduce((acc, item) => {
    acc[item.language] = (acc[item.language] || 0) + item.views;
    return acc;
  }, {});

  const total = Object.values(languages).reduce(
    (sum: number, views: any) => sum + views,
    0,
  );

  const colors = {
    tr: "bg-red-500",
    en: "bg-blue-500",
    ar: "bg-green-500",
    de: "bg-yellow-500",
    fr: "bg-purple-500",
    ru: "bg-indigo-500",
  };

  return Object.entries(languages)
    .map(([language, views]: [string, any]) => ({
      language,
      label:
        LANGUAGE_DICTONARY.find((l) => l.value === language)?.label ||
        language.toUpperCase(),
      views,
      percentage:
        typeof total === "number" && total > 0
          ? ((Number(views) / total) * 100).toFixed(1)
          : "0",
      color: colors[language as keyof typeof colors] || "bg-zinc-500",
    }))
    .sort((a, b) => Number(b.views) - Number(a.views));
}
