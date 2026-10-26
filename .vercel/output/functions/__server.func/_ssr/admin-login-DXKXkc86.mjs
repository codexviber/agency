import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-BhcLuWvF.mjs";
import { t as ADMIN_EMAIL } from "./admin-identity-DDX3auus.mjs";
import { o as guardAdminLogin } from "./cms.functions-CFr8DSCt.mjs";
import { t as LogoMark } from "./logo-mark-ovp-6csp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-login-DXKXkc86.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var BEARER_KEY = "grok-auth.bearer-token";
function messageFrom(payload, fallback) {
	if (payload && typeof payload === "object") {
		const record = payload;
		if (typeof record.message === "string" && record.message) return record.message;
		if (typeof record.error?.message === "string" && record.error.message) return record.error.message;
	}
	return fallback;
}
function AdminLogin({ signedInAs }) {
	const [email, setEmail] = (0, import_react.useState)(ADMIN_EMAIL);
	const [password, setPassword] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(event) {
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
				body: JSON.stringify({
					email: normalized,
					password,
					rememberMe: true
				})
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(messageFrom(payload, "Sign-in failed. Check the email and password."));
			const token = response.headers.get("set-auth-token");
			if (token) sessionStorage.setItem(BEARER_KEY, token);
			await authClient.getSession();
			window.location.assign("/admin");
		} catch (caught) {
			setPending(false);
			setError(caught instanceof Error ? caught.message : "Sign-in failed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-ink px-5 py-12 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-8 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-12 w-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-2xl tracking-tight",
						children: "CodeXViber"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Administrator"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Sign in"
				}),
				signedInAs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"This browser is currently signed in as ",
						signedInAs,
						". Use the administrator account below to manage the site."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 grid gap-4",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-medium",
							children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								autoComplete: "username",
								required: true,
								value: email,
								onChange: (event) => setEmail(event.target.value),
								className: "min-h-12 rounded-xl border border-line bg-ink-2 px-4"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm font-medium",
							children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								autoComplete: "current-password",
								required: true,
								value: password,
								onChange: (event) => setPassword(event.target.value),
								className: "min-h-12 rounded-xl border border-line bg-ink-2 px-4"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-sm text-red",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending,
							className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-fg font-semibold text-ink disabled:opacity-60",
							children: pending ? "Signing in…" : "Sign in"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { useCurrentUser as n, useCurrentUserState as r, AdminLogin as t };
