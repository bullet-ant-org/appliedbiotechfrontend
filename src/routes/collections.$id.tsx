import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/collections/$id")({
  component: CollectionDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `Collection · Applied Biotech Shop` }],
  }),
});

function CollectionDetailPage() {
  const { id } = Route.useParams();
  const [collection, setCollection] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData(`/api/v1/collections/${id}`)
      .then((res) => {
        if (res) {
          // Handle both direct objects and nested responses (e.g., { collection: ... })
          const data = res.collection || res.data || res;
          setCollection(data);
        }
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [fetchData, id]);

  // Normalize and filter items
  const items = (collection?.items || [])
    .filter((p: any) => typeof p === 'object' && p !== null) // Ensure products are populated objects
    .map((p: any) => ({
      id: p._id || p.id,
      name: p.productName || p.name,
      price: p.price,
      stock: p.stock,
      img: p.productImage || p.image || p.img,
      category: p.category,
      description: p.description,
      rating: 5,
      tags: p.tags || [],
      status: p.status || "active",
    }))
    .filter((p: any) => p.status === "active"); // Only show published products to customers

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mx-auto max-w-7xl">
          <Link to="/collections" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All collections
          </Link>

          {loading && !collection ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : notFound || !collection ? (
            <div className="text-center py-20">
              <h1 className="font-display text-2xl font-bold">Collection not found</h1>
              <Link to="/collections" className="mt-4 inline-block text-brand font-semibold">Back to collections →</Link>
            </div>
          ) : (
            <>
              <div className="rounded-3xl overflow-hidden border border-border bg-card mb-10 relative">
                <div className="aspect-[16/6] md:aspect-[16/4] overflow-hidden relative">
                  {collection.coverImage && (
                    <img src={collection.coverImage} alt={collection.collectionName} className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <div className="inline-flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-background/90 text-foreground">
                      <Layers className="h-3 w-3" /> {items.length} {items.length === 1 ? "item" : "items"}
                    </div>
                    <h1 className="mt-3 font-display text-2xl md:text-4xl font-extrabold">{collection.collectionName}</h1>
                    <p className="mt-2 text-sm md:text-base text-white/85 max-w-2xl">{collection.description}</p>
                  </div>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products in this collection yet.</p>
                  <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Browse all products →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {items.map((p: any) => <ProductCard key={p.id} p={p} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
