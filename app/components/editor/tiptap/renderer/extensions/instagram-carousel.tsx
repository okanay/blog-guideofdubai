import React, { useRef, useEffect } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface InstagramCardAttributes {
  imageUrl: string;
  username: string;
  userProfileImage?: string;
  postUrl?: string;
  caption?: string;
  timestamp?: string;
}

// Carousel için tipleri tanımlayalım
export interface InstagramCarouselAttributes {
  cards: InstagramCardAttributes[];
}

// Extension Node
export const InstagramCarousel = Node.create({
  name: "instagramCarousel",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      cards: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-instagram-carousel]",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return {};

          try {
            const cardsJson = node.getAttribute("data-cards");
            return {
              cards: cardsJson ? JSON.parse(cardsJson) : [],
            };
          } catch (err) {
            console.error("Error parsing Instagram carousel data:", err);
            return { cards: [] };
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-instagram-carousel": "" },
        {
          "data-cards": JSON.stringify(HTMLAttributes.cards || []),
        },
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InstagramCarouselView);
  },
});

// Editör için Node View Komponenti
const InstagramCarouselView: React.FC<NodeViewProps> = ({ node }) => {
  const attrs = node.attrs as InstagramCarouselAttributes;

  return (
    <NodeViewWrapper>
      <InstagramCarouselUI cards={attrs.cards} />
    </NodeViewWrapper>
  );
};

export const InstagramCarouselUI: React.FC<InstagramCarouselAttributes> = ({
  cards,
}) => {
  const btnLeftRef = useRef<HTMLButtonElement>(null);
  const btnRightRef = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Scroll işlevleri
  const handleButtonClick = (direction: "Left" | "Right") => {
    if (!container.current || cardRefs.current.length === 0) return;
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardMargin = 12; // gap-3 (0.75rem = 12px)
    const scrollAmount = cardWidth + cardMargin;
    const scrollOffset = direction === "Left" ? -scrollAmount : scrollAmount;
    const currentScroll = container.current.scrollLeft;
    const maxScroll =
      container.current.scrollWidth - container.current.clientWidth;
    const targetScroll = currentScroll + scrollOffset;
    const boundedScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    container.current.scrollTo({
      left: boundedScroll,
      behavior: "smooth",
    });
    updateButtonState();
  };

  const updateButtonState = () => {
    if (!container.current || !btnLeftRef.current || !btnRightRef.current)
      return;
    const { scrollLeft, scrollWidth, clientWidth } = container.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
    btnLeftRef.current.ariaDisabled = isAtStart.toString();
    btnRightRef.current.ariaDisabled = isAtEnd.toString();
  };

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;
    const handleScroll = () => updateButtonState();
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updateButtonState(), 100);
    };
    currentContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    updateButtonState();
    return () => {
      currentContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  if (!cards || cards.length === 0) return null;

  return (
    <div className="instagram-carousel relative my-0 overflow-hidden">
      {/* Kaydırma butonları */}
      <button
        ref={btnLeftRef}
        aria-disabled="true"
        aria-label="Sola Kaydır"
        onClick={() => handleButtonClick("Left")}
        className="border-primary-cover bg-primary hover:bg-primary-light absolute top-1/2 left-1 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition-opacity duration-200 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0 sm:left-2 sm:size-10"
      >
        <ChevronLeft className="text-color-font-invert size-5 sm:size-6" />
      </button>
      <button
        ref={btnRightRef}
        aria-disabled="false"
        aria-label="Sağa Kaydır"
        onClick={() => handleButtonClick("Right")}
        className="border-primary-cover bg-primary hover:bg-primary-light absolute top-1/2 right-1 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition-opacity duration-200 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0 sm:right-2 sm:size-10"
      >
        <ChevronRight className="text-color-font-invert size-5 sm:size-6" />
      </button>
      {/* Kartlar konteyneri */}
      <ul
        ref={container}
        style={{ scrollbarWidth: "none" }}
        className="!ml-0 flex snap-x snap-mandatory flex-nowrap items-start gap-3 overflow-x-auto !px-0 pb-3"
      >
        {cards.map((card, index) => (
          <li
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={twMerge(
              "instagram-card relative mt-0 ml-0 w-full max-w-xs shrink-0 snap-center list-none rounded border border-zinc-200 bg-white pl-0 transition sm:max-w-sm",
              cards.length === 1 && "max-w-lg",
            )}
          >
            <InstagramCardUI {...card} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const InstagramCardUI: React.FC<InstagramCardAttributes> = ({
  imageUrl,
  username,
  userProfileImage,
  postUrl,
  caption,
  timestamp,
}) => {
  const fixedUsername = username || "Guide Of Dubai";

  const fixedProfileImage =
    userProfileImage ||
    "https://assets.guideofdubai.com/uploads/guideofdubai-instagram.jpg-ylIblY.jpg";

  const formattedTimestamp = timestamp
    ? timestamp
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <>
      {/* Kart Başlık */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-2">
          <div className="relative size-9 overflow-hidden rounded-full ring-1 ring-pink-100 sm:size-10">
            <img
              src={fixedProfileImage}
              alt={`${username} profil fotoğrafı`}
              className="overlay-ignore !absolute !inset-0 !mt-0 !h-full !w-full !object-cover"
            />
          </div>
          <span className="max-w-[90px] truncate text-sm font-semibold sm:max-w-[120px]">
            {fixedUsername}
          </span>
        </div>
        <button className="p-1 text-zinc-500 hover:text-zinc-900">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Görsel */}
      <div className="aspect-square w-full overflow-hidden bg-zinc-100">
        <img
          src={imageUrl}
          alt={caption || `${username} tarafından paylaşılan gönderi`}
          className="mt-0 ml-0 h-full w-full rounded-none object-cover"
          loading="lazy"
        />
      </div>

      {/* Açıklama */}
      <div className="h-28 px-3 py-2 sm:px-3 sm:py-2.5">
        <p className="mt-0 ml-0 line-clamp-3 pl-0 text-sm break-words">
          {caption ? (
            <>
              <span className="font-semibold">{username}</span> {caption}
            </>
          ) : null}
        </p>
      </div>

      {/* Zaman */}
      <div className="px-3 py-2 sm:px-3">
        <p className="text-xs text-zinc-400 uppercase">{formattedTimestamp}</p>
      </div>

      {/* Link varsa tıklanabilir kart yapısı */}
      {postUrl && (
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          tabIndex={-1}
        />
      )}
    </>
  );
};

// Renderer komponenti - JSON'dan direkt render etmek için kullanılır
export const InstagramCarouselRenderer = ({ node }: { node: any }) => {
  return <InstagramCarouselUI {...node.attrs} />;
};
