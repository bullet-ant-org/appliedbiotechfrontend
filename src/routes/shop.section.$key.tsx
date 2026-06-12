import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import useFetch from "@/hooks/useFetch";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/shop/section/$key")({
  component: SectionPage,
  head: ({ params }) => ({
    meta: [{ title: `${SECTION_META[params?.key as string]?.title ?? "Products"} · Applied Biotech Shop` }],
  }),
});

const SECTION_META: Record<string, { title: string; eyebrow: string; pick: (products: any[]) => any[] }> = {
  featured: { title: "Featured Products", eyebrow: "Featured", pick: (p) => p.slice(0, 12) },
  "top-rated": { title: "Customer Favorites", eyebrow: "Top Rated", pick: (p) => p.slice(0, 12) },
  "best-sellers": { title: "Best Selling Products", eyebrow: "Best Sellers", pick: (p) => p.slice(Math.min(7, p.length)) },
  "new-arrivals": { title: "Latest Products", eyebrow: "New Arrivals", pick: (p) => [...p].reverse() },
};

function SectionPage() {
  const { key } = Route.useParams();
  const meta = SECTION_META[key];
  const [products, setProducts] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/shop/products").then((res) => {
      if (res) {
        const normalized = res.map((p: any) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          stock: p.stock,
          status: p.status,
          img: p.productImage,
          category: p.category,
          description: p.description,
          rating: 5,
          tags: p.tags || [],
        }));
        setProducts(normalized);
      }
    });
  }, [fetchData]);

  const items = useMemo(() => (meta ? meta.pick(products) : []), [meta, products]);

  if (!meta) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Section not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Back to shop →</Link>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All products
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">{meta.eyebrow}</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{meta.title}</h1>
        <p className="mt-2 text-muted-foreground">{items.length} products</p>

        {loading && items.length === 0 ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products available in this section yet.</p>
            <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Browse all →</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
