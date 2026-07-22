"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

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

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msgLower = error.message.toLowerCase();

      if (msgLower.includes("fetch failed") || msgLower.includes("enotfound")) {
        redirect(`/login?error=${encodeURIComponent("Unable to reach server. Please check your internet connection.")}`);
      }

      if (msgLower.includes("invalid login credentials")) {
        // Smart check: Does an account exist with this email?
        const adminClient = createAdminClient();
        const { data: usersData } = await adminClient.auth.admin.listUsers();
        const userExists = usersData?.users?.some(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!userExists) {
          redirect(
            `/login?error=${encodeURIComponent(
              "No account on record with this email address. Please sign up to create an account."
            )}`
          );
        } else {
          redirect(
            `/login?error=${encodeURIComponent(
              "Incorrect password. If you don't have a password or forgot it, use Magic Link or Reset Password below."
            )}`
          );
        }
      }

      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    if (err instanceof Error && "digest" in err) throw err;
    const msg = String(err);
    redirect(`/login?error=${encodeURIComponent(msg)}`);
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
