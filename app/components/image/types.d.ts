interface DataState {
  // State
  images: ImageType[];
  selectedImage: SelectedImage | null;
  uploadQueue: QueueItem[]; // Yükleme sırası için
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchImages: () => Promise<void>;

  // Tekli ve çoklu yükleme işlemleri
  startUpload: (file: File) => void;
  addToUploadQueue: (files: File[]) => void;
  processUploadQueue: () => Promise<void>;
  uploadSingleFile: (queueItemId: string) => Promise<string | undefined>;
  removeFromQueue: (queueItemId: string) => void;
  clearQueue: () => void;

  // Yeni fonksiyonlar
  updateQueueItemAltText: (queueItemId: string, altText: string) => void;
  cancelQueueItemUpload: (queueItemId: string) => void;

  // Yardımcı işlemler
  processUpload: () => Promise<void>;
  getImageDimensions: (
    imageUrl: string,
  ) => Promise<{ width: number; height: number }>;
  getImageDimensionsLegacy: () => Promise<void>;
  completeUpload: () => Promise<ImageType | null>;
  cancelUpload: () => void;
  selectImage: (imageId: string | null) => void;
  deleteImage: (imageId: string) => Promise<boolean>;
  resetError: () => void;

  // Seçili görselin durumunu kontrol eden yeni yardımcı fonksiyon
  checkSelectedImageStatus: () => boolean;
}

// Yükleme kuyruğundaki bir öğe
interface QueueItem extends Omit<SelectedImage, "file"> {
  id: string; // Kuyruk öğesini tanımlayan benzersiz ID
  file: File;
  altText?: string; // Alt metin ekledik
}

interface ImageType {
  id: string;
  userId: string;
  url: string;
  filename: string;
  altText?: string;
  fileType: string;
  sizeInBytes: number;
  width?: number;
  height?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PresignURLInput {
  filename: string;
  contentType: string;
  sizeInBytes: number;
}

interface PresignedURLResponse {
  id: string;
  presignedUrl: string;
  uploadUrl: string;
  expiresAt: string;
  filename: string;
}

interface ConfirmUploadInput {
  signatureId: string;
  url: string;
  width: number;
  height: number;
  sizeInBytes: number;
  altText?: string;
}

interface ConfirmUploadResponse {
  id: string;
  url: string;
}

interface SelectedImage {
  file: File | null;
  previewUrl: string | null;
  status:
    | "idle"
    | "preparing"
    | "uploading"
    | "confirming"
    | "success"
    | "error";
  progress: number;
  error: string | null;
  signatureId?: string;
  uploadUrl?: string;
  presignedUrl?: string;
  imageData?: {
    id?: string;
    url?: string;
    width?: number;
    height?: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
