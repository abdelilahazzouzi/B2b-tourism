import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { EmailOtpType } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code && !(token_hash && type)) {
    return NextResponse.redirect(
      new URL(
        "/login?error=" + encodeURIComponent("Invalid access link. Please request a new one."),
        request.url
      )
    );
  }

  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    let authError = null;

    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      authError = error;
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      authError = error;
    }

    if (authError) {
      const isExpired =
        authError.message.toLowerCase().includes("expired") ||
        authError.message.toLowerCase().includes("invalid");

      const userMessage = isExpired
        ? "Your access link has expired. Please request a new one."
        : "Access link is invalid. Please request a new one.";

      return NextResponse.redirect(
        new URL("/login?error=" + encodeURIComponent(userMessage), request.url)
      );
    }

    // Get current logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if user has completed onboarding
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!profile || !profile.full_name || profile.full_name.trim() === "") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch {
    return NextResponse.redirect(
      new URL(
        "/login?error=" + encodeURIComponent("Something went wrong. Please request a new link."),
        request.url
      )
    );
  }
}
