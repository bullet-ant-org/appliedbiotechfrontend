import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, inputCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  joined?: string;
  createdAt?: string;
}

export const Route = createFileRoute("/admin/users")({ component: () => {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, fetchData } = useFetch<User[]>();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await fetchData("/api/v1/users");
        if (result) setUsers(result);
      } catch (err: any) {
        toast.error(err.message || "Could not load users");
      }
    };
    getUsers();
  }, [fetchData]);

  async function handleCreateUser() {
    if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
      return toast.error("Please fill in all fields");
    }

    try {
      // Per readme section 4.2: POST /api/v1/users/create
      const result = await fetchData("/api/v1/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password, role: "editor" }),
      });

      if (result) {
        toast.success("User created successfully");
        setOpen(false);
        setUsername(""); setFullName(""); setEmail(""); setPassword("");
        
        // Refresh the list from the backend
        const updatedUsers = await fetchData("/api/v1/users");
        if (updatedUsers) setUsers(updatedUsers);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  }

  return <div className="space-y-6">
    <PageHeader title="Users & Roles" subtitle="Manage team members and customer accounts." />
    <Toolbar onSearch={setQ} addLabel="Create user" onAdd={() => setOpen(true)} />
    <Card className="relative overflow-visible">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 grid place-items-center"> 
          <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
        </div> 
      )}
      <div className="overflow-x-auto pb-48">
        <table className="w-full text-sm min-w-[800px]">
        <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase"><tr><th className="px-4 py-3">User</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
        <tbody className="divide-y divide-border">{users.filter((u) => (String(u.fullName || "") + String(u.email || "")).toLowerCase().includes(q.toLowerCase())).map((u) => (
          <tr key={u.id} className="hover:bg-muted/40">
            <td className="px-4 py-3 flex items-center gap-3">
              <span className="h-9 w-9 rounded-full gradient-brand grid place-items-center text-brand-foreground text-xs font-bold">{u.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
              <div><div className="font-medium">{u.fullName}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
            </td>
            <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{u.role}</span></td>
            <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.status === "active" || u.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : u.status === "invited" || u.status === "Invited" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-500"}`}>{u.status || "Active"}</span></td>
            <td className="text-muted-foreground">{u.joined || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A")}</td>
            <td className="pr-4"><RowMenu actions={[{ label: "Edit role", onClick: () => toast.success("Role updated") }, { label: "Reset password", onClick: () => toast.success("Reset link sent") }, { label: "Suspend", danger: true, onClick: () => setUsers((p) => p.map((x) => x.id === u.id ? { ...x, status: "Suspended" } : x)) }]} /></td>
          </tr>
        ))}
        {!loading && users.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No users found.</td></tr>
        )}
        </tbody>
      </table></div>
    </Card>

    <Modal 
      open={open} 
      onClose={() => setOpen(false)} 
      title="Create New User"
      footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn onClick={handleCreateUser} disabled={loading}>Create User</PrimaryBtn></>}
    >
      <div className="space-y-4">
        <Field label="Full name"><input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" /></Field>
        <Field label="Username"><input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" /></Field>
        <Field label="Email address"><input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@appliedbiotech.com" /></Field>
        <Field label="Password"><input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></Field>
      </div>
    </Modal>
  </div>;
} });