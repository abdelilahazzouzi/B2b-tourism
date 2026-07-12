import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Button } from "@/components/ui/Button";
import { approveInvitation, rejectInvitation } from "./actions";
import { ShieldCheck, Clock, CheckCircle2, XCircle, Link2 } from "lucide-react";
import type { InvitationRequest } from "@/types/domain";
import { CopyButton } from "@/components/ui/CopyButton";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Panel | Kasbarah",
};

function StatusBadge({ status }: { status: InvitationRequest["status"] }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800 border border-amber-300",
    approved: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    rejected: "bg-red-100 text-red-800 border border-red-300",
  };

  const icons = {
    pending: <Clock className="w-3 h-3" />,
    approved: <CheckCircle2 className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 uppercase tracking-wider font-bold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ inviteLink?: string; inviteName?: string; inviteEmail?: string; error?: string }>;
}) {
  const params = await searchParams;
  const inviteLink = params.inviteLink ? decodeURIComponent(params.inviteLink) : null;
  const inviteName = params.inviteName ? decodeURIComponent(params.inviteName) : null;
  const inviteEmail = params.inviteEmail ? decodeURIComponent(params.inviteEmail) : null;
  const pageError = params.error ? decodeURIComponent(params.error) : null;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify admin role using service key to bypass RLS
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all invitation requests ordered by requested_at descending
  const { data: requests } = await adminClient
    .from("invitation_requests")
    .select("*")
    .order("requested_at", { ascending: false });

  const allRequests = (requests ?? []) as InvitationRequest[];
  const pendingCount = allRequests.filter((r) => r.status === "pending").length;

  // Sort: pending first, then approved, then rejected
  const statusOrder = { pending: 0, approved: 1, rejected: 2 };
  const sortedRequests = [...allRequests].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return (
    <div className="space-y-8 relative z-10">

      {/* Error Banner */}
      {pageError && (
        <div className="border-2 border-red-400 bg-red-50 p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 uppercase tracking-wider text-sm">Error</p>
            <p className="text-red-700 text-sm mt-1">{pageError}</p>
          </div>
        </div>
      )}

      {/* Invite Link Banner */}
      {inviteLink && (
        <div className="border-2 border-emerald-400 bg-emerald-50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-black text-emerald-900 uppercase tracking-wider text-sm">
                ✓ {inviteName} ({inviteEmail}) Approved
              </p>
              <p className="text-emerald-700 text-xs mt-1 font-medium">
                Copy the link below and send it directly to the user. It expires after one use.
              </p>
            </div>
          </div>
          <div className="flex items-stretch gap-3">
            <code
              id="invite-link-box"
              className="flex-1 bg-white border-2 border-emerald-300 px-4 py-3 text-xs text-emerald-900 font-mono break-all"
            >
              {inviteLink}
            </code>
            <CopyButton text={inviteLink} />
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b-4 border-navy pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Admin Panel
            </h1>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-800 border-2 border-amber-400 text-sm font-black px-3 py-1 uppercase tracking-wider">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-slate font-bold uppercase tracking-widest mt-2">
            Invitation Queue & Access Control
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate uppercase tracking-widest mb-1">
            Access Level
          </p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-navy" />
            <span className="font-bold text-navy uppercase tracking-wider">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      {sortedRequests.length === 0 ? (
        <div className="border-2 border-slate p-16 flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-16 h-16 text-slate/40 mb-6" />
          <p className="text-xl font-black uppercase tracking-tighter text-navy mb-2">
            No Requests
          </p>
          <p className="text-slate font-bold uppercase tracking-widest text-xs">
            The invitation queue is empty
          </p>
        </div>
      ) : (
        <div className="border-2 border-slate bg-white shadow-[8px_8px_0px_0px_rgba(10,17,40,1)]">
          {/* Table Header */}
          <div className="bg-navy text-white px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-widest">
              Invitation Requests — {allRequests.length} Total
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate">
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-slate px-6 py-4">
                    Requested
                  </th>
                  <th className="text-right text-xs font-bold uppercase tracking-widest text-slate px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-slate/20 last:border-b-0 hover:bg-slate/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-navy">
                        {request.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate text-sm font-medium">
                        {request.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate text-sm font-medium">
                        {formatDate(request.requested_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {request.status === "pending" ? (
                        <div className="flex items-center justify-end gap-3">
                          <form action={approveInvitation}>
                            <input
                              type="hidden"
                              name="requestId"
                              value={request.id}
                            />
                            <input
                              type="hidden"
                              name="email"
                              value={request.email}
                            />
                            <input
                              type="hidden"
                              name="name"
                              value={request.name}
                            />
                            <Button type="submit" size="sm">
                              Approve
                            </Button>
                          </form>
                          <form action={rejectInvitation}>
                            <input
                              type="hidden"
                              name="requestId"
                              value={request.id}
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400"
                            >
                              Reject
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-slate/60 font-bold uppercase tracking-widest">
                          {request.reviewed_at
                            ? formatDate(request.reviewed_at)
                            : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
