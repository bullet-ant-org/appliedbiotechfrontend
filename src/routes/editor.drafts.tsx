import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu } from "@/components/dashboard/widgets";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/drafts")({ component: Drafts });

interface Draft { 
  id: string; 
  title: string; 
  type: "Course" | "Product" | "Collection"; 
  updated: string; 
  endpoint: string;
  publishValue: string;
  targetRoute: string;
}

function Drafts() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Draft[]>([]);
  const [q, setQ] = useState("");
  const { loading, fetchData } = useFetch();

  const loadDrafts = useCallback(async () => {
    const fetchSafe = async (url: string) => {
      try { return await fetchData(url); } catch { return null; }
    };

    const [academy, products, collections] = await Promise.all([
      fetchSafe("/api/v1/academy"),
      fetchSafe("/api/v1/shop/products"),
      fetchSafe("/api/v1/collections")
    ]);

    const drafts: Draft[] = [];

    if (academy) {
      academy.filter((c: any) => c.status === "Draft" || c.status === "Upcoming").forEach((c: any) => {
        drafts.push({
          id: c._id,
          title: c.courseTitle,
          type: "Course",
          updated: new Date(c.updatedAt).toLocaleDateString(),
          endpoint: `/api/v1/academy/${c._id}`,
          publishValue: "Live",
          targetRoute: "/editor/academy"
        });
      });
    }

    if (products) {
      products.filter((p: any) => p.status === "draft").forEach((p: any) => {
        drafts.push({
          id: p._id,
          title: p.productName,
          type: "Product",
          updated: new Date(p.updatedAt || Date.now()).toLocaleDateString(),
          endpoint: `/api/v1/shop/products/${p._id}`,
          publishValue: "active",
          targetRoute: "/editor/shop"
        });
      });
    }

    if (collections) {
      collections.filter((c: any) => c.status === "unpublished").forEach((c: any) => {
        drafts.push({
          id: c._id,
          title: c.collectionName,
          type: "Collection",
          updated: new Date(c.updatedAt).toLocaleDateString(),
          endpoint: `/api/v1/collections/${c._id}`,
          publishValue: "published",
          targetRoute: "/editor/collections"
        });
      });
    }

    setItems(drafts);
  }, [fetchData]);

  useEffect(() => { loadDrafts(); }, [loadDrafts]);

  async function handlePublish(draft: Draft) {
    try {
      await fetchData(draft.endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draft.publishValue })
      });
      toast.success(`${draft.type} published successfully`);
      loadDrafts();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish");
    }
  }

  async function handleDelete(draft: Draft) {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    try {
      await fetchData(draft.endpoint, { method: "DELETE" });
      toast.success("Draft deleted");
      loadDrafts();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Drafts & Pending" subtitle="Aggregated overview of unpublished content across the platform." />
      <Toolbar onSearch={setQ} />

      <Card className="relative overflow-visible">
        {loading && items.length === 0 && (
          <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}
        <div className="overflow-x-auto pb-48">
          <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
            <tr><th className="px-4 py-3">Draft</th><th>Type</th><th>Updated</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())).map((d) => (
              <tr key={d.id} className="hover:bg-muted/40">
                <td className="px-4 py-4 font-medium flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-brand/10 text-brand grid place-items-center"><FileText className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <div className="truncate">{d.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">{d.id}</div>
                  </div>
                </td>
                <td><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase">{d.type}</span></td>
                <td className="text-muted-foreground">{d.updated}</td>
                <td className="pr-4"><RowMenu actions={[
                  { label: "Continue editing", onClick: () => navigate({ to: d.targetRoute as any }) },
                  { label: "Go live now", onClick: () => handlePublish(d) },
                  { label: "Delete draft", danger: true, onClick: () => handleDelete(d) },
                ]} /></td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={4} className="py-20 text-center text-muted-foreground">All content is currently live. Good job!</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
