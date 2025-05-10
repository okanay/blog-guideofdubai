import { Link } from "@/i18n/link";
import {} from "@/routes/blog/_main";
import { useLoaderData } from "@tanstack/react-router";

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
  // Dummy veri, BlogPostCardView tipine göre oluşturuldu
  const DummyRecentPosts: BlogPostCardView[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      groupId: "mastering-ui-elements-guide",
      slug: "mastering-ui-elements-guide",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Mastering UI Elements: A Practical Guide for Designers",
        description:
          "Dive into the world of user interfaces with our expert guides, latest trends, and practical tips.",
        image: "https://images.project-test.info/3.webp",
        readTime: 3,
      },
      createdAt: "2025-05-01T12:00:00.000Z",
      updatedAt: "2025-05-01T12:00:00.000Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      groupId: "crafting-seamless-experiences",
      slug: "crafting-seamless-experiences",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Crafting Seamless Experiences: The Art of Intuitive UI Design",
        description:
          "Explore the principles and techniques that drive user-centric UI design, ensuring a seamless and intuitive experience.",
        image: "https://images.project-test.info/4.webp",
        readTime: 5,
      },
      createdAt: "2025-05-02T12:00:00.000Z",
      updatedAt: "2025-05-02T12:00:00.000Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      groupId: "beyond-aesthetics-emotional-design",
      slug: "beyond-aesthetics-emotional-design",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Beyond Aesthetics: The Power of Emotional UX Design",
        description:
          "Delve into the realm of emotional design and discover how incorporating empathy and psychology elevates user experiences.",
        image: "https://images.project-test.info/1.webp",
        readTime: 2,
      },
      createdAt: "2025-05-03T12:00:00.000Z",
      updatedAt: "2025-05-03T12:00:00.000Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      groupId: "future-of-ux-trends-2025",
      slug: "future-of-ux-trends-2025",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "The Future of UX: Trends to Watch in 2025",
        description:
          "Explore the upcoming trends in UX design that are set to shape the future of digital experiences.",
        image: "https://images.project-test.info/2.webp",
        readTime: 4,
      },
      createdAt: "2025-05-04T12:00:00.000Z",
      updatedAt: "2025-05-04T12:00:00.000Z",
    },
  ];

  // Loader datası kullanımı
  const { recentPosts: loadedPosts } = useLoaderData({ from: "/blog/_main/" });

  // recentPosts varsa ve dizi ise kullan, yoksa dummy datayı kullan
  const recentPosts: BlogPostCardView[] =
    loadedPosts && Array.isArray(loadedPosts) && loadedPosts.length > 0
      ? loadedPosts
      : DummyRecentPosts;

  console.log(loadedPosts);

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
            to={`${post.slug}`}
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 ring ring-zinc-50 transition-all hover:ring-zinc-300 hover:ring-offset-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={post.content.image}
                alt={post.content.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-3 line-clamp-2 text-xl font-semibold">
                {post.content.title}
              </h3>
              <p className="mb-5 line-clamp-3 flex-1 text-sm text-zinc-600">
                {post.content.description}
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="mr-3 h-8 w-8 overflow-hidden rounded-full">
                  <img
                    src={
                      "https://i.pravatar.cc/64?u=" + post.id.substring(0, 8)
                    }
                    alt="Author"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mr-3 text-sm font-medium">Guide of Dubai</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="ml-3 text-xs text-zinc-500">
                  {post.content.readTime} min read
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
