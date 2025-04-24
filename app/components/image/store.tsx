import { createContext, PropsWithChildren, useContext, useState } from "react";
import { toast } from "sonner";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

// API URL'i
const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3000";

// Yükleme konfigürasyonu
const UPLOAD_CONFIG = {
  maxConcurrentUploads: 3,
  retryAttempts: 2,
  retryDelay: 1000,
};

// Axios instance oluşturuyoruz - cookie tabanlı JWT auth için withCredentials: true
const api = axios.create({
  baseURL: API_URL + "/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store oluşturma fonksiyonu
export function ImageProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        // State
        images: [],
        selectedImage: null,
        uploadQueue: [],
        isLoading: false,
        error: null,

        // Images endpoint'inden tüm resimleri çekmek için
        fetchImages: async () => {
          try {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            const response = await api.get<ApiResponse<ImageType[]>>("/images");

            if (response.data.success && response.data.data) {
              set((state) => {
                state.images = response.data.data || [];
                state.isLoading = false;
              });
            } else {
              throw new Error(response.data.message || "Resimler getirilemedi");
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu";

            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });

            toast.error("Resimler alınırken hata: " + errorMessage);
            console.error("Resimler alınırken hata:", error);
          }
        },

        // Yeni bir yükleme işlemi başlatmak için (tekli dosya)
        startUpload: (file: File) => {
          // Dosya önizlemesi oluştur
          const previewUrl = URL.createObjectURL(file);

          set((state) => {
            state.selectedImage = {
              file,
              previewUrl,
              status: "preparing",
              progress: 0,
              error: null,
            };
            state.error = null;
          });

          // Yükleme işlemini başlat
          get().processUpload();
        },

        // Birden fazla dosya yükleme sırasına ekler
        addToUploadQueue: (files: File[]) => {
          const newQueue = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            status: "idle" as const,
            progress: 0,
            error: null,
            id: Math.random().toString(36).substring(2), // Basit bir unique ID
          }));

          set((state) => {
            state.uploadQueue = [...state.uploadQueue, ...newQueue];
          });
        },

        // Sıradaki tüm dosyaları yükler
        processUploadQueue: async () => {
          const { uploadQueue } = get();
          const queue = [...uploadQueue];

          if (queue.length === 0) {
            toast.info("Yüklenecek dosya yok");
            return;
          }

          // Dosyaları gruplar halinde işle (daha iyi performans için)
          const processInChunks = async () => {
            // Yükleme grupları oluştur
            const chunks = [];
            for (
              let i = 0;
              i < queue.length;
              i += UPLOAD_CONFIG.maxConcurrentUploads
            ) {
              chunks.push(
                queue.slice(i, i + UPLOAD_CONFIG.maxConcurrentUploads),
              );
            }

            // Her grubu sırayla işle
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i];
              // Bu gruptaki dosyaları paralel olarak yükle
              await Promise.all(
                chunk.map((item) => get().uploadSingleFile(item.id)),
              );
            }
          };

          try {
            await processInChunks();
            // Tüm yüklemeler tamamlandığında
            toast.success("Tüm dosyalar yüklendi");
            // Yükleme tamamlandıktan sonra resimleri yenile
            await get().fetchImages();
          } catch (error) {
            console.error("Toplu yükleme sırasında hata:", error);
            toast.error("Bazı dosyalar yüklenemedi");
          }
        },

        // Tek bir dosyayı yükle (kuyruktan)
        uploadSingleFile: async (queueItemId: string) => {
          const state = get();
          const queueItem = state.uploadQueue.find(
            (item) => item.id === queueItemId,
          );

          if (!queueItem) {
            console.error("Yüklenecek dosya bulunamadı:", queueItemId);
            return;
          }

          try {
            // Durumu "uploading" olarak güncelle
            set((state) => {
              const itemIndex = state.uploadQueue.findIndex(
                (item) => item.id === queueItemId,
              );
              if (itemIndex !== -1) {
                state.uploadQueue[itemIndex].status = "uploading";
              }
            });

            // 1. Presigned URL al
            const presignData: PresignURLInput = {
              filename: queueItem.file.name,
              contentType: queueItem.file.type,
              sizeInBytes: queueItem.file.size,
            };

            const presignResponse = await api.post<
              ApiResponse<PresignedURLResponse>
            >("/images/presign", presignData);

            if (!presignResponse.data.success || !presignResponse.data.data) {
              throw new Error(
                presignResponse.data.message || "Presigned URL alınamadı",
              );
            }

            const {
              id: signatureId,
              presignedUrl,
              uploadUrl,
            } = presignResponse.data.data;

            // URL bilgilerini güncelle
            set((state) => {
              const itemIndex = state.uploadQueue.findIndex(
                (item) => item.id === queueItemId,
              );
              if (itemIndex !== -1) {
                state.uploadQueue[itemIndex].signatureId = signatureId;
                state.uploadQueue[itemIndex].presignedUrl = presignedUrl;
                state.uploadQueue[itemIndex].uploadUrl = uploadUrl;
              }
            });

            // 2. Dosyayı Cloudflare R2'ye yükle
            const uploadResponse = await axios.put(
              presignedUrl,
              queueItem.file,
              {
                headers: {
                  "Content-Type": queueItem.file.type,
                },
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const progress = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    set((state) => {
                      const itemIndex = state.uploadQueue.findIndex(
                        (item) => item.id === queueItemId,
                      );
                      if (itemIndex !== -1) {
                        state.uploadQueue[itemIndex].progress = progress;
                      }
                    });
                  }
                },
              },
            );

            if (uploadResponse.status !== 200) {
              throw new Error("Dosya yüklenemedi");
            }

            // 3. Yükleme tamamlandı, görsel boyutlarını al
            const dimensions = await get().getImageDimensions(
              queueItem.previewUrl,
            );

            // 4. Yüklemeyi onayla
            const confirmData: ConfirmUploadInput = {
              signatureId: signatureId,
              url: uploadUrl,
              width: dimensions.width,
              height: dimensions.height,
              sizeInBytes: queueItem.file.size,
              altText: "",
            };

            const confirmResponse = await api.post<
              ApiResponse<ConfirmUploadResponse>
            >("/images/confirm", confirmData);

            if (!confirmResponse.data.success || !confirmResponse.data.data) {
              throw new Error(
                confirmResponse.data.message || "Yükleme onaylanamadı",
              );
            }

            const { id, url } = confirmResponse.data.data;

            // 5. Durumu başarılı olarak güncelle
            set((state) => {
              const itemIndex = state.uploadQueue.findIndex(
                (item) => item.id === queueItemId,
              );
              if (itemIndex !== -1) {
                state.uploadQueue[itemIndex].status = "success";
                state.uploadQueue[itemIndex].progress = 100;
                state.uploadQueue[itemIndex].imageData = {
                  id: id,
                  url: uploadUrl || url,
                  width: dimensions.width,
                  height: dimensions.height,
                };
              }
            });

            return id;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu";

            // Durumu hata olarak güncelle
            set((state) => {
              const itemIndex = state.uploadQueue.findIndex(
                (item) => item.id === queueItemId,
              );
              if (itemIndex !== -1) {
                state.uploadQueue[itemIndex].status = "error";
                state.uploadQueue[itemIndex].error = errorMessage;
              }
            });

            console.error(`Dosya yükleme hatası (${queueItemId}):`, error);
            throw error;
          }
        },

        // Yükleme işlemini işleyen yardımcı fonksiyon (internal) - Eski tek dosya yöntemi
        processUpload: async () => {
          const { selectedImage } = get();

          if (!selectedImage?.file) {
            set((state) => {
              state.error = "Yüklenecek dosya bulunamadı";
            });
            toast.error("Yüklenecek dosya bulunamadı");
            return;
          }

          try {
            // 1. Presigned URL al
            set((state) => {
              if (state.selectedImage) {
                state.selectedImage.status = "preparing";
                state.selectedImage.error = null;
              }
            });

            const presignData: PresignURLInput = {
              filename: selectedImage.file.name,
              contentType: selectedImage.file.type,
              sizeInBytes: selectedImage.file.size,
            };

            const presignResponse = await api.post<
              ApiResponse<PresignedURLResponse>
            >("/images/presign", presignData);

            if (!presignResponse.data.success || !presignResponse.data.data) {
              throw new Error(
                presignResponse.data.message || "Presigned URL alınamadı",
              );
            }

            const {
              id: signatureId,
              presignedUrl,
              uploadUrl,
            } = presignResponse.data.data;

            // 2. Presigned URL bilgilerini state içinde sakla
            set((state) => {
              if (state.selectedImage) {
                state.selectedImage.signatureId = signatureId;
                state.selectedImage.presignedUrl = presignedUrl;
                state.selectedImage.uploadUrl = uploadUrl;
                state.selectedImage.status = "uploading";
              }
            });

            // 3. Dosyayı Cloudflare R2'ye yükle (PUT isteği)
            const uploadResponse = await axios.put(
              presignedUrl,
              selectedImage.file,
              {
                headers: {
                  "Content-Type": selectedImage.file.type,
                },
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const progress = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    set((state) => {
                      if (state.selectedImage) {
                        state.selectedImage.progress = progress;
                      }
                    });
                  }
                },
              },
            );

            if (uploadResponse.status !== 200) {
              throw new Error("Dosya yüklenemedi");
            }

            // 4. Yükleme tamamlandığında status'u güncelle
            set((state) => {
              if (state.selectedImage) {
                state.selectedImage.status = "confirming";
                state.selectedImage.progress = 100;
                // Upload sonrası state.selectedImage.uploadUrl değerini doğru şekilde kullanabilmek için
                // Bu değer completeUpload'da kullanılacak
                if (
                  !state.selectedImage.uploadUrl &&
                  uploadResponse.config?.url
                ) {
                  state.selectedImage.uploadUrl = selectedImage.uploadUrl;
                }
              }
            });

            // Resim hakkında diğer bilgileri almak için (genişlik, yükseklik vs)
            await get().getImageDimensionsLegacy();

            // 5. Yükleme onayını al
            await get().completeUpload();
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu";

            set((state) => {
              if (state.selectedImage) {
                state.selectedImage.status = "error";
                state.selectedImage.error = errorMessage;
              }
            });

            toast.error("Yükleme hatası: " + errorMessage);
            console.error("Yükleme hatası:", error);
          }
        },

        // Görsel boyutlarını hesaplama (Promise döndürür)
        getImageDimensions: (imageUrl: string) => {
          return new Promise<{ width: number; height: number }>(
            (resolve, reject) => {
              if (!imageUrl) {
                reject(new Error("Geçerli bir resim URL'i bulunamadı"));
                return;
              }

              const img = new Image();
              img.onload = () => {
                resolve({
                  width: img.width,
                  height: img.height,
                });
              };

              img.onerror = () => {
                reject(new Error("Resim boyutları hesaplanamadı"));
              };

              img.src = imageUrl;
            },
          );
        },

        // Resim boyutlarını hesaplamak için yardımcı fonksiyon (internal) - Eski yöntem
        getImageDimensionsLegacy: () => {
          return new Promise<void>((resolve, reject) => {
            const { selectedImage } = get();

            if (!selectedImage?.file || !selectedImage.previewUrl) {
              reject(new Error("Dosya bilgileri bulunamadı"));
              return;
            }

            const img = new Image();
            img.onload = () => {
              set((state) => {
                if (state.selectedImage) {
                  state.selectedImage.imageData = {
                    ...(state.selectedImage.imageData || {}),
                    width: img.width,
                    height: img.height,
                  };
                }
              });
              resolve();
            };

            img.onerror = () => {
              reject(new Error("Resim boyutları hesaplanamadı"));
            };

            img.src = selectedImage.previewUrl;
          });
        },

        // Yüklemeyi tamamla (confirm) endpoint'ini çağır - Eski yöntem
        completeUpload: async () => {
          const { selectedImage } = get();

          if (
            !selectedImage ||
            !selectedImage.signatureId ||
            selectedImage.status !== "confirming"
          ) {
            set((state) => {
              state.error = "Tamamlanacak yükleme bulunamadı";
            });
            toast.error("Tamamlanacak yükleme bulunamadı");
            return null;
          }

          try {
            const confirmData: ConfirmUploadInput = {
              signatureId: selectedImage.signatureId,
              url: selectedImage.uploadUrl || "",
              width: selectedImage.imageData?.width || 0,
              height: selectedImage.imageData?.height || 0,
              sizeInBytes: selectedImage.file?.size || 0,
              altText: "",
            };

            const confirmResponse = await api.post<
              ApiResponse<ConfirmUploadResponse>
            >("/images/confirm", confirmData);

            if (!confirmResponse.data.success || !confirmResponse.data.data) {
              throw new Error(
                confirmResponse.data.message || "Yükleme onaylanamadı",
              );
            }

            const { id, url } = confirmResponse.data.data;

            // Yeni resmi images array'ine ekle
            const newImage: ImageType = {
              id,
              // url: url,  // Bu backend'den gelen url - presignedUrl değil uploadUrl
              url: selectedImage.uploadUrl || url, // Öncelikle uploadUrl'yi kullanmaya çalış
              userId: "", // Bu bilgi backend'den gelecek
              filename: selectedImage.file?.name || "",
              fileType: selectedImage.file?.type || "",
              sizeInBytes: selectedImage.file?.size || 0,
              width: selectedImage.imageData?.width,
              height: selectedImage.imageData?.height,
              status: "active",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // State'i güncelle
            set((state) => {
              state.images = [...state.images, newImage];
              if (state.selectedImage) {
                state.selectedImage.status = "success";
                if (state.selectedImage.imageData) {
                  state.selectedImage.imageData.id = id;
                  state.selectedImage.imageData.url =
                    state.selectedImage.uploadUrl || url;
                }
              }
            });

            toast.success("Resim başarıyla yüklendi");
            return newImage;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu";

            set((state) => {
              if (state.selectedImage) {
                state.selectedImage.status = "error";
                state.selectedImage.error = errorMessage;
              }
            });

            toast.error("Yükleme onaylama hatası: " + errorMessage);
            console.error("Yükleme onaylama hatası:", error);
            return null;
          }
        },

        // Kuyruktaki bir dosyayı kaldır
        removeFromQueue: (queueItemId: string) => {
          set((state) => {
            // Önizleme URL'ini temizle
            const item = state.uploadQueue.find(
              (item) => item.id === queueItemId,
            );
            if (item?.previewUrl) {
              URL.revokeObjectURL(item.previewUrl);
            }

            // Kuyruktan kaldır
            state.uploadQueue = state.uploadQueue.filter(
              (item) => item.id !== queueItemId,
            );
          });
        },

        // Tüm kuyruğu temizle
        clearQueue: () => {
          set((state) => {
            // Tüm önizleme URL'lerini temizle
            state.uploadQueue.forEach((item) => {
              if (item.previewUrl) {
                URL.revokeObjectURL(item.previewUrl);
              }
            });

            // Kuyruğu temizle
            state.uploadQueue = [];
          });

          toast.info("Yükleme kuyruğu temizlendi");
        },

        // Yüklemeyi iptal etmek için - Eski yöntem
        cancelUpload: () => {
          const { selectedImage } = get();

          // Önizleme URL'sini temizle
          if (selectedImage?.previewUrl) {
            URL.revokeObjectURL(selectedImage.previewUrl);
          }

          set((state) => {
            state.selectedImage = null;
          });

          toast.info("Yükleme iptal edildi");
        },

        // Bir resmi seçmek için
        selectImage: (imageId: string | null) => {
          if (!imageId) {
            set((state) => {
              state.selectedImage = null;
            });
            return;
          }

          const { images } = get();
          const selectedImageData = images.find((img) => img.id === imageId);

          if (!selectedImageData) {
            set((state) => {
              state.error = "Seçilen resim bulunamadı";
            });
            toast.error("Seçilen resim bulunamadı");
            return;
          }

          set((state) => {
            state.selectedImage = {
              file: null,
              previewUrl: selectedImageData.url,
              status: "success",
              progress: 100,
              error: null,
              imageData: {
                id: selectedImageData.id,
                url: selectedImageData.url,
                width: selectedImageData.width,
                height: selectedImageData.height,
              },
            };
          });
        },

        // Resmi silmek için
        deleteImage: async (imageId: string) => {
          try {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            const response = await api.delete<ApiResponse<void>>(
              `/images/${imageId}`,
            );

            if (response.data.success) {
              // State'den resmi kaldır
              set((state) => {
                state.images = state.images.filter((img) => img.id !== imageId);
                // Eğer silinmiş resim seçiliyse, seçim iptal edilir
                if (state.selectedImage?.imageData?.id === imageId) {
                  state.selectedImage = null;
                }
                state.isLoading = false;
              });

              toast.success("Resim başarıyla silindi");
              return true;
            } else {
              throw new Error(response.data.message || "Resim silinemedi");
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Bilinmeyen bir hata oluştu";

            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });

            toast.error("Resim silme hatası: " + errorMessage);
            console.error("Resim silme hatası:", error);
            return false;
          }
        },

        // Hata durumunu sıfırlamak için
        resetError: () => {
          set((state) => {
            state.error = null;
          });
        },
      })),
    ),
  );

  return (
    <ImageContext.Provider value={store}>{children}</ImageContext.Provider>
  );
}

// Context
const ImageContext = createContext<StoreApi<DataState> | undefined>(undefined);

// Hook
export function useImage() {
  const context = useContext(ImageContext);

  if (!context) {
    throw new Error("useImage hook must be used within a ImageProvider");
  }

  return useStore(context, (state) => state);
}
