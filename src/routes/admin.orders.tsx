import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal } from "@/components/dashboard/widgets";
import { Loader2, Package, MapPin, Phone, Mail, Tag, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

interface Order {
  id: string;
  email: string;
  createdAt: string;
  items: any[];
  courseItems: any[];
  totalAmount: number;
  status: string;
  trackingCode: string;
  reference: string;
  orderType: string;
  shippingAddress?: any;
  phone?: string;
  raw?: any;
}

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "failed"];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [viewing, setViewing] = useState<Order | null>(null);
  const { loading, fetchData } = useFetch();

  const stats = ["All", ...STATUS_OPTIONS.map((s) => s[0].toUpperCase() + s.slice(1))];

  const loadOrders = useCallback(async () => {
    try {
      const result = await fetchData("/api/v1/payments/orders-ledger");
      if (result) setOrders(result.map((o: any) => ({
        id: o._id,
        email: o.email,
        createdAt: o.createdAt,
        items: o.items || [],
        courseItems: o.courseItems || [],
        totalAmount: o.totalAmount,
        status: o.status || "pending",
        trackingCode: o.trackingCode,
        reference: o.reference,
        orderType: o.orderType,
        shippingAddress: o.shippingAddress,
        phone: o.phone,
        raw: o,
      })));
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function updateStatus(id: string, next: string) {
    try {
      await fetchData(`/api/v1/payments/orders/${id}/status-update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      toast.success(`Order marked as ${next}`);
      loadOrders();
      setViewing((v) => v && v.id === id ? { ...v, status: next } : v);
    } catch (err) { toast.error("Failed to update status"); }
  }

  const filtered = orders.filter((o) =>
    (filter === "All" || String(o.status || "").toLowerCase() === filter.toLowerCase()) &&
    (String(o.id || "").toLowerCase().includes(q.toLowerCase()) ||
      String(o.trackingCode || "").toLowerCase().includes(q.toLowerCase()) ||
      String(o.email || "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle="Track and fulfill all customer orders." />
      <Toolbar onSearch={setQ}>
        <div className="flex gap-1 overflow-x-auto bg-card border border-border rounded-xl p-1">
          {stats.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap ${filter === s ? "gradient-brand text-brand-foreground" : "hover:bg-accent"}`}>{s}</button>
          ))}
        </div>
      </Toolbar>

      <Card className="relative overflow-visible">
        {loading && orders.length === 0 && (
          <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}
        <div className="overflow-x-auto pb-48">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
              <tr><th className="px-4 py-3">Tracking Code</th><th>Customer</th><th>Type</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setViewing(o)}>
                  <td className="px-4 py-3 font-mono text-[10px]">{o.trackingCode || o.id}</td>
                  <td><div className="font-medium">{o.email}</div></td>
                  <td className="capitalize text-xs text-muted-foreground">{o.orderType}</td>
                  <td className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{(o.items?.length || 0) + (o.courseItems?.length || 0)}</td>
                  <td className="font-semibold">₦{o.totalAmount.toLocaleString()}</td>
                  <td><StatusPill s={o.status} /></td>
                  <td className="pr-4" onClick={(e) => e.stopPropagation()}>
                    <RowMenu actions={[
                      { label: "View order", onClick: () => setViewing(o) },
                      {
                        label: "Copy Tracking Code",
                        onClick: () => {
                          navigator.clipboard.writeText(o.trackingCode || o.id);
                          toast.success("Tracking code copied to clipboard");
                        }
                      },
                      { label: "Mark processing", onClick: () => updateStatus(o.id, "processing") },
                      { label: "Mark shipped", onClick: () => updateStatus(o.id, "shipped") },
                      { label: "Mark delivered", onClick: () => updateStatus(o.id, "delivered") },
                      { label: "Mark failed", danger: true, onClick: () => updateStatus(o.id, "failed") },
                    ]} />
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No matches found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <OrderDetailModal order={viewing} onClose={() => setViewing(null)} onUpdateStatus={updateStatus} />
    </div>
  );
}

export function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    failed: "bg-red-500/10 text-red-500",
    shipped: "bg-blue-500/10 text-blue-600",
    processing: "bg-indigo-500/10 text-indigo-600",
    delivered: "bg-emerald-600/10 text-emerald-700",
  };
  const status = String(s || "").toLowerCase().trim() || "pending";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export function OrderDetailModal({ order, onClose, onUpdateStatus }: { order: Order | null; onClose: () => void; onUpdateStatus: (id: string, status: string) => void }) {
  if (!order) return null;
  const addr = order.shippingAddress || {};
  const hasAddr = addr && (addr.address || addr.city || addr.state || addr.firstName);

  return (
    <Modal open={!!order} onClose={onClose} title={`Order ${order.trackingCode || order.id}`}
      footer={
        <div className="flex flex-wrap gap-2 w-full">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onUpdateStatus(order.id, s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${order.status === s ? "gradient-brand text-brand-foreground border-transparent" : "border-border hover:bg-accent"}`}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Reference & status */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground">Payment reference</div>
            <div className="font-mono text-xs mt-1 break-all">{order.reference}</div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground">Tracking code</div>
            <div className="font-mono text-xs mt-1 break-all">{order.trackingCode}</div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground">Order type</div>
            <div className="text-sm mt-1 capitalize font-medium">{order.orderType}</div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1"><StatusPill s={order.status} /></div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Customer</h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-brand" /> {order.email}</div>
            {order.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brand" /> {order.phone}</div>}
          </div>
        </div>

        {/* Shipping address */}
        {hasAddr && (
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Shipping address</h4>
            <div className="rounded-xl bg-secondary/50 p-3 text-sm space-y-1">
              {(addr.firstName || addr.lastName) && <div className="font-medium">{addr.firstName} {addr.lastName}</div>}
              {addr.address && <div className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" /> <span>{addr.address}, {addr.city}, {addr.state} {addr.postal}</span></div>}
            </div>
          </div>
        )}
        {!hasAddr && order.orderType === "shop" && (
          <div className="text-xs text-muted-foreground italic">No shipping address was recorded for this order.</div>
        )}

        {/* Shop items */}
        {order.items?.length > 0 && (
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Package className="h-3.5 w-3.5" /> Items ordered</h4>
            <div className="space-y-2">
              {order.items.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 text-sm">
                  {it.product?.productImage && <img src={it.product.productImage} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{it.product?.productName || "Product"}</div>
                    <div className="text-xs text-muted-foreground">Qty {it.quantity} · ₦{Number(it.price).toLocaleString()} each</div>
                    {it.product?.shippingNote && <div className="text-[11px] text-muted-foreground mt-0.5 italic">{it.product.shippingNote}</div>}
                    {it.product?.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {it.product.tags.map((t: string) => <span key={t} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-semibold"><Tag className="h-2.5 w-2.5" />{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold shrink-0">₦{(it.price * it.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academy course items */}
        {order.courseItems?.length > 0 && (
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" /> Courses enrolled</h4>
            <div className="space-y-2">
              {order.courseItems.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 text-sm">
                  {it.course?.image && <img src={it.course.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{it.course?.courseTitle || "Course"}</div>
                    {it.practicalDate && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Preferred practical date{it.practicalDate.includes("|") ? "s" : ""}:{" "}
                        {it.practicalDate.split("|").map((d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold shrink-0">₦{Number(it.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="font-display font-bold text-sm">Total paid</span>
          <span className="font-display font-bold text-lg text-brand">₦{order.totalAmount.toLocaleString()}</span>
        </div>
        <div className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</div>
      </div>
    </Modal>
  );
}
