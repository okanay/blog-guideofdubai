import { Link } from "@/i18n/link";
import { CalendarDays, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef, useEffect } from "react";
import { useLoaderData } from "@tanstack/react-router";

export function FeaturedBlogSection() {
  // TanStack Router'dan verileri al
  const { featuredPosts: loadedFeaturedPosts } = useLoaderData({
    from: "/blog/_main/",
  }) as {
    featuredPosts: BlogPostCardView[];
  };

  const featuredPosts: BlogPostCardView[] =
    loadedFeaturedPosts &&
    Array.isArray(loadedFeaturedPosts) &&
    loadedFeaturedPosts.length > 0
      ? loadedFeaturedPosts
      : DummyPosts.filter((post) => post.featured);

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
    <section id="featured-blog" className="relative mt-8 px-4">
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
        {featuredPosts.map((blog, index) => (
          <li
            key={blog.id}
            ref={(el) => {
              if (el) {
                cardRefs.current[index] = el;
              }
            }}
            className="shrink-0 snap-center"
          >
            <FeaturedBlogCard blog={blog} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedBlogCard({
  blog,
  index,
}: {
  blog: BlogPostCardView;
  index: number;
}) {
  // Varsayılan bir author bilgisi tanımla (API'den gelmiyor ise)
  const authorInfo = {
    name: "Guide Of Dubai",
    avatar:
      "https://assets.guideofdubai.com/uploads/guideofdubai.png-VIfbeQ.png",
  };

  return (
    <div className="group relative w-72 cursor-pointer overflow-hidden rounded-lg border border-zinc-300 sm:w-96 xl:w-[25vw]">
      <Link to={`/blog/${blog.slug}`}>
        {/* Card Image */}
        <div className="relative h-72 w-full sm:h-96">
          <img
            src={
              blog.content.image ||
              "https://images.project-test.info/placeholder.webp"
            }
            alt={blog.content.title}
            loading="lazy"
            fetchPriority="low"
            className="h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-75"
          />

          {/* Category Badge - Eğer kategori varsa ilk kategoriyi göster */}
          {blog.categories && blog.categories.length > 0 && (
            <span className="absolute top-4 left-4 rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[0.6rem] font-medium text-zinc-100">
              {blog.categories[0].value}
            </span>
          )}

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Title */}
          <div className="absolute bottom-20 left-0 w-full px-4 sm:bottom-16">
            <h2 className="line-clamp-2 text-xl font-bold text-white">
              {blog.content.title}
            </h2>
          </div>

          {/* Author and Metadata */}
          <div className="absolute bottom-4 left-0 flex w-full flex-col gap-x-2 gap-y-1 px-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-1 flex items-center gap-2 sm:order-1">
              {/* <div className="size-8 shrink-0 overflow-hidden rounded-full bg-zinc-300">
                <img
                  src={authorInfo.avatar}
                  alt={authorInfo.name}
                  loading="lazy"
                  fetchPriority="low"
                  className="h-full w-full object-cover"
                />
              </div> */}

              {/* Etiketler - En fazla bir etiket göster, zarif bir şekilde */}
              {blog.tags && blog.tags.length > 0 ? (
                <div className="flex items-center">
                  <span className="max-w-48 truncate pr-1 text-sm text-white">
                    {blog.tags[0].value}
                  </span>
                  {blog.tags.length > 1 && (
                    <span className="rounded bg-zinc-800/60 px-1 text-xs text-zinc-300">
                      +{blog.tags.length - 1}
                    </span>
                  )}
                </div>
              ) : (
                <span className="max-w-48 truncate text-sm text-white/60">
                  {blog.categories?.[0]?.value || "Blog"}
                </span>
              )}
            </div>

            <div className="order-2 flex items-center gap-4 sm:order-2">
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 text-sm text-white">
                  {formatDate(blog.createdAt)}
                </span>
                <CalendarDays className="text-color-font-invert size-3 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1">
                <span className="line-clamp-1 text-sm text-white">
                  {blog.stats?.likes || blog.stats?.views || 0}
                </span>
                <Heart className="text-color-font-invert size-3 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Placeholder dummy posts for when API fails
const DummyPosts: BlogPostCardView[] = [
  {
    id: "1",
    groupId: "group1",
    slug: "luxury-hotels-dubai",
    language: "tr",
    featured: true,
    status: "published",
    content: {
      title: "Top 10 Luxury Hotels in Dubai That Will Take Your Breath Away",
      description:
        "Discover the most luxurious hotels in Dubai offering exceptional services and amenities.",
      image: "https://images.project-test.info/1.webp",
      readTime: 8,
    },
    categories: [{ name: "Hotels", value: "hotels" }],
    tags: [
      { name: "Luxury", value: "luxury" },
      { name: "5-Star", value: "5-star" },
    ],
    createdAt: new Date("2025-03-15T14:30:00Z").toString(),
    updatedAt: new Date("2025-03-15T14:30:00Z").toString(),
    stats: { likes: 458, views: 1200, shares: 89, comments: 32 },
  },
  {
    id: "2",
    groupId: "group2",
    slug: "desert-safari-guide",
    language: "tr",
    featured: true,
    status: "published",
    content: {
      title:
        "Experience the Magic of Arabian Nights: Ultimate Desert Safari Guide",
      description:
        "Everything you need to know about booking and enjoying the perfect desert safari in Dubai.",
      image: "https://images.project-test.info/2.webp",
      readTime: 10,
    },
    categories: [{ name: "Desert Safari", value: "desert-safari" }],
    tags: [
      { name: "Adventure", value: "adventure" },
      { name: "Safari", value: "safari" },
    ],
    createdAt: new Date("2025-02-28T09:15:00Z").toString(),
    updatedAt: new Date("2025-02-28T09:15:00Z").toString(),
    stats: { likes: 327, views: 980, shares: 65, comments: 18 },
  },
  {
    id: "3",
    groupId: "group3",
    slug: "hidden-gems-dubai",
    language: "tr",
    featured: true,
    status: "published",
    content: {
      title:
        "Discover Dubai's Hidden Gems: Off-the-Beaten-Path City Tour Spots",
      description:
        "Explore the lesser-known attractions that showcase Dubai's authentic culture and heritage.",
      image: "https://images.project-test.info/3.webp",
      readTime: 12,
    },
    categories: [{ name: "City Tours", value: "city-tours" }],
    tags: [
      { name: "Local", value: "local" },
      { name: "Culture", value: "culture" },
    ],
    createdAt: new Date("2025-03-10T11:45:00Z").toString(),
    updatedAt: new Date("2025-03-10T11:45:00Z").toString(),
    stats: { likes: 276, views: 850, shares: 42, comments: 21 },
  },
  {
    id: "4",
    groupId: "group4",
    slug: "extreme-sports-dubai",
    language: "tr",
    featured: true,
    status: "published",
    content: {
      title: "Adrenaline Junkies Guide: 7 Extreme Sports You Must Try in Dubai",
      description:
        "From skydiving over Palm Jumeirah to dune bashing in the desert - Dubai's top extreme activities.",
      image: "https://images.project-test.info/4.webp",
      readTime: 9,
    },
    categories: [{ name: "Activities", value: "activities" }],
    tags: [
      { name: "Extreme", value: "extreme" },
      { name: "Sports", value: "sports" },
    ],
    createdAt: new Date("2025-01-22T16:20:00Z").toString(),
    updatedAt: new Date("2025-01-22T16:20:00Z").toString(),
    stats: { likes: 389, views: 1050, shares: 78, comments: 29 },
  },
];

// Tarih formatlama fonksiyonu (lib/utils.ts içinde tanımlanmalı)
const formatDate = (date: Date | string) => {
  if (!date) return "";
  const d = new Date(date);

  // Ay isimleri
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
