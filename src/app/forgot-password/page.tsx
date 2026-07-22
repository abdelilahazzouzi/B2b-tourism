import { requestPasswordReset } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Reset Password | Kasbarah",
  description: "Request a password reset link.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isSent = params?.sent === "true";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-widest text-slate hover:text-navy transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>

        {isSent ? (
          <div className="border-2 border-navy p-8 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)] bg-navy text-white text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 mx-auto text-white" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Reset Link Dispatched
            </h1>
            <p className="text-sm text-slate leading-relaxed font-medium">
              If an account exists with that email address, a password reset link has been dispatched to your inbox.
            </p>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)]">
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="w-5 h-5 text-navy" />
              <h1 className="text-2xl font-black uppercase tracking-tighter text-navy">
                Reset Password
              </h1>
            </div>
            <p className="text-xs text-slate font-medium mb-6 leading-relaxed">
              Enter your email address below and we&apos;ll send you a link to choose a new password.
            </p>

            {params?.error && (
              <div className="mb-6 p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-navy">{params.error}</p>
              </div>
            )}

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

              <div className="pt-2">
                <Button formAction={requestPasswordReset} className="w-full h-12 text-base">
                  Dispatch Reset Link
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
