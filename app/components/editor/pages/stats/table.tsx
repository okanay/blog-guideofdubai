import { useEditorContext } from "@/components/editor/store";
import { Eye, ThumbsUp, Share2, MessageSquare } from "lucide-react";
import { formatDate } from "@/components/editor/helper";
import { ACTIVE_LANGUAGE_DICTONARY } from "@/i18n/config";

export function StatsTable() {
  const { blogStats } = useEditorContext();
  const { filteredData } = blogStats;

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead>
          <tr className="bg-gradient-to-r from-zinc-50 to-zinc-100">
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-600 uppercase">
                  Blog Detayları
                </span>
              </div>
            </th>
            <th className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-600 uppercase">
                  Performans Metrikleri
                </span>
              </div>
            </th>
            <th className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-600 uppercase">
                  Son Aktivite
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {filteredData.map((stat, index) => {
            return (
              <tr
                key={stat.blogId}
                className={`group transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-zinc-50/30"
                } hover:bg-blue-50/50`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200">
                      {stat.image ? (
                        <img
                          src={stat.image}
                          alt={stat.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-lg font-bold text-zinc-400">
                            {stat.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600">
                        {stat.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            stat.language === "tr"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ACTIVE_LANGUAGE_DICTONARY.find(
                            (l) => l.value === stat.language,
                          )?.label || stat.language}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {stat.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-zinc-900">
                          {stat.views.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Görüntülenme
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-zinc-900">
                          {stat.likes.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">Beğeni</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1.5">
                        <Share2 className="h-4 w-4 text-violet-500" />
                        <span className="font-semibold text-zinc-900">
                          {stat.shares.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">Paylaşım</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-zinc-900">
                          {stat.comments.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">Yorum</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-zinc-900">
                      {formatDate(stat.lastViewedAt)}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Oluşturulma: {formatDate(stat.createdAt)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <Eye className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-sm font-medium text-zinc-900">Veri bulunamadı</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Filtreleme kriterlerinize uygun sonuç yok.
          </p>
        </div>
      )}
    </div>
  );
}
