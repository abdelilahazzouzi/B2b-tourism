import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Plane } from "lucide-react";
import type { Itinerary } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  in_transit: "bg-blue-100 text-blue-800",
  completed: "bg-slate/10 text-slate",
  cancelled: "bg-red-100 text-red-800",
};

export const metadata = {
  title: "Itineraries | Kasbarah",
};

export default async function ItinerariesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("itineraries")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const itineraries = (data ?? []) as Itinerary[];

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-navy pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter">My Itineraries</h1>
        <p className="text-slate font-bold uppercase tracking-widest mt-2 text-sm">Active &amp; Upcoming Expeditions</p>
      </div>
      {itineraries.length === 0 ? (
        <div className="border-2 border-slate p-12 flex flex-col items-center justify-center text-center space-y-4">
          <Plane className="w-12 h-12 text-slate" />
          <p className="font-bold text-navy uppercase tracking-wide">No Itineraries Yet</p>
          <p className="text-slate text-sm max-w-xs">
            Your expedition itineraries will appear here once your concierge team has prepared them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itn) => (
            <div key={itn.id} className="border-2 border-slate p-6 flex justify-between items-center hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0px_0px_rgba(10,17,40,1)]">
              <div>
                <p className="font-black text-navy uppercase text-lg">{itn.destination}</p>
                <p className="text-sm text-slate font-bold mt-1">{itn.title}</p>
                <p className="text-xs text-slate mt-1">
                  {itn.start_date ? new Date(itn.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                  {itn.end_date ? ` — ${new Date(itn.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                </p>
              </div>
              <div className={`text-xs px-3 py-1.5 uppercase tracking-wider font-bold ${STATUS_STYLES[itn.status] ?? 'bg-slate/10 text-slate'}`}>
                {itn.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
