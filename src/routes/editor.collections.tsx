import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Modal, Field, Toolbar, RowMenu, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/collections")({ component: EditorCollections });

interface Coll { 
  id: string; 
  name: string; 
  items: number; 
  status: "Published" | "Draft"; 
  cover?: string; 
  description: string;
  productIds: string[];
  updatedAt: string;
}

function EditorCollections() {
  const [items, setItems] = useState<Coll[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coll | null>(null);
  const [allProducts, setAllProducts] = useState<{id: string, name: string, img: string, price: number}[]>([]);

  const { loading, fetchData } = useFetch();

  const loadCollections = useCallback(async () => {
    try {
      const result = await fetchData("/api/v1/collections");
      if (result) {
        setItems(result.map((c: any) => ({
          id: c._id,
          name: c.collectionName,
          items: c.items?.length || 0,
          status: c.status === "published" ? "Published" : "Draft",
          description: c.description || "",
          cover: c.coverImage,
          productIds: (c.items || []).map((p: any) => typeof p === 'string' ? p : p._id),
          updatedAt: c.updatedAt
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { 
    loadCollections(); 
    fetchData("/api/v1/shop/products").then(res => {
      if (res) setAllProducts(res.map((p: any) => ({ id: p._id, name: p.productName, img: p.productImage, price: p.price })));
    });
  }, [fetchData, loadCollections]);

  async function save(form: any) {
    const formData = new FormData();
    formData.append("collectionName", form.name);
    formData.append("description", form.description);
    formData.append("status", form.status === "Published" ? "published" : "unpublished");
    formData.append("items", JSON.stringify(form.productIds));

    if (form.coverFile) formData.append("coverImage", form.coverFile);

    try {
      const url = editing ? `/api/v1/collections/${editing.id}` : "/api/v1/collections";
      await fetchData(url, { method: editing ? "PUT" : "POST", body: formData });
      toast.success(editing ? "Collection updated" : "Collection created");
      setOpen(false); setEditing(null); loadCollections();
    } catch (err: any) { toast.error(err.message || "Failed to save collection"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    try { await fetchData(`/api/v1/collections/${id}`, { method: "DELETE" }); toast.success("Deleted"); loadCollections(); } catch (err) {}
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Collections" subtitle="Group products into curated bundles." />
      <Toolbar onSearch={setQ} addLabel="New collection" onAdd={() => { setEditing(null); setOpen(true); }} />

      <Card className="relative overflow-visible">
        {loading && items.length === 0 && <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        <div className="overflow-x-auto pb-48">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
              <tr><th className="px-4 py-3">Collection</th><th>Items</th><th>Status</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium flex items-center gap-3">
                    {c.cover ? <img src={c.cover} className="h-9 w-9 rounded-lg object-cover" /> : <span className="h-9 w-9 rounded-xl gradient-brand grid place-items-center text-brand-foreground"><Layers className="h-4 w-4" /></span>}
                    {c.name}
                  </td>
                  <td>{c.items}</td>
                  <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === "Published" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{c.status}</span></td>
                  <td className="text-muted-foreground">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  <td className="pr-4"><RowMenu actions={[{ label: "Edit", onClick: () => { setEditing(c); setOpen(true); } }, { label: "Delete", danger: true, onClick: () => handleDelete(c.id) }]} /></td>
                </tr>
              ))}
              {!loading && items.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No collections found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <CollModal key={editing?.id ?? "new"} open={open} onClose={() => { setOpen(false); setEditing(null); }} editing={editing} onSave={save} loading={loading} allProducts={allProducts} />
    </div>
  );
}

function CollModal({ open, onClose, editing, onSave, loading, allProducts }: { open: boolean; onClose: () => void; editing: any; onSave: (c: any) => void; loading: boolean; allProducts: any[] }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [status, setStatus] = useState<"Published" | "Draft">(editing?.status ?? "Draft");
  const [cover, setCover] = useState<string | undefined>(editing?.cover);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(editing?.productIds ?? []);

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit collection" : "New collection"}
      footer={<><GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={loading} onClick={() => { if (!name.trim()) return toast.error("Name required"); onSave({ name, description, status, coverFile, productIds: selectedProducts }); }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </PrimaryBtn></>}>
      <div className="space-y-4">
        <ImageUpload label="Cover image" value={cover} onChange={(val) => { if (typeof val === 'string') setCover(val); else { setCoverFile(val); setCover(URL.createObjectURL(val)); } }} aspect="aspect-[16/9]" />
        <Field label="Collection name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Description"><textarea rows={3} className={textareaCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option>Published</option><option>Draft</option>
          </select>
        </Field>
        <Field label="Included Products">
          <div className="border border-border rounded-xl p-2 max-h-48 overflow-y-auto space-y-1 bg-background/50">
            {allProducts.map(p => (
              <label key={p.id} className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-lg cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.includes(p.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedProducts(prev => [...prev, p.id]);
                    else setSelectedProducts(prev => prev.filter(id => id !== p.id));
                  }}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <img src={p.img} className="h-6 w-6 rounded object-cover" />
                <span className="flex-1 truncate">{p.name}</span>
              </label>
            ))}
            {allProducts.length === 0 && <div className="text-center py-4 text-xs text-muted-foreground">No products available.</div>}
          </div>
        </Field>
      </div>
    </Modal>
  );
}
