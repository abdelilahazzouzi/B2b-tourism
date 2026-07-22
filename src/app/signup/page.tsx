import { signup } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserPlus, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Account | Kasbarah",
  description: "Create an account to access the Kasbarah Traveler Portal.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

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

        <div className="bg-white border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)]">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-navy" />
            <h1 className="text-2xl font-black uppercase tracking-tighter text-navy">
              Create Account
            </h1>
          </div>

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
                placeholder="alex@domain.com"
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
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2">
              <Button formAction={signup} className="w-full h-12 text-base">
                Create Account & Sign In
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate uppercase tracking-wider border-t border-slate/20 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-navy font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
