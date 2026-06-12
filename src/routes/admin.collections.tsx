import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Modal, Field, Toolbar, RowMenu, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/collections")({ component: AdminCollections });

interface Coll { 
  id: string; 
  name: string; 
  items: number; 
  status: "Published" | "Draft"; 
  updatedAt: string; 
  description: string;
  cover?: string;
  productIds: string[];
}

function AdminCollections() {
  const [items, setItems] = useState<Coll[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coll | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<{id: string, name: string, img: string, price: number}[]>([]);
  
  const { loading, fetchData } = useFetch();

  const loadCollections = useCallback(async () => {
    try {
      const result = await fetchData("/api/v1/collections");
      if (result) {
        const normalized = result.map((c: any) => ({
          id: c._id,
          name: c.collectionName,
          items: c.items?.length || 0,
          // Handle both populated objects and raw IDs
          productIds: (c.items || []).map((p: any) => typeof p === 'string' ? p : p._id),
          // Map backend 'published'/'unpublished' to UI 'Published'/'Draft'
          status: c.status === "published" ? "Published" : "Draft",
          updatedAt: c.updatedAt,
          description: c.description,
          cover: c.coverImage
        }));
        setItems(normalized);
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { 
    loadCollections(); 
    // Load available products for selection
    fetchData("/api/v1/shop/products").then(res => {
      if (res) {
        setAllProducts(res.map((p: any) => ({
          id: p._id,
          name: p.productName,
          img: p.productImage,
          price: p.price
        })));
      }
    });
  }, [fetchData, loadCollections]);

  async function handleSave() {
    if (!name.trim()) return toast.error("Enter a name");
    if (!cover) return toast.error("Please upload a cover image");
    
    const formData = new FormData();
    formData.append("collectionName", name);
    formData.append("description", description);
    // Map UI 'Published'/'Draft' back to backend 'published'/'unpublished'
    formData.append("status", (editing ? editing.status : "Draft") === "Published" ? "published" : "unpublished");
    
    // Spec requirement: Sent as stringified JSON array
    formData.append("items", JSON.stringify(selectedProducts));

    if (cover) {
      if (typeof cover !== "string") formData.append("coverImage", cover);
      else if (!editing) formData.append("coverImage", cover);
    }

    try {
      const url = editing ? `/api/v1/collections/${editing.id}` : "/api/v1/collections";
      const method = editing ? "PUT" : "POST";
      
      const result = await fetchData(url, { method, body: formData });
      if (result) {
        toast.success(editing ? "Collection updated" : "Collection created");
        setOpen(false);
        setEditing(null);
        setName(""); 
        setDescription(""); 
        setCover(undefined); 
        setSelectedProducts([]);
        loadCollections();
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${editing ? "update" : "create"} collection`);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/collections/${id}`, { method: "DELETE" });
      toast.success("Collection deleted");
      loadCollections();
    } catch (err) { toast.error("Failed to delete"); }
  }

  async function toggleStatus(c: Coll) {
    const nextUI = c.status === "Published" ? "Draft" : "Published";
    const nextBackend = nextUI === "Published" ? "published" : "unpublished";
    try {
      await fetchData(`/api/v1/collections/${c.id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextBackend }) 
      });
      toast.success(`Collection ${nextUI === "Published" ? "published" : "unpublished"}`);
      loadCollections();
    } catch (err) { toast.error("Update failed"); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Collections" subtitle="Group products into curated bundles." />
      <Toolbar onSearch={setQ} addLabel="New collection" onAdd={() => { 
        setEditing(null); 
        setName(""); 
        setDescription(""); 
        setCover(undefined); 
        setSelectedProducts([]);
        setOpen(true); 
      }} />

      <Card className="relative overflow-visible">
        {loading && items.length === 0 && (
          <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}
        <div className="overflow-x-auto pb-48">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
              <tr><th className="px-4 py-3">Collection</th><th>Items</th><th>Status</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.filter((i) => i.name?.toLowerCase().includes(q.toLowerCase())).map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium flex items-center gap-3">
                    {c.cover ? (
                      <img src={c.cover} className="h-9 w-9 rounded-lg object-cover" alt="" />
                    ) : (
                      <span className="h-9 w-9 rounded-xl gradient-brand grid place-items-center text-brand-foreground"><Layers className="h-4 w-4" /></span>
                    )}
                    {c.name}
                  </td>
                  <td>{c.items}</td>
                  <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${c.status === "Published" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{c.status}</span></td>
                  <td className="text-muted-foreground">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  <td className="pr-4"><RowMenu actions={[
                    { label: "Edit", onClick: () => { 
                      setEditing(c); 
                    setName(c.name); 
                    setDescription(c.description); 
                    setCover(c.cover); 
                    setSelectedProducts(c.productIds);
                    setOpen(true); 
                  } },
                  { label: c.status === "Published" ? "Unpublish" : "Publish", onClick: () => toggleStatus(c) },
                  { label: "Delete", danger: true, onClick: () => handleDelete(c.id) },
                ]} /></td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No collections found.</td></tr>}
          </tbody>
        </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit collection" : "New collection"}
        footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save Changes" : "Create"}</PrimaryBtn></>}>
        <div className="space-y-4">
          <ImageUpload label="Cover image" value={cover} onChange={setCover} aspect="aspect-[16/9]" />
          <Field label="Collection name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="E.g. Holiday Promo Pack" /></Field>
          <Field label="Description"><textarea rows={3} className={textareaCls} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" /></Field>
          <Field label="Products in this bundle">
            <div className="border border-border rounded-xl p-2 max-h-48 overflow-y-auto space-y-1 bg-background/50">
              {allProducts.map(p => (
                <label key={p.id} className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-lg cursor-pointer text-sm">
                  <input 
                    type="checkbox" 
                    className="rounded border-input text-primary focus:ring-primary"
                    checked={selectedProducts.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProducts(prev => [...prev, p.id]);
                      else setSelectedProducts(prev => prev.filter(id => id !== p.id));
                    }}
                  />
                  <img src={p.img} className="h-6 w-6 rounded object-cover" />
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="text-muted-foreground text-xs">₦{p.price.toLocaleString()}</span>
                </label>
              ))}
              {allProducts.length === 0 && <div className="text-center py-4 text-xs text-muted-foreground">No products available to add.</div>}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
}