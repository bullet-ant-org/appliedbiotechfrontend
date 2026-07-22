import { Link, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function FloatingHome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/editor")) return null;

  return (
    <Link
      to="/"
      aria-label="Back to home"
      className="fixed left-4 top-20 lg:top-24 z-30 inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2.5 text-sm font-semibold shadow-soft hover:border-brand/40 transition-colors"
    >
      <Home className="h-4 w-4" /> Home
    </Link>
  );
}
