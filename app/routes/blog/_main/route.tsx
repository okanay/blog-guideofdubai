// app/routes/(languages)/route.tsx
import { RootFooter } from "@/components/footer";
import { RootHeader } from "@/components/header";
import { SearchProvider } from "@/components/search";
import { getLanguageFromSearch } from "@/i18n/action";
import { seoTranslations } from "@/i18n/languages";
import { useLanguage } from "@/i18n/use-language";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/blog/_main")({
  loader: async ({ location: { search } }) => {
    const lang = getLanguageFromSearch(search);
    return { lang };
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.root.title,
        },
        {
          name: "description",
          content: seoData.root.description,
        },
      ],
      links: [],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { language } = useLanguage();

  return (
    <Fragment>
      <RootHeader />
      <SearchProvider language={language}>
        <Outlet />
      </SearchProvider>
      <RootFooter />
    </Fragment>
  );
}
