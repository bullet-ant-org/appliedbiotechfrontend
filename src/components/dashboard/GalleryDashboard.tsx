import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, PrimaryBtn, Modal, Field, inputCls, textareaCls } from "@/components/dashboard/widgets";
import { Upload, Trash2, Loader2, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

type Meta = { name: string; description: string };
const META_KEY = "ab.gallery.meta.v1";

function loadMeta(): Record<string, Meta> {
  try { return JSON.parse(localStorage.getItem(META_KEY) || "{}"); } catch { return {}; }
}
function saveMeta(m: Record<string, Meta>) {
  try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch {}
}

export function GalleryDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<Record<string, Meta>>({});
  const { loading, fetchData } = useFetch();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/gallery");
      if (res) setItems(res);
    } catch {}
  }, [fetchData]);

  useEffect(() => { load(); setMeta(loadMeta()); }, [load]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function pickFile(f: File | null | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("File must be an image"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Image is over 5MB"); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setPreviewUrl(""); setName(""); setDescription(""); setBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { toast.error("Pick an image first"); return; }
    if (!name.trim()) { toast.error("Add a name"); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("galleryImage", file);
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      const res = await fetchData("/api/v1/gallery/upload", { method: "POST", body: fd });
      const id = res?._id || res?.id;
      if (id) {
        const next = { ...meta, [id]: { name: name.trim(), description: description.trim() } };
        setMeta(next); saveMeta(next);
      }
      toast.success("Image added to gallery");
      setOpen(false); reset();
      load();
    } catch {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/gallery/${id}`, { method: "DELETE" });
      const next = { ...meta }; delete next[id]; setMeta(next); saveMeta(next);
      toast.success("Deleted");
      load();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        subtitle="Upload photos with a name and description. They appear as cards on the public Gallery page."
        actions={<PrimaryBtn onClick={() => { reset(); setOpen(true); }}><Plus className="h-4 w-4" /> New image</PrimaryBtn>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading && items.length === 0 && <div className="col-span-full py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {items.map((g) => {
          const m = meta[g._id] || { name: g.name || "Untitled", description: g.description || "" };
          return (
            <Card key={g._id} className="overflow-hidden group relative">
              <div className="aspect-[4/3] bg-muted">
                <img src={g.url} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold text-sm leading-snug truncate">{m.name}</div>
                {m.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</div>}
              </div>
              <button onClick={() => handleDelete(g._id)} className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-background/90 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          );
        })}
        {!loading && items.length === 0 && (
          <button onClick={() => { reset(); setOpen(true); }} className="col-span-full rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:border-brand p-14 text-center transition-colors">
            <div className="mx-auto h-12 w-12 rounded-full bg-brand/10 text-brand grid place-items-center mb-3"><ImagePlus className="h-5 w-5" /></div>
            <div className="font-medium">No images yet. Add the first one.</div>
            <div className="text-xs text-muted-foreground mt-1">Click to open the upload form</div>
          </button>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => { if (!busy) { setOpen(false); reset(); } }}
        title="Add gallery image"
        footer={
          <>
            <button type="button" onClick={() => { setOpen(false); reset(); }} className="h-10 px-4 rounded-xl border border-border text-sm font-semibold">Cancel</button>
            <button form="gallery-form" type="submit" disabled={busy} className="h-10 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center gap-2 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
            </button>
          </>
        }
      >
        <form id="gallery-form" onSubmit={submit} className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-brand transition-colors p-6 text-center cursor-pointer"
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
            {previewUrl ? (
              <img src={previewUrl} alt="" className="mx-auto max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <div className="mx-auto h-10 w-10 rounded-full bg-brand/10 text-brand grid place-items-center mb-2"><Upload className="h-5 w-5" /></div>
                <div className="text-sm font-medium">Drop image or click to browse</div>
                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">PNG or JPG · Max 5MB</div>
              </>
            )}
          </div>
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DNA Extraction Bench" required />
          </Field>
          <Field label="Description" hint="A short caption shown under the image card.">
            <textarea className={textareaCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's happening in this photo?" />
          </Field>
        </form>
      </Modal>
    </div>
  );
}