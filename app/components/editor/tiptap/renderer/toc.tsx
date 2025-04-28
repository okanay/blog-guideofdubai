import React, { useEffect, useMemo, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";

// Yardımcı: Render edilmiş DOM'dan başlıkları (h1-h6) ve indexlerini bul
function getHeadingsFromDOM(container: HTMLElement | null) {
  if (!container) return [];
  const headingTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const headings: {
    text: string;
    level: number;
    element: HTMLElement;
    index: number;
    offsetTop: number; // DOM'daki y pozisyonu
  }[] = [];
  let globalIndex = 0;

  container.querySelectorAll(headingTags.join(",")).forEach((el) => {
    headings.push({
      text: el.textContent || "",
      level: Number(el.tagName.replace("H", "")),
      element: el as HTMLElement,
      index: globalIndex++,
      offsetTop: (el as HTMLElement).offsetTop,
    });
  });

  // Y pozisyonuna göre başlıkları sırala (yukarıdan aşağıya)
  return headings.sort((a, b) => a.offsetTop - b.offsetTop);
}

// Yardımcı: Hiyerarşik TOC ağacı oluştur
type TOCItem = {
  text: string;
  level: number;
  index: number;
  children: TOCItem[];
};

function buildTOCTree(
  headings: { text: string; level: number; index: number }[],
) {
  const root: TOCItem = { text: "", level: 0, index: -1, children: [] };
  const stack: TOCItem[] = [root];

  for (const heading of headings) {
    const item: TOCItem = { ...heading, children: [] };
    while (stack.length > 1 && heading.level <= stack[stack.length - 1].level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(item);
    stack.push(item);
  }
  return root.children;
}

// TOC renderı (recursive)
function TOCList({
  items,
  activeIndex,
  onClick,
}: {
  items: TOCItem[];
  activeIndex: number | null;
  onClick: (index: number) => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={`${item.text}-${item.index}`}>
          <button
            type="button"
            className={twMerge(
              "group flex w-full items-center rounded px-2 py-1 text-left text-xs leading-6 transition-colors",
              activeIndex === item.index
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-gray-700 hover:bg-gray-50",
            )}
            style={{
              marginLeft: (item.level - 1) * 8,
              paddingLeft: 0,
            }}
            onClick={() => onClick(item.index)}
          >
            {/* Nokta */}
            <span
              className={twMerge(
                "mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors",
                activeIndex === item.index
                  ? "bg-primary-600"
                  : "bg-gray-300 group-hover:bg-gray-400",
              )}
            />
            <span className="truncate">{item.text}</span>
          </button>
          {item.children.length > 0 && (
            <TOCList
              items={item.children}
              activeIndex={activeIndex}
              onClick={onClick}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

interface BlogTOCProps {
  htmlContainerSelector: string; // örn: "#blog-content"
}

export const BlogTOC: React.FC<BlogTOCProps> = ({ htmlContainerSelector }) => {
  const [headings, setHeadings] = useState<
    {
      text: string;
      level: number;
      element: HTMLElement;
      index: number;
      offsetTop: number;
    }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Yeni state: tıklama ile kilitlenecek başlık indeksi.
  const [lockedHeading, setLockedHeading] = useState<number | null>(null);

  const scrollDirectionRef = useRef<"up" | "down">("down");
  const lastScrollTopRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lockTimerRef = useRef<number | null>(null);

  // Render edilmiş DOM'dan başlıkları bul
  useEffect(() => {
    const container = document.querySelector(
      htmlContainerSelector,
    ) as HTMLElement;
    if (!container) return;
    const found = getHeadingsFromDOM(container);
    setHeadings(found);

    // İlk başlığı aktif yap
    if (found.length > 0) {
      setActiveIndex(found[0].index);
    }
  }, [htmlContainerSelector, document.location.pathname]); // pathname değişirse tekrar tara

  // Scroll yönünü algıla
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.scrollY || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTopRef.current) {
        scrollDirectionRef.current = "down";
      } else {
        scrollDirectionRef.current = "up";
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll pozisyonuna göre en uygun başlığı seç (throttled)
  useEffect(() => {
    if (headings.length === 0) return;

    const updateActiveHeading = () => {
      // Eğer kilit aktifse, scroll ile güncelleme yapma;
      // ayrıca eğer scroll pozisyonu tıklanan başlığa yakınsa kilidi serbest bırak.
      if (lockedHeading !== null) {
        const locked = headings.find((h) => h.index === lockedHeading);
        if (locked) {
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          if (
            // Tıklanan başlık biraz üstte de olsa gelse,
            Math.abs(locked.offsetTop - scrollTop) < 30
          ) {
            setLockedHeading(null);
            if (lockTimerRef.current !== null) {
              clearTimeout(lockTimerRef.current);
              lockTimerRef.current = null;
            }
          }
        }
        // Kilit aktifken scroll güncellemesi yapılmasın.
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Tüm başlıklar içinden görünür olanları filtrele
      let visibleHeadings = headings.filter((heading) => {
        const { offsetTop } = heading;
        const elementHeight = heading.element.offsetHeight;

        // Viewport içinde mi?
        return (
          offsetTop < scrollTop + window.innerHeight * 0.8 &&
          offsetTop + elementHeight > scrollTop - window.innerHeight * 0.2
        );
      });

      if (visibleHeadings.length === 0) return;

      let activeHeading;

      if (scrollDirectionRef.current === "down") {
        // Aşağı kaydırırken: Görünür başlıkların en AŞAĞIDA olanını seç
        visibleHeadings.sort((a, b) => b.offsetTop - a.offsetTop);

        // Ekranın üst kısmında tamamen görünür olan ilk başlığı seç
        const fullyVisibleHeadings = visibleHeadings.filter(
          (h) => h.offsetTop > scrollTop - 50,
        );

        activeHeading =
          fullyVisibleHeadings.length > 0
            ? fullyVisibleHeadings[fullyVisibleHeadings.length - 1]
            : visibleHeadings[visibleHeadings.length - 1];
      } else {
        // Yukarı kaydırırken: Görünür başlıkların en ÜSTTE olanını seç
        visibleHeadings.sort((a, b) => a.offsetTop - b.offsetTop);
        activeHeading = visibleHeadings[0];
      }

      if (activeHeading) {
        setActiveIndex(activeHeading.index);
      }
    };

    // Throttled scroll işleyici
    const handleScroll = () => {
      if (timerRef.current !== null) {
        return;
      }

      timerRef.current = window.setTimeout(() => {
        updateActiveHeading();
        timerRef.current = null;
      }, 100); // 100ms throttle
    };

    // İlk yükleme için bir kez çalıştır
    updateActiveHeading();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [headings, lockedHeading]);

  // Scroll fonksiyonu (aynı başlık metni birden fazla ise index ile bul)
  const handleTOCClick = (index: number) => {
    // Eğer lock aktifse, yeni tıklamayı işleme
    if (lockedHeading !== null) return;

    const heading = headings.find((h) => h.index === index);
    if (heading && heading.element) {
      window.scrollTo({
        top: heading.offsetTop - 20,
        behavior: "smooth",
      });
      setActiveIndex(index);
      setLockedHeading(index);

      if (lockTimerRef.current !== null) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }

      lockTimerRef.current = window.setTimeout(() => {
        setLockedHeading((current) => (current === index ? null : current));
        lockTimerRef.current = null;
      }, 1000); // Süreyi ihtiyacına göre ayarlayabilirsin
    }
  };

  // Hiyerarşik TOC ağacı
  const tocTree = useMemo(
    () =>
      buildTOCTree(
        headings.map(({ text, level, index }) => ({ text, level, index })),
      ),
    [headings],
  );

  if (headings.length === 0) return null;

  return (
    <nav
      className="sticky top-2 max-h-[70vh] overflow-auto overflow-x-hidden rounded-lg bg-white/70 p-3 text-xs leading-6"
      aria-label="Sayfada Olanlar"
    >
      <h2 className="text-color-font mb-2 text-xs font-bold tracking-wide uppercase">
        On This Page
      </h2>
      <TOCList
        items={tocTree}
        activeIndex={activeIndex}
        onClick={handleTOCClick}
      />
    </nav>
  );
};
