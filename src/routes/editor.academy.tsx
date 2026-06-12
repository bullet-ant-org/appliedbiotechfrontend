import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Toolbar, RowMenu, Modal, Field, ImageUpload, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/academy")({ component: EditorAcademy });

interface Course { id: string; title: string; level: string; price: number; cover?: string; description: string; students: number; }

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
  const [cover, setCover] = useState<any>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const { loading, fetchData } = useFetch();

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/academy");
      if (res) setItems(res.map((c: any) => ({
        id: c._id, title: c.courseTitle, level: c.levelDescription, price: c.price,
        cover: c.image, description: Array.isArray(c.outline) ? c.outline.join('\n') : "", students: c.students || 0
      })));
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  async function handleSave() {
    if (!title.trim()) return toast.error("Title required");
    const formData = new FormData();
    formData.append("courseTitle", title);
    formData.append("levelDescription", level);
    formData.append("price", String(price));
    formData.append("headline", title);
    formData.append("description", description);

    const outlineArray = description.split('\n').map(s => s.trim()).filter(Boolean);
    formData.append("outline", JSON.stringify(outlineArray));

    if (cover) {
      if (typeof cover !== "string") formData.append("image", cover);
      else if (!editing) formData.append("image", cover);
    }

    if (pdf) formData.append("pdfFile", pdf);

    try {
      const url = editing ? `/api/v1/academy/${editing.id}` : "/api/v1/academy";
      await fetchData(url, { method: editing ? "PUT" : "POST", body: formData });
      toast.success(editing ? "Course updated" : "Course created");
      setOpen(false); setEditing(null); setPdf(null); loadCourses();
    } catch (err) {}
  }

  async function handleDelete(id: string) {
    try {
      await fetchData(`/api/v1/academy/${id}`, { method: "DELETE" });
      toast.success("Course deleted"); loadCourses();
    } catch (err) {}
  }

  return <div className="space-y-6">
    <PageHeader title="Academy content" subtitle="Edit lessons, modules and course materials." />
    <Toolbar onSearch={setQ} addLabel="New course" onAdd={() => { setEditing(null); setTitle(""); setLevel("Beginner"); setPrice(180); setDescription(""); setCover(null); setOpen(true); }} />
    <Card className="relative overflow-visible">
      {loading && items.length === 0 && <div className="absolute inset-0 bg-background/50 z-10 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      <div className="overflow-x-auto pb-48"><table className="w-full text-sm">
      <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase"><tr><th className="px-4 py-3">Course</th><th>Level</th><th>Price</th><th>Students</th><th></th></tr></thead>
      <tbody className="divide-y divide-border">{items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())).map((c) => (
        <tr key={c.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => navigate({ to: "/editor/academy/$id", params: { id: c.id } })}>
          <td className="px-4 py-3 font-medium text-primary hover:underline">{c.title}</td><td>{c.level}</td>
          <td className="font-semibold">₦{c.price.toLocaleString()}</td>
          <td>{c.students.toLocaleString()}</td>
          <td className="pr-4" onClick={(e) => e.stopPropagation()}><RowMenu actions={[
            { label: "Edit", onClick: () => { setEditing(c); setTitle(c.title); setLevel(c.level); setPrice(c.price); setDescription(c.description); setCover(c.cover); setOpen(true); } },
            { label: "View students", onClick: () => navigate({ to: "/editor/academy/$id", params: { id: c.id } }) },
            { label: "Delete", danger: true, onClick: () => handleDelete(c.id) }
          ]} /></td>
        </tr>
      ))}
      {!loading && items.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No academy courses found.</td></tr>}
      </tbody>
    </table></div>
    </Card>

    <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit course" : "New course"} 
      footer={<><GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn><PrimaryBtn disabled={loading} onClick={handleSave}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</PrimaryBtn></>}>
      <div className="space-y-4">
        <ImageUpload label="Cover" value={cover} onChange={setCover} aspect="aspect-[16/9]" />
        <Field label="Title"><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} /></Field>
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