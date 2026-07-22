import { updatePassword } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Set New Password | Kasbarah",
  description: "Set a new password for your account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-24">
      <div className="w-full max-w-md">
        {params?.error && (
          <div className="mb-6 p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-navy">{params.error}</p>
          </div>
        )}

        <div className="bg-white border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)]">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-navy" />
            <h1 className="text-2xl font-black uppercase tracking-tighter text-navy">
              Set New Password
            </h1>
          </div>
          <p className="text-xs text-slate font-medium mb-6 leading-relaxed">
            Please enter your new password below to update your account.
          </p>

          <form className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-widest text-slate"
                htmlFor="password"
              >
                New Password
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
              <Button formAction={updatePassword} className="w-full h-12 text-base">
                Update Password & Enter Portal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
