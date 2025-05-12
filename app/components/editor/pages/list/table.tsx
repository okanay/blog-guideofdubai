import { useEditorContext } from "@/components/editor/store";
import { ACTIVE_LANGUAGE_DICTONARY } from "@/i18n/config";
import { Link } from "@/i18n/link";

import { Archive, ArrowUpFromLine, CheckCircle2, Edit, Eye, EyeIcon, EyeOff, MoreHorizontal, Star, StarOff, Trash2 } from "lucide-react"; // prettier-ignore
import { BLOG_OPTIONS } from "../../constants";
import { formatDate } from "../../helper";

interface BlogTableProps {
  blogs: BlogPostCardView[];
  onDeleteClick: (id: string) => void;
  onFeaturedToggle: (blogId: string, currentStatus: boolean) => void;
}

export function BlogTable({
  blogs,
  onDeleteClick,
  onFeaturedToggle,
}: BlogTableProps) {
  const { changeBlogStatus } = useEditorContext();

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full divide-y divide-zinc-200">
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
              Oluşturma
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase md:table-cell"
            >
              Güncelleme
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
                      <p className="max-w-40 truncate text-sm font-medium text-zinc-900">
                        {blog.content.title}
                      </p>
                    </div>
                    <p className="truncate text-xs text-zinc-500">
                      {blog.content.readTime} dk okuma süresi
                    </p>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                {ACTIVE_LANGUAGE_DICTONARY.find(
                  (lang) => lang.value === blog.language,
                )?.label || blog.language}
              </td>
              <td className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    BLOG_OPTIONS.find((option) => option.value === blog.status)
                      ?.config.color
                  }`}
                >
                  {
                    BLOG_OPTIONS.find((option) => option.value === blog.status)
                      ?.label2
                  }
                </span>
              </td>
              <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                {formatDate(blog.createdAt)}
              </td>
              <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                {formatDate(blog.updatedAt)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/blog/${blog.slug}`}
                    target="_blank"
                    className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-200"
                  >
                    <EyeIcon size={16} className="mr-1 inline-block" />
                  </Link>

                  <Link
                    to={`/editor/edit/${blog.id}`}
                    className="rounded-lg bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200"
                  >
                    <Edit size={16} className="mr-1 inline-block" />
                  </Link>
                  <button
                    onClick={() => onFeaturedToggle(blog.id, blog.featured)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      blog.featured
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                    title={
                      blog.featured
                        ? "Öne çıkanlardan kaldır"
                        : "Öne çıkanlara ekle"
                    }
                  >
                    {blog.featured ? <StarOff size={16} /> : <Star size={16} />}
                  </button>

                  {/* Durum değiştirme butonu */}
                  {blog.status !== "published" ? (
                    <button
                      onClick={() => changeBlogStatus(blog.id, "published")}
                      className="rounded-lg bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-200"
                      title="Yayınla"
                    >
                      <ArrowUpFromLine size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => changeBlogStatus(blog.id, "archived")}
                      className="rounded-lg bg-purple-100 px-2.5 py-1.5 text-xs font-medium text-purple-800 transition-colors hover:bg-purple-200"
                      title="Taslağa Çevir"
                    >
                      <Archive size={16} />
                    </button>
                  )}

                  {/* Silme butonu */}
                  <button
                    onClick={() => onDeleteClick(blog.id)}
                    className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-200"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
