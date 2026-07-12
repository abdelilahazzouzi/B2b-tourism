import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { FileText } from "lucide-react";
import type { Invoice } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate/10 text-slate",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-slate/10 text-slate line-through",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export const metadata = {
  title: "Invoices | Kasbarah",
};

export default async function InvoicesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const invoices = (data ?? []) as Invoice[];

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-navy pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Invoices</h1>
        <p className="text-slate font-bold uppercase tracking-widest mt-2 text-sm">Billing &amp; Payment History</p>
      </div>
      {invoices.length === 0 ? (
        <div className="border-2 border-slate p-12 flex flex-col items-center justify-center text-center space-y-4">
          <FileText className="w-12 h-12 text-slate" />
          <p className="font-bold text-navy uppercase tracking-wide">No Invoices Yet</p>
          <p className="text-slate text-sm max-w-xs">
            Your invoices will appear here once issued by the Kasbarah finance team.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="border-2 border-slate p-6 flex justify-between items-center hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0px_0px_rgba(10,17,40,1)]">
              <div>
                <p className="font-black text-navy uppercase">{inv.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-slate mt-1">
                  Due: {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-navy text-lg">{formatCurrency(inv.amount, inv.currency)}</p>
                <p className={`text-xs uppercase tracking-wider font-bold mt-1 px-2 py-0.5 inline-block ${STATUS_STYLES[inv.status] ?? 'bg-slate/10 text-slate'}`}>
                  {inv.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
