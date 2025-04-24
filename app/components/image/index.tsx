import React, { useEffect, useRef, useState } from "react";
import { useImage } from "./store";
import {
  X,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Check,
  Search,
  Clock,
  EyeIcon,
} from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (image: ImageType | null) => void;
  singleSelect?: boolean;
}

// Image Types için interface tanımlaması
interface ImageType {
  id: string;
  url: string;
  filename: string;
  altText?: string;
  width?: number;
  height?: number;
  createdAt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  singleSelect = true,
}) => {
  // State değerlerinin düzgün çalışması için default değerler eklendi
  const {
    images = [],
    selectedImage = { imageData: null },
    isLoading = false,
    fetchImages = () => {},
    selectImage = () => {},
    deleteImage = async () => {},
    addToUploadQueue = () => {},
    processUploadQueue = async () => {},
    uploadQueue = [],
    clearQueue = () => {},
  } = useImage();

  const [tab, setTab] = useState<"upload" | "gallery">("gallery");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal açıldığında resimleri yükle
  useEffect(() => {
    if (isOpen && !isLoading && images.length <= 0) {
      fetchImages();
    }
  }, [isOpen]);

  // Modal kapatıldığında seçili resmi temizle
  const handleClose = () => {
    selectImage(null);
    onClose();
  };

  // Dosya seçme ve yükleme işlemleri
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addToUploadQueue(files);
      setTab("upload"); // Otomatik olarak upload tabına geç

      // Input değerini sıfırla (aynı dosyayı tekrar seçebilmek için)
      e.target.value = "";
    }
  };

  // Dosya seçme dialogunu açma
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Yükleme işlemini başlat
  const handleStartUpload = async () => {
    if (uploadQueue.length === 0) return;

    setUploading(true);
    await processUploadQueue();
    setUploading(false);

    // Yükleme tamamlandıktan sonra galeri tabına geç ve resimleri yenile
    setTab("gallery");
    fetchImages();
  };

  // Drag & Drop olayları
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );

      if (files.length === 0) return;

      addToUploadQueue(files);
      setTab("upload"); // Otomatik olarak upload tabına geç
    }
  };

  // Resim seçme işlemi
  const handleSelectImage = (image: ImageType) => {
    selectImage(image.id);
    if (onSelect) {
      onSelect(image);
    }
    if (singleSelect) {
      handleClose();
    }
  };

  // Resim silme işlemi
  const handleDeleteImage = async (imageId: string) => {
    await deleteImage(imageId);
  };

  // Arama ve filtreleme
  const filteredImages = images.filter((image) => {
    if (!searchQuery) return true;
    return (
      image.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (image.altText &&
        image.altText.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
            Resim Yöneticisi
          </h2>
          <div>
            <button
              type="button"
              className={`mr-2 border-b-2 px-3 py-2 font-medium transition-colors md:px-4 md:py-3 ${
                tab === "gallery"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab("gallery")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <ImageIcon size={18} />
                <span className="text-xs sm:text-sm">Galeri</span>
              </div>
            </button>
            <button
              type="button"
              className={`border-b-2 px-3 py-2 font-medium transition-colors md:px-4 md:py-3 ${
                tab === "upload"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab("upload")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <Upload size={18} />
                <span className="text-xs sm:text-sm">Yükle</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content - Sticky Header yükleme alanı için */}
        <div className="relative flex-1 overflow-auto">
          {/* Sticky Upload Area - Her zaman görünür olacak */}
          {tab === "upload" && (
            <div className="sticky top-0 z-10 bg-white p-4 shadow-md">
              <div
                className={`rounded-lg border-2 border-dashed p-4 text-center md:p-8 ${
                  dragActive
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <Upload
                  size={30}
                  className="mx-auto mb-2 text-gray-400 md:mb-4 md:text-4xl"
                />
                <h3 className="mb-1 text-base font-medium text-gray-700 md:mb-2 md:text-lg">
                  {dragActive
                    ? "Dosyaları Buraya Bırakın"
                    : "Resim Yüklemek İçin Tıklayın veya Sürükleyin"}
                </h3>
                <p className="mb-3 text-xs text-gray-500 md:mb-6 md:text-sm">
                  PNG, JPG, WEBP ve SVG formatları desteklenir
                </p>
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-300 rounded-md px-4 py-2 text-xs text-white transition-colors focus:ring-2 focus:outline-none md:px-6 md:py-2.5 md:text-sm"
                >
                  Dosya Seç
                </button>
              </div>
            </div>
          )}

          <div className="p-4">
            {/* Gallery Tab */}
            {tab === "gallery" && (
              <div>
                <div className="mb-4 space-y-3">
                  {/* Arama ve Filtreleme */}
                  <div className="flex gap-x-4 sm:flex-row">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Dosya adı veya alt metin ara..."
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:ring-1 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={fetchImages}
                      disabled={isLoading}
                      className={`text-primary-500 hover:text-primary-700 border-primary-300 flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                        isLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <RefreshCw
                        size={16}
                        className={`${isLoading ? "animate-spin" : ""}`}
                      />
                      <span>Yenile</span>
                    </button>
                  </div>
                </div>

                {/* Grid görüntüleme */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`group hover:border-primary-500 relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                        selectedImage?.imageData?.id === image.id
                          ? "border-primary-500"
                          : "border-zinc-200"
                      } bg-gray-100 transition-all`}
                      onClick={() => handleSelectImage(image)}
                    >
                      {/* Resim için sabit yükseklik ve genişlik tanımı */}
                      <div className="h-full w-full">
                        <img
                          src={image.url}
                          alt={image.altText || image.filename}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Resim yüklenemezse placeholder göster
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30 40 L50 60 L70 40' stroke='%23cccccc' stroke-width='5' fill='none'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      {/* Kaplama - Hover efekti */}
                      <div className="bg-opacity-100 group-hover:bg-opacity-30 absolute inset-0 flex flex-col justify-between bg-zinc-950/40 opacity-0 transition-all group-hover:opacity-100">
                        {/* Üst kısım - Seçim işareti */}
                        <div className="flex justify-end p-2">
                          {selectedImage?.imageData?.id === image.id && (
                            <div className="bg-primary-500 rounded-full p-1 shadow-md">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Alt kısım - Bilgiler ve butonlar */}
                        <div className="p-2">
                          {/* İşlem butonları */}
                          <div className="mb-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image.id);
                              }}
                              className="rounded-full bg-white/90 p-1.5 text-red-500 shadow-md transition-colors hover:bg-red-500 hover:text-white"
                              title="Resmi sil"
                            >
                              <Trash2 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(image.url, "_blank");
                              }}
                              className="text-primary-500 hover:bg-primary-500 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:text-white"
                              title="Orijinal görüntüyü aç"
                            >
                              <EyeIcon size={16} />
                            </button>
                          </div>

                          {/* Bilgi alanı */}
                          <div className="bg-opacity-50 rounded-md bg-zinc-950 p-1.5 text-xs text-white">
                            <div className="truncate">{image.filename}</div>
                            <div className="mt-0.5 flex justify-between text-[10px] text-white/80">
                              <span>
                                {image.width}x{image.height || "?"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {new Date(image.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arama sonucu boş ise */}
                {!isLoading &&
                  filteredImages.length === 0 &&
                  searchQuery !== "" && (
                    <div className="py-8 text-center text-gray-500">
                      <Search size={40} className="mx-auto mb-2 opacity-30" />
                      <p>Aramanızla eşleşen resim bulunamadı</p>
                    </div>
                  )}

                {/* Hiç resim yoksa */}
                {!isLoading && images.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <ImageIcon size={40} className="mx-auto mb-2 opacity-30" />
                    <p>Henüz hiç resim yüklenmemiş</p>
                    <button
                      type="button"
                      onClick={() => setTab("upload")}
                      className="text-primary-500 hover:text-primary-700 mt-3 text-sm font-medium"
                    >
                      İlk resminizi yükleyin
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Upload Tab - Queue kısmı */}
            {tab === "upload" && (
              <div className="mt-4">
                {/* Yükleme Kuyruğu */}
                {uploadQueue.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-700 md:text-base">
                      Yükleme Kuyruğu
                    </h3>
                    <div className="max-h-60 space-y-3 overflow-y-auto pr-1 md:max-h-80">
                      {uploadQueue.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3"
                        >
                          {/* Önizleme - Sabit boyut */}
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            {item.previewUrl ? (
                              <img
                                src={item.previewUrl}
                                alt="Önizleme"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              // Resim yüklenemezse placeholder göster
                              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                <ImageIcon
                                  size={20}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* Bilgiler */}
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <div className="truncate text-sm font-medium text-gray-700">
                                  {item.file?.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.file &&
                                    (item.file.size / 1024 / 1024).toFixed(
                                      2,
                                    )}{" "}
                                  MB
                                </div>
                              </div>

                              {/* Durum göstergesi */}
                              <div className="ml-2">
                                {item.status === "idle" && (
                                  <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    Bekliyor
                                  </span>
                                )}
                                {item.status === "uploading" && (
                                  <span className="bg-primary-100 text-primary-800 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium">
                                    Yükleniyor
                                  </span>
                                )}
                                {item.status === "success" && (
                                  <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                    Tamamlandı
                                  </span>
                                )}
                                {item.status === "error" && (
                                  <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                    Hata
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* İlerleme çubuğu */}
                            {item.status === "uploading" && (
                              <div className="mt-1">
                                <div className="mb-1 flex justify-between text-xs text-gray-500">
                                  <span>Yükleniyor...</span>
                                  <span>{item.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="bg-primary-500 h-full rounded-full"
                                    style={{ width: `${item.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Hata mesajı */}
                            {item.status === "error" && item.error && (
                              <div className="mt-1 text-xs text-red-600">
                                {item.error}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Butonlar - Sabit kısmın altına yerleştirildi */}
                <div className="sticky bottom-0 mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={clearQueue}
                    disabled={uploading || uploadQueue.length === 0}
                    className="text-color-font flex h-10 items-center justify-center gap-2 rounded border border-zinc-200 bg-zinc-100 px-3 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 md:h-11"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Kuyruğu Temizle</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartUpload}
                    disabled={uploading || uploadQueue.length === 0}
                    className="bg-primary-500 hover:bg-primary-600 flex h-10 items-center justify-center gap-2 rounded px-3 text-white disabled:cursor-not-allowed disabled:opacity-50 md:h-11"
                  >
                    {uploading ? (
                      <span className="flex items-center gap-1">
                        <RefreshCw size={16} className="animate-spin" />{" "}
                        <span className="text-sm">Yükleniyor...</span>
                      </span>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span className="text-sm">Tümünü Yükle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t border-zinc-200 p-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
          >
            Kapat
          </button>
          {onSelect && selectedImage?.imageData?.id && (
            <button
              type="button"
              onClick={() => {
                const selectedImg = images.find(
                  (img) => img.id === selectedImage.imageData?.id,
                );
                if (selectedImg && onSelect) {
                  onSelect(selectedImg);
                  handleClose();
                }
              }}
              className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-300 rounded-md px-4 py-2 text-sm text-white transition-colors focus:ring-2 focus:outline-none"
            >
              Seç
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
