"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
      <div className="max-w-lg w-full border-2 border-red-500 bg-red-50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-black uppercase text-red-900 tracking-tight">
            Dashboard Module Failed
          </h2>
        </div>
        
        <p className="text-red-800 font-medium mb-6">
          We encountered an issue loading this section of the client portal. 
        </p>

        <div className="bg-white border border-red-200 text-red-700 p-4 font-mono text-sm mb-6 overflow-auto">
          {error.message || "An unexpected error occurred in the dashboard."}
        </div>

        <Button 
          onClick={() => reset()} 
          className="bg-red-500 hover:bg-red-600 text-white border-red-700 uppercase tracking-widest text-sm font-bold"
        >
          Attempt Recovery
        </Button>
      </div>
    </div>
  );
}
