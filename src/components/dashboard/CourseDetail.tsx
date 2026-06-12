import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/dashboard/widgets";
import { ArrowLeft, Users, GraduationCap, FileText, Calendar } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useSiteContent } from "@/lib/site-content";

type Student = { id: string; name: string; email: string; progress: number; practicalDate?: string };

export function CourseDetail({ id, basePath }: { id: string; basePath: "/admin/academy" | "/editor/academy" }) {
  const [course, setCourse] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { fetchData } = useFetch();
  const { practicalDates } = useSiteContent();

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchData("/api/v1/academy");
        const c = (all || []).find((x: any) => x._id === id);
        if (c) setCourse(c);
      } catch {}
      // Roster — backend endpoint may not exist; show empty if it fails
      try {
        const res = await fetchData(`/api/v1/academy/${id}/students`);
        if (Array.isArray(res)) {
          setStudents(res.map((s: any) => ({
            id: s._id || s.id || s.email,
            name: s.fullName || s.name || "—",
            email: s.email || "—",
            progress: s.progress ?? 0,
            practicalDate: s.practicalDate,
          })));
        }
      } catch {}
    })();
  }, [id, fetchData]);

  return (
    <div className="space-y-6">
      <Link to={basePath as any} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to courses</Link>
      <PageHeader
        title={course?.courseTitle || "Course"}
        subtitle={course?.levelDescription ? `${course.levelDescription} · ₦${Number(course.price || 0).toLocaleString()}` : "Loading…"}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Enrolled" value={students.length} />
        <Stat icon={GraduationCap} label="Avg progress" value={students.length ? `${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%` : "—"} />
        <Stat icon={Calendar} label="Practical slots" value={practicalDates.length} />
        <Stat icon={FileText} label="Course PDF" value={course?.pdf || course?.pdfUrl ? "Available" : "None"} />
      </div>

      {course?.image && (
        <Card className="overflow-hidden">
          <img src={course.image} alt="" className="w-full max-h-64 object-cover" />
        </Card>
      )}

      {(course?.pdf || course?.pdfUrl) && (
        <a href={course.pdf || course.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border hover:bg-accent text-sm font-semibold">
          <FileText className="h-4 w-4" /> Open course PDF
        </a>
      )}

      <Card>
        <div className="p-4 border-b border-border font-display font-bold">Enrolled students</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground text-xs uppercase">
              <tr><th className="px-4 py-3">Name</th><th>Email</th><th>Progress</th><th>Practical date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td>{s.email}</td>
                  <td><div className="flex items-center gap-2 max-w-[180px]"><div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden"><div className="h-full gradient-brand" style={{ width: `${s.progress}%` }} /></div><span className="text-xs w-9 text-right">{s.progress}%</span></div></td>
                  <td>{s.practicalDate ? new Date(s.practicalDate).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">No enrolled students yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return <Card className="p-4 flex items-center gap-3">
    <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></span>
    <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-display font-bold text-lg">{value}</div></div>
  </Card>;
}