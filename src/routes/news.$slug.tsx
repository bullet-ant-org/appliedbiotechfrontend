import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/news/$slug")({
  component: NewsDetail,
  head: ({ params }) => ({ meta: [{ title: `${params?.slug ?? "Article"} · Applied Biotech News` }] }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="grid place-items-center p-10 text-center pt-32">
        <div>
          <h1 className="font-display text-3xl font-bold">Article not found</h1>
          <Link to="/news" className="mt-4 inline-block text-brand font-semibold">← Back to news</Link>
        </div>
      </div>
    </div>
  ),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any>(null);
  const [others, setOthers] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  const loadData = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/news");
      if (res && (Array.isArray(res) || Array.isArray(res.data))) {
        const list = Array.isArray(res) ? res : res.data;
        const normalized = list.map((n: any) => ({
          id: n._id,
          title: n.headline || n.title,
          slug: n.slug || n._id, // Match logic with news.tsx list page
          tag: n.tag,
          excerpt: n.description || n.excerpt || "",
          // Align with backend rich text format or simple string
          body: typeof n.newsBody === 'object' 
            ? (n.newsBody?.sections?.[0]?.content || "") 
            : (n.newsBody || n.body || ""),
          cover: n.image,
          date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
        }));
        
        const found = normalized.find((n: any) => n.slug === slug || n.id === slug);
        if (found) {
          setPost(found);
          setOthers(normalized.filter((n: any) => n.id !== found.id).slice(0, 3));
        } else {
          setPost("NOT_FOUND");
        }
      } else {
        setPost("NOT_FOUND");
      }
    } catch (err) {
      setPost("NOT_FOUND");
    }
  }, [fetchData, slug]);

  useEffect(() => { loadData(); }, [loadData]);

  if (post === "NOT_FOUND") {
    throw notFound();
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <article className="px-4 sm:px-6 lg:px-8 pt-28 pb-12 max-w-full">
        <div className="mx-auto max-w-3xl w-full">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> All news</Link>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold uppercase tracking-wider">{post.tag}</span>
            <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-extrabold leading-tight break-words">{post.title}</h1>
          {post.cover && <img src={post.cover} alt={post.title} className="mt-8 rounded-2xl w-full aspect-[16/9] object-cover" />}
          <p className="mt-8 text-lg md:text-xl text-foreground/80 leading-relaxed font-medium break-words">{post.excerpt}</p>
          <div className="mt-6 space-y-5 text-base md:text-lg text-foreground/90 leading-[1.8] break-words">
            {(post.body || "").split(/\n\s*\n/).map((para: string, i: number) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </div>
      </article>
      {others.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-bold mb-6">More stories</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {others.map((n) => (
                <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-brand transition-all">
                  {n.cover && <div className="aspect-[16/10] overflow-hidden"><img src={n.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground">{n.date}</div>
                    <div className="mt-2 font-display font-bold group-hover:text-brand transition-colors">{n.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
