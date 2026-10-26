import { S as require_jsx_runtime, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useCurrentUserState, t as AdminLogin } from "./admin-login-DXKXkc86.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-oxNujQta.js
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-ink text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking session…" })
	});
	if (user?.primaryEmail?.toLowerCase() === "admin1234@codexviber.com") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogin, { signedInAs: user?.primaryEmail });
}
//#endregion
export { LoginPage as component };
