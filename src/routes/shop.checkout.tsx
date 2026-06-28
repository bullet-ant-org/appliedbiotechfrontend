import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, ArrowLeft, CheckCircle2, Loader2, GraduationCap, AlertTriangle } from "lucide-react";
import { useShop } from "@/lib/shop";
import { fmt } from "@/lib/products";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { z } from "zod";

const ACADEMY_CART_KEY = "ab.shop.academy_cart";
const PICKUP_KEY = "ab.shop.pickup";

function readAcademyCart(): any[] {
  try { return JSON.parse(localStorage.getItem(ACADEMY_CART_KEY) || "[]"); } catch { return []; }
}
function readPickupMap(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(PICKUP_KEY) || "{}"); } catch { return {}; }
}

const checkoutSearchSchema = z.object({});

export const Route = createFileRoute("/shop/checkout")({
  component: CheckoutPage,
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Checkout · Applied Biotech Shop" }] }),
});

function CheckoutPage() {
  const { cartItems, cartTotal, cart = [], clearCart } = useShop();
  const { fetchData, loading: apiLoading } = useFetch();
  const [products, setProducts] = useState<any[]>([]);
  const [paying, setPaying] = useState(false);
  const [academyItems] = useState<any[]>(readAcademyCart);
  const [persistedPickup] = useState<Record<string, boolean>>(readPickupMap);
  const [showAcademyWarning, setShowAcademyWarning] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  // Resolve academy user ID from stored token
  function getAcademyUserId(): string | null {
    try {
      const token = localStorage.getItem("ab.academy.token") || localStorage.getItem("academy_token") || localStorage.getItem("academyToken");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id || payload?.sub || null;
    } catch { return null; }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (cart && cart.length > 0) {
        try {
          const res = await fetchData("/api/v1/shop/products");
          if (!mounted || !res) return;
          const list = Array.isArray(res) ? res : (res.data || res.products || []);
          if (Array.isArray(list)) setProducts(list);
        } catch (err) { /* ignore */ }
      }
    })();
    return () => { mounted = false; };
  }, [fetchData, cart]);

  const effectiveItems = useMemo(() => {
    const base = (Array.isArray(cartItems) && cartItems.length > 0)
      ? cartItems
      : (Array.isArray(cart) ? cart : []).map((c: any) => {
        const lookupKey = c.id || c.product || c.productId || c._id;
        const p = products.find((x: any) => x._id === lookupKey || x.id === lookupKey || String(x._id) === String(lookupKey));
        return {
          id: lookupKey || c.id || c.product || c.productId || c._id,
          name: p?.productName || p?.name || c.name || c.title || "Item",
          price: Number(p?.price ?? p?.salePrice ?? c.price ?? 0),
          img: p?.productImage || p?.image || c.img || "",
          category: p?.category || p?.productCategory || c.category || "",
          qty: typeof c.qty === "number" ? c.qty : (c.quantity ?? 1),
          ...c,
        };
      });
    return base.map((it: any) => {
      const p = products.find((x: any) => x._id === it.id || x.id === it.id || String(x._id) === String(it.id));
      return {
        ...it,
        shippingFee: Number(p?.shippingFee ?? it.shippingFee ?? 0),
        pickupAvailable: !!(p?.pickupAvailable ?? it.pickupAvailable),
        pickup: !!persistedPickup[it.id],
      };
    });
  }, [cart, cartItems, products, persistedPickup]);

  const effectiveTotal = useMemo(() => effectiveItems.reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0), [effectiveItems]);
  const shippingTotal = useMemo(() => effectiveItems.reduce((s: number, it: any) => it.pickup ? s : s + (Number(it.shippingFee || 0) * Number(it.qty || 1)), 0), [effectiveItems]);
  const academyTotal = useMemo(() => academyItems.reduce((s: number, i: any) => s + Number(i.price || 0), 0), [academyItems]);

  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const shipping = shippingTotal;
  const total = effectiveTotal + shipping + academyTotal;

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paying) return;

    // If academy courses are in the cart, show warning modal first (unless already confirmed)
    if (academyItems.length > 0 && !showAcademyWarning) {
      setPendingFormData(new FormData(e.currentTarget));
      setShowAcademyWarning(true);
      return;
    }
    setShowAcademyWarning(false);
    setPaying(true);

    const fd = pendingFormData || new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email) {
      setPaying(false);
      return toast.error("Please provide an email");
    }

    if (total <= 0) {
      setPaying(false);
      return toast.error("Cart total must be greater than 0");
    }

    const phone = String(fd.get("phone") || "").trim();
    const shippingAddress = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      postal: String(fd.get("postal") || "").trim(),
    };

    try {
      const res = await fetchData("/api/v1/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: academyItems.length > 0 && effectiveItems.length === 0 ? "academy" : "shop",
          email,
          phone,
          shippingAddress,
          totalAmount: total,
          items: effectiveItems.map(it => ({
            product: it.id,
            quantity: it.qty,
            price: it.price
          })),
          courseItems: academyItems.map(i => ({
            course: i.id,
            practicalDate: i.practicalDate ? i.practicalDate.split("|")[0] : "",
            price: i.price,
          })),
          academyUserId: academyItems.length > 0 ? getAcademyUserId() : null,
        })
      });

      const reference =
        res?.paystackData?.reference ||
        res?.paystackData?.data?.reference ||
        res?.order?.reference ||
        res?.data?.reference ||
        res?.reference;

      if (!reference) {
        console.error("Paystack initialization failed. Missing reference:", res);
        throw new Error(res?.message || "Could not initialize transaction with Paystack");
      }

      if (typeof window !== "undefined" && !(window as any).PaystackPop) {
        throw new Error("Paystack payment interface is still loading. Please try again in a moment.");
      }

      const handler = (window as any).PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
        email: email,
        amount: total * 100,
        ref: reference,
        callback: function (response: any) {
          console.log("✅ PAYSTACK SUCCESS:", response);
          toast.success("Payment received! Finalizing your order...");
          clearCart();
          try { localStorage.removeItem("ab.shop.academy_cart"); localStorage.removeItem("ab.shop.pickup"); } catch {}
          const finalRef = response?.reference || response?.trxref || reference;
          window.location.assign(`/verify?reference=${encodeURIComponent(finalRef)}`);
        },
        onClose: function () {
          setPaying(false);
          toast.error("Payment window closed");
        }
      });

      handler.openIframe();

    } catch (err: any) {
      console.error("Payment initialization error:", err);
      setPaying(false);
      toast.error(err?.message || "Payment initialization failed");
    }
  }

  if (done) {    return (
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-md text-center bg-card border border-border rounded-3xl p-10">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center mb-4"><CheckCircle2 className="h-9 w-9" /></div>
          <h1 className="font-display text-3xl font-bold">Order confirmed</h1>
          <p className="mt-2 text-muted-foreground">Thanks! A confirmation email is on its way.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand">Back to shop</Link>
        </div>
      </section>
    );
  }

  if (effectiveItems.length === 0 && academyItems.length === 0 && !apiLoading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-brand font-semibold">Continue shopping →</Link>
      </section>
    );
  }

  if (apiLoading && effectiveItems.length === 0) {
    return <div className="py-40 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      {/* Academy email warning modal */}
      {showAcademyWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-7 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-full bg-amber-500/10 grid place-items-center shrink-0">
                <GraduationCap className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Academy course in your cart</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Your cart contains {academyItems.length} academy course{academyItems.length > 1 ? "s" : ""}. Course access is linked to your <strong>Academy account email</strong>.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 flex gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Please make sure the email address you enter at checkout matches your <strong>Applied Biotech Academy login</strong>. If they don't match, the course will not appear in your academy account after purchase.
              </p>
            </div>
            {!getAcademyUserId() && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 flex gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-relaxed">
                  You are not currently logged in to an Academy account. Your purchase will be recorded but <strong>course access cannot be automatically granted</strong>. Please log in to your Academy account before proceeding, or contact support after payment.
                </p>
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowAcademyWarning(false); setPendingFormData(null); }}
                className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold hover:bg-accent transition-colors"
              >
                Go back
              </button>
              <button
                onClick={() => {
                  setShowAcademyWarning(false);
                  setPaying(true);
                  // Re-trigger payment with saved form data
                  setTimeout(async () => {
                    const fd = pendingFormData!;
                    const email = String(fd.get("email") || "").trim();
                    const phone = String(fd.get("phone") || "").trim();
                    const shippingAddress = {
                      firstName: String(fd.get("firstName") || "").trim(),
                      lastName: String(fd.get("lastName") || "").trim(),
                      address: String(fd.get("address") || "").trim(),
                      city: String(fd.get("city") || "").trim(),
                      state: String(fd.get("state") || "").trim(),
                      postal: String(fd.get("postal") || "").trim(),
                    };
                    try {
                      const res = await fetchData("/api/v1/payments/initialize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderType: academyItems.length > 0 && effectiveItems.length === 0 ? "academy" : "shop",
                          email, phone, shippingAddress, totalAmount: total,
                          items: effectiveItems.map(it => ({ product: it.id, quantity: it.qty, price: it.price })),
                          courseItems: academyItems.map(i => ({ course: i.id, practicalDate: i.practicalDate ? i.practicalDate.split("|")[0] : "", price: i.price })),
                          academyUserId: getAcademyUserId(),
                        })
                      });
                      const reference = res?.paystackData?.reference || res?.paystackData?.data?.reference || res?.order?.reference || res?.data?.reference || res?.reference;
                      if (!reference) throw new Error(res?.message || "Could not initialize transaction");
                      if (!(window as any).PaystackPop) throw new Error("Paystack is loading, please try again.");
                      const handler = (window as any).PaystackPop.setup({
                        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
                        email, amount: total * 100, ref: reference,
                        callback: (response: any) => {
                          toast.success("Payment received! Finalizing your order...");
                          clearCart();
                          try { localStorage.removeItem("ab.shop.academy_cart"); localStorage.removeItem("ab.shop.pickup"); } catch {}
                          const finalRef = response?.reference || response?.trxref || reference;
                          window.location.assign(`/verify?reference=${encodeURIComponent(finalRef)}`);
                        },
                        onClose: () => { setPaying(false); toast.error("Payment window closed"); }
                      });
                      handler.openIframe();
                    } catch (err: any) { setPaying(false); toast.error(err?.message || "Payment initialization failed"); }
                  }, 0);
                }}
                className="flex-1 h-11 rounded-xl gradient-brand text-brand-foreground text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                {getAcademyUserId() ? "I understand, proceed" : "Proceed anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => navigate({ to: "/shop/cart" })} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </button>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>

        <form onSubmit={handlePay} className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8">
            <Section title="Contact">
              <Field label="Email"><input name="email" required type="email" className={input} /></Field>
              <Field label="Phone"><input name="phone" required type="tel" className={input} /></Field>
            </Section>
            <Section title="Shipping address">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="First name"><input name="firstName" required className={input} /></Field>
                <Field label="Last name"><input name="lastName" required className={input} /></Field>
              </div>
              <Field label="Address"><input name="address" required className={input} /></Field>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="City"><input name="city" required className={input} /></Field>
                <Field label="State"><input name="state" required className={input} /></Field>
                <Field label="Postal code"><input name="postal" required className={input} /></Field>
              </div>
            </Section>
          </div>

          <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-36">
            <h3 className="font-display font-bold text-lg">Summary</h3>
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
              {effectiveItems.map((it) => (
                <div key={it.id} className="flex gap-3 text-sm">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0">{it.img ? <img src={it.img} alt={it.name} className="w-full h-full object-cover" /> : null}</div>
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-1">{it.name}</div>
                    <div className="text-muted-foreground text-xs">Qty {it.qty}</div>
                  </div>
                  <div className="font-semibold">{fmt(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{fmt(effectiveTotal)}</span></div>
              {academyTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Academy courses</span><span className="font-semibold">{fmt(academyTotal)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : fmt(shipping)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-display font-bold text-brand">{fmt(total)}</span></div>
            </div>
            <button 
              type="submit" 
              disabled={paying} 
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {paying ? "Processing..." : `Pay with Paystack · ${fmt(total)}`}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}

const input = "w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }: any) { return <label className="block text-sm"><span className="font-medium">{label}</span><div className="mt-1.5">{children}</div></label>; }
function Section({ title, children }: any) {
  return <div className="bg-card border border-border rounded-2xl p-6 space-y-3"><h3 className="font-display font-bold text-lg">{title}</h3>{children}</div>;
                     }
