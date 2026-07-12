import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import type { SupportTicket } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  open: "border-amber-500 text-amber-700",
  in_progress: "border-blue-500 text-blue-700",
  resolved: "border-emerald-500 text-emerald-700",
  closed: "border-slate text-slate",
};

export function TicketingSystem({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <div className="border-2 border-slate p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LifeBuoy className="w-6 h-6 text-navy" />
          <h3 className="text-xl font-bold uppercase tracking-wide">Concierge Desk</h3>
        </div>
        <Link
          href="/dashboard/support/new"
          className="text-xs font-bold uppercase tracking-widest bg-navy text-white px-3 py-1.5 hover:bg-navy/90 transition-colors"
        >
          New Ticket
        </Link>
      </div>
      {tickets.length === 0 ? (
        <div className="py-8 text-center">
          <LifeBuoy className="w-10 h-10 text-slate mx-auto mb-3" />
          <p className="font-bold text-navy uppercase tracking-wide text-sm">No Tickets</p>
          <p className="text-slate text-xs mt-1">All clear — open a ticket if you need anything.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((tck) => (
            <div key={tck.id} className="flex justify-between items-center border-b border-slate pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-bold text-navy uppercase">{tck.subject}</p>
                <p className="text-sm text-slate">{tck.id.slice(0, 8).toUpperCase()} &bull; {new Date(tck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className={`text-xs px-2 py-1 uppercase tracking-wider font-bold border-2 ${STATUS_STYLES[tck.status] ?? 'border-slate text-slate'}`}>
                {tck.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
