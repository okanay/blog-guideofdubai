interface DataState {
  // State
  images: ImageType[];
  selectedImage: SelectedImage | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchImages: () => Promise<void>;
  startUpload: (file: File) => void;
  processUpload: () => Promise<void>;
  getImageDimensions: () => Promise<void>;
  completeUpload: () => Promise<ImageType | null>;
  cancelUpload: () => void;
  selectImage: (imageId: string | null) => void;
  deleteImage: (imageId: string) => Promise<boolean>;
  resetError: () => void;
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
