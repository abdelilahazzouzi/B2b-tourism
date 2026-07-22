"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getSiteUrl } from "@/utils/url";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
});

// Generic error messages — never expose raw Supabase strings to the client.
const AUTH_ERRORS: Record<string, string> = {
  "Email rate limit exceeded": "Too many requests. Please wait a few minutes before trying again.",
  "User already registered": "An account with this email already exists. Please sign in.",
  "For security purposes, you can only request this after": "Please wait before requesting another link.",
};

function toUserFacingError(message: string): string {
  const msgLower = message.toLowerCase();
  for (const [key, friendly] of Object.entries(AUTH_ERRORS)) {
    if (msgLower.includes(key.toLowerCase())) return friendly;
  }
  return "Something went wrong. Please try again or contact support.";
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

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Insert into the invitation_requests table for admin approval
  const { error } = await supabase.from("invitation_requests").insert({
    name,
    email,
  });

  if (error) {
    // 23505 is the PostgreSQL error code for unique_violation
    if (error.code === "23505") {
      redirect(`/request-access?error=${encodeURIComponent("You have already requested an invitation.")}`);
    }
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
