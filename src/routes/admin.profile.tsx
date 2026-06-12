import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Card, Field, inputCls, textareaCls, PrimaryBtn, GhostBtn } from "@/components/dashboard/widgets";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export const Route = createFileRoute("/admin/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, fetchData } = useFetch();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await fetchData("/api/v1/auth/profile");
        if (result) {
          setName(result.fullName);
          setEmail(result.email);
          setBio(result.bio || "");
          updateProfile({ name: result.fullName, email: result.email, bio: result.bio });
        }
      } catch (err) {}
    };
    getProfile();
  }, [fetchData]);

  async function handleUpdateProfile() {
    try {
      const result = await fetchData("/api/v1/auth/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, bio }),
      });
      if (result) {
        toast.success("Profile updated successfully");
        updateProfile({ ...user, name: result.user.fullName, bio: result.user.bio });
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
      const result = await fetchData("/api/v1/auth/profile/update", {
        method: "PUT",
        body: formData,
      });
      if (result) {
        toast.success("Profile picture updated");
        updateProfile({ ...user, ...result.user, name: result.user.fullName });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    try {
      await fetchData("/api/v1/auth/profile/password", { // Per readme section 4.1: PUT /profile/password
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Manage your personal information and security." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="relative inline-block">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
            <div className="h-28 w-28 rounded-full bg-muted overflow-hidden mx-auto relative border border-border">
              {(user as any)?.avatar ? (
                <img src={(user as any).avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full gradient-brand grid place-items-center text-brand-foreground text-3xl font-bold">
                  {user?.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              )}
              {loading && <div className="absolute inset-0 bg-background/50 grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-card border border-border grid place-items-center hover:bg-accent transition-colors shadow-sm" 
              aria-label="Change avatar"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 font-display font-bold text-lg">{user?.name}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          <div className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold uppercase">{user?.role}</div>
        </Card>
        <Card className="lg:col-span-2 p-6 space-y-4">
          <h3 className="font-display font-bold">Personal info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name"><input className={inputCls} value={name} onChange={e => setName(e.target.value)} /></Field>
            <Field label="Email address"><input className={inputCls} value={email} disabled /></Field>
          </div>
          <Field label="Bio"><textarea rows={3} className={textareaCls} value={bio} onChange={e => setBio(e.target.value)} /></Field>
          <PrimaryBtn onClick={handleUpdateProfile} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}</PrimaryBtn>
        </Card>
        <Card className="lg:col-span-3 p-6 space-y-4">
          <h3 className="font-display font-bold">Change password</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Current password"><input type="password" className={inputCls} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></Field>
            <Field label="New password"><input type="password" className={inputCls} value={newPassword} onChange={e => setNewPassword(e.target.value)} /></Field>
            <Field label="Confirm new password"><input type="password" className={inputCls} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></Field>
          </div>
          <PrimaryBtn onClick={handleChangePassword} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}</PrimaryBtn>
        </Card>
      </div>
    </div>
  );
}