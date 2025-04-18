import { HeadContent, Outlet, Scripts, createRootRoute, redirect } from "@tanstack/react-router"; // prettier-ignore
import { LANGUAGE_DIRECTIONS, SUPPORTED_LANGUAGES } from "@/i18n/config";
import LanguageProvider from "@/i18n/provider";
import { detectLanguage } from "@/i18n/action";

import globals from "@/globals.css?url";
import { RootProviders } from "@/providers";

export const Route = createRootRoute({
  loader: async (ctx) => {
    // URL'den dil parametresini kontrol et
    const pathSegments = ctx.location.pathname.split("/");
    const langParam = pathSegments[1];
    const isValidLangParam = SUPPORTED_LANGUAGES.includes(
      langParam as Language,
    );

    // Eğer URL içinde geçerli bir dil parametresi yoksa
    if (ctx.location.pathname === "/" || !isValidLangParam) {
      const detectedLanguage = await detectLanguage();

      // Kök dizin ise dil yönlendirmesi yap
      if (ctx.location.pathname === "/") {
        throw redirect({
          to: `/${detectedLanguage}/`,
        });
      }

      // Geçersiz dil parametresi ise ve başka bir path ise
      // Aynı pathi doğru dille yönlendir
      if (!isValidLangParam && pathSegments.length > 1) {
        const restOfPath = pathSegments.slice(1).join("/");
        throw redirect({
          to: `/${detectedLanguage}/${restOfPath}`,
        });
      }
      return {
        lang: detectedLanguage,
      };
    } else {
      // Geçerli bir dil parametresi varsa, direkt kullan
      return {
        lang: langParam as Language,
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
          type: "image/svg",
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

  return (
    <html lang={lang} dir={LANGUAGE_DIRECTIONS[lang]}>
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
