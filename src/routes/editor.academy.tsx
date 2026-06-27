import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2, CalendarDays, Plus, X } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/academy")({ component: EditorAcademy });

interface Course { id: string; title: string; level: string; price: number; cover?: string; description: string; students: number; courseType?: string; trainingDates?: string[]; }

function EditorAcademy() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [price, setPrice] = useState(180);
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [courseType, setCourseType] = useState<"modular" | "training">("modular");
  const [trainingDates, setTrainingDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const { loading, fetchData } = useFetch();

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/academy");
      if (res) setItems(res.map((c: any) => ({
        id: c._id, title: c.courseTitle, level: c.levelDescription, price: c.price,
        cover: c.image, description: Array.isArray(c.outline) ? c.outline.join('\n') : "",
        students: c.students || 0, courseType: c.courseType || "modular", trainingDates: c.trainingDates || [],
      })));
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  function resetForm() {
    setEditing(null); setTitle(""); setLevel("Beginner"); setPrice(180);
    setDescription(""); setCover(undefined); setCoverFile(null); setPdf(null);
    setCourseType("modular"); setTrainingDates([]); setNewDate("");
    setOpen(false);
  }

  async function handleSave() {
    if (!title.trim()) return toast.error("Title required");
    if (!editing && !coverFile) return toast.error("Course cover image required");
    const formData = new FormData();
    formData.append("courseTitle", title);
    formData.append("levelDescription", level);
    formData.append("price", String(price));
    formData.append("headline", title);
    formData.append("description", description);
    formData.append("courseType", courseType);
    if (courseType === "training") formData.append("trainingDates", JSON.stringify(trainingDates));
    const outlineArray = description.split('\n').map(s => s.trim()).filter(Boolean);
    formData.append("outline", JSON.stringify(outlineArray));
    if (coverFile) formData.append("image", coverFile);
    if (pdf) formData.append("pdfFile", pdf);
    try {
      const url = editing ? `/api/v1/academy/${editing.id}` : "/api/v1/academy";
      await fetchData(url, { method: editing ? "PUT" : "POST", body: formData });
      toast.success(editing ? "Course updated" : "Course created");
      resetForm(); loadCourses();
    } catch (err) {}
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/academy/${id}`, { method: "DELETE" });
      toast.success("Course deleted"); loadCourses();
    } catch (err) {}
  }

  function addDate() {
    if (!newDate) return;
    if (!trainingDates.includes(newDate)) setTrainingDates(prev => [...prev, newDate]);
    setNewDate("");
  }

  function openEdit(c: Course) {
    setEditing(c); setTitle(c.title); setLevel(c.level); setPrice(c.price);
    setDescription(c.description); setCover(c.cover); setCoverFile(null);
    setCourseType((c.courseType as any) || "modular");
    setTrainingDates(c.trainingDates || []);
    setOpen(true);
  }

  return <div className="space-y-6">
    <PageHeader title="Academy content" subtitle="Edit lessons, modules and course materials." />
    <Toolbar onSearch={setQ} addLabel="New course" onAdd={() => { resetForm(); setOpen(true); }} />
    <Card className="relative overflow-visible">
      {loading && items.length === 0 && <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      <div className="overflow-x-auto pb-48"><table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase"><tr><th className="px-4 py-3">Course</th><th>Type</th><th>Level</th><th>Price</th><th>Students</th><th></th></tr></thead>
        <tbody className="divide-y divide-border">{items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())).map((c) => (
          <tr key={c.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => navigate({ to: "/editor/academy/$id", params: { id: c.id } })}>
            <td className="px-4 py-3 font-medium text-primary hover:underline">{c.title}</td>
            <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.courseType === "training" ? "bg-amber-500/10 text-amber-600" : "bg-brand/10 text-brand"}`}>{c.courseType === "training" ? "Training" : "Modular"}</span></td>
            <td>{c.level}</td>
            <td className="font-semibold">₦{c.price.toLocaleString()}</td>
            <td>{c.students.toLocaleString()}</td>
            <td className="pr-4" onClick={(e) => e.stopPropagation()}><RowMenu actions={[
              { label: "Edit", onClick: () => openEdit(c) },
              { label: "View students", onClick: () => navigate({ to: "/editor/academy/$id", params: { id: c.id } }) },
              { label: "Delete", danger: true, onClick: () => handleDelete(c.id) }
            ]} /></td>
          </tr>
        ))}
        {!loading && items.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No academy courses found.</td></tr>}
        </tbody>
      </table></div>
    </Card>

    <Modal open={open} onClose={resetForm} title={editing ? "Edit course" : "New course"}
      footer={<><GhostBtn onClick={resetForm}>Cancel</GhostBtn><PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</PrimaryBtn></>}>
      <div className="space-y-4">
        <ImageUpload label="Cover" value={cover} onChange={(dataUrl, file) => { setCover(dataUrl); if (file) setCoverFile(file); }} aspect="aspect-[16/9]" />
        <Field label="Title"><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} /></Field>

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
          <Field label="Price (₦)"><input type="number" className={inputCls} value={price} onChange={e => setPrice(+e.target.value)} /></Field>
        </div>
        <Field label="Outline (One per line)"><textarea rows={4} className={textareaCls} value={description} onChange={e => setDescription(e.target.value)} /></Field>
        <Field label="Course PDF (optional)">
          <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] || null)} className="block w-full text-sm text-foreground file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-secondary file:text-foreground file:font-semibold hover:file:bg-accent" />
          {pdf && <div className="text-xs text-muted-foreground mt-1.5">{pdf.name}</div>}
        </Field>
      </div>
    </Modal>
  </div>;
}
