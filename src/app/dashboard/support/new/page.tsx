import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { z } from "zod";

export const metadata = {
  title: "New Support Ticket | Kasbarah",
};

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

async function createTicket(formData: FormData) {
  "use server";
  const cookieStore = await (await import("next/headers")).cookies();
  const { createClient } = await import("@/utils/supabase/server");
  const { z } = await import("zod");
  
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const ticketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  });

  const parsed = ticketSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/dashboard/support/new?error=${encodeURIComponent(msg)}`);
  }

  // 1. Create the support ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({
      client_id: user.id,
      subject: parsed.data.subject,
    })
    .select("id")
    .single();

  if (ticketError || !ticket) {
    redirect(`/dashboard/support/new?error=${encodeURIComponent("Failed to create ticket. Please try again.")}`);
  }

  // 2. Add the initial message to the ticket
  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_id: user.id,
    body: parsed.data.message,
  });

  redirect("/dashboard/support?success=true");
}

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b-4 border-navy pb-6">
        <Link href="/dashboard/support" className="text-xs font-bold uppercase tracking-widest text-slate hover:text-navy transition-colors">
          ← Back to Support
        </Link>
        <h1 className="text-4xl font-black uppercase tracking-tighter mt-4">New Ticket</h1>
        <p className="text-slate font-bold uppercase tracking-widest mt-2 text-sm">Contact the Concierge Desk</p>
      </div>

      {params?.error && (
        <div className="p-4 border-2 border-navy bg-navy/5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-navy">{params.error}</p>
        </div>
      )}

      <form className="space-y-6 border-2 border-slate p-8 shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate" htmlFor="subject">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="e.g. Update my Marrakech itinerary"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            placeholder="Describe your request in detail..."
            className="w-full border-2 border-slate px-4 py-3 text-navy font-medium text-sm focus:outline-none focus:border-navy resize-none"
          />
        </div>
        <div className="pt-2">
          <Button formAction={createTicket} className="w-full h-12 text-base">
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
}
