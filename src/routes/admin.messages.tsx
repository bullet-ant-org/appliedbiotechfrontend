import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/dashboard/widgets";
import { Mail, MailOpen, Loader2, Trash2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({ component: MessagesPage });

function MessagesPage() {
  const [selIdx, setSelIdx] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/messages");
      if (res) {
        setItems(res.map((m: any) => ({
          id: m._id,
          from: m.fullName,
          subj: m.subject,
          body: m.message,
          t: m.createdAt,
          unread: m.status === "unread"
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const selected = items[selIdx];

  async function handleSelect(i: number) {
    setSelIdx(i);
    const msg = items[i];
    if (msg?.unread) {
      try {
        await fetchData(`/api/v1/messages/${msg.id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" })
        });
        setItems(prev => prev.map((item, idx) => i === idx ? { ...item, unread: false } : item));
      } catch (err) {}
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await fetchData(`/api/v1/messages/${id}`, { method: "DELETE" });
      toast.success("Message deleted");
      setItems(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelIdx(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message");
    }
  }

  return <div className="space-y-6">
    <PageHeader title="Messages" subtitle="Customer messages from contact forms and inquiries." />
    <Card className="overflow-hidden grid lg:grid-cols-3 min-h-[500px] relative">
      {loading && items.length === 0 && (
        <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}
      <div className="border-r border-border divide-y divide-border lg:max-h-[600px] overflow-y-auto pb-48">
        {items.map((m, i) => (
          <button key={m.id} onClick={() => handleSelect(i)} className={`w-full text-left p-4 hover:bg-muted/40 group/msg ${selIdx === i ? "bg-muted/60" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${m.unread ? "bg-primary" : "bg-transparent"}`} />
              <div className="font-semibold text-sm flex-1">{m.from}</div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-muted-foreground">{new Date(m.t).toLocaleDateString()}</div>
                <div 
                  onClick={(e) => handleDelete(m.id, e)}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/msg:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            <div className="text-sm mt-1 truncate">{m.subj}</div>
            <div className="text-xs text-muted-foreground truncate mt-0.5">{m.body}</div>
          </button>
        ))}
        {!loading && items.length === 0 && <div className="p-10 text-center text-muted-foreground text-sm">No messages yet.</div>}
      </div>
      <div className="lg:col-span-2 p-6">
        {selected ? (
          <>
            <div className="flex items-center gap-2 mb-2"><MailOpen className="h-4 w-4 text-primary" /><span className="text-xs uppercase font-semibold text-muted-foreground">Inbox</span></div>
            <h2 className="font-display text-xl font-bold">{selected.subj}</h2>
            <div className="text-sm text-muted-foreground mt-1">From <span className="text-foreground font-medium">{selected.from}</span> · {new Date(selected.t).toLocaleString()}</div>
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{selected.body}</p>
            <textarea className="mt-6 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" rows={4} placeholder="Reply..." />
            <button onClick={() => toast.info("Email relay not configured for demo")} className="mt-3 h-10 px-4 rounded-xl gradient-brand text-brand-foreground text-sm font-semibold inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Send reply</button>
          </>
        ) : (
          <div className="h-full grid place-items-center text-muted-foreground text-sm">Select a message to read</div>
        )}
      </div>
    </Card>
  </div>;
}