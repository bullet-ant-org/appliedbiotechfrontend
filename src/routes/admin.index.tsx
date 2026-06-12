import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  TrendingUp, DollarSign, Heart, MousePointerClick, Users, Package, ArrowUpRight, ArrowDownRight, Download, Loader2, ShoppingCart, GraduationCap,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

interface User {
  id: string;
  role: string;
  status: string;
  cart?: any[];
  wishlist?: any[];
  createdAt?: string;
}

interface Order {
  id: string;
  email: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface Product {
  id: string;
  status: string;
  price: number;
  createdAt?: string;
}

interface AcademyCourse {
  id: string;
  students: number;
  status: string;
  createdAt?: string;
}

interface PageMetric {
  page: string;
  views: number;
  updatedAt: string;
}

const COLORS = ["oklch(0.42 0.18 255)", "oklch(0.62 0.2 240)", "oklch(0.78 0.15 200)", "oklch(0.769 0.188 70.08)"];

function Overview() {
  const { user } = useAuth();
  const { loading, fetchData } = useFetch();
  const [metrics, setMetrics] = useState({
    users: 0,
    orders: [] as Order[],
    products: 0,
    courses: 0,
    totalRevenue: 0,
    avgOrder: 0,
    purchases: 0,
    cartItems: 0,
    wishlistItems: 0,
    totalStudents: 0,
    usersDelta: "0%",
    usersUp: true,
    revenueDelta: "0%",
    revenueUp: true,
    productsDelta: "0%",
    productsUp: true,
    studentsDelta: "0%",
    studentsUp: true,
    monthlySales: [] as { d: string; v: number }[],
    totalViews: 0,
  });

  useEffect(() => {
    const getOverview = async () => {
      try {
        // Fetch resources individually to be resilient to 404s from unimplemented modules
        const fetchSafe = async (url: string) => {
          try {
            return await fetchData(url);
          } catch (e) {
            console.warn(`Dashboard endpoint ${url} not found or inaccessible.`);
            return null;
          }
        };

        const [users, orders, products, academy, analytics] = await Promise.all([
          fetchSafe("/api/v1/users"),
          fetchSafe("/api/v1/payments/orders-ledger"), // Corrected to match README 4.10
          fetchSafe("/api/v1/shop/products"), // Corrected based on Readme 4.3
          fetchSafe("/api/v1/academy"),
          fetchSafe("/api/v1/analytics/metrics"),
        ]);

        const orderList = (orders as Order[]) || [];
        const userList = (users as User[]) || [];
        const productList = (products as Product[]) || [];
        const courseList = (academy as AcademyCourse[]) || [];
        const analyticList = (analytics as PageMetric[]) || [];
        const totalStudents = courseList.reduce((acc, curr) => acc + (curr.students || 0), 0);
        const totalRevenue = orderList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        // Calculate growth percentages based on createdAt dates
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const getGrowth = (list: any[], valueKey?: string) => {
          const current = list.filter(i => i.createdAt && new Date(i.createdAt) > thirtyDaysAgo);
          const previous = list.filter(i => i.createdAt && new Date(i.createdAt) > sixtyDaysAgo && new Date(i.createdAt) <= thirtyDaysAgo);
          
          let currentVal = valueKey ? current.reduce((sum, i) => sum + (i[valueKey] || 0), 0) : current.length;
          let previousVal = valueKey ? previous.reduce((sum, i) => sum + (i[valueKey] || 0), 0) : previous.length;

          if (previousVal === 0) return { delta: currentVal > 0 ? "+100%" : "0%", up: true };
          const pct = ((currentVal - previousVal) / previousVal) * 100;
          return {
            delta: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
            up: pct >= 0
          };
        };

        // For Total Users, we compare the total base 30 days ago vs now
        const totalUsersBefore = userList.filter(u => u.createdAt && new Date(u.createdAt) <= thirtyDaysAgo).length;
        const userPct = totalUsersBefore === 0 ? 100 : ((userList.length - totalUsersBefore) / totalUsersBefore) * 100;
        
        const revGrowth = getGrowth(orderList.filter(o => String(o.status || "").toLowerCase().trim() === "paid"), "totalAmount");
        const prodGrowth = getGrowth(productList);
        const studentGrowth = getGrowth(courseList, "students");
        
        // Calculate Purchases (Paid orders) and User Engagement stats
        const purchases = orderList.filter(o => String(o.status || "").toLowerCase().trim() === "paid").length;
        const cartItems = userList.reduce((acc, u) => acc + (u.cart?.length || 0), 0);
        const wishlistItems = userList.reduce((acc, u) => acc + (u.wishlist?.length || 0), 0);

        // Calculate real weekly sales distribution for the current month
        const now_dt = new Date();
        const weeks = [
          { d: "W1", v: 0 }, { d: "W2", v: 0 }, { d: "W3", v: 0 }, { d: "W4", v: 0 }
        ];
        orderList.forEach(o => {
          const d = new Date(o.createdAt);
          if (d.getMonth() === now_dt.getMonth() && d.getFullYear() === now_dt.getFullYear()) {
            const weekIdx = Math.min(Math.floor((d.getDate() - 1) / 7), 3);
            weeks[weekIdx].v += o.totalAmount;
          }
        });

        setMetrics({
          users: userList.length,
          usersDelta: `${userPct >= 0 ? "+" : ""}${userPct.toFixed(1)}%`,
          usersUp: userPct >= 0,
          revenueDelta: revGrowth.delta,
          revenueUp: revGrowth.up,
          productsDelta: prodGrowth.delta,
          productsUp: prodGrowth.up,
          studentsDelta: studentGrowth.delta,
          studentsUp: studentGrowth.up,
          orders: orderList.slice(0, 5), // Only show latest 5
          products: productList.filter(p => p.status === "active").length,
          courses: courseList.length,
          totalRevenue, purchases, cartItems, wishlistItems, totalStudents,
          avgOrder: orderList.length > 0 ? totalRevenue / orderList.length : 0,
          monthlySales: weeks,
          totalViews: analyticList.reduce((sum, item) => sum + (item.views || 0), 0),
        });
      } catch (err: any) {
        console.warn("Some dashboard components failed to load", err);
        if (!err.message?.includes("404")) {
          toast.error("Failed to load dashboard statistics");
        }
      }
    };
    getOverview();
  }, [fetchData]);

  const handleExport = () => {
    if (metrics.orders.length === 0) {
      toast.error("No recent orders to export");
      return;
    }

    const headers = ["Tracking ID", "Customer Email", "Status", "Total Amount", "Date"];
    const rows = metrics.orders.map(o => [
      o.id,
      o.email,
      o.status || "Paid",
      `₦${o.totalAmount.toLocaleString()}`,
      new Date(o.createdAt).toISOString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Applied_Biotech_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report generated and downloaded");
  };

  return (
    <div className="space-y-6 relative">
      {loading && metrics.users === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      <PageHeader
        title={`Welcome back, ${(user?.name || "").split(" ")[0] || "User"}`}
        subtitle="Here's what's happening across the academy, shop and site today."
        actions={
          <button 
            onClick={handleExport}
            className="h-9 inline-flex items-center gap-2 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent"
          >
            <Download className="h-4 w-4" /> Export report
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Total Users" value={metrics.users.toLocaleString()} delta={metrics.usersDelta} up={metrics.usersUp} />
        <Stat icon={DollarSign} label="Gross Revenue" value={`₦${metrics.totalRevenue.toLocaleString()}`} delta={metrics.revenueDelta} up={metrics.revenueUp} />
        <Stat icon={Package} label="Live Products" value={metrics.products.toString()} delta={metrics.productsDelta} up={metrics.productsUp} />
        <Stat icon={GraduationCap} label="Academy Students" value={metrics.totalStudents.toLocaleString()} delta={metrics.studentsDelta} up={metrics.studentsUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Site Traffic · Real-time</h3>
              <p className="text-xs text-muted-foreground">Total views recorded across all tracked pages</p>
            </div>
            <span className="font-display font-bold text-2xl text-primary">{metrics.totalViews.toLocaleString()} <span className="text-xs text-muted-foreground font-sans uppercase tracking-widest ml-1">Views</span></span>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={yearlyClicksMock}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.2 240)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.62 0.2 240)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.929 0.013 255.508)" />
                <XAxis dataKey="m" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.929 0.013 255.508)" }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.42 0.18 255)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft flex flex-col">
          <h3 className="font-display font-bold text-lg mb-1">Store Engagement</h3>
          <p className="text-xs text-muted-foreground mb-6">Global wishlist and cart activity</p>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><ShoppingCart className="h-5 w-5" /></div>
              <div className="flex-1"><div className="text-xs text-muted-foreground">In Carts</div><div className="font-display font-bold text-xl">{metrics.cartItems} items</div></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-accent-cyan/10 text-accent-cyan grid place-items-center shrink-0"><Heart className="h-5 w-5" /></div>
              <div className="flex-1"><div className="text-xs text-muted-foreground">In Wishlists</div><div className="font-display font-bold text-xl">{metrics.wishlistItems} items</div></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center shrink-0"><DollarSign className="h-5 w-5" /></div>
              <div className="flex-1"><div className="text-xs text-muted-foreground">Purchases</div><div className="font-display font-bold text-xl">{metrics.purchases} completed</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-lg mb-4">Sales · This month</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={metrics.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.929 0.013 255.508)" />
                <XAxis dataKey="d" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.929 0.013 255.508)" }} />
                <Bar dataKey="v" fill="oklch(0.62 0.2 240)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Recent orders</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-2 py-2">Tracking ID</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metrics.orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40">
                    <td className="px-2 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-2 py-3">{o.email}</td>
                    <td className="px-2 py-3"><StatusPill s={o.status || "Paid"} /></td>
                    <td className="px-2 py-3 text-right font-semibold">₦{o.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { l: "Course Enrollments", v: metrics.courses.toString(), icon: Users },
          { l: "Active Products", v: metrics.products.toString(), icon: Package },
          { l: "Avg. order", v: `₦${metrics.avgOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign },
        ].map((s) => (
          <div key={s.l} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><s.icon className="h-5 w-5" /></span>
            <div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display font-bold text-lg">{s.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const yearlyClicksMock = [
  { m: "Jan", v: 12400 }, { m: "Feb", v: 14820 }, { m: "Mar", v: 18200 }, { m: "Apr", v: 16400 },
  { m: "May", v: 22300 }, { m: "Jun", v: 25800 }, { m: "Jul", v: 28100 }, { m: "Aug", v: 30200 },
  { m: "Sep", v: 27500 }, { m: "Oct", v: 31200 }, { m: "Nov", v: 33800 }, { m: "Dec", v: 36400 },
];

function Stat({ icon: Icon, label, value, delta, up }: any) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></span>
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{delta}
        </span>
      </div>
      <div className="mt-4 font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    failed: "bg-red-500/10 text-red-500",
    shipped: "bg-blue-500/10 text-blue-600",
    refunded: "bg-red-500/10 text-red-500",
    cancelled: "bg-muted text-muted-foreground",
  };
  const status = String(s || "").toLowerCase().trim() || "pending";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
}