import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, Search, Loader2, AlertCircle } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

export const Route = createFileRoute("/shop/track")({
  component: TrackPage,
  head: () => ({
    meta: [
      { title: "Track Order · Applied Biotech Shop" },
      { name: "description", content: "Enter your tracking code to see your order status." },
    ],
  }),
});

const STEPS = [
  { key: "ordered", label: "Ordered", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function TrackPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<null | { code: string; step: number; eta: string }>(null);
  const { loading, fetchData } = useFetch();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;

    try {
      // Per README Section 4.10: GET /api/v1/payments/track/:code
      const res = await fetchData(`/api/v1/payments/track/${c}`);
      if (res) {
        const backendStatus = String(res.status || "pending").toLowerCase();
        
        // Mapping backend Enum range values to UI steps
        const mapping: Record<string, number> = {
          pending: 0,
          paid: 0,
          processing: 1,
          shipped: 2,
          out: 3, // Inferred status
          delivered: 4,
          failed: -1
        };

        const step = mapping[backendStatus] ?? 0;
        setStatus({ code: c.toUpperCase(), step, eta: res.eta || "2–3 business days" });
      }
    } catch (err: any) {
      toast.error(err.message || "Tracking code not found. Please check your email.");
      setStatus(null);
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold">Track your order</h1>
        <p className="text-muted-foreground text-sm mt-1">Enter the tracking code from your order confirmation email.</p>

        <form onSubmit={onSubmit} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. AB-72931"
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-secondary border border-transparent focus:border-brand focus:outline-none text-sm"
            />
          </div>
          <button disabled={loading} type="submit" className="h-11 px-5 rounded-xl gradient-brand text-brand-foreground text-sm font-bold disabled:opacity-70 inline-flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Track
          </button>
        </form>

        {status && status.step === -1 ? (
          <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 text-destructive grid place-items-center mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold">Order Problem</h2>
            <p className="mt-2 text-muted-foreground text-sm">There was an issue processing your order (ID: {status.code}). Please contact our support team immediately.</p>
            <a href="/contact" className="mt-6 inline-block text-brand font-bold hover:underline">Contact Support</a>
          </div>
        ) : status && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-muted-foreground">Order</div>
                <div className="font-display font-bold text-lg">{status.code}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> ETA</div>
                <div className="font-medium text-sm">{status.eta}</div>
              </div>
            </div>
            <ol className="space-y-3">
              {STEPS.map((s, i) => {
                const done = i <= status.step;
                const current = i === status.step;
                const Icon = s.icon;
                return (
                  <li key={s.key} className={`flex items-center gap-3 p-3 rounded-xl border ${current ? "bg-brand/5 border-brand/30" : done ? "bg-emerald-500/5 border-emerald-500/20" : "border-border opacity-60"}`}>
                    <span className={`h-9 w-9 grid place-items-center rounded-full ${done ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{current ? "In progress" : done ? "Completed" : "Pending"}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}