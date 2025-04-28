import { twMerge } from "tailwind-merge";
import React, { useEffect, useMemo, useState, useRef } from "react";

type Heading = {
  text: string;
  level: number;
  element: HTMLElement;
  index: number;
  offsetTop: number;
};

type TOCItem = {
  text: string;
  level: number;
  index: number;
  children: TOCItem[];
};

// DOM'dan başlıkları bul
function getHeadingsFromDOM(container: HTMLElement | null): Heading[] {
  if (!container) return [];
  const headingTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
  let globalIndex = 0;
  const headings: Heading[] = [];
  container.querySelectorAll(headingTags.join(",")).forEach((el) => {
    headings.push({
      text: el.textContent || "",
      level: Number(el.tagName.replace("H", "")),
      element: el as HTMLElement,
      index: globalIndex++,
      offsetTop: (el as HTMLElement).offsetTop,
    });
  });
  return headings.sort((a, b) => a.offsetTop - b.offsetTop);
}

// Hiyerarşik TOC ağacı
function buildTOCTree(
  headings: { text: string; level: number; index: number }[],
): TOCItem[] {
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
  htmlContainerSelector: string;
}

export const BlogTOC: React.FC<BlogTOCProps> = ({ htmlContainerSelector }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const lockTimerRef = useRef<number | null>(null);

  // Başlıkları DOM'dan çek
  useEffect(() => {
    const container = document.querySelector(
      htmlContainerSelector,
    ) as HTMLElement;
    if (!container) return;
    const found = getHeadingsFromDOM(container);
    setHeadings(found);
    if (found.length > 0) setActiveIndex(found[0].index);
  }, [htmlContainerSelector, document.location.pathname]);

  // Scroll ile aktif başlık güncelle
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (locked) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // En yakın başlığı bul (offsetTop - 20 ile scrollTop karşılaştır)
      const current = headings
        .slice()
        .reverse()
        .find((h) => h.offsetTop - 20 <= scrollTop);
      if (current) setActiveIndex(current.index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // İlk render'da da çalıştır
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, locked]);

  // Lock bittiğinde scroll pozisyonuna göre aktif başlığı güncelle
  useEffect(() => {
    if (!locked && headings.length > 0) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const current = headings
        .slice()
        .reverse()
        .find((h) => h.offsetTop - 20 <= scrollTop);
      if (current) setActiveIndex(current.index);
    }
  }, [locked, headings]);

  // TOC tıklama
  const handleTOCClick = (index: number) => {
    if (locked) return;
    const heading = headings.find((h) => h.index === index);
    if (heading && heading.element) {
      window.scrollTo({
        top: heading.offsetTop - 20,
        behavior: "smooth",
      });
      setActiveIndex(index);
      setLocked(true);

      if (lockTimerRef.current !== null) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      lockTimerRef.current = window.setTimeout(() => {
        setLocked(false);
        lockTimerRef.current = null;
      }, 1000); // 1 saniye lock
    }
  };

  // Unmount'ta timer temizliği
  useEffect(() => {
    return () => {
      if (lockTimerRef.current !== null) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

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
