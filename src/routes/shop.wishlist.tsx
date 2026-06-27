import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { useShop } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/shop/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Your Wishlist · Applied Biotech Shop" }] }),
});

function WishlistPage() {
  const { wishlist } = useShop();
  const [products, setProducts] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/shop/products").then(res => {
      if (res) {
        const normalized = res.map((p: any) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          img: p.productImage,
          category: p.category,
          rating: 5
        }));
        setProducts(normalized);
      }
    });
  }, [fetchData]);

  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">Saved for later</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Your Wishlist ({items.length})</h1>
        </div>
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-20 w-20 rounded-full bg-secondary grid place-items-center mb-6"><Heart className="h-10 w-10 text-muted-foreground" /></div>
            <h2 className="font-display text-2xl font-bold">No favorites yet</h2>
            <p className="mt-2 text-muted-foreground">Tap the heart on any product to save it for later.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand hover:scale-105 transition-transform">
              Browse products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
