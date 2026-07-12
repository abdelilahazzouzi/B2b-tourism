import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Kasbarah",
  description: "Kasbarah is a premium luxury tourism concierge platform specialising in immersive Moroccan expeditions.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-slate">Our Story</span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-navy mt-4">
          About Kasbarah
        </h1>
      </div>
      <div className="space-y-8 text-slate font-medium text-lg leading-relaxed max-w-2xl">
        <p>
          Kasbarah was founded on a single conviction: that true luxury is not
          found in thread counts or star ratings, but in the irreplaceable
          feeling of standing somewhere few others have stood.
        </p>
        <p>
          We design and orchestrate premium expeditions across Morocco — from
          the silence of the Agafay Desert to the labyrinthine medinas of Fez
          — for discerning clients who demand absolute authenticity.
        </p>
        <p>
          Every experience is crafted by our team of expert concierges with
          deep cultural relationships built over decades in the region.
        </p>
      </div>
    </div>
  );
}
