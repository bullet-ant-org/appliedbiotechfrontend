import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/site/Navbar";
import { PageHero } from "@/components/site/PageHero";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({ meta: [{ title: "News · Applied Biotech" }, { name: "description", content: "Latest news, events and updates from Applied Biotech." }] }),
});

function NewsPage() {
  useReveal();
  const { pathname } = useRouterState({ select: (s) => s.location });
  const [items, setItems] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  // Only render the list if we are on the main news index route
  const isIndex = pathname === "/news" || pathname === "/news/";

  const loadNews = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/news");
      if (res) {
        setItems(res.map((n: any) => ({
          id: n._id,
          title: n.headline || n.title,
          slug: n.slug || n._id, // Fallback to ID if slug is not populated
          tag: n.tag,
          excerpt: n.description || n.excerpt || "",
          cover: n.image,
          date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadNews(); }, [loadNews]);

  if (!isIndex) return <Outlet />;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <PageHero eyebrow="News" title={<>What's <span className="gradient-text">happening</span></>} subtitle="Stories, events, training cohorts and industry updates from our team." />
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative min-h-[400px]">
        {loading && items.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {items.map((n) => (
            <Link
              key={n.id}
              to="/news/$slug"
              params={{ slug: n.slug }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-brand hover:-translate-y-1 transition-all"
            >
              {n.cover && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={n.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-7">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold uppercase tracking-wider">{n.tag}</span>
                  <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{n.date}</span>
                </div>
                <h3 className="mt-4 font-display font-bold text-xl group-hover:text-brand transition-colors break-words">{n.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed break-words">{n.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">Read more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div>
              </div>
            </Link>
          ))}
          {!loading && items.length === 0 && <p className="text-center text-muted-foreground col-span-full py-12">No news yet.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
}
