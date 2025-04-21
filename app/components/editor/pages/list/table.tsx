import { Eye, FileTextIcon, MoreHorizontal, CheckCircle2, Trash2, Star, Archive } from "lucide-react"; // prettier-ignore
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { Link } from "@/i18n/link";
import { useState } from "react";

interface BlogTableProps {
  blogs: BlogPostCardView[];
  onChangeStatus: (id: string, status: string) => void;
  onDeleteClick: (id: string) => void;
  formatDate: (date: string) => string;
}

export function BlogTable({
  blogs,
  onChangeStatus,
  onDeleteClick,
  formatDate,
}: BlogTableProps) {
  const [activeMenu, setActiveMenu] = useState<string>("empty");

  const toggleActiveMenu = (id: string) => {
    setActiveMenu(activeMenu === "empty" ? id : "empty");
  };

  const STATUS_CONFIGS = {
    published: {
      label: "Yayında",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    draft: {
      label: "Taslak",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    archived: {
      label: "Arşivlenmiş",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    deleted: {
      label: "Silinmiş",
      color: "text-red-600 bg-red-50 border-red-200",
    },
  };

  return (
    <div className="border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
            >
              Blog
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase md:table-cell"
            >
              Dil
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase md:table-cell"
            >
              Durum
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase md:table-cell"
            >
              Tarih
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium tracking-wider text-zinc-500 uppercase"
            >
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {blogs.map((blog) => (
            <tr key={blog.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-zinc-200">
                    {blog.content.image ? (
                      <img
                        src={blog.content.image}
                        alt={blog.content.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="ml-3 max-w-xs">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {blog.content.title}
                      </p>
                      {blog.featured && (
                        <Star
                          size={14}
                          className="flex-shrink-0 fill-amber-500 text-amber-500"
                        />
                      )}
                    </div>
                    <p className="truncate text-xs text-zinc-500">
                      {blog.content.readTime} dk okuma süresi
                    </p>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                {LANGUAGE_DICTONARY.find((lang) => lang.value === blog.language)
                  ?.label || blog.language}
              </td>
              <td className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${STATUS_CONFIGS[blog.status].color}`}
                >
                  {STATUS_CONFIGS[blog.status].label}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                {formatDate(blog.createdAt)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/editor/edit/${blog.id}`}
                    className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-200"
                  >
                    Düzenle
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => toggleActiveMenu(blog.id)}
                      className="flex items-center justify-center rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* İşlem Menüsü */}
                    {activeMenu === blog.id && (
                      <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                          <Eye size={16} />
                          <span>Görüntüle</span>
                        </Link>

                        {/* Durum değiştirme seçenekleri */}
                        {blog.status === "draft" && (
                          <button
                            onClick={() => onChangeStatus(blog.id, "published")}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle2 size={16} />
                            <span>Yayınla</span>
                          </button>
                        )}

                        {blog.status === "archived" && (
                          <button
                            onClick={() => onChangeStatus(blog.id, "published")}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle2 size={16} />
                            <span>Yayınla</span>
                          </button>
                        )}

                        {blog.status === "published" && (
                          <button
                            onClick={() => onChangeStatus(blog.id, "archived")}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                          >
                            <Archive size={16} />
                            <span>Arşivle</span>
                          </button>
                        )}

                        {/* Silme butonu */}
                        <button
                          onClick={() => onDeleteClick(blog.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          <span>Sil</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
