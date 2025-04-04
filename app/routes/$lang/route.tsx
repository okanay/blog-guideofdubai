// app/routes/(languages)/route.tsx
import { RootFooter } from "@/components/footer";
import { RootHeader } from "@/components/header";
import { seoTranslations } from "@/i18n/languages";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/$lang")({
  beforeLoad: async ({ params: { lang }, ...rest }) => {
    if (rest.matches[rest.matches.length - 1].globalNotFound) {
      return { lang: "en", notFound: true };
    }
    return { lang, notFound: false };
  },
  loader: async ({ context }) => {
    return { lang: context.lang, notFound: context.notFound };
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
  const { notFound } = Route.useLoaderData();

  if (notFound) return <Outlet />;

  return (
    <Fragment>
      <RootHeader />
      <Outlet />
      <RootFooter />
    </Fragment>
  );
}
