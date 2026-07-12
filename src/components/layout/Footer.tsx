export function Footer() {
  return (
    <footer className="border-t border-slate bg-navy text-white px-6 py-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-start gap-12">
        <div className="flex-1">
          <span className="font-bold tracking-tight text-xl uppercase block mb-4">Kasbarah</span>
          <p className="text-slate text-sm max-w-xs leading-relaxed">
            Curated immersive expeditions and premium cultural experiences across Morocco.
          </p>
        </div>
        
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-slate text-xs mb-2">Destinations</span>
            <a href="/destinations" className="hover:text-slate transition-colors">Marrakech</a>
            <a href="/destinations" className="hover:text-slate transition-colors">Agafay Desert</a>
            <a href="/destinations" className="hover:text-slate transition-colors">Atlas Mountains</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-slate text-xs mb-2">Company</span>
            <a href="/about" className="hover:text-slate transition-colors">About Us</a>
            <a href="/contact" className="hover:text-slate transition-colors">Concierge Team</a>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="font-bold uppercase tracking-wider text-slate text-xs mb-2">Legal</span>
            <a href="/legal" className="hover:text-slate transition-colors">Privacy</a>
            <a href="/legal" className="hover:text-slate transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate/30 text-xs text-slate uppercase tracking-wider flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Kasbarah. All rights reserved.</p>
        <p>Premium Tourism & Corporate Domiciliation.</p>
      </div>
    </footer>
  );
}
