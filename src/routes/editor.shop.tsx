import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Modal, Field, Toolbar, RowMenu, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { Package, Eye, EyeOff, Loader2, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fmt } from "@/lib/products";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/shop")({ component: EditorShop });

interface Item { 
  id: string; 
  name: string; 
  price: number; 
  stock: number; 
  status: "active" | "draft"; 
  img: string; 
  category: string; 
  description: string; 
  tags?: string[];
  shippingNote?: string;
  shippingFee?: number;
  shippingType?: "standalone" | "bulk";
  pickupAvailable?: boolean;
}

function EditorShop() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("₦");
  const { loading, fetchData } = useFetch();

  const loadSettings = useCallback(async () => {
    try {
      const collRes = await fetchData("/api/v1/collections");
      if (collRes) setCollections(collRes);

      const contentRes = await fetchData("/api/v1/content");
      if (contentRes) {
        const currencySetting = contentRes.find((c: any) => c.key === "currency");
        if (currencySetting) {
          const symbol = currencySetting.value.match(/\((.+)\)/)?.[1] || currencySetting.value;
          setCurrencySymbol(symbol);
        }
      }
    } catch (err) {}
  }, [fetchData]);

  const loadProducts = useCallback(async () => {
    try {
      const result = await fetchData("/api/v1/shop/products");
      if (result) {
        const normalized = result.map((p: any) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          stock: p.stock,
          status: p.status,
          img: p.productImage,
          category: p.category,
          description: p.description,
          tags: p.tags || [],
          shippingNote: p.shippingNote || "",
          shippingFee: p.shippingFee || 0,
          shippingType: p.shippingType || "standalone",
          pickupAvailable: !!p.pickupAvailable,
        }));
        setItems(normalized);
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { 
    loadProducts(); 
    loadSettings();
  }, [loadProducts, loadSettings]);

  async function handleSave(data: any) {
    const formData = new FormData();
    formData.append("productName", data.name);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("category", data.category);
    formData.append("status", data.status.toLowerCase());
    formData.append("description", data.description);
    formData.append("tags", JSON.stringify(data.tags || []));
    formData.append("shippingNote", data.shippingNote || "");
    formData.append("shippingFee", String(data.shippingFee || 0));
    formData.append("shippingType", data.shippingType || "standalone");
    formData.append("pickupAvailable", String(!!data.pickupAvailable));
    
    if (data.img) {
      // Fix: Ensure image is sent on creation even if provided as a string preview
      if (typeof data.img !== "string") {
        formData.append("productImage", data.img);
      } else if (!data.id) {
        formData.append("productImage", data.img);
      }
    }

    try {
      const url = data.id ? `/api/v1/shop/products/${data.id}` : "/api/v1/shop/products";
      const method = data.id ? "PUT" : "POST";
      
      const result = await fetchData(url, { method, body: formData });
      if (result) {
        // Relationship Sync: Update the collection registry
        const targetColl = collections.find(c => c.collectionName === data.category);
        if (targetColl) {
          const productId = result._id || data.id;
          const currentItems = (targetColl.items || []).map((i: any) => typeof i === 'string' ? i : (i._id || i.id));
          
          if (!currentItems.includes(productId)) {
            const newItems = [...currentItems, productId];
            await fetchData(`/api/v1/collections/${targetColl._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: newItems })
            });
          }
        }

        toast.success(data.id ? "Product updated" : "Product added");
        setOpen(false); setEditing(null);
        loadProducts();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/shop/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      loadProducts();
    } catch (err: any) {
      toast.error("Failed to delete product");
    }
  }

  async function toggleStatus(p: Item) {
    const nextStatus = p.status === "active" ? "draft" : "active";
    try {
      await fetchData(`/api/v1/shop/products/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
        headers: { "Content-Type": "application/json" }
      });
      toast.success(`Product ${nextStatus === "active" ? "published" : "unpublished"}`);
      loadProducts();
    } catch (err) {
      toast.error("Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Shop items" subtitle="Edit product copy, pricing, imagery and visibility." />
      <Toolbar onSearch={setQ} addLabel="New item" onAdd={() => { setEditing(null); setOpen(true); }} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
        {loading && items.length === 0 && (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}
        {items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).map((p) => (
          <Card key={p.id} className="group relative">
            <div className="aspect-[4/3] bg-muted rounded-t-2xl overflow-hidden relative">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${p.status === "active" ? "bg-emerald-500/90 text-white" : "bg-muted text-muted-foreground"}`}>
                {p.status === "active" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {p.status}
              </span>
            </div>
            <div className="absolute top-2 right-2 z-20"><RowMenu actions={[
              { label: "Edit", onClick: () => { setEditing(p); setOpen(true); } },
              { label: p.status === "active" ? "Unpublish" : "Publish", onClick: () => toggleStatus(p) },
              { label: "Delete", danger: true, onClick: () => handleDelete(p.id) },
            ]} /></div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground capitalize">{p.category}</div>
              <div className="font-semibold text-sm mt-0.5 line-clamp-2 min-h-[2.5em]">{p.name}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-display font-bold text-base">{fmt(p.price)}</div>
                <div className={`text-xs ${p.stock === 0 ? "text-destructive" : p.stock < 20 ? "text-amber-600" : "text-muted-foreground"}`}>
                  <Package className="inline h-3 w-3 mr-1" />{p.stock}
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <button 
                  onClick={() => { setEditing(p); setOpen(true); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ItemModal 
        key={editing?.id ?? "new"} 
        open={open} 
        onClose={() => { setOpen(false); setEditing(null); }} 
        editing={editing} 
        onSave={handleSave} 
        loading={loading} 
        collectionsList={collections.map(c => c.collectionName)}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

function ItemModal({ open, onClose, editing, onSave, loading, collectionsList, currencySymbol }: { open: boolean; onClose: () => void; editing: Item | null; onSave: (i: any) => void; loading: boolean; collectionsList: string[]; currencySymbol: string }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [price, setPrice] = useState(editing?.price ?? 0);
  const [stock, setStock] = useState(editing?.stock ?? 0);
  const [category, setCategory] = useState(editing?.category ?? collectionsList[0] ?? "reagents");
  const [status, setStatus] = useState<string>(editing?.status ?? "active");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [img, setImg] = useState<string | undefined>(editing?.img);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState((editing?.tags || []).join(", "));
  const [shippingNote, setShippingNote] = useState(editing?.shippingNote || "");
  const [shippingFee, setShippingFee] = useState(editing?.shippingFee || 0);
  const [shippingType, setShippingType] = useState<string>(editing?.shippingType || "standalone");
  const [pickupAvailable, setPickupAvailable] = useState(!!editing?.pickupAvailable);

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit item" : "New item"}
      footer={<><GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={loading} onClick={() => {
          if (!name.trim()) return toast.error("Name required");
          onSave({
            id: editing?.id ?? "", name, price: +price, stock: +stock, category, status, description, img: imgFile || img || "",
            tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
            shippingNote, shippingFee: Number(shippingFee), shippingType, pickupAvailable,
          });
        }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </PrimaryBtn></>}>
      <div className="space-y-4">
        <ImageUpload 
          label="Product image" 
          value={img} 
          onChange={(v, f) => { 
            setImg(typeof v === 'string' ? v : undefined); 
            if (f) setImgFile(f); 
          }} />
        <Field label="Product name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Price (${currencySymbol})`}><input type="number" className={inputCls} value={price} onChange={(e) => setPrice(+e.target.value)} /></Field>
          <Field label="Stock"><input type="number" className={inputCls} value={stock} onChange={(e) => setStock(+e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Collection">
            <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
              {collectionsList.map((c) => <option key={c} value={c}>{c}</option>)}
              {collectionsList.length === 0 && <option value="reagents">reagents</option>}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="active">Active</option><option value="draft">Draft</option>
            </select>
          </Field>
        </div>
        <Field label="Description"><textarea rows={3} className={textareaCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Tags" hint="Comma-separated. Used for filters and badges (e.g. hot, new, sale).">
          <input className={inputCls} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. hot, new, bestseller" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Shipping fee (${currencySymbol})`}><input type="number" className={inputCls} value={shippingFee} onChange={(e) => setShippingFee(+e.target.value)} /></Field>
          <Field label="Shipping type">
            <select className={inputCls} value={shippingType} onChange={(e) => setShippingType(e.target.value)}>
              <option value="standalone">Standalone</option>
              <option value="bulk">Bulk</option>
            </select>
          </Field>
        </div>
        <Field label="Shipping note" hint="Shown to customers on the product page.">
          <textarea className={textareaCls} rows={2} value={shippingNote} onChange={(e) => setShippingNote(e.target.value)} placeholder="e.g. Ships within 2-3 business days from Lagos warehouse" />
        </Field>
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input type="checkbox" className="h-4 w-4 accent-current" checked={pickupAvailable} onChange={(e) => setPickupAvailable(e.target.checked)} />
          Pickup available for this product
        </label>
      </div>
    </Modal>
  );
}
