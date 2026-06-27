import { createFileRoute, useParams } from "@tanstack/react-router";
import { CourseDetail } from "@/components/dashboard/CourseDetail";

export const Route = createFileRoute("/editor/academy/$id")({ component: Page });

function Page() {
  const { id } = useParams({ from: "/editor/academy/$id" });
  return <CourseDetail id={id} basePath="/editor/academy" />;
}