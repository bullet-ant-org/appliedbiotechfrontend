import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, textareaCls, PrimaryBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/deal")({ component: AdminDeal });

function AdminDeal() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    product: "",
    eyebrow: "",
    headline: "",
    blurb: "",
    salePrice: 0,
    oldPrice: 0,
    discountLabel: "",
  });
  
  const { loading, fetchData } = useFetch();

  const loadData = useCallback(async () => {
    try {
      const [prodRes, dealRes] = await Promise.all([
        fetchData("/api/v1/shop/products"),
        fetchData("/api/v1/shop/deal-of-the-week")
      ]);

      if (prodRes) setProducts(prodRes);
      if (dealRes) {
        setForm({
          product: dealRes.product?._id || dealRes.product || "",
          eyebrow: dealRes.eyebrow || "",
          headline: dealRes.headline || "",
          blurb: dealRes.blurb || "",
          salePrice: dealRes.salePrice || 0,
          oldPrice: dealRes.oldPrice || 0,
          discountLabel: dealRes.discountLabel || "",
        });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSave() {
    if (!form.product) return toast.error("Please select a product");
    try {
      await fetchData("/api/v1/shop/deal-of-the-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      toast.success("Deal of the week updated");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update deal");
    }
  }

  const selectedProduct = products.find(p => p._id === form.product);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Deal of the Week" 
        subtitle="Featured promotional offer shown on the Shop home page." 
        actions={<PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</PrimaryBtn>} 
      />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 lg:col-span-2 relative overflow-visible">
          <Field label="Target Product">
            <select 
              className={inputCls} 
              value={form.product} 
              onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.productName}</option>
              ))}
            </select>
          </Field>
          <Field label="Eyebrow text"><input className={inputCls} value={form.eyebrow} onChange={e => setForm(p => ({ ...p, eyebrow: e.target.value }))} placeholder="e.g. EXCLUSIVE LAB DEAL" /></Field>
          <Field label="Headline"><input className={inputCls} value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} placeholder="Catchy title for the deal" /></Field>
          <Field label="Promotion blurb"><textarea rows={3} className={textareaCls} value={form.blurb} onChange={e => setForm(p => ({ ...p, blurb: e.target.value }))} placeholder="Short description explaining the offer" /></Field>
          
          <div className="grid grid-cols-3 gap-3">
            <Field label="Sale price (₦)"><input type="number" className={inputCls} value={form.salePrice} onChange={e => setForm(p => ({ ...p, salePrice: +e.target.value }))} /></Field>
            <Field label="Regular price (₦)"><input type="number" className={inputCls} value={form.oldPrice} onChange={e => setForm(p => ({ ...p, oldPrice: +e.target.value }))} /></Field>
            <Field label="Discount label"><input className={inputCls} value={form.discountLabel} onChange={e => setForm(p => ({ ...p, discountLabel: e.target.value }))} placeholder="e.g. 25% OFF" /></Field>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold mb-4">Live Preview</h3>
          {selectedProduct ? (
            <div className="rounded-3xl bg-foreground text-background p-8 relative overflow-hidden shadow-xl border border-border">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full gradient-brand opacity-30 blur-3xl" />
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent-cyan font-bold">{form.eyebrow || "PROMOTION"}</div>
                <h4 className="mt-3 font-display text-2xl md:text-3xl font-extrabold leading-tight text-white">{form.headline || "Deal Headline"}</h4>
                <p className="mt-3 text-background/70 text-sm line-clamp-3">{form.blurb || "Description of the amazing deal..."}</p>
                
                <div className="mt-6 flex items-center gap-4">
                  <div className="font-display text-3xl font-bold text-accent-cyan">₦{form.salePrice.toLocaleString()}</div>
                  <div className="text-background/50 line-through text-sm">₦{form.oldPrice.toLocaleString()}</div>
                  <span className="px-2 py-0.5 rounded-full bg-accent-cyan text-foreground text-[10px] font-bold">{form.discountLabel}</span>
                </div>
                
                <div className="mt-8 aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <img src={selectedProduct.productImage} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-border rounded-2xl grid place-items-center text-muted-foreground text-sm text-center px-6">
              <Tag className="h-8 w-8 mb-2 opacity-20" />
              Select a product to see how the deal banner will look on the homepage.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
