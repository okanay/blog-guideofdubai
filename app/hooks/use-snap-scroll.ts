// app/hooks/use-snap-scroll.ts
import { useRef, useEffect, RefObject } from "react";

interface UseSnapScrollOptions {
  /**
   * Kartlar arasındaki boşluk (pixel). Varsayılan değer: 12 (tailwind'in gap-3 değeri)
   */
  gap?: number;
  /**
   * Scroll esnasında davranış türü. Varsayılan değer: 'smooth'
   */
  behavior?: ScrollBehavior;
  /**
   * Yeniden boyutlandırma olayı için gecikme süresi (ms). Varsayılan değer: 100
   */
  resizeDebounce?: number;
  /**
   * Kullanıcı bileşeni mount edildiğinde otomatik olarak butonların durumunu günceller
   */
  updateOnMount?: boolean;
  /**
   * Özel bağımlılıklar. Bu değerlerden herhangi biri değiştiğinde scroll durumu güncellenir
   */
  dependencies?: any[];
}

interface UseSnapScrollReturn {
  containerRef: RefObject<HTMLElement>;
  cardRefs: {
    current: (HTMLElement | null)[];
  };
  btnLeftRef: RefObject<HTMLButtonElement>;
  btnRightRef: RefObject<HTMLButtonElement>;
  handleScrollLeft: () => void;
  handleScrollRight: () => void;
  updateButtonState: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}

/**
 * Snap scroll özelliği için özelleştirilmiş hook.
 * Kart bazlı yatay kaydırma işlevselliği sağlar.
 */
export function useSnapScroll({
  gap = 12,
  behavior = "smooth",
  resizeDebounce = 100,
  updateOnMount = true,
  dependencies = [],
}: UseSnapScrollOptions = {}): UseSnapScrollReturn {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const btnLeftRef = useRef<HTMLButtonElement>(null);
  const btnRightRef = useRef<HTMLButtonElement>(null);
  const isAtStartRef = useRef(true);
  const isAtEndRef = useRef(false);

  const updateButtonState = () => {
    if (!containerRef.current || !btnLeftRef.current || !btnRightRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;

    // Butonların ariaDisabled özelliğini güncelle
    btnLeftRef.current.ariaDisabled = isAtStart.toString();
    btnRightRef.current.ariaDisabled = isAtEnd.toString();

    // Referans değerlerini güncelle
    isAtStartRef.current = isAtStart;
    isAtEndRef.current = isAtEnd;
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef.current || cardRefs.current.length === 0) {
      return;
    }

    // İlk kartın genişliğini ve margin değerini al
    const firstCard = cardRefs.current[0];
    if (!firstCard) {
      return;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const scrollAmount = cardWidth + gap;
    const scrollOffset = direction === "left" ? -scrollAmount : scrollAmount;
    const currentScroll = containerRef.current.scrollLeft;

    // Scroll sınırlarını kontrol et
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const targetScroll = currentScroll + scrollOffset;

    // Scroll değerini sınırlar içinde tut
    const boundedScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    containerRef.current.scrollTo({
      left: boundedScroll,
      behavior,
    });

    updateButtonState();
  };

  const handleScrollLeft = () => handleScroll("left");
  const handleScrollRight = () => handleScroll("right");

  // Scroll olaylarını dinle
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScrollEvent = () => {
      updateButtonState();
    };

    // Scroll olay dinleyicisi
    currentContainer.addEventListener("scroll", handleScrollEvent);

    // Yeniden boyutlandırma olay dinleyicisi için debounce fonksiyonu
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateButtonState();
      }, resizeDebounce);
    };

    window.addEventListener("resize", handleResize);

    // İlk render'da buton durumunu güncelle
    if (updateOnMount) {
      updateButtonState();
    }

    return () => {
      currentContainer.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [resizeDebounce, updateOnMount, ...dependencies]);

  return {
    containerRef,
    cardRefs,
    btnLeftRef,
    btnRightRef,
    handleScrollLeft,
    handleScrollRight,
    updateButtonState,
    isAtStart: isAtStartRef.current,
    isAtEnd: isAtEndRef.current,
  };
}
