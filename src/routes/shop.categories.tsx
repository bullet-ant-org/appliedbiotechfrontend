import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/shop/categories")({
  component: CategoriesIndex,
  head: () => ({ meta: [{ title: "All Collections · Applied Biotech Shop" }] }),
});

function CategoriesIndex() {
  const [collections, setCollections] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/collections").then(res => {
      if (res) setCollections(res);
    });
  }, [fetchData]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">Browse</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">All Collections</h1>
          <p className="mt-2 text-muted-foreground">Discover curated bundles of lab equipment and reagents.</p>
        </div>
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((c) => {
            const cover = c.coverImage;
            return (
              <Link key={c._id} to="/collections" className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-brand hover:-translate-y-1 transition-all">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  {cover ? <img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">No items</div>}
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-lg">{c.collectionName}</div>
                    <div className="text-xs text-muted-foreground">{c.items?.length || 0} products</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
