import { ChevronLeft, BookOpenText, Search, ChevronRight, Heart, CalendarDays, Clock, SlidersHorizontal} from "lucide-react"; // prettier-ignore
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/link";

export const Route = createFileRoute("/$lang/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="py-8 sm:py-12">
      <BackgroudGradient />
      <HeroSection />
      <div className="not-sr-only my-24 sm:my-20" aria-hidden />
      <PopularBlogSection />
      <div className="not-sr-only my-6 sm:my-12" aria-hidden />
      <BlogPostLayout />
    </main>
  );
}

function BackgroudGradient() {
  return (
    <div className="to-primary-50/70 fixed top-0 left-0 -z-10 h-[125vh] w-full bg-gradient-to-t from-sky-50 via-zinc-50" />
  );
}

function HeroSection() {
  return (
    <section id="#hero">
      <div className="relative z-21 mx-auto max-w-7xl px-4">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 md:items-center md:justify-center md:text-center">
          <button className="-mb-3 flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1 text-xs font-medium tracking-wide shadow-inner ring shadow-zinc-200/5 ring-zinc-200 ring-offset-2 transition-[opacity] duration-500 ease-in-out hover:opacity-75 focus:opacity-75 focus:outline-none">
            <span>Read Latest Blogs</span>
            <BookOpenText className="text-primary-dark size-3 translate-y-[0.5px]" />
          </button>
          <h1 className="text-5xl sm:text-6xl">
            Find Your Perfect Dubai Experience
          </h1>
          <p className="text-base sm:text-lg">
            Get honest reviews, real photos, and community insights about Dubai
            attractions. Search by location or activity to start exploring.
          </p>
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}

function HeroSearchForm() {
  return (
    <form className="group flex w-full rounded-full ring ring-zinc-200 ring-offset-2 focus-within:!border-zinc-200 focus-within:!ring-zinc-400">
      <button
        type="button"
        className="relative flex flex-shrink-0 items-center justify-center gap-2 rounded-l-full border border-zinc-200 bg-zinc-100 px-4 transition-[opacity_colors] duration-300 hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-200 focus:opacity-75 focus:outline-none sm:w-24 sm:px-2"
      >
        <span className="hidden sm:block">Filter</span>
        <SlidersHorizontal className="size-4" />
      </button>

      <input
        type="text"
        id="search-input"
        name="search-param"
        placeholder="Best Dubai Restaurant.."
        className="w-full flex-grow border-y border-r border-zinc-200 bg-white px-4 py-3 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary flex items-center gap-1.5 rounded-r-full px-4 py-2 font-medium tracking-wide text-white transition-[opacity] duration-500 ease-in-out hover:opacity-75 focus:outline-none"
      >
        <span className="hidden sm:block">Search</span>
        <Search className="size-4 translate-x-[-10%] sm:translate-x-0" />
      </button>
    </form>
  );
}

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

function PopularBlogSection() {
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

export default PopularBlogSection;

function BlogCard({ imageUrl, category, title, author, date, likes, index }) {
  return (
    <div className="group relative w-72 cursor-pointer overflow-hidden rounded-lg border border-zinc-300 sm:w-96 xl:w-[25vw]">
      <Link to={"/blog"}>
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

function BlogPostLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col gap-6">
        {/* Top Row: Featured Posts */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Selected Feature Post (Left side) */}
          <div className="flex-1">
            <SelectedFeaturePost />
          </div>

          {/* Other Featured Posts (Right side) */}
          <div className="md:w-80 lg:w-96">
            <OtherFeaturedPosts />
          </div>
        </div>

        {/* Bottom Row: Recent Posts */}
        <div>
          <RecentPosts />
        </div>
      </div>
    </div>
  );
}

function SelectedFeaturePost() {
  return (
    <div className="group relative h-72 w-full overflow-hidden rounded-lg sm:h-[23.1rem]">
      <Link to={"/blog"}>
        <img
          src="https://images.project-test.info/1.webp"
          alt="Office workspace with computers"
          className="h-full w-full rounded-lg object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-75"
        />

        {/* Content Overlay */}
        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2 border-t border-zinc-100 bg-gradient-to-t from-zinc-950/40 to-zinc-100/40 px-4 py-4 backdrop-blur-xs">
          <span
            className={`w-fit rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[0.6rem] font-medium text-zinc-100`}
          >
            Business
          </span>
          <h1 className="line-clamp-2 text-xl font-bold text-balance text-white md:text-3xl">
            Unlocking Business Efficiency with SaaS Solutions
          </h1>
        </div>
      </Link>
    </div>
  );
}

function OtherFeaturedPosts() {
  const featuredPosts = [
    {
      id: 1,
      imageUrl: "https://images.project-test.info/2.webp",
      title: "Revolutionizing industries through SaaS implementation",
    },
    {
      id: 2,
      imageUrl: "https://images.project-test.info/3.webp",
      title: "Synergizing saas and UX design for elevating digital experiences",
    },
    {
      id: 3,
      imageUrl: "https://images.project-test.info/4.webp",
      title: "Navigating saas waters with intuitive UI and UX",
    },
    {
      id: 4,
      imageUrl: "https://images.project-test.info/1.webp",
      title: "Sculpting saas success - the art of UI and UX design",
    },
  ];

  return (
    <div>
      <h2 className="border-l-primary-cover mb-4 rounded border border-l-2 border-zinc-100 bg-zinc-100 py-1 pl-2 text-2xl font-semibold">
        Other featured posts
      </h2>

      <div className="flex flex-col gap-4">
        {featuredPosts.map((post) => (
          <Link
            to={"/blog"}
            key={post.id}
            className="flex gap-4 rounded border border-transparent bg-zinc-50 ring ring-zinc-50 transition-all duration-300 ease-in-out hover:bg-zinc-100 hover:ring-zinc-300 hover:ring-offset-2 focus:bg-zinc-100 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
          >
            {/* Thumbnail */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-sm font-medium">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecentPosts() {
  const recentPosts = [
    {
      id: 1,
      imageUrl: "https://images.project-test.info/3.webp",
      title: "Mastering UI Elements: A Practical Guide for Designers",
      excerpt:
        "Dive into the world of user interfaces with our expert guides, latest trends, and practical tips.",
      author: "Jennifer Taylor",
      readTime: "3 min read",
      authorImg: "https://i.pravatar.cc/64?u=1",
    },
    {
      id: 2,
      imageUrl: "https://images.project-test.info/4.webp",
      title: "Crafting Seamless Experiences: The Art of Intuitive UI Design",
      excerpt:
        "Explore the principles and techniques that drive user-centric UI design, ensuring a seamless and intuitive experience.",
      author: "Jennifer Taylor",
      readTime: "5 min read",
      authorImg: "https://i.pravatar.cc/64?u=1",
    },
    {
      id: 3,
      imageUrl: "https://images.project-test.info/1.webp",
      title: "Beyond Aesthetics: The Power of Emotional UX Design",
      excerpt:
        "Delve into the realm of emotional design and discover how incorporating empathy and psychology elevates user experiences.",
      author: "Ryan A.",
      readTime: "2 min read",
      authorImg: "https://i.pravatar.cc/64?u=3",
    },
    {
      id: 4,
      imageUrl: "https://images.project-test.info/2.webp",
      title: "The Future of UX: Trends to Watch in 2025",
      excerpt:
        "Explore the upcoming trends in UX design that are set to shape the future of digital experiences.",
      author: "Emily B.",
      readTime: "4 min read",
      authorImg: "https://i.pravatar.cc/64?u=4",
    },
  ];

  return (
    <div>
      <div className="border-l-primary-cover mb-6 flex items-center justify-between rounded border border-l-2 border-zinc-100 bg-zinc-100 px-2 py-1">
        <h2 className="text-2xl font-semibold">Recent Posts</h2>
        <Link
          to="/blog"
          className="text-color-primary border-primary-cover bg-primary flex h-11 items-center justify-center rounded-xs border px-6 text-center text-sm font-bold tracking-wide transition-[opacity] duration-500 ease-in-out hover:opacity-75 focus:opacity-75 focus:outline-none"
        >
          All Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {recentPosts.map((post) => (
          <Link
            to={"/blog"}
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 ring ring-zinc-50 transition-all hover:ring-zinc-300 hover:ring-offset-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-3 line-clamp-2 text-xl font-semibold">
                {post.title}
              </h3>
              <p className="mb-5 flex-1 text-sm text-zinc-600">
                {post.excerpt}
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="mr-3 h-8 w-8 overflow-hidden rounded-full">
                  <img
                    src={post.authorImg}
                    alt={post.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mr-3 text-sm font-medium">{post.author}</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="ml-3 text-xs text-zinc-500">
                  {post.readTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
