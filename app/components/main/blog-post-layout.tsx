import { Link } from "@/i18n/link";

export function BlogPostLayout() {
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
      <Link to={""}>
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
            to={""}
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
          to=""
          className="text-color-primary border-primary-cover bg-primary flex h-11 items-center justify-center rounded-xs border px-6 text-center text-sm font-bold tracking-wide transition-[opacity] duration-500 ease-in-out hover:opacity-75 focus:opacity-75 focus:outline-none"
        >
          All Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {recentPosts.map((post) => (
          <Link
            to={""}
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
