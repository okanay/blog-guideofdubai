// @ts-ignore
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultNotFound } from "./routes/blog/not-found";
import { queryClient } from "./providers/query";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "false",
    defaultNotFoundComponent: () => <DefaultNotFound />,
    scrollRestoration: true,
    scrollBehavior: "instant",
  } as any);

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
