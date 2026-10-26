import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { ADMIN_EMAIL } from "@/lib/admin-identity";
import { guardAdminLogin } from "@/lib/cms.functions";
import { LogoMark } from "./logo-mark";

const BEARER_KEY = "grok-auth.bearer-token";

function messageFrom(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as { message?: unknown; error?: { message?: unknown } };
    if (typeof record.message === "string" && record.message) return record.message;
    if (typeof record.error?.message === "string" && record.error.message) return record.error.message;
  }
  return fallback;
}

export function AdminLogin({ signedInAs }: { signedInAs?: string | null }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (normalized === "admin1234@.com") {
      setError("That email is missing a domain. Use admin1234@codexviber.com.");
      return;
    }
    setPending(true);
    try {
      await guardAdminLogin();
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalized, password, rememberMe: true }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(messageFrom(payload, "Sign-in failed. Check the email and password."));
      }
      const token = response.headers.get("set-auth-token");
      if (token) sessionStorage.setItem(BEARER_KEY, token);
      await authClient.getSession();
      window.location.assign("/admin");
    } catch (caught) {
      setPending(false);
      setError(caught instanceof Error ? caught.message : "Sign-in failed.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 py-12 text-fg">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <LogoMark className="h-12 w-12" />
          <span>
            <span className="block font-display text-2xl tracking-tight">CodeXViber</span>
            <span className="text-sm text-muted">Administrator</span>
          </span>
        </Link>
        <h1 className="font-display text-4xl tracking-tight">Sign in</h1>
        {signedInAs ? (
          <p className="mt-3 text-sm text-muted">
            This browser is currently signed in as {signedInAs}. Use the administrator account below to manage the site.
          </p>
        ) : null}
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 rounded-xl border border-line bg-ink-2 px-4"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 rounded-xl border border-line bg-ink-2 px-4"
            />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-red">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-fg font-semibold text-ink disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
