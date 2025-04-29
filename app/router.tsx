// @ts-ignore
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultNotFound } from "./routes/blog/not-found";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "false",
    defaultNotFoundComponent: () => <DefaultNotFound />,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
