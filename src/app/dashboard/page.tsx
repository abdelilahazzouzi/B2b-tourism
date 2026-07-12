import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ItinerariesList } from "@/components/blocks/ItinerariesList";
import { InvoiceHistory } from "@/components/blocks/InvoiceHistory";
import { TicketingSystem } from "@/components/blocks/TicketingSystem";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Sparkline } from "@/components/ui/Sparkline";
import type { Itinerary, Invoice, SupportTicket } from "@/types/domain";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real data from Supabase in parallel
  const [itinerariesRes, invoicesRes, ticketsRes] = await Promise.all([
    supabase
      .from("itineraries")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("invoices")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("support_tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const itineraries = (itinerariesRes.data ?? []) as Itinerary[];
  const invoices = (invoicesRes.data ?? []) as Invoice[];
  const tickets = (ticketsRes.data ?? []) as SupportTicket[];

  // Compute real metrics
  const activeItineraries = itineraries.filter((i) =>
    ["pending", "confirmed", "in_transit"].includes(i.status)
  ).length;
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );
  const pendingTickets = tickets.filter((t) =>
    ["open", "in_progress"].includes(t.status)
  ).length;

  return (
    <div className="space-y-16 relative z-10">
      <div className="border-b-4 border-navy pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">
            Command Center
          </h1>
          <p className="text-slate font-bold uppercase tracking-widest mt-2">
            Executive Overview // Authorized Access
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate uppercase tracking-widest mb-1">
            System Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-bold text-navy uppercase tracking-wider">
              Optimal
            </span>
          </div>
        </div>
      </div>

      {/* Metrics — driven by real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border-2 border-slate p-6 bg-white relative group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-slate mb-4">
            Active Itineraries
          </p>
          <div className="text-5xl font-black text-navy mb-4">
            <AnimatedCounter value={activeItineraries} />
          </div>
          <Sparkline
            data={[0, 0, 0, 0, 0, 0, 0, 0, activeItineraries]}
            color="#0A1128"
          />
        </div>

        <div className="border-2 border-slate p-6 bg-navy text-white relative group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(74,85,104,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-slate mb-4">
            Total Invoiced
          </p>
          <div className="text-5xl font-black mb-4">
            <AnimatedCounter
              value={
                totalInvoiced >= 1000
                  ? Math.round(totalInvoiced / 1000)
                  : totalInvoiced
              }
              prefix="$"
              suffix={totalInvoiced >= 1000 ? "K" : ""}
            />
          </div>
          <Sparkline
            data={[0, 0, 0, 0, 0, 0, 0, 0, totalInvoiced > 0 ? totalInvoiced / 1000 : 0]}
            color="#FFFFFF"
          />
        </div>

        <div className="border-2 border-slate p-6 bg-white relative group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
          <p className="text-xs font-bold uppercase tracking-widest text-slate mb-4">
            Pending Tickets
          </p>
          <div className="text-5xl font-black text-navy mb-4">
            <AnimatedCounter value={pendingTickets} />
          </div>
          <Sparkline
            data={[0, 0, 0, 0, 0, 0, 0, 0, pendingTickets]}
            color="#0A1128"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="relative">
          <div className="absolute -inset-4 bg-slate/5 -z-10" />
          <ItinerariesList itineraries={itineraries} />
        </div>
        <div className="space-y-12">
          <InvoiceHistory invoices={invoices} />
          <TicketingSystem tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
