import { Link } from "@tanstack/react-router";
import { Heart, Plus, Eye, Star } from "lucide-react";
import { useShop } from "@/lib/shop";
import { fmt, type Product } from "@/lib/products";

export function ProductCard({ p }: { p: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const wished = inWishlist(p.id);
  return (
    <div className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:shadow-brand hover:-translate-y-1 transition-all duration-300">
      {p.tag && (
        <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          p.tag === "HOT" ? "bg-destructive text-destructive-foreground"
          : p.tag === "SALE" ? "gradient-brand text-brand-foreground"
          : "bg-foreground text-background"
        }`}>{p.tag}</span>
      )}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}
          aria-label="Wishlist"
          className={`h-8 w-8 grid place-items-center rounded-full shadow transition-colors ${wished ? "bg-brand text-brand-foreground" : "bg-background/95 hover:bg-brand hover:text-brand-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
        <Link to="/shop/product/$id" params={{ id: p.id }} aria-label="Quick view" className="h-8 w-8 grid place-items-center rounded-full bg-background/95 shadow hover:bg-brand hover:text-brand-foreground transition-colors">
          <Eye className="h-4 w-4" />
        </Link>
      </div>
      <Link to="/shop/product/$id" params={{ id: p.id }} className="block aspect-square overflow-hidden bg-secondary/50">
        <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-0.5 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < p.rating ? "fill-accent-cyan text-accent-cyan" : "text-border"}`} />
          ))}
        </div>
        <Link to="/shop/product/$id" params={{ id: p.id }} className="font-medium text-sm text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors block">
          {p.name}
        </Link>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="font-display font-bold text-lg text-foreground">{fmt(p.price)}</div>
            {p.oldPrice && <div className="text-xs text-muted-foreground line-through">{fmt(p.oldPrice)}</div>}
          </div>
          <button
            onClick={() => addToCart(p.id)}
            aria-label="Add to cart"
            className="h-9 w-9 grid place-items-center rounded-full gradient-brand text-brand-foreground shadow-brand hover:scale-110 transition-transform"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
