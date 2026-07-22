"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function toUserFacingError(message: string): string {
  const msgLower = message.toLowerCase();
  if (msgLower.includes("invalid login credentials")) {
    return "Incorrect email or password. If you signed up via a magic link, use \"Send me a link\" below.";
  }
  if (msgLower.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  return message;
}

export async function login(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { email, password } = parsed.data;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(toUserFacingError(error.message))}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
