import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | Kasbarah",
  description: "Kasbarah privacy policy and terms of service.",
};

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <h1 className="text-4xl font-black uppercase tracking-tighter text-navy mb-16">
        Legal
      </h1>

      <section className="mb-16">
        <h2 className="text-2xl font-black uppercase tracking-tight text-navy border-b-2 border-navy pb-4 mb-8">
          Privacy Policy
        </h2>
        <div className="space-y-6 text-slate font-medium leading-relaxed">
          <p>
            Kasbarah collects only the information necessary to provide our
            premium travel concierge services. This includes your name, email
            address, and travel preferences provided during onboarding.
          </p>
          <p>
            We do not sell, rent, or share your personal information with
            third parties except as required to fulfil your bookings (e.g.,
            accommodation partners, local guides).
          </p>
          <p>
            All data is stored securely via Supabase (PostgreSQL) with
            end-to-end encryption at rest and in transit.
          </p>
          <p>
            To request deletion of your data, contact us at{" "}
            <a
              href="mailto:concierge@kasbarah.com"
              className="text-navy font-bold hover:underline"
            >
              concierge@kasbarah.com
            </a>
            .
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black uppercase tracking-tight text-navy border-b-2 border-navy pb-4 mb-8">
          Terms of Service
        </h2>
        <div className="space-y-6 text-slate font-medium leading-relaxed">
          <p>
            By accessing the Kasbarah Traveler Portal, you agree to use our
            services only for their intended purpose — the planning and
            management of legitimate travel arrangements.
          </p>
          <p>
            Kasbarah reserves the right to revoke portal access at any time
            for violation of these terms or for conduct deemed incompatible
            with our client community standards.
          </p>
          <p>
            All bookings, itineraries, and financial agreements are subject
            to separate contracts issued by Kasbarah and acknowledged by the
            client prior to service execution.
          </p>
          <p className="text-xs uppercase tracking-widest text-slate/60">
            Last updated: June 2026. Subject to change without notice.
          </p>
        </div>
      </section>
    </div>
  );
}
