import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { DashboardShell, type NavGroup } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Layers, ShoppingBag, Settings, Globe, User, Users,
  GraduationCap, BarChart3, ShieldAlert, Receipt, Newspaper, Image, Phone, Tag, Briefcase,
  Mail,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin Dashboard — Applied Biotech" }] }),
});

const groups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/admin", icon: LayoutDashboard },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3, badge: "New" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Shop", to: "/admin/shop", icon: ShoppingBag },
      { label: "Collections", to: "/admin/collections", icon: Layers },
      { label: "Deal of the Week", to: "/admin/deal", icon: Tag },
      { label: "Orders", to: "/admin/orders", icon: Receipt },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Academy", to: "/admin/academy", icon: GraduationCap },
      { label: "News", to: "/admin/news", icon: Newspaper },
      { label: "Gallery", to: "/admin/gallery", icon: Image },
      { label: "Messages", to: "/admin/messages", icon: Mail },
      { label: "Careers", to: "/admin/careers", icon: Briefcase },
      { label: "Contact Info", to: "/admin/contact", icon: Phone },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users & Roles", to: "/admin/users", icon: Users },
      { label: "Website Settings", to: "/admin/settings", icon: Settings },
      { label: "Security", to: "/admin/security", icon: ShieldAlert },
      { label: "My Profile", to: "/admin/profile", icon: User },
    ],
  },
];

function AdminLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/editor" />;
  return (
    <DashboardShell groups={groups} brandLabel="Admin Console">
      <Outlet />
    </DashboardShell>
  );
}