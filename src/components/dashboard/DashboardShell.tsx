import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Menu, X, LogOut, Bell, Search, ChevronDown, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function DashboardShell({
  groups,
  brandLabel,
  brandColor = "primary",
  children,
}: {
  groups: NavGroup[];
  brandLabel: string;
  brandColor?: "primary" | "violet";
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function isActive(to: string) {
    if (to === pathname) return true;
    // exact match for index pages, prefix for nested
    return pathname === to;
  }

  function handleLogout() {
    logout();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  if (!user) {
    // Redirect-ish: prompt sign in
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="max-w-sm text-center bg-card border border-border rounded-2xl p-8 shadow-soft">
          <h2 className="font-display text-xl font-bold">Sign in required</h2>
          <p className="text-sm text-muted-foreground mt-2">You need to sign in to access this dashboard.</p>
          <Link to="/login" className="mt-5 inline-flex items-center justify-center w-full h-10 rounded-xl gradient-brand text-brand-foreground font-semibold">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} flex flex-col h-screen`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="logo" className="h-8 w-8 rounded-lg" />
            <div>
              <div className="font-display font-bold text-sm leading-tight">Applied Biotech</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{brandLabel}</div>
            </div>
          </Link>
          <button className="lg:hidden p-1.5 rounded-md hover:bg-accent" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{g.label}</div>
              <div className="space-y-1">
                {g.items.map((it) => {
                  const active = isActive(it.to);
                  return (
                    <Link
                      key={it.to}
                      to={it.to}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "gradient-brand text-brand-foreground shadow-soft"
                          : "text-foreground/75 hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <it.icon className={`h-4 w-4 ${active ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className="flex-1">{it.label}</span>
                      {it.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-primary/10 text-primary"}`}>{it.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <Link to="/" className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
            <span>View live site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-background/85 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 sm:px-6">
          <button className="lg:hidden p-2 rounded-md hover:bg-accent" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Search dashboard..." className="w-full h-9 rounded-xl bg-muted/60 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          <button className="p-2 rounded-full hover:bg-accent relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </button>

          <div className="relative" onMouseLeave={() => setUserMenu(false)}>
            <button onClick={() => setUserMenu((s) => !s)} className="flex items-center gap-2 rounded-full hover:bg-accent pr-2 pl-1 py-1">
              <span className="h-8 w-8 rounded-full gradient-brand text-brand-foreground grid place-items-center text-xs font-bold">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <span className="hidden sm:block text-sm font-medium">{user.name.split(" ")[0]}</span>
              <ChevronDown className="h-3.5 w-3.5 hidden sm:block" />
            </button>
            {userMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-popover border border-border shadow-brand p-2">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <Link to={user.role === "admin" ? "/admin/profile" : "/editor/profile"} className="block px-3 py-2 rounded-lg text-sm hover:bg-accent">My profile</Link>
                <Link to="/" className="block px-3 py-2 rounded-lg text-sm hover:bg-accent">Back to website</Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}