"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

// Helper: verify the calling user is an admin
async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

export async function approveInvitation(formData: FormData) {
  const admin = await requireAdmin();
  const requestId = formData.get("requestId") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!requestId || !email) {
    redirect("/admin?error=Missing+required+fields");
  }

  const adminClient = createAdminClient();

  // 1. Generate a one-time invite link (bypasses email sending entirely)
  const { data: linkData, error: inviteError } =
    await adminClient.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        data: { full_name: name },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });

  if (inviteError) {
    redirect(`/admin?error=${encodeURIComponent(inviteError.message)}`);
  }

  const inviteLink = linkData?.properties?.action_link ?? "";

  // 2. Update the invitation request status to 'approved'
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase
    .from("invitation_requests")
    .update({
      status: "approved",
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  revalidatePath("/admin");

  // 3. Redirect back to admin page with the invite link so admin can copy it
  redirect(
    `/admin?inviteLink=${encodeURIComponent(inviteLink)}&inviteName=${encodeURIComponent(name)}&inviteEmail=${encodeURIComponent(email)}`
  );
}

export async function rejectInvitation(formData: FormData) {
  const admin = await requireAdmin();
  const requestId = formData.get("requestId") as string;

  if (!requestId) {
    redirect("/admin?error=Missing+request+ID");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase
    .from("invitation_requests")
    .update({
      status: "rejected",
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  revalidatePath("/admin");
}
