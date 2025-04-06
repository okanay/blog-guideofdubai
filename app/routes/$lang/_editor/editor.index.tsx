import { EditorPage } from "@/components/editor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_editor/editor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditorPage />;
}
