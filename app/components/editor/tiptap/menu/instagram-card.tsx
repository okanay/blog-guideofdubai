import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";
import { ImagePreview } from "@/components/editor/ui/image-preview";
import ImageModal from "@/components/image";

const InstagramCardButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Instagram Card değerleri
  const [cardValues, setCardValues] = useState({
    imageUrl: "",
    username: "",
    userProfileImage: "",
    postUrl: "",
    caption: "",
    likesCount: 0,
    location: "",
    timestamp: "",
  });

  // Modal açılınca eğer zaten bir Instagram Card içindeysek, mevcut bilgileri al
  const handleOpenModal = () => {
    if (editor.isActive("instagramCard")) {
      const attrs = editor.getAttributes("instagramCard");
      setCardValues({
        imageUrl: attrs.imageUrl || "",
        username: attrs.username || "",
        userProfileImage: attrs.userProfileImage || "",
        postUrl: attrs.postUrl || "",
        caption: attrs.caption || "",
        likesCount: attrs.likesCount || 0,
        location: attrs.location || "",
        timestamp: attrs.timestamp || "",
      });
    } else {
      // Varsayılan değerleri ayarla
      setCardValues({
        imageUrl: "",
        username: "Guide Of Dubai",
        userProfileImage:
          "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
        postUrl: "",
        caption: "Dubai'nin muhteşem manzarası",
        likesCount: 0,
        location: "",
        timestamp: "5 May 2025",
      });
    }

    setIsModalOpen(true);
  };

  // Görsel seçildiğinde
  const handleImageSelect = (image: any) => {
    if (image) {
      setCardValues((prev) => ({
        ...prev,
        imageUrl: image.url,
      }));

      // Galeri modalını kapat ve Instagram kart modalını geri aç
      setIsGalleryModalOpen(false);
      setTimeout(() => {
        setIsModalOpen(true);
      }, 100);
    }
  };

  // Input değişikliklerini yönet
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Sayı alanları için sayısal değere çevir
    if (type === "number") {
      setCardValues((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setCardValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Instagram Kartı ekle
  const handleInsertCard = () => {
    // Temel doğrulamalar
    if (!cardValues.imageUrl.trim()) {
      setValidationError("Görsel URL'i gereklidir");
      return;
    }

    if (!cardValues.username.trim()) {
      setValidationError("Kullanıcı adı gereklidir");
      return;
    }

    // Editöre Instagram Card ekle
    editor
      .chain()
      .focus()
      .insertContent({
        type: "instagramCard",
        attrs: {
          ...cardValues,
        },
      })
      .run();

    // Modalı kapat
    setIsModalOpen(false);
    setValidationError("");
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("instagramCard"));
    };

    editor.on("selectionUpdate", updateIsActive);
    editor.on("transaction", updateIsActive);
    return () => {
      editor.off("selectionUpdate", updateIsActive);
      editor.off("transaction", updateIsActive);
    };
  }, [editor]);

  return (
    <>
      <MenuButton
        onClick={handleOpenModal}
        isActive={isActive}
        label="Instagram Kartı"
      >
        <Instagram size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Instagram Kartı Ekle"
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Ana Görsel */}
          <div>
            <ImagePreview
              label="Gönderi Görseli"
              value={cardValues.imageUrl}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "imageUrl",
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              placeholder="https://example.com/image.jpg"
              errorMessage={validationError}
              isRequired
              autoFocus
            />
          </div>

          {/* Kullanıcı Bilgileri */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Kullanıcı Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={cardValues.username}
                onChange={handleInputChange}
                placeholder="kullanici_adi"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="userProfileImage"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Profil Görseli URL
              </label>
              <input
                type="text"
                id="userProfileImage"
                name="userProfileImage"
                value={cardValues.userProfileImage}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Boş bırakırsanız varsayılan görsel kullanılır
              </p>
            </div>
          </div>

          {/* Açıklama Metni */}
          <div>
            <label
              htmlFor="caption"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Açıklama
            </label>
            <textarea
              id="caption"
              name="caption"
              value={cardValues.caption}
              onChange={handleInputChange}
              placeholder="Gönderi açıklaması..."
              rows={2}
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
            />
          </div>

          {/* Zamanlama ve Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="timestamp"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Zaman
              </label>
              <input
                type="text"
                id="timestamp"
                name="timestamp"
                value={cardValues.timestamp}
                onChange={handleInputChange}
                placeholder="1 saat önce"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="postUrl"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Gönderi Linki
              </label>
              <input
                type="text"
                id="postUrl"
                name="postUrl"
                value={cardValues.postUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/p/..."
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Alt butonlar */}
          <div className="flex justify-end border-t border-zinc-100 pt-3">
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertCard}
                className="border-primary-500 bg-primary-500 hover:bg-primary-600 focus:ring-primary-400 rounded-md border px-4 py-1.5 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
                disabled={!cardValues.imageUrl || !cardValues.username}
              >
                {isActive ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>

      {/* Resim Galerisi Modalı */}
      <ImageModal
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          // Galeri kapandığında tekrar tiptap modalını aç
          setTimeout(() => {
            setIsModalOpen(true);
          }, 100);
        }}
        onSelect={handleImageSelect}
        singleSelect={true}
      />
    </>
  );
};

export { InstagramCardButton };
