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
      <div className="to-primary-50/70 fixed top-0 left-0 -z-10 h-svh w-full bg-gradient-to-t from-sky-50 via-zinc-50" />
      <Outlet />
      <RootFooter />
    </Fragment>
  );
}
