"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full border-4 border-red-500 bg-white shadow-[16px_16px_0px_0px_rgba(239,68,68,1)] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-red-500 p-3 text-white">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-navy">
            System Failure
          </h1>
        </div>
        
        <p className="text-slate font-medium mb-8">
          A critical error occurred while attempting to load this page. We've logged the incident.
        </p>

        <div className="bg-red-50 text-red-900 p-4 border border-red-200 font-mono text-sm mb-8 overflow-auto max-h-32">
          {error.message || "Unknown error occurred"}
        </div>

        <div className="flex gap-4">
          <Button onClick={() => reset()} size="lg" className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-700">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg" className="flex-1">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
