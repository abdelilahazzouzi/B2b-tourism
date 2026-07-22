"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export async function updatePassword(formData: FormData) {
  const raw = formData.get("password") as string;
  const parsed = passwordSchema.safeParse(raw);

  if (!parsed.success) {
    redirect(`/auth/reset-password?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid password.")}`);
  }

  const password = parsed.data;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    if (err instanceof Error && "digest" in err) throw err;
    redirect(`/auth/reset-password?error=${encodeURIComponent(String(err))}`);
  }

  redirect("/dashboard");
}
