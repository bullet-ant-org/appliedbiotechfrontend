import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import useFetch from "@/hooks/useFetch";
import { Loader2, Tag, ArrowRight, Flame } from "lucide-react";

export const Route = createFileRoute("/shop/deals")({
  component: DealsPage,
  head: () => ({ meta: [{ title: "Deals · Applied Biotech Shop" }] }),
});


function FeaturedCarousel({ items }: { items: any[] }) {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(true);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setZoomed(false);
      setTimeout(() => { setIdx((p) => (p + 1) % items.length); setZoomed(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const item = items[idx];
  const name = item.name || item.headline || item.product?.productName || "";
  const description = item.description || item.blurb || item.product?.description || "";
  const imageUrl = item.imageUrl || item.product?.productImage || "";

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-brand" style={{ background: "linear-gradient(75deg, #5c3a05 0%, #92670f 14%, #c9961f 28%, #f0c33d 42%, #fbe18a 56%, #f0c33d 70%, #c9961f 84%, #7a5208 100%)" }}>
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.7) 48%, transparent 60%)" }} />
      <div className="relative grid md:grid-cols-2 items-center min-h-[280px]">
        <div
          className="p-8 md:p-12"
          style={{ transition: "opacity 0.4s ease, transform 0.4s ease", opacity: zoomed ? 1 : 0, transform: zoomed ? "translateY(0)" : "translateY(10px)" }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#241502] font-bold flex items-center gap-2 mb-3">
            <Tag className="h-3.5 w-3.5" /> Featured
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#241502] leading-tight">{name}</h2>
          {description && <p className="mt-3 text-[#3a2305]/90 text-sm leading-relaxed max-w-md">{description}</p>}
          {items.length > 1 && (
            <div className="flex gap-2 mt-6">
              {items.map((_, i) => (
                <button key={i} onClick={() => { setZoomed(false); setTimeout(() => { setIdx(i); setZoomed(true); }, 300); }}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[#241502]" : "w-2 bg-[#241502]/30"}`} />
              ))}
            </div>
          )}
        </div>
        <div
          className="relative hidden md:block h-full min-h-[280px]"
          style={{ transition: "transform 0.4s ease, opacity 0.4s ease", transform: zoomed ? "scale(1)" : "scale(0.93)", opacity: zoomed ? 1 : 0 }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#92670f]/20 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}

function DealsPage() {
  const [hotDeals, setHotDeals] = useState<any[]>([]);
  const [dealOfWeek, setDealOfWeek] = useState<any>(null);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    Promise.all([
      fetchData("/api/v1/shop/products"),
      fetchData("/api/v1/shop/deal-of-the-week").catch(() => null),
      fetchData("/api/v1/shop/featured-product").catch(() => null),
    ]).then(([products, deal, feat]) => {
      if (products) {
        // Backend auto-tags low-stock (>0, <5) items as "hot"
        const hot = products
          .filter((p: any) => {
            const tags: string[] = p.tags || [];
            return tags.includes("hot") || (p.stock > 0 && p.stock < 5);
          })
          .map((p: any) => ({
            id: p._id,
            name: p.productName,
            price: p.price,
            img: p.productImage,
            category: p.category,
            rating: 5,
            stock: p.stock,
            tags: p.tags || [],
          }));
        setHotDeals(hot);
      }
      if (deal && deal.product) setDealOfWeek(deal);
      if (Array.isArray(feat) && feat.length > 0) setFeaturedItems(feat);
      else if (feat && (feat.name || feat.headline)) setFeaturedItems([feat]);
      else if (feat && feat.product) setFeaturedItems([feat]);
    });
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl space-y-12">

        {/* Hero header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-[0.18em]">
            <Flame className="h-3.5 w-3.5" /> Limited Time
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-3">Hot Deals & Offers</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">Hand-picked offers on lab essentials, refreshed weekly.</p>
        </div>

        {/* Deal of the Week banner */}
        {dealOfWeek && dealOfWeek.product && (
          <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-foreground text-background shadow-brand relative">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full gradient-brand opacity-20 blur-3xl" />
            <div className="p-8 md:p-12 relative flex flex-col justify-center">
              <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" /> {dealOfWeek.eyebrow || "Deal of the Week"}
              </div>
              <h2 className="mt-3 font-display text-2xl md:text-4xl font-extrabold leading-tight">
                {dealOfWeek.headline}
              </h2>
              <p className="mt-3 text-background/70 max-w-md">{dealOfWeek.blurb}</p>
              <div className="mt-5 flex items-center gap-4 flex-wrap">
                <div className="font-display text-3xl font-bold text-accent-cyan">
                  ₦{(dealOfWeek.salePrice || 0).toLocaleString()}
                </div>
                {dealOfWeek.oldPrice > 0 && (
                  <div className="text-background/50 line-through text-xl">
                    ₦{(dealOfWeek.oldPrice).toLocaleString()}
                  </div>
                )}
                {dealOfWeek.discountLabel && (
                  <span className="px-3 py-1 rounded-full bg-accent-cyan text-foreground text-xs font-bold">
                    {dealOfWeek.discountLabel}
                  </span>
                )}
              </div>
              <Link
                to="/shop/product/$id"
                params={{ id: dealOfWeek.product._id || dealOfWeek.product }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-bold hover:scale-105 transition-transform self-start"
              >
                Shop This Deal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[240px]">
              {(dealOfWeek.product?.productImage) && (
                <img
                  src={dealOfWeek.product.productImage}
                  alt={dealOfWeek.product.productName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Featured items — gold gradient, zoom animation */}
        {featuredItems.length > 0 && (
          <FeaturedCarousel items={featuredItems} />
        )}


        {/* Hot deals grid */}
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-brand" /> Low Stock — Get Them While They Last
          </h2>
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : hotDeals.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground rounded-2xl border border-dashed border-border">
              No hot deals at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {hotDeals.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
