import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate px-6 py-4 flex items-center justify-between bg-white text-navy sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
        <Briefcase className="w-6 h-6 text-navy" />
        <span className="font-bold tracking-tight text-xl uppercase">Kasbarah</span>
      </Link>
      <nav className="flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
        <Link href="/#services" className="hover:text-slate transition-colors">Experiences</Link>
        <Link href="/dashboard" className="hover:text-slate transition-colors">Traveler Portal</Link>
      </nav>
    </header>
  );
}
