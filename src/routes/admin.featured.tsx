import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, Award, Plus, Trash2, Upload, X } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/featured")({ component: FeaturedPage });

interface FeatItem { id: string; name: string; description: string; imageUrl: string; imageFile?: File | null; }

function FeaturedPage() {
  const [items, setItems] = useState<FeatItem[]>([]);
  const { loading, fetchData } = useFetch();

  const loadData = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/shop/featured-product");
      if (Array.isArray(res)) {
        setItems(res.map((r: any) => ({
          id: r._id || Math.random().toString(36),
          name: r.name || r.headline || "",
          description: r.description || r.blurb || "",
          imageUrl: r.imageUrl || r.product?.productImage || "",
          imageFile: null,
        })));
      } else if (res && (res.name || res.headline)) {
        setItems([{
          id: res._id || "1",
          name: res.name || res.headline || "",
          description: res.description || res.blurb || "",
          imageUrl: res.imageUrl || res.product?.productImage || "",
          imageFile: null,
        }]);
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadData(); }, [loadData]);

  function addItem() {
    setItems(prev => [...prev, { id: Math.random().toString(36), name: "", description: "", imageUrl: "", imageFile: null }]);
  }

  function removeItem(id: string) { setItems(prev => prev.filter(i => i.id !== id)); }

  function updateItem(id: string, patch: Partial<FeatItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  async function handleSave() {
    const valid = items.filter(i => i.name.trim());
    if (valid.length === 0) return toast.error("Add at least one featured item with a name");

    try {
      // Send each item as FormData (the backend upserts the whole list)
      const formData = new FormData();
      formData.append("items", JSON.stringify(valid.map(i => ({
        name: i.name,
        description: i.description,
        imageUrl: i.imageUrl,
      }))));
      valid.forEach((item, idx) => {
        if (item.imageFile) formData.append(`image_${idx}`, item.imageFile);
      });

      await fetchData("/api/v1/shop/featured-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid.map(i => ({
          name: i.name,
          description: i.description,
          imageUrl: i.imageUrl,
        }))),
      });
      toast.success(`${valid.length} featured item${valid.length > 1 ? "s" : ""} saved`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Featured Products"
        subtitle="Add up to 20 featured items — shown on the landing page, shop hero and deals page. Each item has a name, description and image."
        actions={
          <div className="flex gap-2">
            <GhostBtn onClick={addItem} disabled={items.length >= 20}><Plus className="h-4 w-4 mr-1" /> Add item</GhostBtn>
            <PrimaryBtn onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save all"}
            </PrimaryBtn>
          </div>
        }
      />

      {items.length === 0 && (
        <Card className="p-12 text-center">
          <Award className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No featured items yet.</p>
          <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-5 py-2.5 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Add your first item
          </button>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <FeatCard key={item.id} item={item} idx={idx} onUpdate={updateItem} onRemove={removeItem} />
        ))}
      </div>
    </div>
  );
}

function FeatCard({ item, idx, onUpdate, onRemove }: { item: FeatItem; idx: number; onUpdate: (id: string, p: Partial<FeatItem>) => void; onRemove: (id: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputCls = "w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    const reader = new FileReader();
    reader.onload = e => onUpdate(item.id, { imageUrl: e.target?.result as string, imageFile: file });
    reader.readAsDataURL(file);
  }

  return (
    <Card className="p-5 flex flex-col gap-3 relative group">
      <button onClick={() => onRemove(item.id)}
        className="absolute top-3 right-3 h-7 w-7 grid place-items-center rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white">
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Image */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${item.imageUrl ? "border-transparent" : "border-dashed border-border hover:border-brand"}`}
      >
        {item.imageUrl ? (
          <div className="relative aspect-[16/9] group/img">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity grid place-items-center">
              <span className="text-white text-xs font-semibold flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> Change</span>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/9] bg-secondary/60 grid place-items-center">
            <div className="text-center">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <span className="text-xs text-muted-foreground">Click to upload image</span>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>

      {/* Fields */}
      <input className={inputCls} placeholder="Name *" value={item.name}
        onChange={e => onUpdate(item.id, { name: e.target.value })} />
      <textarea rows={3} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        placeholder="Description" value={item.description}
        onChange={e => onUpdate(item.id, { description: e.target.value })} />

      <div className="text-[10px] text-muted-foreground text-right">Item {idx + 1}</div>
    </Card>
  );
}
