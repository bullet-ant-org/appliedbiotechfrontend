import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { useShop } from "@/lib/shop";

export const Route = createFileRoute("/shop")({
  component: ShopLayout,
  head: () => ({
    meta: [
      { title: "Shop · Applied Biotech" },
      { name: "description", content: "Lab equipment, reagents and consumables — curated, in stock and ready to ship." },
    ],
  }),
});

function ShopSubNav() {
  const { cartCount, wishlistCount } = useShop();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  const links = [
    { label: "All Products", to: "/shop" as const },
    { label: "Deals", to: "/shop/deals" as const },
    { label: "Track Order", to: "/shop/track" as const },
  ];

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/shop/search", search: { q: q.trim() } });
      setSearchOpen(false);
    }
  }

  function isActive(to: string, params?: any) {
    if (to === "/shop") return path === "/shop";
    if (params?.slug) return path === `/shop/category/${params.slug}`;
    return path === to;
  }

  return (
    <div className="sticky top-16 lg:top-20 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="lg:hidden inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground shrink-0">
            <Menu className="h-4 w-4" /> Browse
          </span>
          {links.map((l, i) => {
            const active = isActive(l.to, (l as any).params);
            const cls = `shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              active ? "bg-brand/10 text-brand" : "text-foreground/70 hover:text-foreground hover:bg-accent"
            }`;
            return (l as any).params ? (
              <Link key={i} to={l.to as any} params={(l as any).params} className={cls}>{l.label}</Link>
            ) : (
              <Link key={i} to={l.to as any} className={cls}>{l.label}</Link>
            );
          })}
        </div>
        <form onSubmit={onSearchSubmit} className="hidden md:flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full h-9 pl-9 pr-3 rounded-full bg-secondary text-sm border border-transparent focus:border-brand focus:outline-none transition-colors"
            />
          </div>
          <button type="submit" className="hidden lg:inline-flex h-9 px-4 rounded-full gradient-brand text-brand-foreground text-xs font-bold">Search</button>
        </form>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="md:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-accent text-foreground/80 transition-colors">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link to="/shop/wishlist" aria-label="Wishlist" className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-accent text-foreground/80 transition-colors">
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-accent-cyan text-foreground grid place-items-center">{wishlistCount}</span>
            )}
          </Link>
          <Link to="/shop/cart" aria-label="Cart" className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-accent text-foreground/80 transition-colors">
            <ShoppingCart className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold gradient-brand text-brand-foreground grid place-items-center animate-pulse-ring">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
      {searchOpen && (
        <div className="md:hidden border-t border-border px-4 py-3">
          <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full h-10 pl-9 pr-3 rounded-full bg-secondary text-sm border border-transparent focus:border-brand focus:outline-none"
              />
            </div>
            <button type="submit" className="h-10 px-4 rounded-full gradient-brand text-brand-foreground text-xs font-bold">Go</button>
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close" className="h-10 w-10 grid place-items-center rounded-full hover:bg-accent"><X className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </div>
  );
}

function ShopLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 lg:pt-20">
        <ShopSubNav />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
