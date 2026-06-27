import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/dashboard/widgets";
import { useAuth } from "@/lib/auth";
import { GraduationCap, ShoppingBag, Layers, FileText, ArrowRight, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/")({ component: EditorOverview });

function EditorOverview() {
  const { user } = useAuth();
  const { loading, fetchData } = useFetch();
  const [stats, setStats] = useState({
    courses: 0,
    products: 0,
    collections: 0,
    drafts: 4
  });

  const loadStats = useCallback(async () => {
    const fetchSafe = async (url: string) => {
      try { return await fetchData(url); } catch { return null; }
    };

    const [courses, products, collections] = await Promise.all([
      fetchSafe("/api/v1/academy"),
      fetchSafe("/api/v1/shop/products"),
      fetchSafe("/api/v1/collections")
    ]);

    setStats({
      courses: courses?.length || 0,
      products: products?.length || 0,
      collections: collections?.length || 0,
      drafts: 4
    });
  }, [fetchData]);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div className="space-y-6 relative">
      {loading && stats.courses === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      )}
      <PageHeader title={`Hello, ${(user?.name || "").split(" ")[0] || "Editor"}`} subtitle="Pick up where you left off. Your drafts and recent edits are below." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ i: GraduationCap, l: "Courses managed", v: stats.courses }, { i: ShoppingBag, l: "Products edited", v: stats.products }, { i: Layers, l: "Collections", v: stats.collections }, { i: FileText, l: "Drafts pending", v: stats.drafts }].map((s) => (
          <Card key={s.l} className="p-5"><span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><s.i className="h-5 w-5" /></span><div className="mt-3 font-display text-2xl font-bold">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display font-bold mb-4">Quick actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/editor/academy", l: "New course", i: GraduationCap }, 
              { to: "/editor/shop", l: "Add product", i: ShoppingBag }, 
              { to: "/editor/collections", l: "New collection", i: Layers }
            ].map((a) => (
              <Link key={a.to} to={a.to} className="group p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                <a.i className="h-5 w-5 text-primary" />
                <div className="mt-2 font-semibold text-sm">{a.l}</div>
                <div className="mt-1 text-xs text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Open <ArrowRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-bold mb-4">Recent activity</h3>
          <div className="space-y-3 text-sm">
            {[{ a: "Updated PCR Mastery course", t: "10 min ago" }, { a: "Added 2 products to Reagents", t: "2 hr ago" }, { a: "Published Holiday Promo collection", t: "yesterday" }, { a: "Edited About page hero", t: "2 days ago" }].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border"><div className="font-medium">{e.a}</div><div className="text-xs text-muted-foreground">{e.t}</div></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}