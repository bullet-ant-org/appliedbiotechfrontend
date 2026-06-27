import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/dashboard/widgets";
import { ShieldCheck, Users, Clock, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/security")({ component: SecurityPage });

function SecurityPage() {
  const [users, setUsers] = useState<any[]>([]);
  const { loading, fetchData } = useFetch();

  const loadData = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/users");
      if (res) setUsers(res);
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadData(); }, [loadData]);

  // Derived stats based on available backend data (RBAC distribution)
  const admins = users.filter(u => u.role === "admin").length;
  const editors = users.filter(u => u.role === "editor").length;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMembers = users.filter(u => u.createdAt && new Date(u.createdAt) > sevenDaysAgo);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Security & Access" 
        subtitle="Audit system access and review platform-wide role policies." 
      />
      
      {loading && users.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-soft">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <div className="mt-3 font-display text-2xl font-bold">{admins}</div>
              <div className="text-xs text-muted-foreground">Full Administrators</div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-soft">
              <Users className="h-6 w-6 text-primary" />
              <div className="mt-3 font-display text-2xl font-bold">{editors}</div>
              <div className="text-xs text-muted-foreground">Content Editors</div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-soft">
              <Clock className="h-6 w-6 text-amber-600" />
              <div className="mt-3 font-display text-2xl font-bold">{recentMembers.length}</div>
              <div className="text-xs text-muted-foreground">New Access Granted (7d)</div>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="font-display font-bold mb-4">Access Audit Log</h3>
            <div className="space-y-3 text-sm">
              {recentMembers.length > 0 ? (
                recentMembers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div>
                      <div className="font-medium">System role assigned: <span className="capitalize">{u.role}</span></div>
                      <div className="text-xs text-muted-foreground">{u.fullName} ({u.email})</div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No recent security-relevant events discovered in the logs.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}