import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, textareaCls, PrimaryBtn } from "@/components/dashboard/widgets";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/editor/profile")({ component: EditorProfile });

function EditorProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/api/v1/auth/profile").then((res) => {
      if (res) {
        setName(res.fullName || res.name || "");
        setBio(res.bio || "");
        updateProfile({ name: res.fullName || res.name, bio: res.bio });
      }
    }).catch(() => {});
  }, []);

  async function handleUpdateProfile() {
    if (!name.trim()) return toast.error("Name is required");
    try {
      const res = await fetchData("/api/v1/auth/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, bio }),
      });
      if (res) {
        toast.success("Profile updated");
        updateProfile({ name: res.user?.fullName || name, bio: res.user?.bio || bio });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetchData("/api/v1/auth/profile/update", { method: "PUT", body: formData });
      if (res) { toast.success("Profile picture updated"); updateProfile({ ...user, ...res.user, name: res.user?.fullName }); }
    } catch (err: any) { toast.error(err.message || "Failed to upload image"); }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return toast.error("Please fill in all password fields");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      await fetchData("/api/v1/auth/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    }
  }

  const initials = (user?.name || "User").split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Update your editor profile and credentials." />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="relative w-28 mx-auto">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="h-28 w-28 rounded-full object-cover mx-auto" />
              : <div className="h-28 w-28 rounded-full gradient-brand grid place-items-center text-brand-foreground text-3xl font-bold mx-auto">{initials}</div>
            }
            <button onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-card border border-border shadow grid place-items-center hover:bg-accent transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-4 font-display font-bold text-lg">{user?.name}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          <div className="mt-2 inline-flex text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold uppercase">{user?.role}</div>
        </Card>

        <Card className="lg:col-span-2 p-6 space-y-4">
          <h3 className="font-display font-bold">Personal info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email"><input className={inputCls} value={user?.email || ""} disabled /></Field>
          </div>
          <Field label="Bio"><textarea rows={3} className={textareaCls} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about you..." /></Field>
          <PrimaryBtn onClick={handleUpdateProfile} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </PrimaryBtn>
        </Card>

        <Card className="lg:col-span-3 p-6 space-y-4">
          <h3 className="font-display font-bold">Change password</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Current password"><input type="password" className={inputCls} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></Field>
            <Field label="New password"><input type="password" className={inputCls} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></Field>
            <Field label="Confirm new password"><input type="password" className={inputCls} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></Field>
          </div>
          <PrimaryBtn onClick={handleChangePassword} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </PrimaryBtn>
        </Card>
      </div>
    </div>
  );
}
