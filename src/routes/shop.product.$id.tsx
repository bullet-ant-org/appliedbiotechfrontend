import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, Heart, Plus, Minus, ShoppingBag, Truck, ShieldCheck, RotateCcw, ArrowLeft } from "lucide-react";
import { fmt } from "@/lib/products";
import { useShop } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";
import useFetch from "@/hooks/useFetch";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  const productionUrl = 'https://appliedbiotechbackend.onrender.com';
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) return productionUrl;
  }
  return envUrl || productionUrl;
};

export const Route = createFileRoute("/shop/product/$id")({
  component: ProductDetail,
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/v1/shop/products`);
      const all = await res.json();
      const p = all.find((x: any) => x._id === params.id);
      if (!p) throw notFound();
      return { 
        product: {
          id: p._id,
          name: p.productName,
          price: p.price,
          stock: p.stock,
          img: p.productImage,
          category: p.category,
          description: p.description,
          rating: 5,
          tags: p.tags || [],
          shippingNote: p.shippingNote || "",
          shippingFee: p.shippingFee || 0,
          shippingType: p.shippingType || "standalone",
          pickupAvailable: !!p.pickupAvailable,
        } 
      };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} · Applied Biotech Shop` },
      { name: "description", content: loaderData.product.description },
    ] : [],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="p-20 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Back to shop →</Link>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [qty, setQty] = useState(1);
  const wished = inWishlist(product.id);

  const [related, setRelated] = useState<any[]>([]);
  const { fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/shop/products").then(res => {
      if (res) {
        const all = res.map((p: any) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          img: p.productImage,
          category: p.category,
          rating: 5
        }));
        const sameCat = all.filter((p: any) => p.category === product.category && p.id !== product.id);
        const fillers = all.filter((p: any) => p.id !== product.id && !sameCat.some((s: any) => s.id === p.id));
        setRelated([...sameCat, ...fillers].slice(0, 4));
      }
    });
  }, [fetchData, product.category, product.id]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> All products</Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-3xl overflow-hidden bg-secondary aspect-square">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">{product.category}</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < product.rating ? "fill-accent-cyan text-accent-cyan" : "text-border"}`} />
              ))}
              <span className="text-sm text-muted-foreground">({product.rating}.0)</span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <div className="font-display font-extrabold text-4xl text-foreground">{fmt(product.price)}</div>
              {product.oldPrice && <div className="text-base text-muted-foreground line-through pb-1">{fmt(product.oldPrice)}</div>}
            </div>

            <p className="mt-5 text-foreground/80 leading-relaxed">{product.description}</p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {product.stock} in stock
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 grid place-items-center hover:bg-accent rounded-l-full"><Minus className="h-4 w-4" /></button>
                <span className="px-4 text-base font-semibold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11 grid place-items-center hover:bg-accent rounded-r-full"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => addToCart(product.id, qty)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-3 text-sm font-bold shadow-brand hover:scale-[1.02] transition-transform">
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
              <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" className={`h-11 w-11 grid place-items-center rounded-full border border-border transition-colors ${wished ? "bg-brand text-brand-foreground border-brand" : "hover:bg-accent"}`}>
                <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"><Truck className="h-4 w-4 text-brand" /> Free over ₦100k</div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"><ShieldCheck className="h-4 w-4 text-brand" /> Secure pay</div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"><RotateCcw className="h-4 w-4 text-brand" /> 14-day return</div>
            </div>

            {/* Product details: tags, shipping & pickup */}
            {(product.tags?.length > 0 || product.shippingNote || product.shippingFee > 0 || product.pickupAvailable) && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-5 space-y-3">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Purchase details</h3>

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wide">{t}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm">
                  <Truck className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">
                      {product.shippingFee > 0 ? `Shipping fee: ${fmt(product.shippingFee)}` : "Free shipping on this item"}
                      {product.shippingType === "bulk" && <span className="ml-2 text-xs text-muted-foreground">(Bulk shipping rate)</span>}
                    </div>
                    {product.shippingNote && <p className="text-muted-foreground mt-0.5">{product.shippingNote}</p>}
                  </div>
                </div>

                {product.pickupAvailable && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="font-medium">In-store pickup available</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
