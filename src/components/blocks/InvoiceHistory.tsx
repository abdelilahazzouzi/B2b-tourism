import { FileText } from "lucide-react";
import Link from "next/link";
import type { Invoice } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  draft: "text-slate",
  sent: "text-blue-600",
  paid: "text-emerald-600",
  overdue: "text-red-600",
  cancelled: "text-slate line-through",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function InvoiceHistory({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="border-2 border-slate p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-navy" />
          <h3 className="text-xl font-bold uppercase tracking-wide">Invoices</h3>
        </div>
        <Link
          href="/dashboard/invoices"
          className="text-xs font-bold uppercase tracking-widest text-navy border-2 border-navy px-3 py-1.5 hover:bg-navy hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
      {invoices.length === 0 ? (
        <div className="py-8 text-center">
          <FileText className="w-10 h-10 text-slate mx-auto mb-3" />
          <p className="font-bold text-navy uppercase tracking-wide text-sm">No Invoices Yet</p>
          <p className="text-slate text-xs mt-1">Invoices will appear once issued.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex justify-between items-center border-b border-slate pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-bold text-navy uppercase">{inv.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-slate">Due: {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-navy">{formatCurrency(inv.amount, inv.currency)}</p>
                <p className={`text-xs uppercase tracking-wider font-bold ${STATUS_STYLES[inv.status] ?? 'text-slate'}`}>
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
