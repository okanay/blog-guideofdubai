import { Link } from "@/i18n/link";
import { useLoaderData } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react"; // Lucide ikonları import edildi

export function BlogPostLayout() {
  // Loader datası kullanımı
  const { mostViewedPosts } = useLoaderData({ from: "/blog/_main/" });

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col gap-6">
        {/* Top Row: Featured Posts */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Selected Feature Post (Left side) - En çok görüntülenen post */}
          <div className="flex-1">
            <SelectedFeaturePost mostViewedPosts={mostViewedPosts} />
          </div>

          {/* Other Featured Posts (Right side) - 2-5. en çok görüntülenen postlar */}
          <div className="md:w-80 lg:w-96">
            <MostViewedPosts mostViewedPosts={mostViewedPosts} />
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

function SelectedFeaturePost({
  mostViewedPosts,
}: {
  mostViewedPosts?: BlogPostCardView[];
}) {
  // Dummy veri, olası hata durumları için
  const dummyMostViewedPost = {
    id: "550e8400-e29b-41d4-a716-446655440010",
    groupId: "revolutionizing-industries-saas",
    slug: "revolutionizing-industries-saas",
    language: "en",
    featured: false,
    status: "published",
    content: {
      title: "Revolutionizing industries through SaaS implementation",
      description:
        "Discover how SaaS implementations are transforming traditional industries and creating new opportunities for growth.",
      image: "https://images.project-test.info/2.webp",
      readTime: 4,
    },
    categories: [
      {
        name: "SaaS",
        value: "saas",
      },
    ],
    tags: [],
    createdAt: "2025-04-25T12:00:00.000Z",
    updatedAt: "2025-04-25T12:00:00.000Z",
    stats: {
      views: 1250,
      likes: 87,
      shares: 46,
      comments: 23,
    },
  };

  // En çok görüntülenen yazıyı bul (1. sıradaki)
  const topViewedPost =
    mostViewedPosts &&
    Array.isArray(mostViewedPosts) &&
    mostViewedPosts.length > 0
      ? [...mostViewedPosts].sort((a, b) => {
          const aViews = a.stats?.views || 0;
          const bViews = b.stats?.views || 0;
          return bViews - aViews; // Büyükten küçüğe sırala
        })[0]
      : dummyMostViewedPost;

  return (
    <div className="group relative h-72 w-full overflow-hidden rounded-lg sm:h-[23.1rem]">
      <Link to={topViewedPost.slug || ""}>
        <img
          src={topViewedPost.content.image}
          alt={topViewedPost.content.title}
          className="h-full w-full rounded-lg object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-75"
        />

        {/* View Count Badge */}
        {topViewedPost.stats && (
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1.5 backdrop-blur-sm">
            <Eye className="h-4 w-4 text-white" />
            <span className="text-xs font-semibold text-white">
              {topViewedPost.stats.views.toLocaleString()} görüntülenme
            </span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2 border-t border-zinc-100 bg-gradient-to-t from-zinc-950/40 to-zinc-100/40 px-4 py-4 backdrop-blur-xs">
          {topViewedPost.categories && topViewedPost.categories.length > 0 && (
            <span
              className={`w-fit rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[0.6rem] font-medium text-zinc-100`}
            >
              {topViewedPost.categories[0].value}
            </span>
          )}
          <h1 className="line-clamp-2 text-xl font-bold text-balance text-white md:text-3xl">
            {topViewedPost.content.title}
          </h1>
          <div className="flex items-center gap-3 text-white">
            <span className="text-xs">
              {topViewedPost.content.readTime} min read
            </span>
            {topViewedPost.stats && (
              <>
                <span className="text-xs">•</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs">{topViewedPost.stats.likes}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function MostViewedPosts({
  mostViewedPosts,
}: {
  mostViewedPosts?: BlogPostCardView[];
}) {
  // Dummy veri, BlogPostCardView tipine göre oluşturuldu
  const DummyMostViewedPosts: BlogPostCardView[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      groupId: "revolutionizing-industries-saas",
      slug: "revolutionizing-industries-saas",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Revolutionizing industries through SaaS implementation",
        description:
          "Discover how SaaS implementations are transforming traditional industries and creating new opportunities for growth.",
        image: "https://images.project-test.info/2.webp",
        readTime: 4,
      },
      categories: [
        {
          name: "SaaS",
          value: "saas",
        },
      ],
      tags: [],
      createdAt: "2025-04-25T12:00:00.000Z",
      updatedAt: "2025-04-25T12:00:00.000Z",
      stats: {
        views: 1250,
        likes: 87,
        shares: 46,
        comments: 23,
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440011",
      groupId: "synergizing-saas-ux-design",
      slug: "synergizing-saas-ux-design",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title:
          "Synergizing saas and UX design for elevating digital experiences",
        description:
          "Learn how the integration of SaaS solutions with thoughtful UX design can transform user experiences and drive engagement.",
        image: "https://images.project-test.info/3.webp",
        readTime: 5,
      },
      categories: [
        {
          name: "UX Design",
          value: "ux-design",
        },
      ],
      tags: [],
      createdAt: "2025-04-27T12:00:00.000Z",
      updatedAt: "2025-04-27T12:00:00.000Z",
      stats: {
        views: 980,
        likes: 62,
        shares: 38,
        comments: 15,
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      groupId: "navigating-saas-waters",
      slug: "navigating-saas-waters",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Navigating saas waters with intuitive UI and UX",
        description:
          "A comprehensive guide to creating intuitive UI/UX designs that enhance SaaS product adoption and user satisfaction.",
        image: "https://images.project-test.info/4.webp",
        readTime: 3,
      },
      categories: [
        {
          name: "UI Design",
          value: "ui-design",
        },
      ],
      tags: [],
      createdAt: "2025-04-30T12:00:00.000Z",
      updatedAt: "2025-04-30T12:00:00.000Z",
      stats: {
        views: 875,
        likes: 54,
        shares: 29,
        comments: 12,
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      groupId: "sculpting-saas-success",
      slug: "sculpting-saas-success",
      language: "en",
      featured: false,
      status: "published",
      content: {
        title: "Sculpting saas success - the art of UI and UX design",
        description:
          "Explore the artistic approach to designing UI/UX for SaaS products that captivate users and deliver exceptional value.",
        image: "https://images.project-test.info/1.webp",
        readTime: 6,
      },
      categories: [
        {
          name: "Design",
          value: "design",
        },
      ],
      tags: [],
      createdAt: "2025-05-01T12:00:00.000Z",
      updatedAt: "2025-05-01T12:00:00.000Z",
      stats: {
        views: 762,
        likes: 48,
        shares: 25,
        comments: 9,
      },
    },
  ];

  // 2., 3., 4. ve 5. en çok görüntülenen postları al
  const topViewedPosts: BlogPostCardView[] =
    mostViewedPosts &&
    Array.isArray(mostViewedPosts) &&
    mostViewedPosts.length > 0
      ? [...mostViewedPosts]
          .sort((a, b) => {
            const aViews = a.stats?.views || 0;
            const bViews = b.stats?.views || 0;
            return bViews - aViews;
          })
          .slice(1, 5) // İlk yazı (en popüleri) solda gösterildiği için 2-5. postları gösteriyoruz
      : DummyMostViewedPosts;

  return (
    <div>
      <h2 className="border-l-primary-cover mb-4 rounded border border-l-2 border-zinc-100 bg-zinc-100 py-1 pl-2 text-2xl font-semibold">
        Most Viewed Posts
      </h2>

      <div className="flex flex-col gap-4">
        {topViewedPosts.map((post) => (
          <Link
            to={`${post.slug}`}
            key={post.id}
            className="flex gap-4 rounded border border-transparent bg-zinc-50 ring ring-zinc-50 transition-all duration-300 ease-in-out hover:bg-zinc-100 hover:ring-zinc-300 hover:ring-offset-2 focus:bg-zinc-100 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
          >
            {/* Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
              <img
                src={post.content.image}
                alt={post.content.title}
                className="h-full w-full object-cover"
              />
              {post.stats && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Eye className="mr-1 h-3 w-3 text-white" />
                  <span className="text-[0.6rem] font-semibold text-white">
                    {post.stats.views.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="line-clamp-2 text-sm font-medium">
                {post.content.title}
              </h3>
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
                <div className="mr-3 size-9 overflow-hidden rounded-full">
                  <img
                    src={
                      "https://assets.guideofdubai.com/uploads/guideofdubai.png-VIfbeQ.png"
                    }
                    alt="Author"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mr-3 text-sm font-medium">
                  {post.categories[0].value}
                </span>
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
