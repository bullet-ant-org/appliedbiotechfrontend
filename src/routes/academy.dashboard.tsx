import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { useAcademy } from "@/lib/academy";
import { BookOpen, LayoutDashboard, User, LogOut, ArrowRight, MessageCircle, Calendar, Award, Clock, Menu, X } from "lucide-react";

export const Route = createFileRoute("/academy/dashboard")({
  component: AcademyDashboard,
  head: () => ({ meta: [{ title: "My Academy Dashboard" }] }),
});

type TabKey = "overview" | "courses" | "profile";

function AcademyDashboard() {
  const navigate = useNavigate();
  const { user, enrollments, progressPct, signOut } = useAcademy();
  const [tab, setTab] = useState<TabKey>("overview");
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Sign in to your dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in from the Academy page to access your courses, progress and coaching.</p>
          <Link to="/academy" className="mt-6 inline-flex h-11 px-5 items-center rounded-xl gradient-brand text-brand-foreground font-semibold">Go to Academy</Link>
        </div>
      </div>
    );
  }

  const totalProgress = enrollments.length === 0 ? 0 : Math.round(
    enrollments.reduce((acc, e) => acc + progressPct(e.courseId), 0) / enrollments.length
  );
  const lastRead = [...enrollments].sort((a, b) => b.purchasedAt - a.purchasedAt)[0];

  const items: { key: TabKey; label: string; I: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Student Dashboard", I: LayoutDashboard },
    { key: "courses", label: "My Courses", I: BookOpen },
    { key: "profile", label: "Profile", I: User },
  ];

  function requestCoach() {
    navigate({ to: "/contact" });
  }

  function doSignOut() {
    signOut();
    navigate({ to: "/academy" });
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-30 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 sm:px-6">
        <button className="lg:hidden p-2 rounded-md hover:bg-accent" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        <Link to="/" className="font-display font-bold text-sm sm:text-base">Applied Biotech <span className="text-brand">Academy</span></Link>
        <div className="flex-1" />
        <Link to="/academy" className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground">Back to Academy</Link>
        <div className="h-9 w-9 rounded-full gradient-brand text-brand-foreground grid place-items-center text-xs font-bold">
          {(user.name || "User").split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky lg:top-16 top-0 inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
          <div className="px-5 h-16 flex items-center justify-between border-b border-border lg:hidden">
            <div className="font-display font-bold">Menu</div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-accent"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-5 border-b border-border">
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div className="font-display font-bold text-sm mt-0.5">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {items.map((it) => {
              const active = tab === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => { setTab(it.key); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "gradient-brand text-brand-foreground shadow-soft" : "text-foreground/75 hover:bg-accent hover:text-foreground"}`}
                >
                  <it.I className="h-4 w-4" /><span>{it.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border">
            <button onClick={doSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />}

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {tab === "overview" && (
            <Section title="Welcome back" subtitle={`Pick up where you left off, ${(user.name || "").split(" ")[0] || "Student"}.`}>
              <div className="grid sm:grid-cols-3 gap-4">
                <Stat I={BookOpen} k={String(enrollments.length)} v="Courses owned" />
                <Stat I={Award} k={`${totalProgress}%`} v="Average progress" />
                <Stat I={Calendar} k={enrollments.filter((e) => e.practicalDate).length.toString()} v="Practicals booked" />
              </div>

              <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
                <article className="rounded-2xl bg-card border border-border p-6 shadow-soft">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Last page read</div>
                  {lastRead ? (
                    <>
                      <div className="mt-2 font-display text-xl font-bold">{lastRead.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-2"><Clock className="h-4 w-4" /> Page {lastRead.currentPage + 1} of {lastRead.pageImages?.length ?? lastRead.pages.length}</div>
                      <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full gradient-brand" style={{ width: `${progressPct(lastRead.courseId)}%` }} /></div>
                      <Link to="/academy/read/$courseId" params={{ courseId: lastRead.courseId }} className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold">Continue reading <ArrowRight className="h-4 w-4" /></Link>
                    </>
                  ) : (
                    <>
                      <div className="mt-2 font-display text-lg font-bold">No courses yet</div>
                      <p className="text-sm text-muted-foreground mt-1">Buy a course from the Academy to start reading.</p>
                      <Link to="/academy" className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold">Browse courses <ArrowRight className="h-4 w-4" /></Link>
                    </>
                  )}
                </article>

                <article className="rounded-2xl bg-gradient-to-br from-brand to-accent-cyan text-brand-foreground p-6 shadow-brand">
                  <MessageCircle className="h-6 w-6" />
                  <div className="mt-3 font-display text-xl font-bold leading-snug">Need a 1:1 with a coach?</div>
                  <p className="mt-2 text-sm opacity-90">Book a working scientist to walk you through a protocol, a result, or a career question.</p>
                  <button onClick={requestCoach} className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-background text-foreground text-sm font-bold shadow-soft">Request a coach <ArrowRight className="h-4 w-4" /></button>
                </article>
              </div>
            </Section>
          )}

          {tab === "courses" && (
            <Section title="My Courses" subtitle="Every course you own. Open any to keep reading.">
              {enrollments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                  You haven't bought a course yet. <Link to="/academy" className="text-brand font-semibold hover:underline">Browse the Academy.</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {enrollments.map((e) => {
                    const pct = progressPct(e.courseId);
                    return (
                      <article key={e.courseId} className="rounded-2xl bg-card border border-border overflow-hidden shadow-soft">
                        {e.cover && <div className="aspect-[16/9] overflow-hidden"><img src={e.cover} alt="" className="h-full w-full object-cover" /></div>}
                        <div className="p-5">
                          <h3 className="font-display font-bold leading-snug">{e.title}</h3>
                          {e.practicalDate && <div className="mt-1 text-xs text-muted-foreground">Practical: {new Date(e.practicalDate).toLocaleDateString()}</div>}
                          <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full gradient-brand" style={{ width: `${pct}%` }} /></div>
                          <div className="mt-1 text-xs text-muted-foreground">{pct}% complete · Page {e.currentPage + 1}/{e.pageImages?.length ?? e.pages.length}</div>
                          <Link to="/academy/read/$courseId" params={{ courseId: e.courseId }} className="mt-4 w-full h-10 rounded-xl gradient-brand text-brand-foreground text-sm font-semibold inline-flex items-center justify-center gap-2">Open reader <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </Section>
          )}

          {tab === "profile" && (
            <Section title="Profile" subtitle="Your Academy account details.">
              <div className="rounded-2xl bg-card border border-border p-6 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full gradient-brand text-brand-foreground grid place-items-center text-xl font-bold">
                    {(user.name || "User").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <Info label="Courses owned" value={String(enrollments.length)} />
                  <Info label="Average progress" value={`${totalProgress}%`} />
                </div>
                <button onClick={doSignOut} className="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-accent">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Stat({ I, k, v }: { I: typeof LayoutDashboard; k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
      <I className="h-5 w-5 text-brand" />
      <div className="mt-3 font-display text-2xl font-bold">{k}</div>
      <div className="text-xs text-muted-foreground">{v}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="mt-1 font-display font-bold">{value}</div>
    </div>
  );
}