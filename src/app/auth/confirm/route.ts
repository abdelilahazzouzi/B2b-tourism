import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// This route handles the magic-link token exchange.
// Supabase emails users a link that lands here with ?code=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent("Invalid access link. Please request a new one."), request.url)
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Distinguish between expired and invalid links
      const isExpired =
        error.message.toLowerCase().includes("expired") ||
        error.message.toLowerCase().includes("invalid");

      const userMessage = isExpired
        ? "Your access link has expired. Please request a new one."
        : "Access link is invalid. Please request a new one.";

      return NextResponse.redirect(
        new URL("/request-access?error=" + encodeURIComponent(userMessage), request.url)
      );
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent("Something went wrong. Please request a new link."), request.url)
    );
  }
}
