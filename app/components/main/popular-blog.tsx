import { Link } from "@/i18n/link";
import { CalendarDays, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef, useEffect } from "react";

const blogs = [
  {
    imageUrl: "https://images.project-test.info/1.webp",
    category: "Hotels",
    title: "Top 10 Luxury Hotels in Dubai That Will Take Your Breath Away",
    author: "Ahmed Al Mansouri",
    date: "March 15, 2025",
    likes: "458",
  },
  {
    imageUrl: "https://images.project-test.info/2.webp",
    category: "Desert Safari",
    title:
      "Experience the Magic of Arabian Nights: Ultimate Desert Safari Guide",
    author: "Sarah Johnson",
    date: "February 28, 2025",
    likes: "327",
  },
  {
    imageUrl: "https://images.project-test.info/3.webp",
    category: "City Tours",
    title: "Discover Dubai's Hidden Gems: Off-the-Beaten-Path City Tour Spots",
    author: "Mohammed Al Qasimi",
    date: "March 10, 2025",
    likes: "276",
  },
  {
    imageUrl: "https://images.project-test.info/4.webp",
    category: "Activities",
    title: "Adrenaline Junkies Guide: 7 Extreme Sports You Must Try in Dubai",
    author: "Jessica Williams",
    date: "January 22, 2025",
    likes: "389",
  },
];

export function PopularBlogSection() {
  const btnLeftRef = useRef<HTMLButtonElement>(null);
  const btnRightRef = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);

  const handleButtonClick = (direction: "Left" | "Right") => {
    if (!container.current || cardRefs.current.length === 0) return;

    // İlk kartın genişliğini ve margin değerini al
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardMargin = 12; // gap-3 className'inden gelen değer
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
    let resizeTimer: NodeJS.Timeout;
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

  return (
    <section id="popular-card" className="relative px-4">
      <button
        ref={btnLeftRef}
        aria-disabled="true"
        aria-label="Left Scroll"
        onClick={() => handleButtonClick("Left")}
        className="border-primary-cover bg-primary absolute -top-9 left-5 z-20 size-10 translate-y-[-50%] rounded-xs border p-1 shadow-md transition-opacity duration-300 focus:opacity-75 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-25 sm:top-[50%] sm:left-2 sm:rounded-full"
      >
        <ChevronLeft className="text-color-primary size-full" />
      </button>
      <button
        ref={btnRightRef}
        aria-disabled={false}
        aria-label="Right Scroll"
        onClick={() => handleButtonClick("Right")}
        className="border-primary-cover bg-primary absolute -top-9 right-5 z-20 size-10 translate-y-[-50%] rounded-xs border p-1 shadow-md transition-opacity duration-300 focus:opacity-75 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-25 sm:top-[50%] sm:right-2 sm:rounded-full"
      >
        <ChevronRight className="text-color-primary size-full" />
      </button>
      <ul
        ref={container}
        style={{ scrollbarWidth: "none" }}
        className="flex snap-x snap-mandatory flex-nowrap items-center justify-start gap-3 overflow-x-auto overscroll-x-contain pb-4"
      >
        {blogs.map((blog, index) => (
          <li
            key={index}
            ref={(el) => {
              if (el) {
                cardRefs.current[index] = el;
              }
            }}
            className="shrink-0 snap-center"
          >
            <BlogCard {...blog} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlogCard({ imageUrl, category, title, author, date, likes, index }) {
  return (
    <div className="group relative w-72 cursor-pointer overflow-hidden rounded-lg border border-zinc-300 sm:w-96 xl:w-[25vw]">
      <Link to={""}>
        {/* Card Image */}
        <div className="relative h-72 w-full sm:h-96">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            fetchPriority="low"
            className="h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-75"
          />
          {/* Category Badge */}
          <span
            className={`absolute top-4 left-4 rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[0.6rem] font-medium text-zinc-100`}
          >
            {category}
          </span>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
          {/* Title */}
          <div className="absolute bottom-20 left-0 w-full px-4 sm:bottom-16">
            <h2 className="line-clamp-2 text-xl font-bold text-white">
              {title}
            </h2>
          </div>
          {/* Author and Metadata */}
          <div className="absolute bottom-4 left-0 flex w-full flex-col gap-x-2 gap-y-1 px-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-1 flex items-center gap-2 sm:order-1">
              <div className="size-8 overflow-hidden rounded-full bg-zinc-300">
                <img
                  src={`https://i.pravatar.cc/64?u=${index}`}
                  alt={author}
                  loading="lazy"
                  fetchPriority="low"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="max-w-40 truncate text-sm text-white sm:max-w-24">
                {author}
              </span>
            </div>
            <div className="order-2 flex items-center gap-4 sm:order-2">
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 text-sm text-white">{date}</span>
                <CalendarDays className="text-color-font-invert size-3 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 text-sm text-white">{likes}</span>
                <Heart className="text-color-font-invert size-3 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
