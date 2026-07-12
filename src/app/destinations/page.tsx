import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Destinations | Kasbarah",
  description: "Explore Kasbarah's curated Moroccan destinations — Marrakech, Agafay Desert, Atlas Mountains, and beyond.",
};

const destinations = [
  {
    name: "Marrakech",
    description:
      "The Red City — a sensory labyrinth of souks, palaces, and rooftop terraces. Our concierge provides private medina access beyond the tourist circuit.",
    tag: "City Immersion",
  },
  {
    name: "Agafay Desert",
    description:
      "Thirty minutes from Marrakech, a lunar stone desert with private luxury camps under a sky free of light pollution.",
    tag: "Desert Escape",
  },
  {
    name: "Atlas Mountains",
    description:
      "The High Atlas ridge offers Berber village stays, private trekking routes, and seasonal snow with unmatched panoramic views.",
    tag: "Mountain Expedition",
  },
  {
    name: "Fez",
    description:
      "The world's oldest living medieval city. Our guided access moves through the ancient fez el-bali at hours when the city belongs only to its inhabitants.",
    tag: "Cultural Heritage",
  },
  {
    name: "Essaouira",
    description:
      "A wind-swept Atlantic port town of blue-and-white ramparts, fresh seafood, and Gnawa music echoing through stone corridors.",
    tag: "Coastal Retreat",
  },
  {
    name: "Sahara, Merzouga",
    description:
      "The Erg Chebbi dunes at sunrise. Private camel caravans, luxury desert bivouacs, and silence so complete you hear your own heartbeat.",
    tag: "Saharan Expedition",
  },
];

export default function DestinationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="mb-16 border-b-4 border-navy pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-slate">Where We Operate</span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-navy mt-4">
          Destinations
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            className="border-2 border-slate p-8 group hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)] bg-white"
          >
            <div className="inline-flex items-center gap-2 border border-navy px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-navy mb-4">
              {dest.tag}
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-navy mb-4">
              {dest.name}
            </h2>
            <p className="text-slate font-medium leading-relaxed text-sm">
              {dest.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link
          href="/request-access"
          className="inline-flex items-center gap-2 bg-navy text-white font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-navy/90 transition-colors"
        >
          Apply for Access to Book
        </Link>
      </div>
    </div>
  );
}
