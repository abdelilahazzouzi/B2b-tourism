"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getSiteUrl } from "@/utils/url";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
});

function toUserFacingError(message: string): string {
  const msgLower = message.toLowerCase();
  if (msgLower.includes("rate limit") || msgLower.includes("too many requests")) {
    return "Email rate limit reached. Please wait a few minutes before trying again or request a direct link from your admin.";
  }
  if (msgLower.includes("user not found") || msgLower.includes("not allowed for otp") || msgLower.includes("invalid user")) {
    return "No active account found for this email. Please request an invitation first.";
  }
  if (msgLower.includes("already registered") || msgLower.includes("already exists")) {
    return "An account with this email already exists. Please sign in.";
  }
  return message;
}

export async function requestInvitation(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/request-access?error=${encodeURIComponent(message)}`);
  }

  const { name, email } = parsed.data;
  const adminClient = createAdminClient();

  // Check if this email already exists in invitation_requests
  const { data: existing } = await adminClient
    .from("invitation_requests")
    .select("status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "approved") {
      redirect(
        `/request-access?error=${encodeURIComponent(
          "Your invitation has already been approved! Please check your inbox for your access link, or contact an admin."
        )}`
      );
    } else if (existing.status === "pending") {
      redirect(
        `/request-access?error=${encodeURIComponent(
          "Your invitation request is currently under review by our team."
        )}`
      );
    } else {
      redirect(
        `/request-access?error=${encodeURIComponent(
          "An invitation request for this email was previously processed."
        )}`
      );
    }
  }

  // Insert new request
  const { error } = await adminClient.from("invitation_requests").insert({
    name,
    email,
  });

  if (error) {
    const friendly = toUserFacingError(error.message);
    redirect(`/request-access?error=${encodeURIComponent(friendly)}`);
  }

  redirect("/request-access?sent=true");
}

export async function sendMagicLink(formData: FormData) {
  const emailSchema = z.string().email("Please enter a valid email address");
  const raw = formData.get("email") as string;

  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid email.")}`);
  }

  const email = parsed.data;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    const friendly = toUserFacingError(error.message);
    redirect(`/login?error=${encodeURIComponent(friendly)}`);
  }

  redirect("/login?magic=sent");
}
