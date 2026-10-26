import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/site/admin-dashboard";
import { AdminLogin } from "@/components/site/admin-login";
import { ADMIN_EMAIL } from "@/lib/admin-identity";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · CodeXViber" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper text-paper-muted">
        <p>Checking session…</p>
      </main>
    );
  }
  if (user?.primaryEmail?.toLowerCase() !== ADMIN_EMAIL) {
    return <AdminLogin signedInAs={user?.primaryEmail} />;
  }
  return <AdminDashboard />;
}
