import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Package, Heart, MapPin, CreditCard, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useShop } from "@/lib/shop";

export const Route = createFileRoute("/shop/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account · Applied Biotech Shop" }] }),
});

function AccountPage() {
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useShop();

  if (!user) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-secondary grid place-items-center mb-6"><User className="h-10 w-10 text-muted-foreground" /></div>
          <h1 className="font-display text-3xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-muted-foreground">Track orders, save addresses and access your wishlist anywhere.</p>
          <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand hover:scale-105 transition-transform">
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
        </div>
      </section>
    );
  }

  const tiles = [
    { icon: Package, label: "Orders", value: "0", to: "/shop/account" as const },
    { icon: Heart, label: "Wishlist", value: String(wishlistCount), to: "/shop/wishlist" as const },
    { icon: MapPin, label: "Addresses", value: "1", to: "/shop/account" as const },
    { icon: CreditCard, label: "Cart", value: String(cartCount), to: "/shop/cart" as const },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="bg-card border border-border rounded-3xl p-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-xl">
            {(user?.name || "User").split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map((t, i) => (
            <Link key={i} to={t.to} className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-brand/10 text-brand mb-3"><t.icon className="h-5 w-5" /></div>
              <div className="text-2xl font-display font-bold">{t.value}</div>
              <div className="text-xs text-muted-foreground">{t.label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg">Recent orders</h2>
          <div className="mt-4 text-sm text-muted-foreground text-center py-12">
            You haven't placed any orders yet.
          </div>
        </div>
      </div>
    </section>
  );
}
