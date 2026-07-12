import { login } from "./actions";
import { sendMagicLink } from "@/app/request-access/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldAlert, CheckCircle2, Mail, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Kasbarah",
  description: "Sign in to the Kasbarah Traveler Portal.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; magic?: string }>;
}) {
  const params = await searchParams;
  const magicSent = params?.magic === "sent";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate hover:text-navy transition-colors"
          >
            ← Kasbarah
          </Link>
        </div>

        {params?.error && (
          <div className="mb-6 p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-navy">{params.error}</p>
          </div>
        )}

        {magicSent && (
          <div className="mb-6 p-4 border-2 border-navy bg-navy text-white flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">
              Access link dispatched. Check your inbox and click the link to sign in.
            </p>
          </div>
        )}

        {/* Password login */}
        <div className="bg-white border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)] mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-navy" />
            <h1 className="text-2xl font-black uppercase tracking-tighter text-navy">
              Sign In
            </h1>
          </div>
          <form className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-widest text-slate"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="executive@domain.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-widest text-slate"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            <div className="pt-2">
              <Button formAction={login} className="w-full h-12 text-base">
                Sign In with Password
              </Button>
            </div>
          </form>
        </div>

        {/* Magic link option — for OTP-onboarded users who have no password */}
        <div className="bg-white border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)]">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-navy" />
            <h2 className="text-lg font-black uppercase tracking-tighter text-navy">
              No Password?
            </h2>
          </div>
          <p className="text-sm text-slate font-medium mb-5 leading-relaxed">
            If you joined via a magic link, enter your email below and we&apos;ll
            send you a new one-click access link.
          </p>
          <form className="space-y-4">
            <Input
              id="magic-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
            <Button
              formAction={sendMagicLink}
              variant="outline"
              className="w-full h-12 text-sm"
            >
              Send Me a Magic Link
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate uppercase tracking-wider">
          Don&apos;t have access?{" "}
          <Link href="/request-access" className="text-navy font-bold hover:underline">
            Request an Invitation
          </Link>
        </p>
      </div>
    </div>
  );
}
