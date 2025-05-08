import { DEFAULT_LANGUAGE, LANGUAGE_DICTONARY, SUPPORTED_LANGUAGES } from "@/i18n/config"; // prettier-ignore
import { RootProviders } from "@/providers";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"; // prettier-ignore
import { getHeaders } from "@tanstack/react-start/server";

import globals from "@/globals.css?url";
import { getLanguageFromCookie, getLanguageFromHeader } from "@/i18n/action";
import LanguageSynchronizer from "@/i18n/language-synchronizer";
import LanguageProvider from "@/i18n/provider";
import { createServerFn } from "@tanstack/react-start";

export const getRequestHeaders = createServerFn({
  method: "GET",
}).handler(async () => {
  const headers = getHeaders();
  return { headers };
});

export const Route = createRootRoute<{}>({
  loader: async (ctx) => {
    try {
      const searchParams = new URLSearchParams(ctx.location.search);
      const langParam = searchParams.get("lang");

      // 1. Search Param doğru ise onu döndür.
      if (langParam && SUPPORTED_LANGUAGES.includes(langParam as Language)) {
        return {
          lang: langParam,
        };
      }

      const { headers } = await getRequestHeaders();
      const cookieLang = getLanguageFromCookie(headers["cookie"] || "");
      const headerLang = getLanguageFromHeader(headers["accept-language"]);

      // 2. Cookie'de varsa, redirect ile lang paramı ekle
      if (cookieLang) {
        return {
          lang: cookieLang,
        };
      }

      // 3. Header'dan tespit et, redirect ile lang paramı ekle ve cookie'yi set et
      if (headerLang) {
        return {
          lang: headerLang,
        };
      }

      return {
        lang: DEFAULT_LANGUAGE,
      };
    } catch {
      return {
        lang: DEFAULT_LANGUAGE,
      };
    }
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
        <LanguageSynchronizer />
        <RootProviders>
          <Outlet />
        </RootProviders>
      </LanguageProvider>
    </RootDocument>
  );
}
