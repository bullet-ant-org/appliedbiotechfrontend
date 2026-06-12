import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useShop } from "@/lib/shop";
import useFetch from "@/hooks/useFetch";
import { fmt } from "@/lib/products";

export const Route = createFileRoute("/shop/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Cart · Applied Biotech Shop" }] }),
});

function CartPage() {
  const { cart, cartItems, cartLoading, setQty, removeFromCart, clearCart } = useShop();
  const { fetchData } = useFetch();

  // fetch product catalog (server) so we can enrich cart entries with full details
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchData("/api/v1/shop/products");
        if (!mounted || !res) return;
        const list = Array.isArray(res) ? res : (res.data || res.products || []);
        if (Array.isArray(list)) setProducts(list);
      } catch (err) {
        // ignore; cart page can still render with minimal data
      }
    })();
    return () => { mounted = false; };
  }, [fetchData]);

  // Ensure we always have displayable items: prefer enriched cartItems, fall back to raw cart entries
  const items = useMemo(() => {
    if (Array.isArray(cartItems) && cartItems.length > 0) return cartItems;
    return cart.map((c: any) => {
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

  const cartTotal = items.reduce(
    (s: number, i: any) => s + (Number(i.price || 0) * Number(i.qty || 1)),
    0
  );
  const shipping = cartTotal > 100_000 || cartTotal === 0 ? 0 : 5000;
  const total = cartTotal + shipping;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">Cart</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
              Your Cart ({cart.length})
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear cart
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Cart lines */}
          <div className="space-y-3 min-h-[300px]">
            {/* Loading skeletons — only shown while server products are being fetched AND cart has items */}
            {cartLoading && cart.length > 0 && cartItems.length === 0 ? (
              Array.from({ length: cart.length }).map((_, idx) => (
                <div
                  key={idx}
                  className="reveal bg-card border border-border rounded-2xl p-3 sm:p-4 flex gap-4 animate-pulse"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="flex gap-3 pt-4">
                      <div className="h-8 w-24 bg-muted rounded-full" />
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : cart.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                <div className="mx-auto h-16 w-16 rounded-full bg-secondary grid place-items-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="font-display text-xl font-bold">Your cart is empty</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start adding lab essentials to see them here.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                >
                  Browse products <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              /* Resolved items */
              items.map((it) => (
                <div
                  key={it.id}
                  className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex gap-4"
                >
                  <Link
                    to="/shop/product/$id"
                    params={{ id: it.id }}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-secondary shrink-0"
                  >
                    {it.img ? (
                      <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      to="/shop/product/$id"
                      params={{ id: it.id }}
                      className="font-semibold text-foreground line-clamp-2 hover:text-brand transition-colors"
                    >
                      {it.name}
                    </Link>
                    <div className="text-xs text-muted-foreground capitalize mt-0.5">
                      {it.category}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 flex-wrap">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="h-8 w-8 grid place-items-center hover:bg-accent rounded-l-full transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold tabular-nums">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="h-8 w-8 grid place-items-center hover:bg-accent rounded-r-full transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="font-display font-bold">{fmt(it.price * it.qty)}</div>

                      <button
                        onClick={() => removeFromCart(it.id)}
                        aria-label="Remove"
                        className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order summary */}
          <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-36">
            <h3 className="font-display font-bold text-lg">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{fmt(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? "Free" : fmt(shipping)}</span>
              </div>
              {shipping === 0 && cartTotal > 0 && (
                <div className="text-xs text-emerald-600 font-medium">
                  Free shipping on orders over ₦100,000
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold text-brand">{fmt(total)}</span>
              </div>
            </div>

            <Link
              to="/shop/checkout"
              className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-brand hover:scale-[1.02] transition-transform ${
                cart.length === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
