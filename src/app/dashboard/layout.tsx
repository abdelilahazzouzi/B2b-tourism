import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { LayoutDashboard, Plane, FileText, LifeBuoy, User, Shield } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    
    if (!profile || !profile.full_name || profile.full_name.trim() === "") {
      redirect("/onboarding");
    }

    isAdmin = profile?.role === "admin";
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Itineraries", href: "/dashboard/itineraries", icon: Plane },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: "Admin Panel", href: "/admin", icon: Shield });
  }

  return (
    <div className="flex-1 bg-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r-2 border-slate bg-navy text-white p-6 shrink-0 flex flex-col">
        <h2 className="text-xl font-black uppercase tracking-tight mb-8">
          Client Portal
        </h2>
        <nav className="space-y-1 font-medium tracking-wide uppercase text-sm flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-slate hover:text-white hover:bg-white/10 transition-colors rounded-sm"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate/30 pt-6 mt-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-auto">{children}</main>
    </div>
  );
}
