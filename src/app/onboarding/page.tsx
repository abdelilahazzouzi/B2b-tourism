import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { submitOnboarding } from "./actions";
import { Button } from "@/components/ui/Button";

export default async function OnboardingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // If they already have a full name, send them to the dashboard
  if (profile?.full_name && profile.full_name.trim() !== "") {
    redirect("/dashboard");
  }

  const error = searchParams.error as string | undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-navy">
      <div className="max-w-md w-full border-4 border-navy bg-white shadow-[16px_16px_0px_0px_rgba(74,85,104,1)] p-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
          Welcome to Kasbarah
        </h1>
        <p className="text-slate font-medium mb-8">
          Before you access the client portal, please complete your profile.
        </p>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 text-red-500 p-3 mb-6 font-bold uppercase text-xs">
            {error}
          </div>
        )}

        <form action={submitOnboarding} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-bold uppercase tracking-wider text-navy"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="e.g., Jane Doe"
              className="w-full bg-slate/10 border-2 border-navy px-4 py-3 text-navy font-medium placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-navy transition-all"
            />
          </div>

          <Button type="submit" size="lg" className="w-full text-base">
            Complete Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
