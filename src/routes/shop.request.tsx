import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { CheckCircle2, ArrowRight, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/shop/request")({
  component: RequestProductPage,
  head: () => ({ meta: [{ title: "Request a Product · Applied Biotech Shop" }] }),
});

function RequestProductPage() {
  const { fetchData, loading } = useFetch();
  const [form, setForm] = useState({ fullName: "", email: "", productName: "", description: "" });
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { fullName, email, productName, description } = form;
    if (!fullName.trim() || !email.trim() || !productName.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const res = await fetchData("/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        subject: `Product Request: ${productName.trim()}`,
        message: description.trim(),
      }),
    });
    if (res) {
      setSent(true);
      toast.success("Request sent! We'll get back to you shortly.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const inputCls = "w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
  const textareaCls = "w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        eyebrow="Shop"
        title={<>Can't find what you <span className="gradient-text">need?</span></>}
        subtitle="If a product, reagent or kit isn't listed in our shop, send us a request. Our procurement team will source it or point you in the right direction."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {sent ? (
            <div className="text-center py-20 bg-card border border-border rounded-3xl px-8">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center mx-auto mb-4">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="font-display text-2xl font-bold">Request received!</h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Thanks! Our procurement team typically responds within 24–48 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ fullName: "", email: "", productName: "", description: "" }); }}
                className="mt-6 text-sm font-semibold text-brand hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
              {/* Info panel */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <Package className="h-8 w-8 text-brand mb-3" />
                  <h3 className="font-display font-bold text-lg">How it works</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {[
                      "Fill in your name, email, and the product you need",
                      "We receive your request instantly",
                      "Our team sources it and responds within 24–48 hours",
                      "We'll reach out with pricing and availability",
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full gradient-brand text-brand-foreground text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 text-sm">
                  <div className="font-semibold mb-2">What we can source</div>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {["Molecular biology reagents & kits", "Diagnostic consumables", "Lab equipment & instruments", "Cold-chain chemicals", "PPE & safety supplies"].map((item) => (
                      <li key={item} className="flex gap-2"><ArrowRight className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" /> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-7 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full name *</label>
                    <input required className={inputCls} value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email address *</label>
                    <input required type="email" className={inputCls} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@lab.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Product name *</label>
                  <input required className={inputCls} value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} placeholder="e.g. QIAamp DNA Mini Kit, 50 reactions" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Description / specifications *</label>
                  <textarea required rows={5} className={textareaCls} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the product in as much detail as possible — catalogue number, brand, quantity needed, urgency, any other requirements..." />
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center justify-center gap-2 shadow-brand hover:scale-[1.01] transition-transform disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Send request</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
