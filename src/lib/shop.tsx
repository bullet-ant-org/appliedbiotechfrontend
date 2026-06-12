import {
  createContext, useContext, useEffect, useState,
  ReactNode, useCallback, useRef,
} from "react";
import { toast } from "sonner";
import { PRODUCTS, type Product } from "./products";

export type CartLine = { id: string; qty: number };

export type ResolvedCartItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  qty: number;
  stock?: number;
};

interface ShopValue {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  /** Fully resolved cart items — always populated whether products come from local PRODUCTS or server */
  cartItems: ResolvedCartItem[];
  /** Loading state while server products are being fetched */
  cartLoading: boolean;
}

const Ctx = createContext<ShopValue | null>(null);

const CART_KEY = "ab.shop.cart";
const WISH_KEY = "ab.shop.wishlist";

function resolveBackendBase() {
  const envUrl = (import.meta as any).env?.VITE_BACKEND_URL;
  const productionUrl = "https://appliedbiotechbackend.onrender.com";
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) return productionUrl;
  }
  return (envUrl || productionUrl).replace(/\/$/, "");
}

const API_BASE = `${resolveBackendBase()}/api/v1`;
const token = () =>
  typeof window !== "undefined"
    ? (localStorage.getItem("ab.auth.token") ?? "")
    : "";

async function apiFetch(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token() ? { Authorization: `Bearer ${token()}` } : {},
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/** Normalise a server product record into a flat Product-like object */
function normaliseServerProduct(p: any): Product {
  return {
    id: p._id,
    name: p.productName || p.name || "Product",
    price: Number(p.price ?? p.salePrice ?? 0),
    img: p.productImage || p.image || "",
    category: p.category || p.productCategory || "",
    description: p.description || "",
    stock: Number(p.stock ?? 0),
    rating: p.rating ?? 5,
    tag: (p.tags ?? []).join(" ").toUpperCase() || undefined,
  };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const fetched = useRef(false);

  // Restore persisted cart & wishlist on mount
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);
  useEffect(() => {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  // Eagerly fetch server products once so cartItems always resolves
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    setCartLoading(true);
    apiFetch("/shop/products")
      .then((res) => {
        const list: any[] = Array.isArray(res) ? res : (res?.data ?? res?.products ?? []);
        setServerProducts(list.map(normaliseServerProduct));
      })
      .catch(() => {})
      .finally(() => setCartLoading(false));
  }, []);

  // Resolve a cart line to a full product — checks server products first, then static fallback
  const resolveProduct = useCallback(
    (id: string): Product | undefined =>
      serverProducts.find((p) => p.id === id) ?? PRODUCTS.find((p) => p.id === id),
    [serverProducts],
  );

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      setCart((prev) => {
        const ex = prev.find((l) => l.id === id);
        if (ex) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
        return [...prev, { id, qty }];
      });
      const p = resolveProduct(id);
      toast.success(`${p?.name ?? "Item"} added to cart`);
    },
    [resolveProduct],
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
    toast.success("Removed from cart");
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return setCart((prev) => prev.filter((l) => l.id !== id));
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        toast.success("Removed from wishlist");
        return prev.filter((x) => x !== id);
      }
      toast.success("Added to wishlist");
      return [...prev, id];
    });
  }, []);

  const inWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  // Build cartItems — always non-empty for items that can be resolved
  const cartItems: ResolvedCartItem[] = cart
    .map((line) => {
      const p = resolveProduct(line.id);
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.img,
        category: p.category,
        qty: line.qty,
        stock: p.stock,
      };
    })
    .filter(Boolean) as ResolvedCartItem[];

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        cart, wishlist, cartCount, cartTotal, wishlistCount: wishlist.length,
        addToCart, removeFromCart, setQty, clearCart,
        toggleWishlist, inWishlist, cartItems, cartLoading,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop must be used within ShopProvider");
  return v;
}
