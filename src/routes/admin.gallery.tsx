import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, Modal, Field, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Trash2, Copy, Plus, Calendar, HardDrive } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

interface GalleryItem {
  id: string;
  url: string;
  name: string;
  description: string;
  date: string;
}

function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  
  // Upload form state
  const [file, setFile] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const { loading, fetchData } = useFetch();

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/gallery");
      if (res) {
        setItems(res.map((i: any) => ({
          id: i._id,
          url: i.url,
          name: i.name || "Untitled Asset",
          description: i.description || "",
          date: new Date(i.createdAt).toLocaleDateString()
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  async function handleUpload() {
    if (!file) return toast.error("Please select a file to upload");
    setUploading(true);
    try {
      // Aligning with Backend README Section 4.7: Single Atomic Multipart Request
      const formData = new FormData();
      formData.append("galleryImage", file);
      formData.append("name", name || (file instanceof File ? file.name : "Media Asset"));
      formData.append("description", description);

      await fetchData("/api/v1/gallery/upload", { method: "POST", body: formData });

      toast.success("Media asset uploaded and cataloged");
      setOpen(false);
      setFile(null); setName(""); setDescription("");
      loadGallery();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this asset?")) return;
    try {
      await fetchData(`/api/v1/gallery/${id}`, { method: "DELETE" });
      toast.success("Asset deleted");
      loadGallery();
    } catch (err: any) {
      toast.error("Delete failed");
    }
  }

  const filtered = items.filter(i => (i.name + i.description).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Media Gallery" subtitle="Manage high-resolution images used across the site." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={ImageIcon} label="Total Assets" value={items.length} />
        <Stat icon={Calendar} label="Last Upload" value={items[0]?.date || "N/A"} />
        <Stat icon={HardDrive} label="Storage" value="Cloudinary" />
        <Stat icon={Plus} label="New Today" value={items.filter(i => i.date === new Date().toLocaleDateString()).length} />
      </div>

      <Toolbar onSearch={setQ} addLabel="Upload media" onAdd={() => setOpen(true)} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative pb-20">
        {loading && items.length === 0 && (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}
        {filtered.map((i) => (
          <Card key={i.id} className="overflow-hidden group">
            <div className="aspect-square bg-muted relative">
              <img src={i.url} alt={i.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors grid place-items-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <button onClick={() => { navigator.clipboard.writeText(i.url); toast.success("URL copied to clipboard"); }} title="Copy URL" className="h-9 w-9 grid place-items-center rounded-full bg-white/95 text-foreground hover:bg-brand hover:text-brand-foreground transition-all"><Copy className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(i.id)} title="Delete asset" className="h-9 w-9 grid place-items-center rounded-full bg-white/95 text-destructive hover:bg-destructive hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="text-xs font-bold truncate leading-tight">{i.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{i.date}</div>
            </div>
          </Card>
        ))}
        {!loading && filtered.length === 0 && <div className="col-span-full py-20 text-center text-muted-foreground">No media assets found.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Upload New Media"
        footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn disabled={loading || uploading} onClick={handleUpload}>{(loading || uploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Upload"}</PrimaryBtn></>}>
        <div className="space-y-4">
          <ImageUpload label="Select image" value={file} onChange={setFile} />
          <Field label="Asset name"><input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lab equipment A" /></Field>
          <Field label="Description (Alt text)"><textarea rows={3} className={textareaCls} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description for SEO" /></Field>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return <Card className="p-4 flex items-center gap-3">
    <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></span>
    <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-display font-bold text-lg">{value}</div></div>
  </Card>;
}
