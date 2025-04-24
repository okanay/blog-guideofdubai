import React, { useEffect, useRef, useState } from "react";
import { useImage } from "./store";
import {
  X,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (image: ImageType | null) => void;
  singleSelect?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  singleSelect = true,
}) => {
  const {
    images,
    selectedImage,
    isLoading,
    error,
    fetchImages,
    startUpload,
    cancelUpload,
    selectImage,
    deleteImage,
    resetError,
  } = useImage();

  const [tab, setTab] = useState<"upload" | "gallery">("gallery");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Modal açıldığında resimleri yükle
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, fetchImages]);

  // Modal kapatıldığında seçili resmi temizle
  const handleClose = () => {
    selectImage(null);
    onClose();
  };

  // Dosya seçme ve yükleme işlemleri
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startUpload(e.target.files[0]);
      setTab("upload"); // Otomatik olarak upload tabına geç
    }
  };

  // Dosya seçme dialogunu açma
  const handleClickUpload = () => {
    fileInputRef.current?.click();
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
      startUpload(e.dataTransfer.files[0]);
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

  // Yükleme durumu component'i
  const UploadStatus = () => {
    if (!selectedImage) return null;

    return (
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-medium">Yükleme Durumu</h3>
          {selectedImage.status === "success" && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check size={16} /> Başarılı
            </span>
          )}
          {selectedImage.status === "error" && (
            <span className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={16} /> Hata
            </span>
          )}
        </div>

        {selectedImage.file && (
          <div className="mb-2 text-sm">
            <p className="text-gray-700">{selectedImage.file.name}</p>
            <p className="text-gray-500">
              {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {selectedImage.status === "uploading" && (
          <>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${selectedImage.progress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-right text-xs text-gray-500">
              {selectedImage.progress}%
            </p>
          </>
        )}

        {selectedImage.status !== "idle" && (
          <div className="mt-2">
            {["preparing", "uploading", "confirming"].includes(
              selectedImage.status,
            ) ? (
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-800"
                onClick={cancelUpload}
              >
                İptal Et
              </button>
            ) : selectedImage.status === "error" ? (
              <p className="text-sm text-red-600">
                {selectedImage.error || "Bir hata oluştu"}
              </p>
            ) : null}
          </div>
        )}

        {selectedImage.previewUrl && (
          <div className="mt-3">
            <h4 className="mb-1 text-sm font-medium">Önizleme</h4>
            <div className="relative mt-1 h-48 w-full overflow-hidden rounded-md bg-gray-100">
              <img
                src={selectedImage.previewUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Resim Yöneticisi</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex px-4 pt-4">
          <button
            type="button"
            className={`mr-2 rounded-t-lg px-4 py-2 font-medium ${
              tab === "gallery"
                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("gallery")}
          >
            <div className="flex items-center gap-2">
              <ImageIcon size={18} />
              <span>Galeri</span>
            </div>
          </button>
          <button
            type="button"
            className={`rounded-t-lg px-4 py-2 font-medium ${
              tab === "upload"
                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("upload")}
          >
            <div className="flex items-center gap-2">
              <Upload size={18} />
              <span>Yükle</span>
            </div>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Error Messages */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Hata</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={resetError}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Gallery Tab */}
          {tab === "gallery" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Resim Galerisi</h3>
                <button
                  type="button"
                  onClick={fetchImages}
                  disabled={isLoading}
                  className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 ${
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

              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : images.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <ImageIcon size={40} className="mx-auto mb-2 opacity-30" />
                  <p>Henüz hiç resim yüklenmemiş</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 bg-gray-100 ${
                        selectedImage?.imageData?.id === image.id
                          ? "border-blue-500"
                          : "border-transparent"
                      } hover:border-blue-300`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || image.filename}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error("Görsel yüklenemedi:", image.url);
                          const target = e.target as HTMLImageElement;
                          // Hata durumunda arka plan ve ikon göster
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement("div");
                            errorDiv.className =
                              "flex flex-col items-center justify-center h-full w-full";
                            errorDiv.innerHTML = `
                              <div class="bg-red-100 text-red-500 p-2 rounded-full mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                              </div>
                              <span class="text-xs text-red-500">Görsel Yüklenemedi</span>
                            `;
                            parent.appendChild(errorDiv);
                          }
                        }}
                      />
                      <div className="bg-opacity-0 group-hover:bg-opacity-30 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(image.id);
                          }}
                          className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 truncate bg-black p-1 text-xs text-white">
                        {image.filename}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {tab === "upload" && (
            <div>
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                />
                <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 font-medium">
                  {dragActive
                    ? "Dosyayı Buraya Bırakın"
                    : "Resim Yüklemek İçin Tıklayın veya Sürükleyin"}
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  PNG, JPG ve WEBP formatları desteklenir
                </p>
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Dosya Seç
                </button>
              </div>

              <UploadStatus />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
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
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Seç
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Kullanımı:
// <ImageModal
//   isOpen={isModalOpen}
//   onClose={() => setIsModalOpen(false)}
//   onSelect={(image) => console.log("Selected image:", image)}
// />

export default ImageModal;
