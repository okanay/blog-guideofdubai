import { seoTranslations } from "@/i18n/languages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_auth/login")({
  head: ({ params: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.auth.login.title,
        },
        {
          name: "description",
          content: seoData.auth.login.description,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <main>Login Page</main>;
}
