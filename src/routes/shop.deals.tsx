import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import useFetch from "@/hooks/useFetch";
import { Loader2, Tag, ArrowRight, Flame } from "lucide-react";

export const Route = createFileRoute("/shop/deals")({
  component: DealsPage,
  head: () => ({ meta: [{ title: "Deals · Applied Biotech Shop" }] }),
});

function DealsPage() {
  const [hotDeals, setHotDeals] = useState<any[]>([]);
  const [dealOfWeek, setDealOfWeek] = useState<any>(null);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    Promise.all([
      fetchData("/api/v1/shop/products"),
      fetchData("/api/v1/shop/deal-of-the-week").catch(() => null),
    ]).then(([products, deal]) => {
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
