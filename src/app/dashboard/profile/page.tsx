import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Mail, Shield, Calendar, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import type { UserProfile } from "@/types/domain";

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Profile | Kasbarah",
};

async function updateProfile(formData: FormData) {
  "use server";
  const cookieStore = await (await import("next/headers")).cookies();
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = formData.get("full_name") as string;

  if (!fullName || fullName.trim().length < 2) {
    redirect("/dashboard/profile?error=Name+must+be+at+least+2+characters");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", user.id);

  if (error) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?saved=true");
}

async function updatePassword(formData: FormData) {
  "use server";
  const cookieStore = await (await import("next/headers")).cookies();
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!password || password.length < 6) {
    redirect("/dashboard/profile?error=Password+must+be+at+least+6+characters");
  }

  if (password !== confirmPassword) {
    redirect("/dashboard/profile?error=Passwords+do+not+match");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard/profile?password_updated=true");
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; password_updated?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userProfile = profile as UserProfile | null;

  const ROLE_LABELS: Record<string, string> = {
    client: "Client",
    admin: "Administrator",
    concierge: "Concierge",
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b-4 border-navy pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Profile</h1>
        <p className="text-slate font-bold uppercase tracking-widest mt-2 text-sm">Account Settings</p>
      </div>

      {params?.saved === 'true' && (
        <div className="p-4 border-2 border-emerald-500 bg-emerald-50 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-emerald-800">Profile updated successfully.</p>
        </div>
      )}

      {params?.password_updated === 'true' && (
        <div className="p-4 border-2 border-emerald-500 bg-emerald-50 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-emerald-800">Password updated successfully.</p>
        </div>
      )}

      {params?.error && (
        <div className="p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
          <Shield className="w-5 h-5 text-navy shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-navy">{params.error}</p>
        </div>
      )}

      {/* Read-only info */}
      <div className="border-2 border-slate p-8 space-y-6">
        <h2 className="text-lg font-black uppercase tracking-tighter text-navy border-b-2 border-navy pb-3">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-slate shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate">Email</p>
              <p className="font-bold text-navy mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-slate shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate">Role</p>
              <p className="font-bold text-navy mt-1">{ROLE_LABELS[userProfile?.role ?? 'client'] ?? 'Client'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate">Member Since</p>
              <p className="font-bold text-navy mt-1">
                {userProfile?.created_at
                  ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate">User ID</p>
              <p className="font-mono text-xs text-slate mt-1">{user.id.slice(0, 16)}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable form */}
      <form className="border-2 border-slate p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
        <h2 className="text-lg font-black uppercase tracking-tighter text-navy border-b-2 border-navy pb-3">Edit Profile</h2>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate" htmlFor="full_name">
            Full Name
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={userProfile?.full_name ?? ""}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="pt-2">
          <Button formAction={updateProfile} className="w-full h-12 text-base">
            Save Changes
          </Button>
        </div>
      </form>

      {/* Password reset form */}
      <form className="border-2 border-slate p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
        <h2 className="text-lg font-black uppercase tracking-tighter text-navy border-b-2 border-navy pb-3">Change Password</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate" htmlFor="password">
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate" htmlFor="confirm_password">
              Confirm New Password
            </label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>
        <div className="pt-2">
          <Button formAction={updatePassword} className="w-full h-12 text-base">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
