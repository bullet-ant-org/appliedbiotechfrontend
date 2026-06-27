import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { useReveal } from "@/hooks/use-reveal";
import { ArrowRight, Layers, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [
      { title: "Collections — Applied Biotech" },
      { name: "description", content: "Curated bundles of lab equipment, reagents and educational kits." },
    ],
  }),
});

function CollectionsPage() {
  useReveal();
  const [collections, setCollections] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/collections").then(res => {
      if (res) setCollections(res);
    });
  }, [fetchData]);

  const tones = ["from-blue-500/40 to-cyan-500/30", "from-fuchsia-500/40 to-pink-500/30", "from-emerald-500/40 to-teal-500/30", "from-amber-500/40 to-orange-500/30", "from-violet-500/40 to-indigo-500/30", "from-rose-500/40 to-red-500/30"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        eyebrow="Curated Collections"
        title={<>Bundles built for <span className="gradient-text">real labs</span></>}
        subtitle="Save time and budget with collections curated by our scientists for specific workflows."
      />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto relative min-h-[400px]">
          {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((c, i) => (
            <Link to="/collections/$id" params={{ id: c._id }} key={c._id} className="group relative rounded-3xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-brand transition-all hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={c.coverImage} alt={c.collectionName} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${tones[i % tones.length]} mix-blend-overlay`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-background/90">
                  <Layers className="h-3 w-3" /> {c.items?.length || 0} items
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-display text-xl font-bold">{c.collectionName}</h3>
                  <p className="text-sm text-white/80 mt-1 line-clamp-2">{c.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                    Explore collection <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
          {!loading && collections.length === 0 && <div className="text-center py-20 text-muted-foreground">No collections found.</div>}
        </div>
      </section>

      <Footer />
    </div>
  );
}