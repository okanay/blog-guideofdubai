import { HeadContent, Outlet, Scripts, createRootRoute, redirect } from "@tanstack/react-router"; // prettier-ignore
import { LANGUAGE_DICTONARY, SUPPORTED_LANGUAGES } from "@/i18n/config";
import LanguageProvider from "@/i18n/provider";
import { detectLanguage } from "@/i18n/action";

import globals from "@/globals.css?url";
import { RootProviders } from "@/providers";

export const Route = createRootRoute({
  loader: async (ctx) => {
    // URL'den lang parametresini al
    const searchParams = new URLSearchParams(ctx.location.search);
    const langParam = searchParams.get("lang") as Language;

    // "/blog" ile başlamıyorsa kontrolü.
    if (!ctx.location.pathname.startsWith("/blog")) {
      throw redirect({
        to: "blog",
        replace: true,
      });
    }

    // Lang parametresi var mı ve desteklenen bir dil mi kontrol et
    const isValidLangParam =
      langParam && SUPPORTED_LANGUAGES.includes(langParam);

    // Eğer lang parametresi yoksa veya geçersizse, dil algıla ve yönlendir
    if (!isValidLangParam) {
      // Sunucu tarafında dil algıla (mevcut metodu kullan)
      const detectedLanguage = await detectLanguage();

      // Mevcut search parametrelerini koru ve lang ekle/güncelle
      searchParams.set("lang", detectedLanguage);

      // Aynı path'e lang parametresi eklenmiş halini yönlendir
      throw redirect({
        to: `${ctx.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`,
        replace: true, // Tarayıcı geçmişinde eski URL'yi değiştir
      });
    }

    // Lang parametresi varsa ve geçerliyse, lang değerini dön
    return {
      lang: langParam,
    };
  },
  head: () => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "theme-color",
          media: "(prefers-color-scheme: light)",
          content: "#ffffff",
        },
        {
          name: "theme-color",
          media: "(prefers-color-scheme: dark)",
          content: "#000000",
        },
      ],
      links: [
        {
          rel: "preload stylesheet",
          as: "style",
          type: "text/css",
          crossOrigin: "anonymous",
          href: globals,
        },
        {
          rel: "icon",
          href: "/metadata/favicons/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/metadata/favicons/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/metadata/site.webmanifest",
          color: "#ffffff",
        },
        {
          rel: "sitemap",
          type: "application/xml",
          title: "sitemap",
          href: `/api/sitemap`,
        },
        {
          rel: "preload",
          as: "image",
          type: "image/svg+xml",
          href: `/images/brand.svg`,
        },
        {
          rel: "preload stylesheet",
          as: "style",
          crossOrigin: "anonymous",
          href: `/fonts/custom-sans/font.css`,
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
          href: `/fonts/custom-sans/regular.woff2`,
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
          href: `/fonts/custom-sans/medium.woff2`,
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
          href: `/fonts/custom-sans/semibold.woff2`,
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
          href: `/fonts/custom-sans/bold.woff2`,
        },
      ],
    };
  },
  component: RootComponent,
});

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const { lang } = Route.useLoaderData();
  const language = LANGUAGE_DICTONARY.find((entry) => entry.value === lang);

  return (
    <html lang={language.seo.locale} dir={language.seo.direction}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { lang } = Route.useLoaderData();

  return (
    <RootDocument>
      <LanguageProvider serverLanguage={lang}>
        <RootProviders>
          <Outlet />
        </RootProviders>
      </LanguageProvider>
    </RootDocument>
  );
}
