import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminLogin } from "@/components/site/admin-login";
import { ADMIN_EMAIL } from "@/lib/admin-identity";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink text-muted">
        <p>Checking session…</p>
      </main>
    );
  }
  if (user?.primaryEmail?.toLowerCase() === ADMIN_EMAIL) {
    return <Navigate to="/admin" />;
  }
  return <AdminLogin signedInAs={user?.primaryEmail} />;
}
