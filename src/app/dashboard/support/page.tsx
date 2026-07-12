import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";
import type { SupportTicket } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  open: "border-amber-500 text-amber-700",
  in_progress: "border-blue-500 text-blue-700",
  resolved: "border-emerald-500 text-emerald-700",
  closed: "border-slate text-slate",
};

export const metadata = {
  title: "Support | Kasbarah",
};

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const tickets = (data ?? []) as SupportTicket[];

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-navy pb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Support</h1>
          <p className="text-slate font-bold uppercase tracking-widest mt-2 text-sm">Concierge Desk</p>
        </div>
        <Link
          href="/dashboard/support/new"
          className="bg-navy text-white font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-navy/90 transition-colors shrink-0"
        >
          New Ticket
        </Link>
      </div>

      {params?.success === 'true' && (
        <div className="p-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold text-sm uppercase tracking-wide">
          ✓ Ticket submitted successfully. Our team will respond within 24 hours.
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="border-2 border-slate p-12 flex flex-col items-center justify-center text-center space-y-4">
          <LifeBuoy className="w-12 h-12 text-slate" />
          <p className="font-bold text-navy uppercase tracking-wide">No Open Tickets</p>
          <p className="text-slate text-sm max-w-xs">
            Submit a support request and our concierge team will respond within 24 hours.
          </p>
          <Link
            href="/dashboard/support/new"
            className="mt-4 border-2 border-navy text-navy font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-navy hover:text-white transition-colors"
          >
            Open a Ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((tck) => (
            <div key={tck.id} className="border-2 border-slate p-6 flex justify-between items-center hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0px_0px_rgba(10,17,40,1)]">
              <div>
                <p className="font-black text-navy uppercase">{tck.subject}</p>
                <p className="text-xs text-slate mt-1">
                  {tck.id.slice(0, 8).toUpperCase()} &bull; {new Date(tck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
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
