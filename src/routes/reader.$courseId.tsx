import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { ACADEMY_TOKEN_KEY } from "@/lib/academy";
import { ArrowLeft, ArrowRight, BookOpen, Eye, X, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/reader/$courseId")({
  component: Reader,
  head: () => ({ meta: [{ title: "Read · Academy" }] }),
});

function Reader() {
  const { courseId } = useParams({ from: "/reader/$courseId" });

  const [courseTitle, setCourseTitle] = useState("");
  const [currentPage, setCurrentPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cache = useRef<Record<number, string>>({});

  const token = localStorage.getItem(ACADEMY_TOKEN_KEY);

  const fetchPage = useCallback(async (page: number) => {
    // Return from cache instantly
    if (cache.current[page]) {
      setPageUrl(cache.current[page]);
      setPageLoading(false);
      return;
    }
    setPageLoading(true);
    setPageError(null);
    try {
      const res = await fetch(
        `/api/v1/academy/course/${courseId}/secure-read-stream?page=${page + 1}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (res.status === 401 || res.status === 403) {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.message || "You don't have access to this course.");
        setPageLoading(false);
        return;
      }
      if (!res.ok) {
        // Non-ok on page > 0 likely means we've gone past the last page
        if (page > 0) {
          setTotalPages(page);
          setCurrentPageState(page - 1);
        } else {
          setPageError("Could not load this page. Please try again.");
        }
        setPageLoading(false);
        return;
      }
      const data = await res.json();
      if (data.course && !courseTitle) setCourseTitle(data.course);
      const url = data.streamUrl;
      cache.current[page] = url;
      setPageUrl(url);
      // Silently pre-fetch next page
      const nextPage = page + 1;
      if (!cache.current[nextPage]) {
        fetch(`/api/v1/academy/course/${courseId}/secure-read-stream?page=${nextPage + 1}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} })
          .then(r => r.ok ? r.json() : null)
          .then(d => { if (d?.streamUrl) cache.current[nextPage] = d.streamUrl; })
          .catch(() => {});
      }
    } catch {
      setPageError("Network error. Check your connection and try again.");
    } finally {
      setPageLoading(false);
    }
  }, [courseId, token, courseTitle]);

  // Fetch page on mount and whenever page changes
  useEffect(() => { fetchPage(currentPage); }, [currentPage]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setFullscreen(false);
      if (fullscreen) flashControls();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPage, totalPages, fullscreen]);

  function goPrev() { if (currentPage > 0) setCurrentPageState(p => p - 1); }
  function goNext() { setCurrentPageState(p => p + 1); } // totalPages grows as we discover pages

  function flashControls() {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  function openFullscreen() { setFullscreen(true); flashControls(); }

  const pct = totalPages > 1 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;

  // Not logged in at all
  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mt-4">Sign in to read</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your Academy account to access your courses.</p>
          <Link to="/academy" className="mt-6 inline-flex h-11 px-5 items-center rounded-xl gradient-brand text-brand-foreground font-semibold">Go to Academy</Link>
        </div>
      </div>
    );
  }

  // Backend rejected access (403 = not purchased, 401 = bad token)
  if (authError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold mt-4">Access denied</h1>
          <p className="text-sm text-muted-foreground mt-2">{authError}</p>
          <Link to="/academy" className="mt-6 inline-flex h-11 px-5 items-center rounded-xl gradient-brand text-brand-foreground font-semibold">Back to Academy</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/academy/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> My Library
        </Link>
        <div className="mt-4 flex items-end justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{courseTitle || "Loading…"}</h1>
          <div className="text-xs text-muted-foreground shrink-0">Page {currentPage + 1}</div>
        </div>
        {totalPages > 1 && (
          <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full gradient-brand transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        )}

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
              <img
                key={pageUrl}
                src={pageUrl}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto object-contain bg-white"
              />
              <button
                onClick={openFullscreen}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                title="Fullscreen"
              >
                <Eye className="h-4 w-4" />
              </button>
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
          <button disabled={currentPage === 0} onClick={goPrev}
            className="h-11 px-5 rounded-xl border border-border text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40 hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          {totalPages > 1 && <span className="text-xs text-muted-foreground">{pct}% complete</span>}
          <button onClick={goNext}
            className="h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {fullscreen && pageUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={flashControls}>
          <img src={pageUrl} alt={`Page ${currentPage + 1}`} className="max-h-screen max-w-full object-contain select-none" />

          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
            <button onClick={(ev) => { ev.stopPropagation(); setFullscreen(false); }}
              className="pointer-events-auto absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center">
              <X className="h-5 w-5" />
            </button>
            <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Page {currentPage + 1}
            </div>
            {currentPage > 0 && (
              <button onClick={(ev) => { ev.stopPropagation(); goPrev(); }}
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center">
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            <button onClick={(ev) => { ev.stopPropagation(); goNext(); }}
              className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center">
              <ArrowRight className="h-6 w-6" />
            </button>
            {totalPages > 1 && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
