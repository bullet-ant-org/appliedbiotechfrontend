import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/dashboard/widgets";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

const trafficData = Array.from({ length: 30 }, (_, i) => ({ d: `D${i + 1}`, visits: 800 + Math.round(Math.random() * 1200), signups: 20 + Math.round(Math.random() * 50) }));
const channels = [
  { ch: "Organic", visits: 8240, conv: 412 },
  { ch: "Paid", visits: 4120, conv: 308 },
  { ch: "Social", visits: 3680, conv: 196 },
  { ch: "Email", visits: 2160, conv: 244 },
  { ch: "Direct", visits: 5320, conv: 320 },
];

interface PageMetric {
  page: string;
  views: number;
  updatedAt: string;
}

function AnalyticsPage() {
  const [pageStats, setPageStats] = useState<PageMetric[]>([]);
  const { loading, fetchData } = useFetch<PageMetric[]>();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch from GET /api/v1/analytics/metrics
        const result = await fetchData("/api/v1/analytics/metrics");
        if (result) {
          setPageStats(result);
        }
      } catch (err: any) {
        toast.error("Failed to load real-time analytics");
      }
    };
    loadAnalytics();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Deep insights into traffic, conversions and funnel performance." />
      <div className="grid lg:grid-cols-2 gap-6">

      <Card className="p-6 relative">
        <h3 className="font-display font-bold text-lg mb-4">Top pages</h3>
        <div className="overflow-x-auto pb-48">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground text-xs uppercase">
            <tr><th className="py-2">Page</th><th>Views</th><th>Last Activity</th></tr>
          </thead>
          <tbody className="divide-y divide-border relative">
            {loading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {pageStats.map((r) => (
              <tr key={r.page} className="hover:bg-muted/40">
                <td className="py-3 font-mono text-xs capitalize">{r.page}</td>
                <td className="font-semibold">{r.views.toLocaleString()}</td>
                <td className="text-muted-foreground">{new Date(r.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && pageStats.length === 0 && (
              <tr><td colSpan={3} className="py-10 text-center text-muted-foreground">No traffic data recorded yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
    </div>
  
  );
}
