import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/shop/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [{ title: `${params?.slug ?? ""} · Applied Biotech Shop` }],
  }),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);

  const [products, setProducts] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/shop/products").then(res => {
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
          rating: 5
        }));
        setProducts(normalized);
      }
    });
  }, [fetchData]);

  const items = products.filter((p) => p.category?.toLowerCase() === slug);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">Category</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1 capitalize">{cat?.name ?? slug}</h1>
          <p className="mt-2 text-muted-foreground">{items.length} products</p>
        </div>
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products in this category yet.</p>
              <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Browse all →</Link>
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
