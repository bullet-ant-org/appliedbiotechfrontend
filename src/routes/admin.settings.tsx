import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, X, CalendarPlus } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useSiteContent } from "@/lib/site-content";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const [calOpen, setCalOpen] = useState(false);
  const [dbDates, setDbDates] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, string>>({
    siteName: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    workingHours: "",
  });
  const { loading, fetchData } = useFetch();

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res) {
        setForm(prev => {
          const updated = { ...prev };
          res.forEach((item: any) => {
            // Flatten contact_info object into the form
            if (item.key === "contact_info" && typeof item.value === "object") {
              updated.address = item.value.address || "";
              updated.phone = item.value.phone || "";
              updated.email = item.value.email || "";
              updated.workingHours = item.value.workingHours || "";
            }
            if (item.key === "academy_practical_dates") {
              setDbDates(item.value || []);
            }
            // Map hero_home to Site Name and Tagline
            if (item.key === "hero_home" && typeof item.value === "object") {
              updated.siteName = item.value.title || "";
              updated.tagline = item.value.subtitle || "";
            }
          });
          return updated;
        });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  async function handleSave() {
    try {
      // Job 1: Update Contact Info (Readme 4.9: POST /contact)
      const contactPromise = fetchData("/api/v1/content/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: form.address,
          phone: form.phone,
          email: form.email,
          workingHours: form.workingHours
        })
      });

      // Job 2: Update Home Hero (Readme 4.9: POST /hero)
      const heroPromise = fetchData("/api/v1/content/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: "hero_home",
          title: form.siteName,
          subtitle: form.tagline
        })
      });

      await Promise.all([contactPromise, heroPromise]);
      
      toast.success("Settings updated successfully");
      loadSettings();
    } catch (err) {
      toast.error("Failed to save settings");
    }
  }

  async function handleAddDate(date: string) {
    try {
      await fetchData("/api/v1/content/settings/practical-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDateStringValue: date })
      });
      loadSettings();
    } catch (err) {}
  }

  async function handleRemoveDate(date: string) {
    try {
      await fetchData("/api/v1/content/settings/practical-dates/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookupDateStringValue: date })
      });
      loadSettings();
    } catch (err) {}
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Website Settings" 
        subtitle="Global configuration for the public site." 
        actions={<PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</PrimaryBtn>} 
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">General</h3>
          <Field label="Site name"><input className={inputCls} value={form.siteName} onChange={e => update("siteName", e.target.value)} /></Field>
          <Field label="Tagline"><input className={inputCls} value={form.tagline} onChange={e => update("tagline", e.target.value)} /></Field>
          <Field label="Contact email"><input className={inputCls} value={form.email} onChange={e => update("email", e.target.value)} /></Field>
          <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e => update("phone", e.target.value)} /></Field>
          <Field label="Address"><input className={inputCls} value={form.address} onChange={e => update("address", e.target.value)} /></Field>
          <Field label="Working hours"><input className={inputCls} value={form.workingHours} onChange={e => update("workingHours", e.target.value)} /></Field>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold">Academy practical dates</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Students pick one of these when buying a course.</p>
            </div>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button className="h-9 px-3 rounded-xl gradient-brand text-brand-foreground text-xs font-bold inline-flex items-center gap-1.5"><CalendarPlus className="h-4 w-4" /> Add date</button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  onSelect={(d) => {
                    if (d) {
                      handleAddDate(d.toISOString().slice(0, 10));
                      setCalOpen(false);
                      toast.success("Practical date added");
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[3rem]">
            {dbDates.length === 0 && <div className="text-xs text-muted-foreground">No dates yet. Add one above.</div>}
            {dbDates.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 h-8 rounded-full bg-secondary text-xs font-medium">
                {new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                <button onClick={() => handleRemoveDate(d)} className="h-6 w-6 grid place-items-center rounded-full hover:bg-background"><X className="h-3.5 w-3.5" /></button>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}