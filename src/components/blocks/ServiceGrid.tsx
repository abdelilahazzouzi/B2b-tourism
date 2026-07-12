import { Building2, Plane, ShieldCheck } from "lucide-react";

export function ServiceGrid() {
  const services = [
    {
      title: "Exclusive Expeditions",
      description: "Private, high-comfort guided travel for discerning adventurers across diverse terrains.",
      icon: Plane,
      id: "01",
    },
    {
      title: "Luxury Domiciliation",
      description: "Curated selection and reservation of premium riads, desert camps, and heritage stays.",
      icon: Building2,
      id: "02",
    },
    {
      title: "Seamless Concierge",
      description: "Bespoke itinerary design, instant booking routing, and 24/7 dedicated support.",
      icon: ShieldCheck,
      id: "03",
    },
  ];

  return (
    <section id="services" className="bg-navy text-white px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate pb-8 gap-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Signature Experiences
          </h2>
          <p className="text-slate font-medium max-w-sm text-right uppercase tracking-wider text-sm">
            Deploying unparalleled access to premium cultural and exploratory tourism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id} 
                className="group border-2 border-slate bg-navy hover:bg-white hover:text-navy transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-8 border-b-2 border-slate group-hover:border-navy transition-colors flex justify-between items-center">
                  <Icon className="w-10 h-10" />
                  <span className="text-2xl font-black">{service.id}</span>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-slate group-hover:text-navy/80 font-medium leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
