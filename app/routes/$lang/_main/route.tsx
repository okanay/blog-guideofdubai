// app/routes/(languages)/route.tsx
import { RootFooter } from "@/components/footer";
import { RootHeader } from "@/components/header";
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
      <Outlet />
      <RootFooter />
    </Fragment>
  );
}
