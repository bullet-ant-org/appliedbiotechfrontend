import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, PrimaryBtn } from "@/components/dashboard/widgets";
import { Upload, Trash2, Copy, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/media")({ component: Media });

interface Asset { id: string; name: string; url: string; description: string; date: string; }

function Media() {
  const [items, setItems] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const { loading, fetchData } = useFetch();

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/gallery");
      if (res) {
        setItems(res.map((i: any) => ({
          id: i._id,
          name: i.name || "Untitled",
          url: i.url,
          description: i.description || "",
          date: new Date(i.createdAt).toLocaleDateString(),
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }
        const formData = new FormData();
        formData.append("galleryImage", file);
        formData.append("name", file.name);
        formData.append("description", "");
        await fetchData("/api/v1/gallery/upload", { method: "POST", body: formData });
      }
      toast.success(`${files.length} file(s) uploaded`);
      loadGallery();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this asset?")) return;
    try {
      await fetchData(`/api/v1/gallery/${id}`, { method: "DELETE" });
      toast.success("Asset removed");
      loadGallery();
    } catch (err: any) { toast.error("Delete failed"); }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <input ref={ref} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { upload(e.target.files); e.currentTarget.value = ""; }} />
      <PageHeader
        title="Media Library"
        subtitle="Reusable images and assets used across the site."
        actions={
          <PrimaryBtn onClick={() => ref.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload"}
          </PrimaryBtn>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search assets…"
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading && items.length === 0 ? (
        <div className="py-24 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((a) => (
            <Card key={a.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={a.url} alt={a.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors grid place-items-center gap-2 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(a.url)}
                      className="h-8 w-8 rounded-full bg-white/90 grid place-items-center hover:bg-white transition-colors">
                      <Copy className="h-3.5 w-3.5 text-foreground" />
                    </button>
                    <button onClick={() => handleDelete(a.id)}
                      className="h-8 w-8 rounded-full bg-red-500/90 grid place-items-center hover:bg-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">{a.name}</div>
                <div className="text-[10px] text-muted-foreground">{a.date}</div>
              </div>
            </Card>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No assets yet. Upload your first image.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
