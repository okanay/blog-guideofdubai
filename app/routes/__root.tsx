import globals from "@/globals.css?url";
import { getLanguageFromCookie, getLanguageFromHeader } from "@/i18n/action";
import { ACTIVE_LANGUAGE_DICTONARY, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/i18n/config"; // prettier-ignore
import LanguageProvider from "@/i18n/provider";
import { RootProviders } from "@/providers";
import { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext, redirect } from "@tanstack/react-router"; // prettier-ignore
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const getRequestHeaders = createServerFn({
  method: "GET",
}).handler(async () => {
  const headers = getHeaders();
  return { headers };
});

interface Context {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<Context>()({
  loader: async (ctx) => {
    try {
      const searchParams = new URLSearchParams(ctx.location.search);
      const langParam = searchParams.get("lang") as Language | null;

      // Dil parametresi kontrolü
      let selectedLang: Language | string;
      let shouldRedirect = false;

      // 1. URL'de lang parametresi kontrolü
      if (langParam && SUPPORTED_LANGUAGES.includes(langParam as Language)) {
        // Lang parametresi var ve desteklenen diller içinde
        selectedLang = langParam;

        // Aktif diller içinde olup olmadığını kontrol et
        if (
          !ACTIVE_LANGUAGE_DICTONARY.some(
            (entry) => entry.value === selectedLang,
          )
        ) {
          // Aktif diller içinde değilse, varsayılan aktif dile yönlendir
          selectedLang =
            ACTIVE_LANGUAGE_DICTONARY[0]?.value || DEFAULT_LANGUAGE;
          shouldRedirect = true;
        }
      } else {
        // Lang parametresi yok veya desteklenmeyen bir dil
        shouldRedirect = true;

        // Diğer kaynaklardan dil belirle
        const { headers } = await getRequestHeaders();
        const cookieLang = getLanguageFromCookie(headers["cookie"] || "");
        const headerLang = getLanguageFromHeader(headers["accept-language"]);

        // Cookie'den veya header'dan dil tespiti
        if (
          cookieLang &&
          ACTIVE_LANGUAGE_DICTONARY.some((entry) => entry.value === cookieLang)
        ) {
          selectedLang = cookieLang;
        } else if (
          headerLang &&
          ACTIVE_LANGUAGE_DICTONARY.some((entry) => entry.value === headerLang)
        ) {
          selectedLang = headerLang;
        } else {
          // Hiçbir şekilde aktif dil bulunamadıysa, varsayılan aktif dili kullan
          selectedLang =
            ACTIVE_LANGUAGE_DICTONARY[0]?.value || DEFAULT_LANGUAGE;
        }
      }

      // Yönlendirme gerekiyorsa
      if (shouldRedirect) {
        // Type-safe bir şekilde redirect kullanımı
        return redirect({
          to: ctx.location.pathname,
          search: {
            lang: selectedLang,
          } as any,
        });
      }

      // Yönlendirme gerekmiyorsa normal akışa devam et
      return {
        lang: selectedLang,
      };
    } catch (error) {
      console.error("Language detection error:", error);
      return {
        lang: ACTIVE_LANGUAGE_DICTONARY[0]?.value || DEFAULT_LANGUAGE,
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
  const language = ACTIVE_LANGUAGE_DICTONARY.find(
    (entry) => entry.value === lang,
  );

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

export const queryClient = new QueryClient();

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
