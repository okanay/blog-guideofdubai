import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <main>Index</main>;
}
