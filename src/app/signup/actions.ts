"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  const { name, email, password } = parsed.data;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("already registered") || authError.message.toLowerCase().includes("already exists")) {
        redirect(`/login?error=${encodeURIComponent("An account with this email already exists. Please sign in.")}`);
      }
      redirect(`/signup?error=${encodeURIComponent(authError.message)}`);
    }

    if (authData.user) {
      // Ensure profile row exists with full_name using adminClient to bypass RLS
      const adminClient = createAdminClient();
      await adminClient.from("profiles").upsert(
        {
          id: authData.user.id,
          full_name: name,
        },
        { onConflict: "id" }
      );
    }
  } catch (err) {
    if (err instanceof Error && "digest" in err) throw err;
    const msg = String(err);
    if (msg.includes("ENOTFOUND") || msg.includes("fetch failed")) {
      redirect(`/signup?error=${encodeURIComponent("Unable to reach the server. Please check your internet connection.")}`);
    }
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
