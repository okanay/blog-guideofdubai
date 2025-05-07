import { useState, useEffect } from "react";
import { Instagram, Plus, Check, X } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";
import { ImagePreview } from "@/components/editor/ui/image-preview";
import { twMerge } from "tailwind-merge";
import { InstagramCardAttributes } from "../renderer/extensions/instagram-carousel";

const InstagramCarouselButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Instagram Cards
  const [cards, setCards] = useState<InstagramCardAttributes[]>([
    {
      imageUrl: "",
      username: "Guide Of Dubai",
      userProfileImage:
        "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
      postUrl: "",
      caption: "",
      timestamp: "",
    },
  ]);
  const [cardValues, setCardValues] = useState<InstagramCardAttributes>(
    cards[0],
  );

  // Modal açılınca mevcut bilgileri al
  const handleOpenModal = () => {
    if (editor.isActive("instagramCarousel")) {
      const attrs = editor.getAttributes("instagramCarousel");
      if (attrs.cards && Array.isArray(attrs.cards) && attrs.cards.length > 0) {
        setCards(attrs.cards);
        setCardValues(attrs.cards[0]);
        setActiveCardIndex(0);
      } else {
        setDefaultValues();
      }
    } else {
      setDefaultValues();
    }
    setIsModalOpen(true);
  };

  const setDefaultValues = () => {
    const defaultCards = [
      {
        imageUrl: "",
        username: "Guide Of Dubai",
        userProfileImage:
          "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
        postUrl: "",
        caption: "",
        likesCount: 0,
        location: "",
        timestamp: "",
      },
    ];
    setCards(defaultCards);
    setCardValues(defaultCards[0]);
    setActiveCardIndex(0);
  };

  // Kart seçimi
  const handleCardSelect = (index: number) => {
    setActiveCardIndex(index);
    setCardValues(cards[index]);
  };

  // Input değişiklikleri
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let newValue: string | number = value;
    if (type === "number") {
      newValue = parseInt(value) || 0;
    }
    setCardValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
      userProfileImage:
        "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg",
      postUrl: "",
      caption: "",
      timestamp: "",
    };
    setCards([...cards, newCard]);
    setActiveCardIndex(cards.length);
    setCardValues(newCard);
  };

  // Kart sil
  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) return;
    const updatedCards = cards.filter((_, i) => i !== index);
    const newIndex =
      activeCardIndex === index
        ? Math.max(0, activeCardIndex - 1)
        : activeCardIndex > index
          ? activeCardIndex - 1
          : activeCardIndex;
    setCards(updatedCards);
    setActiveCardIndex(newIndex);
    setCardValues(updatedCards[newIndex]);
  };

  // Carousel ekle/güncelle
  const handleInsertCarousel = () => {
    if (cards.some((card) => !card.imageUrl || !card.username)) {
      setValidationError("Her kartta görsel ve kullanıcı adı zorunludur.");
      return;
    }
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

  // Carousel okları
  const handlePrev = () => {
    if (activeCardIndex > 0) {
      handleCardSelect(activeCardIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeCardIndex < cards.length - 1) {
      handleCardSelect(activeCardIndex + 1);
    }
  };

  return (
    <>
      <MenuButton
        onClick={handleOpenModal}
        isActive={isActive}
        label="Instagram Carousel"
      >
        <Instagram size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          (
            <span className="flex items-center gap-2 text-lg font-bold">
              <Instagram className="text-primary" size={22} />
              Instagram Carousel
            </span>
          ) as any
        }
        maxWidth="max-w-2xl"
      >
        {/* Thumbnail bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3">
          {/* Thumbnail'lar */}
          {cards.map((card, index) => (
            <div className="group relative" key={index}>
              <button
                onClick={() => handleCardSelect(index)}
                className={twMerge(
                  `relative flex h-14 w-14 items-center justify-center overflow-hidden rounded border-2 transition-all duration-150`,
                  activeCardIndex === index
                    ? "border-primary"
                    : "border-transparent",
                )}
                aria-label={`Kart ${index + 1}`}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={`Kart ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Instagram size={22} />
                  </div>
                )}
              </button>
              {/* Thumbnail üzerinde silme ikonu */}
              {cards.length > 1 && (
                <button
                  onClick={() => handleDeleteCard(index)}
                  className="absolute -top-2 -right-2 z-10 hidden items-center justify-center rounded-full border border-zinc-200 bg-white p-1 transition group-hover:flex hover:bg-red-500 hover:text-white"
                  title="Kartı Sil"
                >
                  <X size={14} />
                </button>
              )}
              {/* Kart numarası */}
              <span
                className={`absolute bottom-1 left-1 rounded px-1.5 text-[10px] font-bold ${
                  activeCardIndex === index
                    ? "bg-primary text-color-font-invert"
                    : "text-color-font bg-white/80"
                }`}
              >
                {index + 1}
              </span>
            </div>
          ))}
          {/* Ekle butonu */}
          <button
            onClick={handleAddCard}
            className={`bg-color-font-dark ml-2 flex h-14 w-14 items-center justify-center rounded text-white transition hover:scale-105`}
            title="Yeni Kart Ekle"
          >
            <Plus className="text-color-font-invert size-8" />
          </button>
        </div>

        {/* Kart Düzenleme Alanı */}
        <div className="mx-auto mt-2 w-full rounded border border-zinc-200 bg-zinc-50 p-6">
          <h3 className="mb-4 text-base font-semibold text-zinc-800">
            Kart {activeCardIndex + 1} Detayları
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
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-xs font-medium text-zinc-700"
              >
                Kullanıcı Adı <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={cardValues.username}
                onChange={handleInputChange}
                placeholder="kullanici_adi"
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm transition outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="userProfileImage"
                className="mb-1 block text-xs font-medium text-zinc-700"
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
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm transition outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
              />
              <p className="mt-1 text-[10px] text-zinc-500">
                Boş bırakırsanız varsayılan görsel kullanılır
              </p>
            </div>
          </div>
          {/* Açıklama Metni */}
          <div className="mb-4">
            <label
              htmlFor="caption"
              className="mb-1 block text-xs font-medium text-zinc-700"
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
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm transition outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
            />
          </div>
          {/* Zamanlama ve Link */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="timestamp"
                className="mb-1 block text-xs font-medium text-zinc-700"
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
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm transition outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
              />
            </div>
            <div>
              <label
                htmlFor="postUrl"
                className="mb-1 block text-xs font-medium text-zinc-700"
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
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm transition outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
              />
            </div>
          </div>
          {/* Validation */}
          {validationError && (
            <p className="mt-3 text-xs font-semibold text-pink-600">
              {validationError}
            </p>
          )}
        </div>

        {/* Sticky aksiyon bar */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleInsertCarousel}
            className={`flex items-center gap-2 rounded px-5 py-2 font-semibold transition ${
              cards.some((card) => !card.imageUrl || !card.username)
                ? "cursor-not-allowed bg-zinc-200 text-zinc-400"
                : "from-primary-700 via-primary-600 to-primary-500 bg-gradient-to-tr text-white hover:scale-105"
            }`}
            disabled={cards.some((card) => !card.imageUrl || !card.username)}
            title={isActive ? "Güncelle" : "Ekle"}
          >
            <Check size={18} />
            {isActive ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </RichButtonModal>
    </>
  );
};

export { InstagramCarouselButton };
