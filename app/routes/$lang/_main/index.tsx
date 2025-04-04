import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  BookOpenText,
  Search,
  ChevronRight,
  Heart,
  CalendarDays,
} from "lucide-react";
import { useEffect, useRef } from "react";
export const Route = createFileRoute("/$lang/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <HeroSection />
      <PopularBlogSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section id="#hero" className="pt-8 sm:pt-20">
      <div className="relative z-21 mx-auto max-w-7xl px-4">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 md:items-center md:justify-center md:text-center">
          <button className="-mb-3 flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1 text-xs font-medium shadow-inner ring shadow-zinc-200/5 ring-zinc-200 ring-offset-2">
            <span>Read Latest Blogs</span>
            <BookOpenText className="text-primary-dark size-3 translate-y-[0.5px]" />
          </button>
          <h1 className="font-serif text-6xl">
            Find Your Perfect Dubai Experience
          </h1>
          <p className="text-lg">
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
    <form className="group flex w-full rounded-full border border-gray-200 ring ring-zinc-200 ring-offset-2 focus-within:!border-zinc-200 focus-within:!ring-zinc-400">
      <select className="w-24 appearance-none border-r border-zinc-200 px-2 py-3 text-center text-xs focus:outline-none">
        <option value="all">Look All</option>
        <option value="clothing">Restaurant</option>
        <option value="accessories">Hotels</option>
        <option value="shoes">Rent A Car</option>
      </select>
      <input
        type="text"
        placeholder="Best Dubai Restaurant.."
        className="w-full flex-grow px-4 py-3 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary border-zinc-200] flex items-center gap-1.5 rounded-r-full border px-4 py-2 text-white focus:outline-none"
      >
        <span className="hidden sm:block">Search</span>
        <Search className="size-4" />
      </button>
    </form>
  );
}

function PopularBlogSection() {
  const btnLeftRef = useRef(null);
  const btnRightRef = useRef(null);
  const container = useRef(null);

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
      title:
        "Discover Dubai's Hidden Gems: Off-the-Beaten-Path City Tour Spots",
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
    {
      imageUrl: "https://images.project-test.info/5.webp",
      category: "Rent a Car",
      title:
        "Luxury on Wheels: The Ultimate Guide to Renting Exotic Cars in Dubai",
      author: "Daniel Smith",
      date: "March 05, 2025",
      likes: "312",
    },
    {
      imageUrl: "https://images.project-test.info/6.webp",
      category: "Dubai Visa",
      title: "Everything You Need to Know About Dubai Tourist Visa in 2025",
      author: "Aisha Al Falasi",
      date: "February 12, 2025",
      likes: "531",
    },
    {
      imageUrl: "https://images.project-test.info/7.webp",
      category: "Museum of the Future",
      title: "Inside Dubai's Museum of the Future: A Glimpse into Tomorrow",
      author: "Omar Hassan",
      date: "March 18, 2025",
      likes: "476",
    },
    {
      imageUrl: "https://images.project-test.info/8.webp",
      category: "Burj Khalifa",
      title:
        "Sunset at 828m: The Ultimate Burj Khalifa Experience You Shouldn't Miss",
      author: "Emma Roberts",
      date: "January 30, 2025",
      likes: "602",
    },
    {
      imageUrl: "https://images.project-test.info/9.webp",
      category: "Dubai Frame",
      title:
        "The Golden Frame: Capturing Dubai's Past and Future at the Dubai Frame",
      author: "Khalid Al Maktoum",
      date: "February 20, 2025",
      likes: "347",
    },
    {
      imageUrl: "https://images.project-test.info/10.webp",
      category: "Dubai City Tour",
      title:
        "From Old Town to Marina: The Perfect 3-Day Dubai City Tour Itinerary",
      author: "Sophia Chen",
      date: "March 01, 2025",
      likes: "419",
    },
    {
      imageUrl: "https://images.project-test.info/11.webp",
      category: "Rent a Yacht",
      title: "Sailing the Arabian Gulf: Luxury Yacht Experiences in Dubai",
      author: "James Wilson",
      date: "February 05, 2025",
      likes: "384",
    },
    {
      imageUrl: "https://images.project-test.info/12.webp",
      category: "Restaurants",
      title:
        "Culinary Delights: Top 12 Fine Dining Restaurants in Dubai for 2025",
      author: "Fatima Al Hashimi",
      date: "March 22, 2025",
      likes: "495",
    },
  ];

  const handleButtonClick = (direction: "Left" | "Right") => {
    if (!container.current) return;
    const cardWidth = 288;
    const scrollAmount = cardWidth + 16;
    const scrollOffset = direction === "Left" ? -scrollAmount : scrollAmount;
    container.current.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
    updateButtonState();
  };

  const updateButtonState = () => {
    if (!container.current || !btnLeftRef.current || !btnRightRef.current)
      return;
    const { scrollLeft, scrollWidth, clientWidth } = container.current;
    btnLeftRef.current.ariaDisabled = (scrollLeft <= 0).toString();
    btnRightRef.current.ariaDisabled = (
      scrollLeft + clientWidth >=
      scrollWidth - 10
    ).toString();
  };

  useEffect(() => {
    updateButtonState();
    const currentContainer = container.current;
    currentContainer?.addEventListener("scroll", updateButtonState);
    return () => {
      currentContainer?.removeEventListener("scroll", updateButtonState);
    };
  }, []);

  return (
    <section id="popular-card" className="relative py-12 pr-4 pl-2 sm:py-20">
      <button
        ref={btnLeftRef}
        onClick={() => handleButtonClick("Left")}
        aria-disabled="true"
        className="border-primary-cover bg-primary absolute top-[50%] left-2 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-25"
      >
        <ChevronLeft className="text-color-primary size-full" />
      </button>
      <button
        ref={btnRightRef}
        onClick={() => handleButtonClick("Right")}
        className="border-primary-cover bg-primary absolute top-[50%] right-2 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-25"
      >
        <ChevronRight className="text-color-primary size-full" />
      </button>
      <ul
        ref={container}
        style={{ scrollbarWidth: "none" }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4"
      >
        {blogs.map((blog, index) => (
          <li key={index} className="shrink-0 snap-center">
            <BlogCard {...blog} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlogCard({ imageUrl, category, title, author, date, likes, index }) {
  return (
    <div className="relative w-72 overflow-hidden rounded-xs shadow-md sm:w-96">
      {/* Card Image */}
      <div className="relative h-72 w-full sm:h-96">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />

        {/* Category Badge */}
        <span
          className={`bg-primary border-primary-cover absolute top-4 left-4 rounded-full border px-3 py-1 text-xs font-medium text-white`}
        >
          {category}
        </span>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* Title */}
        <div className="absolute bottom-16 left-0 w-full px-4">
          <h3 className="line-clamp-2 text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Author and Metadata */}
        <div className="absolute bottom-4 left-0 flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="size-8 overflow-hidden rounded-full bg-gray-300">
              <img
                src={`https://i.pravatar.cc/64?u=${index}`}
                alt={author}
                loading="lazy"
                fetchPriority="low"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="max-w-24 truncate text-sm text-white">
              {author}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-white">{date}</span>
              <CalendarDays className="text-color-font-invert size-3" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-white">{likes}</span>
              <Heart className="text-color-font-invert size-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
