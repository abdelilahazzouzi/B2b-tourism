import { Plane } from "lucide-react";
import type { Itinerary } from "@/types/domain";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  in_transit: "bg-blue-100 text-blue-800",
  completed: "bg-slate/10 text-slate",
  cancelled: "bg-red-100 text-red-800",
};

export function ItinerariesList({ itineraries }: { itineraries: Itinerary[] }) {
  return (
    <div className="border-2 border-slate p-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="w-6 h-6 text-navy" />
        <h3 className="text-xl font-bold uppercase tracking-wide">Active Itineraries</h3>
      </div>
      {itineraries.length === 0 ? (
        <div className="py-8 text-center">
          <Plane className="w-10 h-10 text-slate mx-auto mb-3" />
          <p className="font-bold text-navy uppercase tracking-wide text-sm">No Itineraries Yet</p>
          <p className="text-slate text-xs mt-1">Your concierge team will add them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itn) => (
            <div key={itn.id} className="flex justify-between items-center border-b border-slate pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-bold text-navy uppercase">{itn.destination}</p>
                <p className="text-sm text-slate">{itn.title} &bull; {itn.start_date ? new Date(itn.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}</p>
              </div>
              <div className={`text-xs px-2 py-1 uppercase tracking-wider font-bold ${STATUS_STYLES[itn.status] ?? 'bg-slate/10 text-slate'}`}>
                {itn.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
