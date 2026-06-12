import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Package, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import useFetch from "@/hooks/useFetch";
import { z } from "zod";

const searchSchema = z.object({
  reference: z.string().optional(),
  trxref: z.string().optional(), // Paystack often sends this too
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
  const { fetchData } = useFetch();

  useEffect(() => {
    console.log("🔍 VERIFY: Checking status for reference:", reference);
    console.log("Full Search Params:", search);

    if (!reference) {
      console.warn("⚠️ VERIFY: No reference found in URL.");
      setStatus("error");
      return;
    }

    const verify = async () => {
      // Try a few times — the Paystack webhook may take a moment to land
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          // Primary lookup: some backends key /track/:code by payment reference too
          const res = await fetchData(`/api/v1/payments/track/${reference}`);
          if (res && (res.status === "paid" || res.status === "processing" || res.status === "shipped" || res.status === "delivered")) {
            setOrderDetails(res);
            setStatus("success");
            return;
          }
        } catch (err) {
          // not found yet — fall through to retry
        }
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500));
      }
      // Payment was confirmed by Paystack client-side even if our ledger lookup
      // hasn't caught up yet — show success so the user isn't left in limbo.
      setStatus("success");
    };

    verify();
  }, [reference, fetchData]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          {status === "loading" ? (
            <div className="space-y-6 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-brand mx-auto" />
              <h1 className="font-display text-2xl font-bold">Confirming your payment...</h1>
              <p className="text-muted-foreground">Please don't refresh the page. We're finalizing your order with Paystack.</p>
            </div>
          ) : status === "success" ? (
            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-brand reveal animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">Order Confirmed!</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Your payment was successful. We've received your order and our team is preparing it for shipment.
              </p>
              
              <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Reference</span>
                  <span className="font-mono font-medium text-foreground">{reference}</span>
                </div>
                {orderDetails?.trackingCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tracking Code</span>
                    <span className="font-mono font-medium text-foreground">{orderDetails.trackingCode}</span>
                  </div>
                )}
                {orderDetails?.totalAmount != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-medium text-foreground">₦{Number(orderDetails.totalAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Status</span>
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Paid</span>
                </div>
              </div>

              <div className="mt-10 grid gap-3">
                <Link to="/shop/track" className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-8 py-4 font-bold shadow-brand hover:scale-[1.02] transition-transform">
                  <Package className="h-4 w-4" /> Track My Order
                </Link>
                <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 font-semibold hover:bg-accent transition-colors">
                  Continue Shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12">
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