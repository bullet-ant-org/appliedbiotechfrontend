import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { ChevronLeft, ChevronRight, ShieldCheck, Headphones, RotateCcw, Loader2, Package } from "lucide-react";
import hero1 from "@/assets/shop-hero-1.jpg";
import hero2 from "@/assets/shop-hero-2.jpg";
import { CATEGORIES, fmt, getProduct } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { useSiteContent } from "@/lib/site-content";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/shop/")({ component: ShopHome });

const slides = [
  { img: hero1, eyebrow: "Limited Time", title: "Great Deals on Lab Essentials", sub: "Up to 30% off select consumables and reagents. While stocks last.", cta: "Shop Deals", to: "/shop/deals" as const },
  { img: hero2, eyebrow: "New Arrival", title: "Agarose · Molecular Grade", sub: "Premium-quality reagents for reliable, reproducible results.", cta: "Browse Reagents", to: "/shop/category/$slug" as const, slug: "reagents" },
];

function HeroCarousel() {
  const [i, setI] = useState(0);
  const [zoomed, setZoomed] = useState(true);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const { fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/shop/featured-product")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setFeaturedItems(res);
        else if (res && (res.name || res.headline)) setFeaturedItems([res]);
        else if (res && res.product) setFeaturedItems([res]);
      })
      .catch(() => {});
  }, [fetchData]);

  const allSlides = useMemo(() => {
    const featSlides = featuredItems.map((f) => ({
      img: f.imageUrl || f.product?.productImage || "",
      eyebrow: "Featured",
      title: f.name || f.headline || f.product?.productName || "",
      sub: f.description || f.blurb || f.product?.description || "",
      gold: true,
    }));
    return [...featSlides, ...slides];
  }, [featuredItems]);

  useEffect(() => {
    const t = setInterval(() => {
      setZoomed(false);
      setTimeout(() => { setI((p) => (p + 1) % allSlides.length); setZoomed(true); }, 350);
    }, 5500);
    return () => clearInterval(t);
  }, [allSlides.length]);
  const next = () => { setZoomed(false); setTimeout(() => { setI((p) => (p + 1) % allSlides.length); setZoomed(true); }, 300); };
  const prev = () => { setZoomed(false); setTimeout(() => { setI((p) => (p - 1 + allSlides.length) % allSlides.length); setZoomed(true); }, 300); };
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mx-auto max-w-7xl relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/40 via-secondary to-accent/30 shadow-soft">
        <div className="relative min-h-[380px] md:min-h-[440px]">
          {allSlides.map((s: any, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 grid md:grid-cols-2 items-center transition-all duration-700 ${i === idx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}
              style={s.gold ? { background: "linear-gradient(75deg, #5c3a05 0%, #92670f 14%, #c9961f 28%, #f0c33d 42%, #fbe18a 56%, #f0c33d 70%, #c9961f 84%, #7a5208 100%)" } : undefined}
            >
              <div className="p-8 md:p-14 order-2 md:order-1 relative z-10">
                <span className={`inline-block text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full ${s.gold ? "bg-black/20 text-white" : "bg-brand/10 text-brand"}`}>{s.eyebrow}</span>
                <h1 className={`mt-4 font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight ${s.gold ? "text-[#241502]" : "text-foreground"}`}>{s.title}</h1>
                <p className={`mt-4 text-base md:text-lg max-w-md ${s.gold ? "text-[#3a2305]/90" : "text-muted-foreground"}`}>{s.sub}</p>
                {!s.gold && (
                  s.slug ? (
                    <Link to="/shop/category/$slug" params={{ slug: s.slug as string }} className="mt-7 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-3.5 text-sm font-bold shadow-brand hover:scale-105 transition-transform">
                      {s.cta} <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link to="/shop/deals" className="mt-7 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-7 py-3.5 text-sm font-bold shadow-brand hover:scale-105 transition-transform">
                      {s.cta} <ChevronRight className="h-4 w-4" />
                    </Link>
                  )
                )}
              </div>
              <div className="order-1 md:order-2 hidden md:block h-full relative overflow-hidden md:rounded-l-[3rem]">
                {s.img && <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: (i === idx && zoomed) ? "scale(1)" : "scale(1.06)", opacity: (i === idx && zoomed) ? 1 : 0.8 }} />}
              </div>
            </div>
          ))}
        </div>
        <button aria-label="Previous" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur shadow hover:bg-background transition-colors"><ChevronLeft className="h-5 w-5" /></button>
        <button aria-label="Next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur shadow hover:bg-background transition-colors"><ChevronRight className="h-5 w-5" /></button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {allSlides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${i === idx ? "w-8 gradient-brand" : "w-2 bg-foreground/25 hover:bg-foreground/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoStrip() {
  const items = [
    { icon: ShieldCheck, title: "Secure Payment", sub: "100% protected", link: null },
    { icon: RotateCcw, title: "Easy Returns", sub: "14-day window", link: null },
    { icon: Headphones, title: "24/7 Support", sub: "We're here to help", link: "/contact" },
    { icon: Package, title: "Request a Product", sub: "Can't find it? Ask us", link: "/shop/request" },
  ];
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it, i) => {
          const content = (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:shadow-soft hover:-translate-y-0.5 transition-all">
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-brand/10 text-brand shrink-0"><it.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">{it.title}</div>
                <div className="text-xs text-muted-foreground truncate">{it.sub}</div>
              </div>
            </div>
          );

          if (it.link) {
            return (
              <Link key={i} to={it.link} className="block">
                {content}
              </Link>
            );
          }

          return <div key={i}>{content}</div>;
        })}
      </div>
    </section>
  );
}

function CollectionGrid({ collections }: { collections: any[] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">Browse</div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">Shop by Collection</h2>
          </div>
          <Link to="/collections" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {collections.slice(0, 6).map((c) => (
            <Link key={c._id} to="/collections/$id" params={{ id: c._id }} className="group relative aspect-square rounded-2xl bg-muted border border-border p-4 flex flex-col justify-between text-left hover:shadow-brand hover:-translate-y-1 transition-all overflow-hidden">
              {c.coverImage && <img src={c.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white/80">{c.items?.length || 0} items</div>
              <div className="relative z-10 font-display font-bold text-white line-clamp-2 leading-tight">{c.collectionName}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ title, eyebrow, items, sectionKey }: { title: string; eyebrow: string; items: any[]; sectionKey: string }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">{eyebrow}</div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">{title}</h2>
          </div>
          <Link to="/shop/section/$key" params={{ key: sectionKey }} className="text-sm font-semibold text-brand hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function DealBanner({ deal }: { deal: any }) {
  if (!deal || !deal.product) return null;

  // Backend usually populates the product object
  const product = deal.product;
  const productId = product._id || product;
  const productImg = product.productImage;
  const productName = product.productName;

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 rounded-3xl overflow-hidden bg-foreground text-background relative">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full gradient-brand opacity-30 blur-3xl" />
        <div className="p-10 md:p-14 relative">
          <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold">{deal.eyebrow}</div>
          <h3 className="mt-3 font-display text-3xl md:text-5xl font-extrabold leading-tight"><span className="gradient-text">{deal.headline}</span></h3>
          <p className="mt-4 text-background/70 max-w-md">{deal.blurb}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="font-display text-3xl font-bold text-accent-cyan">₦{(deal.salePrice || 0).toLocaleString()}</div>
            <div className="text-background/50 line-through">₦{(deal.oldPrice || 0).toLocaleString()}</div>
            <span className="px-2 py-0.5 rounded-full bg-accent-cyan text-foreground text-xs font-bold">{deal.discountLabel}</span>
          </div>
          <Link to="/shop/product/$id" params={{ id: productId }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-bold hover:scale-105 transition-transform">
            Shop the Deal <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[300px]"><img src={productImg} alt={productName} loading="lazy" className="absolute inset-0 w-full h-full object-cover" /></div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-14 mb-14">
      <div className="mx-auto max-w-5xl reveal text-center rounded-3xl bg-gradient-to-br from-secondary via-accent/30 to-secondary p-10 md:p-14 border border-border">
        <h3 className="font-display text-2xl md:text-3xl font-bold">Get 10% off your first order</h3>
        <p className="mt-2 text-muted-foreground">Join our newsletter for product drops, lab tips and exclusive deals.</p>
        <form onSubmit={(e) => { e.preventDefault(); (e.currentTarget.querySelector("input") as HTMLInputElement).value = ""; import("sonner").then(({ toast }) => toast.success("Subscribed! Check your inbox.")); }} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input type="email" required placeholder="you@lab.com" className="flex-1 h-12 px-5 rounded-full bg-background border border-border focus:border-brand focus:outline-none text-sm" />
          <button className="h-12 px-7 rounded-full gradient-brand text-brand-foreground font-bold text-sm shadow-brand hover:scale-105 transition-transform">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function ShopHome() {
  useReveal();
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [deal, setDeal] = useState<any>(null);
  const [topOrderedIds, setTopOrderedIds] = useState<string[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    const load = async () => {
      const [prodRes, collRes, dealRes] = await Promise.all([
        fetchData("/api/v1/shop/products"),
        fetchData("/api/v1/collections"),
        fetchData("/api/v1/shop/deal-of-the-week")
      ]);

      if (prodRes) {
        const normalized = prodRes.map((p: any) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          stock: p.stock,
          status: p.status,
          img: p.productImage,
          category: p.category,
          description: p.description,
          rating: 5
        }));
        setProducts(normalized);
      }
      if (collRes) setCollections(collRes);
      if (dealRes) setDeal(dealRes);

      // Rank products by how often they've actually been ordered (admin/editor-style aggregation)
      try {
        const ordersRes = await fetchData("/api/v1/payments/orders-ledger");
        if (Array.isArray(ordersRes)) {
          const countMap: Record<string, number> = {};
          ordersRes.forEach((o: any) => {
            (o.items || []).forEach((it: any) => {
              const pid = it.product?._id || it.product;
              if (!pid) return;
              countMap[pid] = (countMap[pid] || 0) + (it.quantity || 1);
            });
          });
          const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]).map(([id]) => id);
          setTopOrderedIds(sorted);
        }
      } catch (err) {
        // Guests don't have access to this staff-only endpoint — fall back gracefully below
      }
    };
    load();
    fetchData("/api/v1/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "shop" }),
    }).catch(() => {});
  }, [fetchData]);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  const topRated = useMemo(() => {
    if (topOrderedIds.length > 0) {
      const byId = new Map(products.map((p) => [p.id, p]));
      const ranked = topOrderedIds.map((id) => byId.get(id)).filter(Boolean) as any[];
      if (ranked.length > 0) return ranked.slice(0, 4);
    }
    return products.slice(4, 8).length > 0 ? products.slice(4, 8) : products.slice(0, 4);
  }, [products, topOrderedIds]);

  const bestSellers = useMemo(() => products.slice(Math.min(7, products.length), Math.min(11, products.length)), [products]);
  const newArrivals = useMemo(() => products.slice(-4), [products]);

  return (
    <>
      <HeroCarousel />
      <PromoStrip />
      {loading && products.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <CollectionGrid collections={collections} />
          <ProductSection eyebrow="Featured" title="Featured Products" items={featured} sectionKey="featured" />
          <ProductSection eyebrow="Top Rated" title="Customer Favorites" items={topRated} sectionKey="top-rated" />
          <DealBanner deal={deal} />
          <ProductSection eyebrow="Best Sellers" title="Best Selling Products" items={bestSellers} sectionKey="best-sellers" />
          <ProductSection eyebrow="New Arrivals" title="Latest Products" items={newArrivals} sectionKey="new-arrivals" />
          <Newsletter />
        </>
      )}
    </>
  );
}
