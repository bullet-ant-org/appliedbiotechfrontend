import { createFileRoute } from "@tanstack/react-router";
import { GalleryDashboard } from "@/components/dashboard/GalleryDashboard";

export const Route = createFileRoute("/admin/gallery")({ component: () => <GalleryDashboard /> });