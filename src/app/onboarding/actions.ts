"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function submitOnboarding(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = formData.get("fullName") as string;

  if (!fullName || fullName.trim() === "") {
    redirect("/onboarding?error=Name+is+required");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: fullName.trim() }, { onConflict: "id" });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  // Clear server cache for layout and pages before redirecting
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
