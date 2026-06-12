import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, textareaCls, PrimaryBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/deal")({ component: DealAdmin });

function DealAdmin() {
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
        fetchData("/api/v1/shop/deal-of-the-week"),
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
        body: JSON.stringify(form),
      });
      toast.success("Deal of the week updated");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update deal");
    }
  }

  const selectedProduct = products.find((p) => p._id === form.product);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deal of the Week"
        subtitle="Featured promotional offer shown on the Shop home page."
        actions={
          <PrimaryBtn disabled={loading} onClick={handleSave}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </PrimaryBtn>
        }
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 lg:col-span-2 relative overflow-visible">
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur z-10 grid place-items-center rounded-2xl">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          )}
          <Field label="Target Product">
            <select
              className={inputCls}
              value={form.product}
              onChange={(e) => setForm((p) => ({ ...p, product: e.target.value }))}
            >
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.productName}</option>
              ))}
            </select>
          </Field>
          <Field label="Eyebrow text">
            <input className={inputCls} value={form.eyebrow} placeholder="e.g. LIMITED TIME OFFER"
              onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))} />
          </Field>
          <Field label="Headline">
            <input className={inputCls} value={form.headline}
              onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))} />
          </Field>
          <Field label="Blurb">
            <textarea rows={3} className={textareaCls} value={form.blurb}
              onChange={(e) => setForm((p) => ({ ...p, blurb: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Sale price (₦)">
              <input type="number" className={inputCls} value={form.salePrice}
                onChange={(e) => setForm((p) => ({ ...p, salePrice: Number(e.target.value) }))} />
            </Field>
            <Field label="Old price (₦)">
              <input type="number" className={inputCls} value={form.oldPrice}
                onChange={(e) => setForm((p) => ({ ...p, oldPrice: Number(e.target.value) }))} />
            </Field>
            <Field label="Discount label">
              <input className={inputCls} value={form.discountLabel} placeholder="-50% OFF"
                onChange={(e) => setForm((p) => ({ ...p, discountLabel: e.target.value }))} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-brand" /> Preview
          </h3>
          {selectedProduct ? (
            <div className="rounded-2xl bg-foreground text-background p-5 relative overflow-hidden">
              <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold">{form.eyebrow || "EYEBROW"}</div>
              <h4 className="mt-2 font-display text-lg font-extrabold leading-tight">{form.headline || "Headline goes here"}</h4>
              <p className="mt-1.5 text-background/65 text-sm line-clamp-2">{form.blurb || "Blurb text goes here."}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="font-display text-xl font-bold text-accent-cyan">₦{(form.salePrice || 0).toLocaleString()}</div>
                <div className="text-background/50 line-through text-sm">₦{(form.oldPrice || 0).toLocaleString()}</div>
                <span className="px-2 py-0.5 rounded-full bg-accent-cyan text-foreground text-xs font-bold">{form.discountLabel || "-0%"}</span>
              </div>
              {selectedProduct.productImage && (
                <img src={selectedProduct.productImage} alt="" className="mt-3 rounded-xl w-full aspect-video object-cover" />
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border h-48 grid place-items-center text-muted-foreground text-sm">
              Select a product to preview
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
