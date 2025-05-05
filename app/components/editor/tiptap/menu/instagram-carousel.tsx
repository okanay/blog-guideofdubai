import { useState, useEffect } from "react";
import { Instagram, Plus, Trash2, ChevronRight } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";
import { ImagePreview } from "@/components/editor/ui/image-preview";
import ImageModal from "@/components/image";
import { InstagramCardAttributes } from "../renderer/extensions/instagram-card";

const InstagramCarouselButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Instagram Cards değerleri
  const [cards, setCards] = useState<InstagramCardAttributes[]>([
    // Varsayılan olarak bir boş kart
    {
      imageUrl: "",
      username: "Guide Of Dubai",
      userProfileImage:
        "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
      postUrl: "",
      caption: "Dubai'nin muhteşem manzarası",
      likesCount: 0,
      location: "",
      timestamp: "5 May 2025",
    },
  ]);

  // Aktif kartı düzenle
  const [cardValues, setCardValues] = useState<InstagramCardAttributes>(
    cards[0],
  );

  // Modal açılınca eğer zaten bir Instagram Carousel içindeysek, mevcut bilgileri al
  const handleOpenModal = () => {
    if (editor.isActive("instagramCarousel")) {
      const attrs = editor.getAttributes("instagramCarousel");

      if (attrs.cards && Array.isArray(attrs.cards) && attrs.cards.length > 0) {
        setCards(attrs.cards);
        setCardValues(attrs.cards[0]);
        setActiveCardIndex(0);
      } else {
        // Varsayılan değerleri ayarla
        setDefaultValues();
      }
    } else {
      // Varsayılan değerleri ayarla
      setDefaultValues();
    }

    setIsModalOpen(true);
  };

  // Varsayılan değerleri ayarla
  const setDefaultValues = () => {
    const defaultCards = [
      {
        imageUrl: "",
        username: "Guide Of Dubai",
        userProfileImage:
          "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
        postUrl: "",
        caption: "Dubai'nin muhteşem manzarası",
        likesCount: 0,
        location: "",
        timestamp: "5 May 2025",
      },
    ];

    setCards(defaultCards);
    setCardValues(defaultCards[0]);
    setActiveCardIndex(0);
  };

  // Kullanıcı bir kart seçtiğinde
  const handleCardSelect = (index: number) => {
    setActiveCardIndex(index);
    setCardValues(cards[index]);
  };

  // Görsel kütüphanesini aç
  const handleOpenGalleryModal = () => {
    setIsGalleryModalOpen(true);
  };

  // Görsel seçildiğinde
  const handleImageSelect = (image: any) => {
    if (image) {
      setCardValues((prev) => ({
        ...prev,
        imageUrl: image.url,
      }));

      // Kart dizisini güncelle
      const updatedCards = [...cards];
      updatedCards[activeCardIndex] = {
        ...updatedCards[activeCardIndex],
        imageUrl: image.url,
      };
      setCards(updatedCards);

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
    let newValue: string | number = value;
    if (type === "number") {
      newValue = parseInt(value) || 0;
    }

    // Aktif kartı güncelle
    setCardValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Kart dizisini güncelle
    const updatedCards = [...cards];
    updatedCards[activeCardIndex] = {
      ...updatedCards[activeCardIndex],
      [name]: newValue,
    };
    setCards(updatedCards);
  };

  // Yeni kart ekle
  const handleAddCard = () => {
    const newCard: InstagramCardAttributes = {
      imageUrl: "",
      username: "Guide Of Dubai",
      userProfileImage: "",
      postUrl: "",
      caption: "",
      likesCount: 0,
      location: "",
      timestamp: "5 May 2025",
    };

    setCards([...cards, newCard]);
    setActiveCardIndex(cards.length);
    setCardValues(newCard);
  };

  // Kart sil
  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      // En az bir kart olmalı
      return;
    }

    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);

    // Silinen kart aktifse, ilk kartı seç
    if (activeCardIndex === index) {
      setActiveCardIndex(0);
      setCardValues(updatedCards[0]);
    }
    // Silinen kart aktif karttan önceyse, aktif kart indeksini güncelle
    else if (activeCardIndex > index) {
      setActiveCardIndex(activeCardIndex - 1);
    }
  };

  // Instagram Kartlarını ekle
  const handleInsertCarousel = () => {
    // Temel doğrulamalar
    if (cards.some((card) => !card.imageUrl || !card.username)) {
      setValidationError(
        "Tüm kartlarda görsel URL'i ve kullanıcı adı gereklidir",
      );
      return;
    }

    // Editöre Instagram Carousel ekle
    editor
      .chain()
      .focus()
      .insertContent({
        type: "instagramCarousel",
        attrs: {
          cards,
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
      setIsActive(editor.isActive("instagramCarousel"));
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
        label="Instagram Galerisi"
      >
        <Instagram size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Instagram Galerisi Ekle"
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Kart Seçimi */}
          <div className="border-b border-zinc-200 pb-3">
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Instagram Kartları
            </h3>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardSelect(index)}
                  className={`relative flex min-w-[120px] flex-col items-center rounded border p-2 transition ${
                    activeCardIndex === index
                      ? "border-primary-500 bg-primary-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <div className="relative mb-1 h-16 w-16 overflow-hidden rounded">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={`Kart ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-400">
                        <Instagram size={24} />
                      </div>
                    )}
                  </div>
                  <span className="max-w-full truncate text-xs font-medium">
                    {card.username || `Kart ${index + 1}`}
                  </span>

                  {/* Silme butonu */}
                  {cards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(index);
                      }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                      aria-label={`Kart ${index + 1}'i sil`}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </button>
              ))}

              {/* Yeni kart ekleme butonu */}
              <button
                onClick={handleAddCard}
                className="flex min-w-[120px] flex-col items-center rounded border border-dashed border-zinc-300 p-2 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-600"
              >
                <div className="mb-1 flex h-16 w-16 items-center justify-center rounded border border-zinc-200 bg-zinc-100">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-medium">Yeni Kart Ekle</span>
              </button>
            </div>
          </div>

          {/* Aktif Kart Düzenleme */}
          <div className="border-t border-zinc-100 pt-3">
            <h3 className="mb-3 text-sm font-medium text-zinc-700">
              Kart {activeCardIndex + 1} Düzenleme
            </h3>

            {/* Ana Görsel */}
            <div className="mb-4">
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
            <div className="mb-4 grid grid-cols-2 gap-4">
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
            <div className="mb-4">
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
                  placeholder="5 May 2025"
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
          </div>

          {/* Alt butonlar */}
          <div className="flex justify-between border-t border-zinc-100 pt-3">
            <div className="flex items-center">
              {validationError && (
                <p className="text-sm text-red-500">{validationError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertCarousel}
                className="border-primary-500 bg-primary-500 hover:bg-primary-600 focus:ring-primary-400 rounded-md border px-4 py-1.5 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
                disabled={cards.some(
                  (card) => !card.imageUrl || !card.username,
                )}
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

export { InstagramCarouselButton };
