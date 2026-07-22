"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getSiteUrl } from "@/utils/url";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export async function requestPasswordReset(formData: FormData) {
  const raw = formData.get("email") as string;
  const parsed = emailSchema.safeParse(raw);

  if (!parsed.success) {
    redirect(`/forgot-password?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid email.")}`);
  }

  const email = parsed.data;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const siteUrl = await getSiteUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/confirm?next=/auth/reset-password`,
    });

    if (error) {
      if (error.message.toLowerCase().includes("fetch failed") || error.message.toLowerCase().includes("enotfound")) {
        redirect(`/forgot-password?error=${encodeURIComponent("Unable to reach the server. Please check your internet connection.")}`);
      }
      redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    if (err instanceof Error && "digest" in err) throw err;
    redirect(`/forgot-password?error=${encodeURIComponent(String(err))}`);
  }

  redirect("/forgot-password?sent=true");
}
