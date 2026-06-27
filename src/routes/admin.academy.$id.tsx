import { createFileRoute, useParams } from "@tanstack/react-router";
import { CourseDetail } from "@/components/dashboard/CourseDetail";

export const Route = createFileRoute("/admin/academy/$id")({ component: Page });

function Page() {
  const { id } = useParams({ from: "/admin/academy/$id" });
  return <CourseDetail id={id} basePath="/admin/academy" />;
}