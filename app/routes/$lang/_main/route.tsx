// app/routes/(languages)/route.tsx
import { RootFooter } from "@/components/footer";
import { RootHeader } from "@/components/header";
import { SearchProvider } from "@/components/search";
import { seoTranslations } from "@/i18n/languages";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/$lang/_main")({
  head: ({ params: { lang } }) => {
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
  return (
    <Fragment>
      <RootHeader />
      <SearchProvider>
        <Outlet />
      </SearchProvider>
      <RootFooter />
    </Fragment>
  );
}
