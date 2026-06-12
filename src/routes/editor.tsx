import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { DashboardShell, type NavGroup } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, GraduationCap, ShoppingBag, Layers, User, Image, FileText, Newspaper, Phone, Tag, Receipt } from "lucide-react";

export const Route = createFileRoute("/editor")({
  component: EditorLayout,
  head: () => ({ meta: [{ title: "Editor Dashboard — Applied Biotech" }] }),
});

const groups: NavGroup[] = [
  { label: "Workspace", items: [{ label: "Overview", to: "/editor", icon: LayoutDashboard }] },
  { label: "Content", items: [
    { label: "Academy", to: "/editor/academy", icon: GraduationCap },
    { label: "Shop Items", to: "/editor/shop", icon: ShoppingBag },
    { label: "Collections", to: "/editor/collections", icon: Layers },
    { label: "Deal of the Week", to: "/editor/deal", icon: Tag },
    { label: "Orders", to: "/editor/orders", icon: Receipt, badge: "12" },
    { label: "News", to: "/editor/news", icon: Newspaper },
    { label: "Gallery", to: "/editor/gallery", icon: Image },
    { label: "Contact Info", to: "/editor/contact", icon: Phone },
    { label: "Drafts", to: "/editor/drafts", icon: FileText, badge: "4" },
    { label: "Media Library", to: "/editor/media", icon: Image },
  ] },
  { label: "Account", items: [{ label: "My Profile", to: "/editor/profile", icon: User }] },
];

function EditorLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "editor" && user.role !== "admin") return <Navigate to="/login" />;
  return <DashboardShell groups={groups} brandLabel="Editor Studio"><Outlet /></DashboardShell>;
}