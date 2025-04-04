import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_main/blog")({
  loader: async ({ params }) => {
    const lang = params.lang;
    return { lang };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
