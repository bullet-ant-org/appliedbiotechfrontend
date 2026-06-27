import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({ meta: [{ title: "Gallery · Applied Biotech" }, { name: "description", content: "Photos from our labs, training sessions and field work." }] }),
});

function GalleryPage() {
  useReveal();
  const [items, setItems] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/gallery");
      if (res) {
        setItems(res.map((i: any) => ({
          id: i._id || i.id,
          url: i.url || i.image || i.galleryImage,
          name: i.name || i.title || "Untitled",
          description: i.description || i.excerpt || "",
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <PageHero eyebrow="Gallery" title={<>Inside our <span className="gradient-text">work</span></>} subtitle="Moments from the lab, the field and the classroom." />
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative min-h-[400px]">
        {loading && items.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <article key={g.id} className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-brand transition-all hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={g.url} alt={g.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg leading-snug break-words">{g.name}</h3>
                {g.description && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed break-words">{g.description}</p>}
              </div>
            </article>
          ))}
          {!loading && items.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">No photos uploaded yet.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
}