import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, PrimaryBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/contact")({ component: ContactAdmin });

function ContactAdmin() {
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    mapUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
  });
  
  const { loading, fetchData } = useFetch();

  const loadContact = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res) {
        const contactData = res.find((i: any) => i.key === "contact_info");
        if (contactData && typeof contactData.value === "object") {
          setForm({
            address: contactData.value.address || "",
            phone: contactData.value.phone || "",
            email: contactData.value.email || "",
            workingHours: contactData.value.workingHours || "",
            mapUrl: contactData.value.mapUrl || "",
            facebookUrl: contactData.value.facebookUrl || "",
            twitterUrl: contactData.value.twitterUrl || "",
            linkedinUrl: contactData.value.linkedinUrl || "",
            instagramUrl: contactData.value.instagramUrl || "",
          });
        }
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadContact(); }, [loadContact]);

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  async function handleSave() {
    try {
      await fetchData("/api/v1/content/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      toast.success("Contact information updated");
      loadContact();
    } catch (err) {
      toast.error("Failed to save contact info");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contact Information" 
        subtitle="Primary contact details and social media links shown across the site." 
        actions={<PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</PrimaryBtn>} 
      />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Primary Contact</h3>
          <Field label="Physical Address"><input className={inputCls} value={form.address} onChange={e => update("address", e.target.value)} /></Field>
          <Field label="Phone Number"><input className={inputCls} value={form.phone} onChange={e => update("phone", e.target.value)} /></Field>
          <Field label="Public Email"><input className={inputCls} value={form.email} onChange={e => update("email", e.target.value)} /></Field>
          <Field label="Working Hours"><input className={inputCls} value={form.workingHours} onChange={e => update("workingHours", e.target.value)} /></Field>
          <Field label="Google Maps URL"><input className={inputCls} value={form.mapUrl} onChange={e => update("mapUrl", e.target.value)} /></Field>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">Social Profiles</h3>
          <Field label="Facebook"><input className={inputCls} value={form.facebookUrl} onChange={e => update("facebookUrl", e.target.value)} /></Field>
          <Field label="Twitter / X"><input className={inputCls} value={form.twitterUrl} onChange={e => update("twitterUrl", e.target.value)} /></Field>
          <Field label="LinkedIn"><input className={inputCls} value={form.linkedinUrl} onChange={e => update("linkedinUrl", e.target.value)} /></Field>
          <Field label="Instagram"><input className={inputCls} value={form.instagramUrl} onChange={e => update("instagramUrl", e.target.value)} /></Field>
        </Card>
      </div>
    </div>
  );
}
