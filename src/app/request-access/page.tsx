import { requestInvitation } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Request Access | Kasbarah",
  description: "Request an exclusive invitation to the Kasbarah Traveler Portal.",
};

export default async function RequestAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isSent = params?.sent === "true";

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-6 py-24 bg-white relative">
      {/* Background grid detail */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0A1128 1px, transparent 1px), linear-gradient(90deg, #0A1128 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header mark */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate hover:text-navy transition-colors"
          >
            ← Kasbarah
          </Link>
        </div>

        {isSent ? (
          /* ── Success State ── */
          <div className="border-2 border-navy p-10 shadow-[12px_12px_0px_0px_rgba(10,17,40,1)] bg-navy text-white text-center space-y-6">
            <CheckCircle2 className="w-12 h-12 mx-auto text-white" />
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Access Dispatched
            </h1>
            <p className="text-slate leading-relaxed font-medium">
              Your exclusive access link has been dispatched to your inbox.
              Check your email — click the link to enter the Traveler Portal.
            </p>
            <p className="text-xs uppercase tracking-widest text-slate/70 border-t border-slate/30 pt-4">
              No link? Check your spam folder or{" "}
              <Link
                href="/request-access"
                className="underline hover:text-white transition-colors"
              >
                request again
              </Link>
              .
            </p>
          </div>
        ) : (
          /* ── Request Form ── */
          <div className="border-2 border-navy bg-white p-10 shadow-[12px_12px_0px_0px_rgba(74,85,104,1)]">
            <div className="mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 border-2 border-navy px-3 py-1 bg-navy text-white text-xs font-bold uppercase tracking-widest mb-4">
                <Mail className="w-3.5 h-3.5" />
                <span>Invitation Protocol</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-navy">
                Request Access
              </h1>
              <p className="text-slate font-medium text-sm leading-relaxed">
                Kasbarah is invitation-only. Submit your details and we will
                dispatch a secure, one-click access link to your inbox
                immediately.
              </p>
            </div>

            {params?.error && (
              <div className="mb-6 p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-navy uppercase tracking-wide">
                  {params.error}
                </p>
              </div>
            )}

            <form className="space-y-5">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-widest text-slate"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Alexandra Martínez"
                  required
                  autoComplete="name"
                />
              </div>

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
                  placeholder="alex@organization.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="pt-2">
                <Button
                  formAction={requestInvitation}
                  className="w-full h-14 text-base"
                >
                  Dispatch My Access Link
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate uppercase tracking-wider">
              Already have access?{" "}
              <Link
                href="/login"
                className="text-navy font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
