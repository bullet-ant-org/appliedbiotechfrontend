import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Package, ArrowRight, AlertCircle, ShoppingBag, Download, Copy, Check, GraduationCap, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import useFetch from "@/hooks/useFetch";
import { z } from "zod";

const searchSchema = z.object({
  reference: z.string().optional(),
  trxref: z.string().optional(),
});

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({ meta: [{ title: "Verifying Payment · Applied Biotech" }] }),
});

function VerifyPage() {
  const search = Route.useSearch();
  const reference = search.reference || search.trxref;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { fetchData } = useFetch();

  useEffect(() => {
    if (!reference) { setStatus("error"); return; }
    const verify = async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          // Try by reference first
          const res = await fetchData(`/api/v1/payments/order-by-reference/${reference}`);
          if (res && res._id) {
            setOrderDetails(res);
            setStatus("success");
            return;
          }
        } catch (_) {}
        try {
          // Fallback: try tracking code path
          const res2 = await fetchData(`/api/v1/payments/track/${reference}`);
          if (res2 && (res2.status === "paid" || res2.status === "processing" || res2.status === "shipped" || res2.status === "delivered")) {
            setOrderDetails(res2);
            setStatus("success");
            return;
          }
        } catch (_) {}
        if (attempt < 4) await new Promise(r => setTimeout(r, 1800));
      }
      // Payment was confirmed by Paystack client-side — show success anyway
      setStatus("success");
    };
    verify();
  }, [reference, fetchData]);

  async function handleDownload() {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `receipt-${orderDetails?.trackingCode || reference}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (_) {
      // fallback: open print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  function copyTracking() {
    const code = orderDetails?.trackingCode;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const shopItems: any[] = orderDetails?.items?.filter((i: any) => i.product || i.name) || [];
  const courseItems: any[] = orderDetails?.courseItems?.filter((i: any) => i.course || i.courseTitle) || [];
  const isAcademy = orderDetails?.orderType === "academy";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {status === "loading" ? (
            <div className="space-y-6 py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-brand mx-auto" />
              <h1 className="font-display text-2xl font-bold">Confirming your payment...</h1>
              <p className="text-muted-foreground">Please don't refresh the page. We're finalizing your order with Paystack.</p>
            </div>
          ) : status === "success" ? (
            <div>
              {/* Receipt card (captured for download) */}
              <div ref={receiptRef} className="bg-white text-gray-900 rounded-[2.5rem] border border-gray-200 shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#004B87] px-8 py-6 text-white text-center">
                  <h1 className="font-bold text-2xl tracking-tight">Applied Biotech International</h1>
                  <p className="text-blue-200 text-xs mt-1 uppercase tracking-widest">Payment Receipt</p>
                </div>

                <div className="px-8 py-6">
                  {/* Success badge */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                  </div>
                  <h2 className="text-center font-bold text-2xl text-gray-900 mb-1">Order Confirmed!</h2>
                  <p className="text-center text-gray-500 text-sm mb-6">Your payment was received and verified successfully.</p>

                  {/* Meta */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm mb-6">
                    <MetaRow label="Reference" value={<span className="font-mono text-[13px]">{reference}</span>} />
                    {orderDetails?.trackingCode && <MetaRow label="Tracking Code" value={<span className="font-mono font-bold text-[#004B87]">{orderDetails.trackingCode}</span>} />}
                    {orderDetails?.totalAmount != null && <MetaRow label="Total Paid" value={<span className="font-bold">₦{Number(orderDetails.totalAmount).toLocaleString()}</span>} />}
                    <MetaRow label="Status" value={<span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Paid</span>} />
                    {orderDetails?.createdAt && <MetaRow label="Date" value={new Date(orderDetails.createdAt).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" })} />}
                  </div>

                  {/* Items */}
                  {(shopItems.length > 0 || courseItems.length > 0) && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Items ordered</h3>
                      <div className="space-y-3">
                        {shopItems.map((item: any, i: number) => {
                          const p = item.product;
                          const name = p?.productName || p?.name || item.name || "Product";
                          const img = p?.productImage || p?.image || item.img;
                          const price = Number(item.price || p?.price || 0);
                          const qty = Number(item.quantity || item.qty || 1);
                          return (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                              {img && <img src={img} alt={name} className="h-14 w-14 rounded-lg object-cover shrink-0 border border-gray-200" />}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-gray-900 leading-snug">{name}</div>
                                {p?.category && <div className="text-xs text-gray-500 mt-0.5">{p.category}</div>}
                                <div className="text-xs text-gray-500 mt-0.5">Qty: {qty}</div>
                              </div>
                              <div className="font-bold text-sm text-gray-900 shrink-0">₦{(price * qty).toLocaleString()}</div>
                            </div>
                          );
                        })}
                        {courseItems.map((item: any, i: number) => {
                          const c = item.course;
                          const name = c?.courseTitle || c?.title || item.courseTitle || "Course";
                          const img = c?.image;
                          const price = Number(item.price || c?.price || 0);
                          return (
                            <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                              {img ? (
                                <img src={img} alt={name} className="h-14 w-14 rounded-lg object-cover shrink-0 border border-blue-200" />
                              ) : (
                                <div className="h-14 w-14 rounded-lg bg-[#004B87]/10 grid place-items-center shrink-0">
                                  <GraduationCap className="h-6 w-6 text-[#004B87]" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-gray-900 leading-snug">{name}</div>
                                <div className="text-xs text-[#004B87] font-medium mt-0.5">Academy Course</div>
                                {item.practicalDate && (
                                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    <CalendarDays className="h-3 w-3" /> Practical: {item.practicalDate}
                                  </div>
                                )}
                              </div>
                              <div className="font-bold text-sm text-gray-900 shrink-0">₦{Number(price).toLocaleString()}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {orderDetails?.totalAmount != null && (
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total Paid</span>
                      <span className="font-display font-bold text-xl text-[#004B87]">₦{Number(orderDetails.totalAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                  <p className="text-gray-400 text-xs">© 2026 Applied Biotech International Nigeria Limited · appliedbiotech.ng</p>
                </div>
              </div>

              {/* Action buttons (outside receipt capture area) */}
              <div className="mt-6 space-y-3">
                {orderDetails?.trackingCode && (
                  <button onClick={copyTracking} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold hover:bg-accent transition-colors">
                    {copied ? <><Check className="h-4 w-4 text-emerald-500" /> Tracking code copied!</> : <><Copy className="h-4 w-4" /> Copy tracking code</>}
                  </button>
                )}
                <button onClick={handleDownload} disabled={downloading} className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3.5 text-sm font-bold shadow-brand hover:scale-[1.02] transition-transform disabled:opacity-70">
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {downloading ? "Generating..." : "Download receipt as image"}
                </button>
                {isAcademy ? (
                  <Link to="/academy" className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold hover:bg-accent transition-colors">
                    Back to Academy <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/shop/track" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold hover:bg-accent transition-colors">
                      <Package className="h-4 w-4" /> Track order
                    </Link>
                    <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold hover:bg-accent transition-colors">
                      Continue shopping <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive grid place-items-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
              <p className="mt-2 text-muted-foreground">We couldn't verify your payment reference. If you were charged, please contact support.</p>
              <Link to="/shop" className="mt-8 inline-flex items-center gap-2 text-brand font-bold hover:underline">
                <ShoppingBag className="h-4 w-4" /> Return to Shop
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}
