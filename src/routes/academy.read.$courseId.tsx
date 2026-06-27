import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useAcademy } from "@/lib/academy";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/academy/read/$courseId")({
  component: Reader,
  head: () => ({ meta: [{ title: "Read · Academy" }] }),
});

function Reader() {
  const { courseId } = useParams({ from: "/academy/read/$courseId" });
  const { getEnrollment, setPage, progressPct } = useAcademy();
  const e = getEnrollment(courseId);

  if (!e) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mt-4">You don't own this course yet</h1>
          <p className="text-sm text-muted-foreground mt-2">Buy it from the Academy to unlock the reader.</p>
          <Link to="/academy" className="mt-6 inline-flex h-11 px-5 items-center rounded-xl gradient-brand text-brand-foreground font-semibold">Back to Academy</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const total = (e.pageImages?.length ?? e.pages.length);
  const pct = progressPct(courseId);
  const imageMode = !!e.pageImages && e.pageImages.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/academy" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> My Library</Link>
        <div className="mt-4 flex items-end justify-between">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{e.title}</h1>
          <div className="text-xs text-muted-foreground">Page {e.currentPage + 1} of {total}</div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full gradient-brand transition-all" style={{ width: `${pct}%` }} />
        </div>

        {imageMode ? (
          <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-card">
            <img
              key={e.currentPage}
              src={e.pageImages![e.currentPage]}
              alt={`Page ${e.currentPage + 1}`}
              className="w-full h-auto object-contain bg-black animate-fade-in"
            />
          </div>
        ) : (
          <>
            {e.cover && (
              <img src={e.cover} alt="" className="mt-6 w-full rounded-2xl aspect-[16/8] object-cover" />
            )}
            <article className="prose prose-neutral dark:prose-invert mt-6 max-w-none whitespace-pre-line text-foreground leading-relaxed">
              {e.pages[e.currentPage]}
            </article>
          </>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={e.currentPage === 0}
            onClick={() => setPage(courseId, e.currentPage - 1)}
            className="h-11 px-5 rounded-xl border border-border text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"
          ><ArrowLeft className="h-4 w-4" /> Back</button>
          <button
            disabled={e.currentPage >= total - 1}
            onClick={() => setPage(courseId, e.currentPage + 1)}
            className="h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40"
          >Next <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <Footer />
    </div>
  );
}