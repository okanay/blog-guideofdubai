import { createFileRoute, Outlet } from "@tanstack/react-router";
import editorStyles from "@/components/styles.css?url";

export const Route = createFileRoute("/$lang/_editor")({
  head: () => {
    return {
      meta: [],
      links: [
        {
          rel: "preload stylesheet",
          as: "style",
          type: "text/css",
          crossOrigin: "anonymous",
          href: editorStyles,
        },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
