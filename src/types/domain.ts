// Domain types matching the Supabase DB schema.
// Update these when the schema changes.

export type UserRole = "client" | "admin" | "concierge";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface InvitationRequest {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface Itinerary {
  id: string;
  client_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  status: "pending" | "confirmed" | "in_transit" | "completed" | "cancelled";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  itinerary_id: string | null;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date: string | null;
  paid_at: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  client_id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string;
  resolved_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}
