import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Lock, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useShop } from "@/lib/shop";
import { fmt } from "@/lib/products";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { usePaystackPayment } from "react-paystack";
import { z } from "zod";

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

  // Paystack Configuration State
  const [paystackConfig, setPaystackConfig] = useState({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    email: "",
    amount: 0,
    reference: "",
  });

  const initializePayment = usePaystackPayment(paystackConfig);
  const [shouldTriggerPopup, setShouldTriggerPopup] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Load shop products if cart has items
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
    if (Array.isArray(cartItems) && cartItems.length > 0) return cartItems;
    return (Array.isArray(cart) ? cart : []).map((c: any) => {
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
  }, [cart, cartItems, products]);

  const effectiveTotal = useMemo(() => effectiveItems.reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0), [effectiveItems]);

  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const shipping = effectiveTotal > 100000 || effectiveTotal === 0 ? 0 : 5000;
  const total = effectiveTotal + shipping;

  // Define handlers for Paystack
  const onSuccess = useCallback((res: any) => {
    console.log("✅ PAYSTACK SUCCESS: Transaction completed successfully.");
    console.log("Paystack Response Object:", res);
    
    toast.success("Payment received! Finalizing your order...");
    
    setPaying(false);
    setShouldTriggerPopup(false);
    clearCart();
    
    // Get reference from response or fallback to our config
    const reference = res?.reference || paystackConfig.reference;
    
    // Use router navigation instead of window.location.href for a smoother transition
    navigate({ to: "/verify", search: { reference } });
  }, [clearCart, navigate, paystackConfig.reference]);

  const onClose = useCallback(() => {
    setPaying(false);
    setShouldTriggerPopup(false);
    toast.error("Payment window closed");
  }, []);

  // Watch for reference readiness to trigger popup
  useEffect(() => {
    if (shouldTriggerPopup && paystackConfig.reference) {
      initializePayment(onSuccess, onClose);
      // Reset trigger to prevent infinite loops on re-renders
      setShouldTriggerPopup(false);
    }
  }, [shouldTriggerPopup, paystackConfig, initializePayment, onSuccess, onClose]);

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paying) return;
    setPaying(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
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
      // Initialize transaction on the backend
      const res = await fetchData("/api/v1/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "shop",
          email,
          phone,
          shippingAddress,
          totalAmount: total,
          items: effectiveItems.map(it => ({
            product: it.id,
            quantity: it.qty,
            price: it.price
          })),
          courseItems: [],
          academyUserId: null,
        })
      });

      const reference = 
        res?.paystackData?.reference || 
        res?.paystackData?.data?.reference || 
        res?.order?.reference || 
        res?.data?.reference || 
        res?.reference;

      if (reference) {
        // 2. Set the config and signal the effect to open the popup
        setPaystackConfig({
          publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
          email,
          amount: total * 100, // Naira to Kobo
          reference: reference,
        });
        setShouldTriggerPopup(true);
      } else {
        console.error("Paystack initialization failed. The backend response did not contain a valid reference:", res);
        const errorMsg = res?.message || "Could not initialize transaction with Paystack";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      setPaying(false);
      toast.error(err?.message || "Payment initialization failed");
    }
  }

  if (done) {
    return (
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

  if (effectiveItems.length === 0 && !apiLoading) {
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
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate({ to: "/shop/cart" })} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
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
            {/* Payment handled by Paystack — no card fields shown on client */}
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
