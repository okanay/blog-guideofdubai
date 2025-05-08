// app/routes/blog/_auth/_editor/editor.featured.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEditorContext } from "@/components/editor/store";
import { useState, useEffect } from "react";
import {
  Loader2,
  GripVertical,
  Star,
  StarOff,
  RefreshCw,
  Save,
  ArrowLeft,
} from "lucide-react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { Link } from "@/i18n/link";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/_auth/_editor/editor/featured")({
  component: FeaturedBlogsPage,
});

function FeaturedBlogsPage() {
  const {
    fetchFeaturedBlogs,
    removeFromFeatured,
    updateFeaturedOrdering,
    featuredBlogs,
    statusStates: { featured },
  } = useEditorContext();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>("tr");
  const [items, setItems] = useState<BlogPostCardView[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Dil değiştiğinde featured blogları yükle
  useEffect(() => {
    fetchFeaturedBlogs(selectedLanguage);
  }, [selectedLanguage]);

  // Featured bloglar değiştiğinde local state'i güncelle
  useEffect(() => {
    setItems(featuredBlogs[selectedLanguage] || []);
    setHasChanges(false);
  }, [featuredBlogs, selectedLanguage]);

  // Drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
  };

  // Drag enter
  const handleDragEnter = (index: number) => {
    if (draggedItem !== index) {
      setDragOverIndex(index);
    }
  };

  // Drag leave
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const itemsCopy = [...items];
    const draggedItemContent = itemsCopy[draggedItem];

    // Remove from old position
    itemsCopy.splice(draggedItem, 1);
    // Insert at new position
    itemsCopy.splice(dropIndex, 0, draggedItemContent);

    setItems(itemsCopy);
    setDraggedItem(null);
    setDragOverIndex(null);
    setHasChanges(true);
  };

  // Drag end
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Sıralamayı kaydet
  const handleSaveOrdering = async () => {
    const blogIds = items.map((item) => item.id);
    const success = await updateFeaturedOrdering(selectedLanguage, blogIds);

    if (success) {
      setHasChanges(false);
      toast.success("Sıralama başarıyla güncellendi");
    }
  };

  // Featured'dan çıkar
  const handleRemoveFromFeatured = async (blogId: string) => {
    const success = await removeFromFeatured(blogId);

    if (success) {
      fetchFeaturedBlogs(selectedLanguage);
      toast.success("Blog öne çıkanlardan kaldırıldı");
    }
  };

  return (
    <main className="relative mx-auto w-full space-y-4 overflow-hidden px-4 sm:px-6 lg:px-8">
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Link
                to="/editor/"
                className="bg-primary border-primary-cover text-color-primary flex size-8 flex-shrink-0 items-center justify-center rounded-md border transition-opacity duration-300 hover:opacity-75"
              >
                <ArrowLeft size={18} />
              </Link>

              <div className="px-6">
                <h2 className="text-lg font-semibold text-zinc-800 transition-all duration-300">
                  Öne Çıkan Bloglar
                </h2>

                <p className="line-clamp-1 text-sm text-zinc-500 transition-all duration-300">
                  Dil bazında öne çıkan blogları sürükle-bırak ile sıralayın
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dil Seçici */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) =>
                    setSelectedLanguage(e.target.value as Language)
                  }
                  className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:ring-1"
                >
                  {LANGUAGE_DICTONARY.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Yenile Butonu */}
              <button
                onClick={() => fetchFeaturedBlogs(selectedLanguage)}
                disabled={featured.loading}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={featured.loading ? "animate-spin" : ""}
                />
                Yenile
              </button>

              {/* Kaydet Butonu */}
              <button
                onClick={handleSaveOrdering}
                disabled={!hasChanges || featured.loading}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  hasChanges && !featured.loading
                    ? "bg-primary hover:bg-primary-600 shadow-sm"
                    : "cursor-not-allowed bg-zinc-300"
                }`}
              >
                <Save size={16} />
                Sıralamayı Kaydet
              </button>
            </div>
          </div>
        </div>
      </header>

      {featured.loading && items.length === 0 ? (
        <div className="flex items-center justify-center">
          <Loader2 className="text-primary-500 h-8 w-8 animate-spin" />
          <span className="ml-3 text-zinc-600">
            Öne çıkan bloglar yükleniyor...
          </span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Star className="h-10 w-10 text-amber-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-zinc-900">
            Öne çıkan blog yok
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {selectedLanguage.toUpperCase()} dili için henüz öne çıkan blog
            eklenmemiş.
          </p>
          <Link
            to="/editor/list"
            className="bg-primary hover:bg-primary-600 mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            <Star size={16} />
            Blog Listesine Git
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Başlık */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Sıralama ({items.length} blog)
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Blogları sürükleyerek sırasını değiştirebilirsiniz
              </p>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm text-amber-800">
                <Star size={14} className="text-amber-600" />
                Kaydetmeyi unutmayın
              </div>
            )}
          </div>

          {/* Blog Listesi */}
          {items.map((blog, index) => (
            <div
              key={blog.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative flex items-center gap-4 rounded-lg border bg-white p-4 transition-all duration-150 ${
                draggedItem === index
                  ? "scale-[0.95]"
                  : dragOverIndex === index
                    ? "border-primary scale-[1.05]"
                    : "border-zinc-200 hover:border-zinc-500"
              }`}
            >
              {/* Drag Handle */}
              <div
                className={`flex items-center justify-center rounded p-1 transition-colors ${
                  draggedItem === index
                    ? "bg-primary-100 text-primary-600"
                    : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                }`}
                style={{ cursor: "grab" }}
              >
                <GripVertical size={20} className="pointer-events-none" />
              </div>

              {/* Sıra Numarası */}
              <div className="bg-primary-50 text-primary-700 flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold">
                {index + 1}
              </div>

              {/* Blog Görseli */}
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {blog.content.image ? (
                  <img
                    src={blog.content.image}
                    alt={blog.content.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                    <Star className="h-6 w-6 text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Blog Bilgileri */}
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 font-medium text-zinc-900">
                  {blog.content.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                  {blog.content.description}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                  <span>{blog.content.readTime} dk okuma</span>
                  <span>•</span>
                  <span>
                    {
                      LANGUAGE_DICTONARY.find(
                        (lang) => lang.value === blog.language,
                      )?.label
                    }
                  </span>
                </div>
              </div>

              {/* İşlemler */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemoveFromFeatured(blog.id)}
                  className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                  title="Öne çıkanlardan kaldır"
                >
                  <StarOff size={16} />
                  <span className="hidden sm:inline">Kaldır</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
