import React, { useRef, useEffect } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InstagramCardUI, InstagramCardAttributes } from "./instagram-card";

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
      // Boş içerik, tüm render işlemi NodeView tarafından yapılacak
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

// UI Komponenti - hem editör içinde hem de render edilmiş görünümde kullanılır
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

    // İlk kartın genişliğini ve margin değerini al
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardMargin = 16; // gap-4 className'inden gelen değer (1rem = 16px)
    const scrollAmount = cardWidth + cardMargin;

    const scrollOffset = direction === "Left" ? -scrollAmount : scrollAmount;
    const currentScroll = container.current.scrollLeft;

    // Scroll sınırlarını kontrol et
    const maxScroll =
      container.current.scrollWidth - container.current.clientWidth;
    const targetScroll = currentScroll + scrollOffset;

    // Scroll değerini sınırlar içinde tut
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

    const handleScroll = () => {
      updateButtonState();
    };

    // Scroll event listener
    currentContainer.addEventListener("scroll", handleScroll);

    // Resize event listener için debounce fonksiyonu
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateButtonState();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    updateButtonState();

    return () => {
      currentContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Eğer hiç kart yoksa boş div göster
  if (!cards || cards.length === 0) {
    return (
      <div className="my-6 flex justify-center text-zinc-400">
        Instagram kartları bulunamadı
      </div>
    );
  }

  // Tek kart varsa merkezle
  if (cards.length === 1) {
    return (
      <div className="not-prose my-6 flex justify-center">
        <InstagramCardUI {...cards[0]} />
      </div>
    );
  }

  return (
    <div className="not-prose instagram-carousel relative my-6">
      {/* Kaydırma butonları */}
      <button
        ref={btnLeftRef}
        aria-disabled="true"
        aria-label="Sola Kaydır"
        onClick={() => handleButtonClick("Left")}
        className="absolute top-1/2 left-0 z-100 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm transition-opacity duration-200 hover:bg-zinc-50 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-25"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        ref={btnRightRef}
        aria-disabled="false"
        aria-label="Sağa Kaydır"
        onClick={() => handleButtonClick("Right")}
        className="absolute top-1/2 right-0 z-100 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm transition-opacity duration-200 hover:bg-zinc-50 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-25"
      >
        <ChevronRight size={16} />
      </button>

      {/* Kartlar konteyneri */}
      <ul
        ref={container}
        style={{ scrollbarWidth: "none" }}
        className="!ml-0 flex snap-x snap-mandatory flex-nowrap items-start gap-4 overflow-x-auto overscroll-x-contain !px-0 pb-4"
      >
        {cards.map((card, index) => (
          <li
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="shrink-0 snap-center list-none"
          >
            <InstagramCardUI {...card} />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Renderer komponenti - JSON'dan direkt render etmek için kullanılır
export const InstagramCarouselRenderer = ({ node }: { node: any }) => {
  return <InstagramCarouselUI {...node.attrs} />;
};
