"use client";

import { logout } from "@/app/login/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center gap-2 text-slate hover:text-white transition-colors text-sm font-bold uppercase tracking-wide w-full"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </form>
  );
}
