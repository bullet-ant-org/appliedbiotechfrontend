import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, Newspaper } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/news")({ component: NewsAdmin });

interface Post {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  body: string;
  cover?: string;
  date: string;
}

const empty: Post = { id: "", title: "", slug: "", tag: "Update", excerpt: "", body: "", date: "" };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function NewsAdmin() {
  const [items, setItems] = useState<Post[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post>(empty);
  const [coverFile, setCoverFile] = useState<any>(null);
  const { loading, fetchData } = useFetch();

  const loadNews = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/news");
      if (res) {
        setItems(res.map((n: any) => ({
          id: n._id,
          title: n.headline || n.title,
          slug: n.slug,
          tag: n.tag,
          excerpt: n.description || n.excerpt || "",
          body: typeof n.body === "object" ? (n.body?.sections?.[0]?.content || "") : (n.body || ""),
          cover: n.coverImage,
          date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadNews(); }, [loadNews]);

  function startNew() {
    setEditing({ ...empty, date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) });
    setCoverFile(null);
    setOpen(true);
  }
  function startEdit(n: Post) { setEditing(n); setCoverFile(null); setOpen(true); }

  async function handleSave() {
    if (!editing.title.trim()) return toast.error("Title is required");
    if (!editing.body.trim()) return toast.error("Article content is required");
    if (!editing.id && !coverFile) return toast.error("A cover image is required for new articles");

    try {
      console.log("--- Editor Upload Debug Start ---");
      const formData = new FormData();
      formData.append("title", editing.title);
      formData.append("tag", editing.tag);
      formData.append("excerpt", editing.excerpt || "");

      const bodyPayload = { sections: [{ type: "text", content: editing.body }] };
      formData.append("body", JSON.stringify(bodyPayload));

      const slug = editing.slug || slugify(editing.title);
      formData.append("slug", slug);

      if (coverFile && typeof coverFile !== "string") {
        console.log("Image found: Attaching binary file to 'coverImage' field.");
        formData.append("coverImage", coverFile);
      }

      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`- ${key}:`, key === 'coverImage' ? (value as File).name : value);
      }

      const url = editing.id ? `/api/v1/news/${editing.id}` : "/api/v1/news";
      const method = editing.id ? "PUT" : "POST";
      console.log(`Sending: ${method} ${url}`);
      console.log("--- Editor Upload Debug End ---");

      await fetchData(url, { method, body: formData });
      toast.success(editing.id ? "Article updated" : "Article published");
      setOpen(false);
      loadNews();
    } catch (err: any) {
      console.error("Editor Save Error:", err);
      toast.error(`Upload failed: ${err.message || "Server Error"}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    try {
      await fetchData(`/api/v1/news/${id}`, { method: "DELETE" });
      toast.success("Article deleted");
      loadNews();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  const filtered = items.filter((n) => (n.title + n.tag + n.excerpt).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="News & Announcements" subtitle="Write, edit and publish posts to the public News page." />
      <Toolbar onSearch={setQ} addLabel="New article" onAdd={startNew} />
      <Card className="relative">
        {loading && items.length === 0 && (
          <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className="overflow-x-auto pb-48">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
              <tr><th className="px-4 py-3">Article</th><th>Tag</th><th>Date</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {n.cover
                        ? <img src={n.cover} alt="" className="h-10 w-14 rounded-md object-cover shrink-0" />
                        : <div className="h-10 w-14 rounded-md bg-muted grid place-items-center shrink-0"><Newspaper className="h-4 w-4 text-muted-foreground" /></div>
                      }
                      <div className="min-w-0">
                        <div className="font-medium truncate">{n.title}</div>
                        <div className="text-xs text-muted-foreground truncate">/{n.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">{n.tag}</span></td>
                  <td className="text-muted-foreground">{n.date}</td>
                  <td className="pr-4"><RowMenu actions={[
                    { label: "Edit", onClick: () => startEdit(n) },
                    { label: "Delete", danger: true, onClick: () => handleDelete(n.id) },
                  ]} /></td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No news posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing.id ? "Edit article" : "New article"}
        footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn onClick={handleSave} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</PrimaryBtn></>}>
        <div className="space-y-4">
          <ImageUpload 
            label="Cover image" 
            value={editing.cover} 
            onChange={(c, f) => { setEditing((e) => ({ ...e, cover: typeof c === "string" ? c : "" })); setCoverFile(f || null); }} 
            aspect="aspect-[16/9]" />
          <Field label="Title">
            <input className={inputCls} value={editing.title}
              onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tag"><input className={inputCls} value={editing.tag} onChange={(e) => setEditing((p) => ({ ...p, tag: e.target.value }))} /></Field>
            <Field label="Date"><input className={inputCls} value={editing.date} onChange={(e) => setEditing((p) => ({ ...p, date: e.target.value }))} placeholder="May 12, 2026" /></Field>
          </div>
          <Field label="Excerpt"><textarea rows={2} className={textareaCls} value={editing.excerpt} onChange={(e) => setEditing((p) => ({ ...p, excerpt: e.target.value }))} /></Field>
          <Field label="Body (full article)"><textarea rows={8} className={textareaCls} value={editing.body} onChange={(e) => setEditing((p) => ({ ...p, body: e.target.value }))} /></Field>
        </div>
      </Modal>
    </div>
  );
}
