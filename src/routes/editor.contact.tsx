import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, PrimaryBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/contact")({ component: ContactAdmin });

function ContactAdmin() {
  const [form, setForm] = useState({
    address: "", phone: "", email: "", workingHours: "", mapUrl: "",
    facebookUrl: "", twitterUrl: "", linkedinUrl: "", instagramUrl: "",
  });
  const { loading, fetchData } = useFetch();

  const loadContact = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res) {
        const data = res.find((i: any) => i.key === "contact_info");
        if (data?.value) setForm({
          address: data.value.address || "",
          phone: data.value.phone || "",
          email: data.value.email || "",
          workingHours: data.value.workingHours || "",
          mapUrl: data.value.mapUrl || "",
          facebookUrl: data.value.facebookUrl || "",
          twitterUrl: data.value.twitterUrl || "",
          linkedinUrl: data.value.linkedinUrl || "",
          instagramUrl: data.value.instagramUrl || "",
        });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadContact(); }, [loadContact]);

  async function save() {
    try {
      await fetchData("/api/v1/content/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      toast.success("Contact info updated");
      loadContact();
    } catch (err) {}
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contact information" 
        subtitle="Shown on the Contact page and in the site footer." 
        actions={<PrimaryBtn disabled={loading} onClick={save}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</PrimaryBtn>} 
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Primary</h3>
          <Field label="Address"><input className={inputCls} value={form.address} onChange={set("address")} /></Field>
          <Field label="Phone"><input className={inputCls} value={form.phone} onChange={set("phone")} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={set("email")} /></Field>
          <Field label="Working hours"><input className={inputCls} value={form.workingHours} onChange={set("workingHours")} /></Field>
          <Field label="Map URL (optional)"><input className={inputCls} value={form.mapUrl ?? ""} onChange={set("mapUrl")} /></Field>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Social profiles</h3>
          <Field label="Facebook URL"><input className={inputCls} value={form.facebookUrl} onChange={set("facebookUrl")} /></Field>
          <Field label="Twitter / X URL"><input className={inputCls} value={form.twitterUrl} onChange={set("twitterUrl")} /></Field>
          <Field label="LinkedIn URL"><input className={inputCls} value={form.linkedinUrl} onChange={set("linkedinUrl")} /></Field>
          <Field label="Instagram URL"><input className={inputCls} value={form.instagramUrl} onChange={set("instagramUrl")} /></Field>
        </Card>
      </div>
    </div>
  );
}
