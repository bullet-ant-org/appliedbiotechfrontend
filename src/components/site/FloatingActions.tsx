import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, GraduationCap } from "lucide-react";

export function FloatingActions() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/editor")) return null;

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <Link
        to="/shop"
        className="group flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-105"
      >
        <ShoppingCart className="h-4 w-4" />
        Shop
      </Link>
      <Link
        to="/academy"
        className="group flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-transform hover:scale-105"
      >
        <GraduationCap className="h-4 w-4" />
        Academy
      </Link>
    </div>
  );
}
