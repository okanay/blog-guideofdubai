import { createFileRoute } from "@tanstack/react-router";
import { StatsPage } from "@/components/editor/pages/stats";

export const Route = createFileRoute("/blog/_auth/_editor/editor/stats")({
  component: StatsPage,
});
