import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { useAcademy } from "@/lib/academy";
import { ACADEMY_TOKEN_KEY } from "@/lib/academy";
import { ArrowLeft, ArrowRight, BookOpen, Eye, X, Loader2, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/academy/read/$courseId")({
  component: Reader,
  head: () => ({ meta: [{ title: "Read · Academy" }] }),
});

const API = "/api/v1/academy";

function Reader() {
  const { courseId } = useParams({ from: "/academy/read/$courseId" });
  const { getEnrollment, setPage, progressPct } = useAcademy();
  const e = getEnrollment(courseId);

  // Page image cache: pageNum → cloudinary URL
  const [pageCache, setPageCache] = useState<Record<number, string>>({});
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Fullscreen lightbox
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPage = e?.currentPage ?? 0;

  const fetchPage = useCallback(async (page: number) => {
    if (pageCache[page]) return;
    setPageLoading(true);
    setPageError(null);
    try {
      const token = localStorage.getItem(ACADEMY_TOKEN_KEY);
      const res = await fetch(`${API}/course/${courseId}/secure-read-stream?page=${page + 1}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setPageError(err.message || "Could not load this page. Please try again.");
        return;
      }
      const data = await res.json();
      setPageCache(prev => ({ ...prev, [page]: data.streamUrl }));
      // Pre-fetch next page silently
      if (page + 1 < (totalPages ?? 999)) {
        fetch(`${API}/course/${courseId}/secure-read-stream?page=${page + 2}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then(r => r.json()).then(d => {
          if (d.streamUrl) setPageCache(prev => ({ ...prev, [page + 1]: d.streamUrl }));
        }).catch(() => {});
      }
    } catch {
      setPageError("Network error loading page.");
    } finally {
      setPageLoading(false);
    }
  }, [courseId, pageCache, totalPages]);

  // On mount and page change, fetch the current page
  useEffect(() => {
    if (!e) return;
    fetchPage(currentPage);
  }, [currentPage, e]);

  // Detect total pages by probing (max 300)
  useEffect(() => {
    if (!e || totalPages !== null) return;
    // Use outline length as a rough known lower bound; actual pages from stream
    const knownMin = Array.isArray(e.pages) ? e.pages.length : 1;
    setTotalPages(knownMin > 0 ? knownMin : 1);
    // Try to probe further pages asynchronously to discover true count
    (async () => {
      const token = localStorage.getItem(ACADEMY_TOKEN_KEY);
      let lo = knownMin, hi = 300;
      // Binary search for last valid page
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        try {
          const res = await fetch(`${API}/course/${courseId}/secure-read-stream?page=${mid}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) { lo = mid; } else { hi = mid - 1; }
        } catch { break; }
      }
      setTotalPages(lo);
    })();
  }, [e, courseId]);

  function handleScreenTap() {
    if (!fullscreen) return;
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  function openFullscreen() {
    setFullscreen(true);
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  // Keyboard navigation
  useEffect(() => {
    if (!e || !totalPages) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "ArrowRight" && currentPage < totalPages! - 1) setPage(courseId, currentPage + 1);
      if (ev.key === "ArrowLeft" && currentPage > 0) setPage(courseId, currentPage - 1);
      if (ev.key === "Escape") setFullscreen(false);
      if (fullscreen) { setShowControls(true); if (controlsTimer.current) clearTimeout(controlsTimer.current); controlsTimer.current = setTimeout(() => setShowControls(false), 3000); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [e, currentPage, totalPages, fullscreen, courseId, setPage]);

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
      </div>
    );
  }

  const total = totalPages ?? 1;
  const pct = total > 1 ? Math.round(((currentPage + 1) / total) * 100) : (currentPage > 0 ? 100 : 0);
  const pageUrl = pageCache[currentPage];

  const PageImage = ({ src, className }: { src: string; className: string }) => (
    <img
      key={src}
      src={src}
      alt={`Page ${currentPage + 1}`}
      className={className}
      onError={() => setPageError("This page could not be rendered.")}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/academy/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> My Library
          </Link>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{e.title}</h1>
          <div className="text-xs text-muted-foreground shrink-0">Page {currentPage + 1}{total > 1 ? ` of ${total}` : ""}</div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full gradient-brand transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>

        {/* Page viewer */}
        <div className="mt-6 rounded-2xl overflow-hidden border border-border bg-card relative group min-h-[420px] flex items-center justify-center">
          {pageLoading && !pageUrl ? (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <span className="text-sm">Loading page {currentPage + 1}…</span>
            </div>
          ) : pageError ? (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground px-6 text-center">
              <BookOpen className="h-8 w-8" />
              <p className="text-sm">{pageError}</p>
              <button onClick={() => { setPageError(null); fetchPage(currentPage); }}
                className="mt-2 h-9 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-accent">
                Retry
              </button>
            </div>
          ) : pageUrl ? (
            <>
              <PageImage src={pageUrl} className="w-full h-auto object-contain bg-white" />
              {/* Fullscreen button */}
              <button
                onClick={openFullscreen}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                title="Fullscreen"
              >
                <Eye className="h-4 w-4" />
              </button>
              {/* Loading overlay for page transitions */}
              {pageLoading && (
                <div className="absolute inset-0 bg-background/60 grid place-items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-brand" />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <span className="text-sm">Preparing reader…</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            disabled={currentPage === 0}
            onClick={() => setPage(courseId, currentPage - 1)}
            className="h-11 px-5 rounded-xl border border-border text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40 hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs text-muted-foreground">{pct}% complete</span>
          <button
            disabled={currentPage >= total - 1}
            onClick={() => setPage(courseId, currentPage + 1)}
            className="h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center gap-2 disabled:opacity-40"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={handleScreenTap}
        >
          {pageUrl && (
            <img
              src={pageUrl}
              alt={`Page ${currentPage + 1}`}
              className="max-h-screen max-w-full object-contain select-none"
            />
          )}

          {/* Tap-reveal controls */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
            {/* Close */}
            <button
              onClick={(ev) => { ev.stopPropagation(); setFullscreen(false); }}
              className="pointer-events-auto absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Page indicator */}
            <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {currentPage + 1} / {total}
            </div>

            {/* Prev arrow */}
            {currentPage > 0 && (
              <button
                onClick={(ev) => { ev.stopPropagation(); setPage(courseId, currentPage - 1); }}
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next arrow */}
            {currentPage < total - 1 && (
              <button
                onClick={(ev) => { ev.stopPropagation(); setPage(courseId, currentPage + 1); }}
                className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            )}

            {/* Progress bar */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
