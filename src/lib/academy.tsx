import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { toast } from "sonner";

const BACKEND_URL = (() => {
  const env = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost") &&
    !window.location.hostname.includes("127.0.0.1")) {
    if (!env || env.includes("localhost") || env.includes("127.0.0.1")) {
      return "https://appliedbiotechbackend.onrender.com";
    }
  }
  return env || "https://appliedbiotechbackend.onrender.com";
})();

export function backendFetch(path: string, options?: RequestInit) {
  const base = BACKEND_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${base}${p}`, options);
}

export type AcademyUser = { id?: string; _id?: string; email: string; name: string; phone?: string; role?: string };
export type Enrollment = {
  courseId: string;
  title: string;
  cover?: string;
  price: number;
  pages: string[];        // page text content (fallback)
  pageImages?: string[];  // image URLs — if present, reader shows images instead of text
  currentPage: number;
  practicalDate?: string; // ISO
  purchasedAt: number;
};

interface AcademyValue {
  user: AcademyUser | null;
  enrollments: Enrollment[];
  signIn: (email: string, password: string) => Promise<AcademyUser>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<AcademyUser>;
  signOut: () => void;
  enroll: (e: Omit<Enrollment, "currentPage" | "purchasedAt">) => void;
  isEnrolled: (courseId: string) => boolean;
  setPage: (courseId: string, page: number) => void;
  setPracticalDate: (courseId: string, iso: string) => void;
  progressPct: (courseId: string) => number;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  signInFromServer: (user: AcademyUser, token?: string) => Promise<AcademyUser>;
}

const Ctx = createContext<AcademyValue | null>(null);
const USER_KEY = "ab.academy.user";
const USERS_KEY = "ab.academy.users";    // {email: {name, password}}
const ENROLL_KEY = "ab.academy.enrollments";
export const ACADEMY_TOKEN_KEY = "ab.academy.token";

function readJSON<T>(k: string, fallback: T): T {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AcademyUser | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const hasSynced = useRef(false);

  useEffect(() => {
    const storedUser = readJSON<AcademyUser | null>(USER_KEY, null);
    const storedEnrollments = readJSON<Enrollment[]>(ENROLL_KEY, []);
    setUser(storedUser);
    setEnrollments(storedEnrollments);

    if (hasSynced.current) return;
    const token = localStorage.getItem(ACADEMY_TOKEN_KEY);
    if (!storedUser || !token) return;
    hasSynced.current = true;

    backendFetch("/api/v1/academy/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(profile => {
        if (!profile) return;
        const purchased: any[] = profile.purchasedCourses || [];
        if (purchased.length === 0) return;
        setEnrollments(prev => {
          const merged = [...prev];
          for (const p of purchased) {
            const course = p.course;
            if (!course || !course._id) continue;
            const alreadyIn = merged.some(e => e.courseId === course._id);
            if (!alreadyIn) {
              merged.push({
                courseId: course._id,
                title: course.courseTitle || course.title || "Course",
                cover: course.image || "",
                price: course.price || 0,
                pages: Array.isArray(course.outline) ? course.outline : [],
                pageImages: [],
                currentPage: 0,
                practicalDate: p.practicalDate || undefined,
                purchasedAt: new Date(p.purchasedAt || Date.now()).getTime(),
              });
            }
          }
          return merged;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try { localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments)); } catch {}
  }, [enrollments]);

  const signIn = useCallback(async (email: string, password: string) => {
    const users = readJSON<Record<string, { name: string; password: string }>>(USERS_KEY, {});
    const u = users[email.toLowerCase()];
    if (!u || u.password !== password) throw new Error("Invalid email or password");
    const next = { email: email.toLowerCase(), name: u.name };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
    toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
    return next;
  }, []);

  const signUp = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const users = readJSON<Record<string, { name: string; password: string }>>(USERS_KEY, {});
    const key = email.toLowerCase();
    if (users[key]) throw new Error("An account already exists for this email");
    users[key] = { name, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const next = { email: key, name };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
    toast.success(`Account created — welcome, ${name.split(" ")[0]}`);
    return next;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACADEMY_TOKEN_KEY);
    localStorage.removeItem(ENROLL_KEY);
    setUser(null);
    setEnrollments([]);
    toast.success("Signed out of Academy");
  }, []);

  const enroll = useCallback((e: Omit<Enrollment, "currentPage" | "purchasedAt">) => {
    setEnrollments((prev) => {
      if (prev.some((x) => x.courseId === e.courseId)) return prev;
      return [...prev, { ...e, currentPage: 0, purchasedAt: Date.now() }];
    });
    toast.success(`Purchased — “${e.title}” is in your library`);
  }, []);

  const isEnrolled = useCallback((id: string) => enrollments.some((e) => e.courseId === id), [enrollments]);

  const setPage = useCallback((courseId: string, page: number) => {
    setEnrollments((prev) => prev.map((e) => {
      if (e.courseId !== courseId) return e;
      const total = (e.pageImages?.length ?? e.pages.length);
      return { ...e, currentPage: Math.max(0, Math.min(page, total - 1)) };
    }));
  }, []);

  const setPracticalDate = useCallback((courseId: string, iso: string) => {
    setEnrollments((prev) => prev.map((e) => e.courseId === courseId ? { ...e, practicalDate: iso } : e));
  }, []);

  const progressPct = useCallback((courseId: string) => {
    const e = enrollments.find((x) => x.courseId === courseId);
    if (!e) return 0;
    const total = (e.pageImages?.length ?? e.pages.length);
    if (total <= 1) return e.currentPage > 0 ? 100 : 0;
    return Math.round(((e.currentPage + 1) / total) * 100);
  }, [enrollments]);

  const getEnrollment = useCallback((id: string) => enrollments.find((e) => e.courseId === id), [enrollments]);

  const signInFromServer = useCallback(async (serverUser: AcademyUser, token?: string) => {
    const next: AcademyUser = {
      id: String((serverUser as any).id || (serverUser as any)._id || ""),
      email: String(serverUser.email || (serverUser as any).username || "").toLowerCase().trim(),
      name: String(serverUser.name || (serverUser as any).fullName || (serverUser as any).username || "Student"),
      role: String((serverUser as any).role || "student").toLowerCase()
    } as AcademyUser;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      if (token) localStorage.setItem(ACADEMY_TOKEN_KEY, token);
    } catch {}
    setUser(next);

    // Fetch purchased courses from backend and sync into local enrollments
    if (token) {
      try {
        const res = await backendFetch("/api/v1/academy/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const profile = await res.json();
          const purchased: any[] = profile.purchasedCourses || [];
          if (purchased.length > 0) {
            setEnrollments(prev => {
              const merged = [...prev];
              for (const p of purchased) {
                const course = p.course;
                if (!course || !course._id) continue;
                const courseId = course._id;
                const alreadyIn = merged.some(e => e.courseId === courseId);
                if (!alreadyIn) {
                  merged.push({
                    courseId,
                    title: course.courseTitle || course.title || "Course",
                    cover: course.image || "",
                    price: course.price || 0,
                    pages: Array.isArray(course.outline) ? course.outline : [],
                    pageImages: [],
                    currentPage: 0,
                    practicalDate: p.practicalDate || undefined,
                    purchasedAt: new Date(p.purchasedAt || Date.now()).getTime(),
                  });
                }
              }
              return merged;
            });
          }
        }
      } catch {}
    }

    toast.success(`Welcome back, ${next.name.split(" ")[0] || "Student"}`);
    return next;
  }, []);

  return (
    <Ctx.Provider value={{ user, enrollments, signIn, signUp, signOut, enroll, isEnrolled, setPage, setPracticalDate, progressPct, getEnrollment, signInFromServer }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAcademy() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAcademy must be used within AcademyProvider");
  return v;
                                                       }
