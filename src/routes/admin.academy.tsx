import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { GraduationCap, Users, Loader2, BookOpen, CalendarDays, Plus, X } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/academy")({ component: AdminAcademy });

interface Course {
  id: string;
  title: string;
  students: number;
  weeks: number;
  level: string;
  price: number;
  status: string;
  description: string;
  coverImage?: string;
  courseType?: "modular" | "training";
  trainingDates?: string[];
}

function AdminAcademy() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [weeks, setWeeks] = useState(4);
  const [price, setPrice] = useState(180);
  const [status, setStatus] = useState("Live");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [courseType, setCourseType] = useState<"modular" | "training">("modular");
  const [trainingDates, setTrainingDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const { loading, fetchData } = useFetch();
  const [tab, setTab] = useState<"courses" | "students">("courses");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const loadEnrollments = useCallback(async () => {
    setEnrollLoading(true);
    try {
      const res = await fetchData("/api/v1/academy/administration/metrics");
      if (res) setEnrollments(Array.isArray(res) ? res : res.students || []);
    } catch (err) {}
    finally { setEnrollLoading(false); }
  }, [fetchData]);

  const loadCourses = useCallback(async () => {
    try {
      const result = await fetchData("/api/v1/academy");
      if (result) {
        setItems(result.map((c: any) => ({
          id: c._id,
          title: c.courseTitle,
          students: c.students || 0,
          weeks: c.weeks || 4,
          level: c.levelDescription,
          price: c.price,
          status: c.status || "Live",
          description: Array.isArray(c.outline) ? c.outline.join('\n') : "",
          coverImage: c.image,
          courseType: c.courseType || "modular",
          trainingDates: c.trainingDates || [],
        })));
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const resetForm = useCallback(() => {
    setEditing(null);
    setTitle(""); setLevel("Beginner"); setWeeks(4); setPrice(180);
    setStatus("Live"); setDescription(""); setCover(undefined); setCoverFile(null); setPdf(null);
    setCourseType("modular"); setTrainingDates([]); setNewDate("");
    setOpen(false);
  }, []);

  async function handleSave() {
    if (!title.trim()) return toast.error("Course title required");
    if (!editing && !coverFile) return toast.error("Course cover image required");
    const formData = new FormData();
    formData.append("courseTitle", title);
    formData.append("levelDescription", level);
    formData.append("price", String(price));
    formData.append("weeks", String(weeks));
    formData.append("status", status);
    formData.append("headline", title);
    formData.append("description", description);
    formData.append("courseType", courseType);
    if (courseType === "training") {
      formData.append("trainingDates", JSON.stringify(trainingDates));
    }
    const outlineArray = description.split('\n').map(s => s.trim()).filter(Boolean);
    formData.append("outline", JSON.stringify(outlineArray));
    if (coverFile) formData.append("image", coverFile);
    if (pdf) formData.append("pdfFile", pdf);
    try {
      const url = editing ? `/api/v1/academy/${editing.id}` : "/api/v1/academy";
      const method = editing ? "PUT" : "POST";
      await fetchData(url, { method, body: formData });
      toast.success(editing ? "Course updated" : "Course created");
      resetForm(); loadCourses();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${editing ? 'update' : 'create'} course`);
    }
  }

  function startEdit(c: Course) {
    setEditing(c);
    setTitle(c.title); setLevel(c.level); setWeeks(c.weeks); setPrice(c.price);
    setStatus(c.status); setDescription(c.description); setCover(c.coverImage); setCoverFile(null);
    setCourseType(c.courseType || "modular");
    setTrainingDates(c.trainingDates || []);
    setOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/academy/${id}`, { method: "DELETE" });
      toast.success("Course deleted"); loadCourses();
    } catch (err) { toast.error("Delete failed"); }
  }

  function addDate() {
    if (!newDate) return;
    if (!trainingDates.includes(newDate)) setTrainingDates(prev => [...prev, newDate]);
    setNewDate("");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Academy" subtitle="Manage all courses, instructors and enrollments." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={GraduationCap} label="Total courses" value={items.length} />
        <Stat icon={Users} label="Active students" value={items.reduce((acc, c) => acc + c.students, 0).toLocaleString()} />
        <Stat icon={GraduationCap} label="Live courses" value={items.filter((i) => i.status === "Live").length} />
        <Stat icon={BookOpen} label="Enrollments" value={enrollments.length} />
      </div>

      <div className="flex gap-2">
        {(["courses", "students"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); if (t === "students" && enrollments.length === 0) loadEnrollments(); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? "gradient-brand text-brand-foreground" : "bg-card border border-border hover:bg-accent"}`}>
            {t === "courses" ? `Courses (${items.length})` : `Enrolled Students (${enrollments.length})`}
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <>
          <Toolbar onSearch={setQ} addLabel="New course" onAdd={() => { resetForm(); setOpen(true); }} />
          <Card className="relative overflow-visible">
            {loading && items.length === 0 && (
              <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            )}
            <div className="overflow-x-auto pb-48">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
                  <tr><th className="px-4 py-3">Course</th><th>Type</th><th>Level</th><th>Duration</th><th>Price</th><th>Status</th><th></th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())).map((c) => (
                    <tr key={c.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => navigate({ to: "/admin/academy/$id", params: { id: c.id } })}>
                      <td className="px-4 py-3 font-medium text-primary hover:underline">{c.title}</td>
                      <td>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.courseType === "training" ? "bg-amber-500/10 text-amber-600" : "bg-brand/10 text-brand"}`}>
                          {c.courseType === "training" ? "Training" : "Modular"}
                        </span>
                      </td>
                      <td>{c.level}</td>
                      <td>{c.weeks} wks</td>
                      <td className="font-semibold">₦{c.price.toLocaleString()}</td>
                      <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === "Live" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{c.status}</span></td>
                      <td className="pr-4" onClick={(e) => e.stopPropagation()}><RowMenu actions={[
                        { label: "Edit", onClick: () => startEdit(c) },
                        { label: "Delete", danger: true, onClick: () => handleDelete(c.id) },
                      ]} /></td>
                    </tr>
                  ))}
                  {!loading && items.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No courses found.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === "students" && (
        <Card className="relative overflow-visible">
          {enrollLoading && (
            <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center rounded-2xl"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          )}
          <div className="overflow-x-auto pb-48">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
                <tr><th className="px-4 py-3">Student</th><th>Email</th><th>Courses Purchased</th><th>Practical Date</th><th>Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map((s: any) => (
                  <tr key={s._id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-semibold">{s.fullName || s.name}</td>
                    <td className="text-muted-foreground">{s.email}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(s.courses || s.purchasedCourses || []).map((c: any, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold">
                            {c.courseTitle || c.title || c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-muted-foreground text-xs">{s.practicalDate || "Not selected"}</td>
                    <td className="text-muted-foreground">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
                {!enrollLoading && enrollments.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No enrolled students yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={open} onClose={resetForm} title={editing ? "Edit Course" : "New Course"}
        footer={<><GhostBtn onClick={resetForm}>Cancel</GhostBtn><PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save Changes" : "Create"}</PrimaryBtn></>}>
        <div className="space-y-4">
          <ImageUpload label="Course cover" value={cover} onChange={(dataUrl, file) => { setCover(dataUrl); if (file) setCoverFile(file); }} aspect="aspect-[16/9]" />
          <Field label="Course title"><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. Advanced Microbiology" /></Field>

          <Field label="Course type">
            <div className="flex gap-2">
              {(["modular", "training"] as const).map(t => (
                <button key={t} type="button" onClick={() => setCourseType(t)}
                  className={`flex-1 h-10 rounded-xl text-sm font-semibold border transition-colors ${courseType === t ? "gradient-brand text-brand-foreground border-transparent" : "border-border bg-secondary"}`}>
                  {t === "modular" ? "Modular Course" : "Training / Workshop"}
                </button>
              ))}
            </div>
          </Field>

          {courseType === "training" && (
            <Field label="Training dates">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className={`flex-1 ${inputCls}`} />
                  <button type="button" onClick={addDate} className="h-10 px-3 rounded-xl gradient-brand text-brand-foreground text-sm font-semibold inline-flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                {trainingDates.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {trainingDates.map(d => (
                      <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        <button type="button" onClick={() => setTrainingDates(prev => prev.filter(x => x !== d))}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Level"><select className={inputCls} value={level} onChange={e => setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
            <Field label="Status">
              <select className={inputCls} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Live">Live</option><option value="Upcoming">Upcoming</option><option value="Draft">Draft</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (Weeks)"><input type="number" value={weeks} onChange={e => setWeeks(+e.target.value)} className={inputCls} /></Field>
            <Field label="Price (₦)"><input type="number" value={price} onChange={e => setPrice(+e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Outline (One per line)"><textarea rows={4} className={textareaCls} value={description} onChange={e => setDescription(e.target.value)} placeholder="Introduction to diagnostics&#10;PCR design fundamentals&#10;..." /></Field>
          <Field label="Course PDF (optional)">
            <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] || null)} className="block w-full text-sm text-foreground file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-secondary file:text-foreground file:font-semibold hover:file:bg-accent" />
            {pdf && <div className="text-xs text-muted-foreground mt-1.5">{pdf.name}</div>}
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return <Card className="p-4 flex items-center gap-3">
    <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></span>
    <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-display font-bold text-lg">{value}</div></div>
  </Card>;
}
