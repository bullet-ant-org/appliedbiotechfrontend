import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, inputCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { Loader2, Briefcase, MapPin, Users, FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/careers")({ component: AdminCareers });

interface Job { id: string; jobTitle: string; field: string; location: string; jobType: string; spotsAvailable: number; createdAt: string; }
interface Application { id: string; fullName: string; email: string; phoneNumber: string; location: string; careerTitle: string; resumeUrl?: string; cvUrl?: string; passportUrl?: string; createdAt: string; }

const emptyJob = { jobTitle: "", field: "", location: "", jobType: "Full-Time / On-Site", spotsAvailable: 1 };

function AdminCareers() {
  const [tab, setTab] = useState<"jobs" | "applications">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyJob);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const { loading, fetchData } = useFetch();

  const loadData = useCallback(async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetchData("/api/v1/careers"),
        fetchData("/api/v1/careers/administration/submissions"),
      ]);
      if (jobsRes) setJobs(jobsRes.map((j: any) => ({ id: j._id, jobTitle: j.jobTitle, field: j.field, location: j.location, jobType: j.jobType, spotsAvailable: j.spotsAvailable, createdAt: j.createdAt })));
      if (appsRes) setApplications(appsRes.map((a: any) => ({
        id: a._id, fullName: a.fullName, email: a.email, phoneNumber: a.phoneNumber,
        location: a.location, careerTitle: a.career?.jobTitle || "N/A",
        resumeUrl: a.resumeUrl, cvUrl: a.cvUrl, passportUrl: a.passportUrl, createdAt: a.createdAt,
      })));
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleCreateJob() {
    if (!form.jobTitle.trim() || !form.field.trim() || !form.location.trim()) return toast.error("Please fill in all required fields");
    try {
      await fetchData("/api/v1/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Job posted successfully");
      setOpen(false); setForm(emptyJob); loadData();
    } catch (err: any) { toast.error(err.message || "Failed to post job"); }
  }

  async function handleDeleteJob(id: string) {
    if (!confirm("Delete this job posting?")) return;
    try {
      await fetchData(`/api/v1/careers/${id}`, { method: "DELETE" });
      toast.success("Job deleted"); loadData();
    } catch (err: any) { toast.error(err.message || "Failed to delete"); }
  }

  const filteredJobs = jobs.filter((j) => (j.jobTitle + j.field + j.location).toLowerCase().includes(q.toLowerCase()));
  const filteredApps = applications.filter((a) => (a.fullName + a.email + a.careerTitle).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Careers" subtitle="Manage job postings and review applicant submissions." />

      <div className="flex gap-2">
        {(["jobs", "applications"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? "gradient-brand text-brand-foreground" : "bg-card border border-border hover:bg-accent"}`}>
            {t === "jobs" ? `Job Postings (${jobs.length})` : `Applications (${applications.length})`}
          </button>
        ))}
      </div>

      {tab === "jobs" && (
        <>
          <Toolbar onSearch={setQ} addLabel="Post a job" onAdd={() => { setForm(emptyJob); setOpen(true); }} />
          <Card className="relative overflow-visible">
            {loading && jobs.length === 0 && <div className="absolute inset-0 grid place-items-center bg-background/50 z-10 rounded-2xl"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            <div className="overflow-x-auto pb-48">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
                  <tr><th className="px-4 py-3">Position</th><th>Field</th><th>Location</th><th>Type</th><th>Spots</th><th>Posted</th><th></th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-semibold">{j.jobTitle}</td>
                      <td className="text-muted-foreground">{j.field}</td>
                      <td><div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{j.location}</div></td>
                      <td><span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold">{j.jobType}</span></td>
                      <td className="text-center">{j.spotsAvailable}</td>
                      <td className="text-muted-foreground">{new Date(j.createdAt).toLocaleDateString()}</td>
                      <td className="pr-4"><RowMenu actions={[
                        { label: "Delete", danger: true, onClick: () => handleDeleteJob(j.id) },
                      ]} /></td>
                    </tr>
                  ))}
                  {!loading && filteredJobs.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No job postings yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === "applications" && (
        <>
          <Toolbar onSearch={setQ} />
          <Card className="relative overflow-visible">
            {loading && applications.length === 0 && <div className="absolute inset-0 grid place-items-center bg-background/50 z-10 rounded-2xl"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            <div className="overflow-x-auto pb-48">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
                  <tr><th className="px-4 py-3">Applicant</th><th>Position</th><th>Phone</th><th>Location</th><th>Applied</th><th>Files</th><th></th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{a.fullName}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </td>
                      <td className="font-medium">{a.careerTitle}</td>
                      <td className="text-muted-foreground">{a.phoneNumber}</td>
                      <td className="text-muted-foreground">{a.location}</td>
                      <td className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-1">
                          {a.resumeUrl && <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-semibold">Resume</a>}
                          {a.cvUrl && <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">CV</a>}
                        </div>
                      </td>
                      <td className="pr-4"><RowMenu actions={[
                        { label: "View details", onClick: () => setViewApp(a) },
                        { label: "Copy email", onClick: () => { navigator.clipboard.writeText(a.email); toast.success("Email copied"); } },
                      ]} /></td>
                    </tr>
                  ))}
                  {!loading && filteredApps.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No applications yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Create job modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Post a New Job"
        footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn onClick={handleCreateJob} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Job"}</PrimaryBtn></>}>
        <div className="space-y-4">
          <Field label="Job Title *"><input className={inputCls} value={form.jobTitle} onChange={(e) => setForm((s) => ({ ...s, jobTitle: e.target.value }))} placeholder="e.g. Lead Bioprocess Engineer" /></Field>
          <Field label="Field / Department *"><input className={inputCls} value={form.field} onChange={(e) => setForm((s) => ({ ...s, field: e.target.value }))} placeholder="e.g. Research & Development" /></Field>
          <Field label="Location *"><input className={inputCls} value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} placeholder="e.g. Abuja, Nigeria" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job Type">
              <select className={inputCls} value={form.jobType} onChange={(e) => setForm((s) => ({ ...s, jobType: e.target.value }))}>
                {["Full-Time / On-Site", "Full-Time / Remote", "Part-Time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Spots Available">
              <input type="number" min={1} className={inputCls} value={form.spotsAvailable} onChange={(e) => setForm((s) => ({ ...s, spotsAvailable: Number(e.target.value) }))} />
            </Field>
          </div>
        </div>
      </Modal>

      {/* View application modal */}
      {viewApp && (
        <Modal open={!!viewApp} onClose={() => setViewApp(null)} title="Application Details"
          footer={<GhostBtn onClick={() => setViewApp(null)}>Close</GhostBtn>}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-xs text-muted-foreground">Full Name</div><div className="font-semibold">{viewApp.fullName}</div></div>
              <div><div className="text-xs text-muted-foreground">Email</div><div className="font-semibold">{viewApp.email}</div></div>
              <div><div className="text-xs text-muted-foreground">Phone</div><div className="font-semibold">{viewApp.phoneNumber}</div></div>
              <div><div className="text-xs text-muted-foreground">Location</div><div className="font-semibold">{viewApp.location}</div></div>
              <div><div className="text-xs text-muted-foreground">Applied For</div><div className="font-semibold">{viewApp.careerTitle}</div></div>
              <div><div className="text-xs text-muted-foreground">Date Applied</div><div className="font-semibold">{new Date(viewApp.createdAt).toLocaleDateString()}</div></div>
            </div>
            <div className="flex gap-3 pt-2">
              {viewApp.resumeUrl && <a href={viewApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"><Download className="h-4 w-4" /> Resume</a>}
              {viewApp.cvUrl && <a href={viewApp.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"><Download className="h-4 w-4" /> CV</a>}
              {viewApp.passportUrl && <a href={viewApp.passportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"><Eye className="h-4 w-4" /> Photo</a>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
