import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Kasbarah",
  description: "Reach the Kasbarah concierge team for bespoke travel enquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-slate">Get In Touch</span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-navy mt-4">
          Concierge Team
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-slate font-medium text-lg leading-relaxed">
            Our concierge team is available to discuss your bespoke travel
            requirements. For immediate enquiries, reach us directly.
          </p>
          <div className="border-t-2 border-navy pt-6 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate">Email</p>
            <a
              href="mailto:concierge@kasbarah.com"
              className="text-navy font-bold text-lg hover:underline"
            >
              concierge@kasbarah.com
            </a>
          </div>
          <div className="border-t-2 border-navy pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate mb-4">Request Access</p>
            <Link
              href="/request-access"
              className="inline-flex items-center gap-2 bg-navy text-white font-bold uppercase tracking-widest text-sm px-6 py-3 hover:bg-navy/90 transition-colors"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
