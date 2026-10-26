import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signOut, t as authClient } from "./client-BhcLuWvF.mjs";
import { i as hasGateSessionMarker } from "./server-DEyjGmVt.mjs";
import { c as updateAgency, d as updateProject, f as updateService, i as getAdminBundle, l as updateInquiry, n as deleteInquiry, r as deleteProject, t as createProject, u as updatePerson } from "./cms.functions-CFr8DSCt.mjs";
import { t as LogoMark } from "./logo-mark-ovp-6csp.mjs";
import { n as useCurrentUser, r as useCurrentUserState, t as AdminLogin } from "./admin-login-DXKXkc86.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CQT5w13_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var TABS = [
	{
		id: "overview",
		label: "Overview"
	},
	{
		id: "agency",
		label: "Agency"
	},
	{
		id: "people",
		label: "People"
	},
	{
		id: "services",
		label: "Services"
	},
	{
		id: "projects",
		label: "Projects"
	},
	{
		id: "messages",
		label: "Messages"
	},
	{
		id: "password",
		label: "Password"
	}
];
var fieldClass = "min-h-12 w-full rounded-xl border border-paper-line bg-white px-3 text-paper-fg";
function errorText(error) {
	if (error instanceof Error && error.message) return error.message;
	return "Something went wrong. Try again.";
}
async function readCover(file) {
	if (![
		"image/png",
		"image/jpeg",
		"image/webp"
	].includes(file.type)) throw new Error("Use a PNG, JPG, or WebP image.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Could not read that image.");
	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const url = canvas.toDataURL("image/jpeg", .82);
	if (url.length > 11e5) throw new Error("That image is still too large. Try a smaller photo.");
	return url;
}
async function createAutoCover(title, description) {
	const canvas = document.createElement("canvas");
	canvas.width = 1400;
	canvas.height = 788;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Could not create the automatic preview image.");
	const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
	gradient.addColorStop(0, "#1f1630");
	gradient.addColorStop(1, "#0d1724");
	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = "#3fd7ff";
	context.lineWidth = 4;
	context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);
	context.fillStyle = "#3fd7ff";
	context.font = "600 28px sans-serif";
	context.fillText("CODEXVIBER / PROJECT", 92, 116);
	context.fillStyle = "#f7f3ea";
	context.font = "700 78px sans-serif";
	const words = title.trim().slice(0, 44).split(" ");
	let line = "";
	let y = 300;
	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (context.measureText(candidate).width > 1080 && line) {
			context.fillText(line, 92, y);
			y += 92;
			line = word;
		} else line = candidate;
	}
	if (line) context.fillText(line, 92, y);
	context.fillStyle = "#b6c0cf";
	context.font = "400 28px sans-serif";
	context.fillText(description.trim().slice(0, 72), 92, 650);
	return canvas.toDataURL("image/jpeg", .82);
}
function AdminDashboard() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [bundle, setBundle] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [reloadKey, setReloadKey] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		getAdminBundle().then((next) => {
			if (!cancelled) {
				setBundle(next);
				setError("");
			}
		}).catch((caught) => {
			if (!cancelled) setError(errorText(caught));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [reloadKey]);
	function saved(text) {
		setNotice(text);
		setError("");
		setReloadKey((value) => value + 1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-paper-fg scheme-light",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "bg-ink text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-10 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-xl leading-none",
						children: "CodeXViber"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Admin"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-paper-muted",
					children: "Changes here are saved for the public site. Founder photographs stay locked to the real portraits."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex gap-2 overflow-x-auto pb-1",
					role: "tablist",
					"aria-label": "Admin sections",
					children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === item.id,
						onClick: () => {
							setTab(item.id);
							setNotice("");
						},
						className: `min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${tab === item.id ? "bg-ink text-fg" : "border border-paper-line bg-white"}`,
						children: item.label
					}, item.id))
				}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "mt-4 rounded-xl border border-paper-line bg-white px-4 py-3 text-sm",
					children: notice
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-4 rounded-xl border border-red bg-white px-4 py-3 text-sm text-red",
					children: error
				}) : null,
				loading && !bundle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-paper-muted",
					children: "Loading the studio data…"
				}) : null,
				bundle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						tab === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, { bundle }) : null,
						tab === "agency" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgencyForm, {
							bundle,
							onSaved: () => saved("Agency details saved."),
							onError: setError
						}) : null,
						tab === "people" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeopleForm, {
							people: bundle.people,
							onSaved: () => saved("Profile saved."),
							onError: setError
						}) : null,
						tab === "services" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesForm, {
							services: bundle.allServices,
							onSaved: () => saved("Service saved."),
							onError: setError
						}) : null,
						tab === "projects" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsForm, {
							projects: bundle.allProjects,
							onSaved: (text) => saved(text),
							onError: setError
						}) : null,
						tab === "messages" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Messages, {
							inquiries: bundle.inquiries,
							onSaved: (text) => saved(text),
							onError: setError
						}) : null,
						tab === "password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordForm, {
							onError: setError,
							onSaved: setNotice
						}) : null
					]
				}) : null
			]
		})]
	});
}
function Overview({ bundle }) {
	const cards = [
		["Published projects", bundle.counts.publishedProjects],
		["Draft projects", bundle.counts.draftProjects],
		["New messages", bundle.counts.newInquiries],
		["Visible services", bundle.counts.services]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: cards.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-paper-line bg-white p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-paper-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-4xl tabular-nums",
					children: value
				})]
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-sm leading-relaxed text-paper-muted",
			children: "The public site shows published projects only. Open the site in another tab to preview before you share it."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-flex min-h-11 items-center font-semibold",
			children: "View public website"
		})
	] });
}
function SocialEditor({ value, onChange }) {
	const rows = value.length > 0 ? value : [{
		label: "",
		url: ""
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "Social links"
			}),
			rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Social label",
					placeholder: "Label",
					value: row.label,
					onChange: (event) => {
						const next = [...rows];
						next[index] = {
							...row,
							label: event.target.value
						};
						onChange(next);
					},
					className: fieldClass
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Social URL",
					placeholder: "https://",
					value: row.url,
					onChange: (event) => {
						const next = [...rows];
						next[index] = {
							...row,
							url: event.target.value
						};
						onChange(next);
					},
					className: fieldClass
				})]
			}, index)),
			rows.length < 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "justify-self-start text-sm font-semibold",
				onClick: () => onChange([...rows, {
					label: "",
					url: ""
				}]),
				children: "Add a link"
			}) : null
		]
	});
}
function AgencyForm({ bundle, onSaved, onError }) {
	const [tagline, setTagline] = (0, import_react.useState)(bundle.agency.tagline);
	const [heroIntro, setHeroIntro] = (0, import_react.useState)(bundle.agency.heroIntro);
	const [aboutTitle, setAboutTitle] = (0, import_react.useState)(bundle.agency.aboutTitle);
	const [aboutBody, setAboutBody] = (0, import_react.useState)(bundle.agency.aboutBody);
	const [approach, setApproach] = (0, import_react.useState)(bundle.agency.approach);
	const [email, setEmail] = (0, import_react.useState)(bundle.agency.email);
	const [phone, setPhone] = (0, import_react.useState)(bundle.agency.phone);
	const [location, setLocation] = (0, import_react.useState)(bundle.agency.location);
	const [socials, setSocials] = (0, import_react.useState)(bundle.agency.socials);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setPending(true);
		try {
			await updateAgency({ data: {
				tagline,
				heroIntro,
				aboutTitle,
				aboutBody,
				approach,
				email,
				phone,
				location,
				socials
			} });
			onSaved();
		} catch (caught) {
			onError(errorText(caught));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-3xl gap-4",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Tagline", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: tagline,
					onChange: (event) => setTagline(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Introduction", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} min-h-28 py-3`,
					value: heroIntro,
					onChange: (event) => setHeroIntro(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["About title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: aboutTitle,
					onChange: (event) => setAboutTitle(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["About text", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} min-h-36 py-3`,
					value: aboutBody,
					onChange: (event) => setAboutBody(event.target.value)
				})]
			}),
			approach.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-2xl border border-paper-line bg-white p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Step title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: step.title,
						onChange: (event) => {
							const next = [...approach];
							next[index] = {
								...step,
								title: event.target.value
							};
							setApproach(next);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Step description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} min-h-24 py-3`,
						value: step.body,
						onChange: (event) => {
							const next = [...approach];
							next[index] = {
								...step,
								body: event.target.value
							};
							setApproach(next);
						}
					})]
				})]
			}, index)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Public email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: email,
					onChange: (event) => setEmail(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Public phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: phone,
					onChange: (event) => setPhone(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Location", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: location,
					onChange: (event) => setLocation(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialEditor, {
				value: socials,
				onChange: setSocials
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60",
				children: pending ? "Saving…" : "Save agency details"
			})
		]
	});
}
function PeopleForm({ people, onSaved, onError }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-6",
		children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonEditor, {
			person,
			onSaved,
			onError
		}, person.id))
	});
}
function PersonEditor({ person, onSaved, onError }) {
	const [name, setName] = (0, import_react.useState)(person.name);
	const [role, setRole] = (0, import_react.useState)(person.role);
	const [bio, setBio] = (0, import_react.useState)(person.bio);
	const [portfolioUrl, setPortfolioUrl] = (0, import_react.useState)(person.portfolioUrl);
	const [socials, setSocials] = (0, import_react.useState)(person.socials);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setPending(true);
		try {
			await updatePerson({ data: {
				id: person.id,
				name,
				role,
				bio,
				portfolioUrl,
				socials
			} });
			onSaved();
		} catch (caught) {
			onError(errorText(caught));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4 rounded-2xl border border-paper-line bg-white p-5",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: person.photoUrl,
					alt: "",
					className: `h-20 w-20 rounded-xl object-cover ${person.accent === "red" ? "object-top" : "object-center"}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold",
					children: person.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-paper-muted",
					children: "Portrait is fixed so the right photo stays with the right person."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: name,
					onChange: (event) => setName(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Role", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: role,
					onChange: (event) => setRole(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Biography", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} min-h-28 py-3`,
					value: bio,
					onChange: (event) => setBio(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Portfolio URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: portfolioUrl,
					placeholder: "https://",
					onChange: (event) => setPortfolioUrl(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialEditor, {
				value: socials,
				onChange: setSocials
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60",
				children: pending ? "Saving…" : "Save profile"
			})
		]
	});
}
function ServicesForm({ services, onSaved, onError }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4",
		children: services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceEditor, {
			service,
			onSaved,
			onError
		}, service.id))
	});
}
function ServiceEditor({ service, onSaved, onError }) {
	const [title, setTitle] = (0, import_react.useState)(service.title);
	const [description, setDescription] = (0, import_react.useState)(service.description);
	const [detailsUrl, setDetailsUrl] = (0, import_react.useState)(service.detailsUrl);
	const [visible, setVisible] = (0, import_react.useState)(service.visible);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setPending(true);
		try {
			await updateService({ data: {
				id: service.id,
				title,
				description,
				detailsUrl,
				visible
			} });
			onSaved();
		} catch (caught) {
			onError(errorText(caught));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3 rounded-2xl border border-paper-line bg-white p-5",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (event) => setTitle(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} min-h-24 py-3`,
					value: description,
					onChange: (event) => setDescription(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Details link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: detailsUrl,
					placeholder: "Optional https://",
					onChange: (event) => setDetailsUrl(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: visible,
					onChange: (event) => setVisible(event.target.checked)
				}), "Show on the public site"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60",
				children: pending ? "Saving…" : "Save service"
			})
		]
	});
}
function blankProject() {
	return {
		title: "",
		description: "",
		category: "",
		technologies: "",
		demoUrl: "",
		githubUrl: "",
		coverData: "",
		videoUrl: "",
		published: false
	};
}
function ProjectsForm({ projects, onSaved, onError }) {
	const [draft, setDraft] = (0, import_react.useState)(blankProject);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	function edit(project) {
		setDraft({
			id: project.id,
			title: project.title,
			description: project.description,
			category: project.category,
			technologies: project.technologies,
			demoUrl: project.demoUrl,
			githubUrl: project.githubUrl,
			coverData: project.coverData,
			videoUrl: project.videoUrl,
			published: project.published
		});
		setConfirmId(null);
	}
	async function onSubmit(event) {
		event.preventDefault();
		setPending(true);
		try {
			const coverData = draft.coverData || await createAutoCover(draft.title, draft.description);
			const payload = {
				...draft,
				coverData
			};
			if (draft.id) {
				await updateProject({ data: {
					...payload,
					id: draft.id
				} });
				onSaved("Project updated.");
			} else {
				await createProject({ data: payload });
				setDraft(blankProject());
				onSaved("Project added.");
			}
		} catch (caught) {
			onError(errorText(caught));
		} finally {
			setPending(false);
		}
	}
	async function remove(id) {
		setPending(true);
		try {
			await deleteProject({ data: { id } });
			if (draft.id === id) setDraft(blankProject());
			setConfirmId(null);
			onSaved("Project deleted.");
		} catch (caught) {
			onError(errorText(caught));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid content-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "justify-self-start text-sm font-semibold",
				onClick: () => setDraft(blankProject()),
				children: "New project"
			}), projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-paper-line bg-white p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [project.coverData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: project.coverData,
						alt: "",
						className: "h-16 w-24 rounded-lg object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-24 place-items-center rounded-lg bg-paper font-display text-2xl",
						children: project.title.slice(0, 1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: project.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-paper-muted",
							children: project.published ? "Published" : "Draft"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-paper-line px-4 text-sm",
						onClick: () => edit(project),
						children: "Edit"
					}), confirmId === project.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full bg-ink px-4 text-sm text-fg",
						onClick: () => remove(project.id),
						children: "Confirm delete"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-paper-line px-4 text-sm",
						onClick: () => setConfirmId(project.id),
						children: "Delete"
					})]
				})]
			}, project.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid content-start gap-3 rounded-2xl border border-paper-line bg-white p-5",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold",
					children: draft.id ? "Edit project" : "Add project"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-paper-muted",
					children: "Add the project name, what it is about, and a link. If you do not upload an image, a preview is generated automatically."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Project name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.title,
						onChange: (event) => setDraft({
							...draft,
							title: event.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["About the project", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} min-h-28 py-3`,
						value: draft.description,
						onChange: (event) => setDraft({
							...draft,
							description: event.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.category,
						onChange: (event) => setDraft({
							...draft,
							category: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Technologies", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.technologies,
						onChange: (event) => setDraft({
							...draft,
							technologies: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Project link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.demoUrl,
						placeholder: "https://",
						onChange: (event) => setDraft({
							...draft,
							demoUrl: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Optional video preview link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.videoUrl,
						placeholder: "https://example.com/project-preview.mp4",
						onChange: (event) => setDraft({
							...draft,
							videoUrl: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Repository URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: draft.githubUrl,
						placeholder: "https://",
						onChange: (event) => setDraft({
							...draft,
							githubUrl: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm font-medium",
					children: ["Cover image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "text-sm",
						onChange: async (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							try {
								const coverData = await readCover(file);
								setDraft((current) => ({
									...current,
									coverData
								}));
							} catch (caught) {
								onError(errorText(caught));
							}
						}
					})]
				}),
				draft.coverData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: draft.coverData,
					alt: "Project cover preview",
					className: "aspect-video w-full rounded-xl object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-3 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: draft.published,
						onChange: (event) => setDraft({
							...draft,
							published: event.target.checked
						})
					}), "Published on the public site"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: pending,
					className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60",
					children: pending ? "Saving…" : draft.id ? "Save project" : "Add project"
				})
			]
		})]
	});
}
function Messages({ inquiries, onSaved, onError }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const visible = inquiries.filter((item) => filter === "all" || item.status === filter);
	async function setStatus(id, status) {
		try {
			await updateInquiry({ data: {
				id,
				status
			} });
			onSaved("Message updated.");
		} catch (caught) {
			onError(errorText(caught));
		}
	}
	async function remove(id) {
		try {
			await deleteInquiry({ data: { id } });
			onSaved("Message deleted.");
		} catch (caught) {
			onError(errorText(caught));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"all",
					"new",
					"read",
					"archived"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(item),
					className: `min-h-11 rounded-full px-4 text-sm font-semibold capitalize ${filter === item ? "bg-ink text-fg" : "border border-paper-line bg-white"}`,
					children: item
				}, item))
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-paper-muted",
				children: "No messages in this view."
			}) : null,
			visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl border border-paper-line bg-white p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: item.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-paper-muted uppercase",
							children: item.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-paper-muted",
						children: [
							item.name,
							" · ",
							item.email
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed",
						children: item.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-paper-muted",
						children: item.createdAt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-full border border-paper-line px-4 text-sm",
								onClick: () => setStatus(item.id, "read"),
								children: "Mark read"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-full border border-paper-line px-4 text-sm",
								onClick: () => setStatus(item.id, "archived"),
								children: "Archive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-full border border-paper-line px-4 text-sm",
								onClick: () => remove(item.id),
								children: "Delete"
							})
						]
					})
				]
			}, item.id))
		]
	});
}
function PasswordForm({ onSaved, onError }) {
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		if (newPassword.length < 8) {
			onError("Use at least 8 characters for the new password.");
			return;
		}
		if (newPassword !== confirm) {
			onError("The new passwords do not match.");
			return;
		}
		setPending(true);
		const result = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: false
		});
		setPending(false);
		if (result.error) {
			onError(result.error.message || "Could not change the password.");
			return;
		}
		setCurrentPassword("");
		setNewPassword("");
		setConfirm("");
		onSaved("Password updated.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-md gap-4",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Current password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					className: fieldClass,
					value: currentPassword,
					onChange: (event) => setCurrentPassword(event.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					className: fieldClass,
					value: newPassword,
					onChange: (event) => setNewPassword(event.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm font-medium",
				children: ["Confirm new password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					className: fieldClass,
					value: confirm,
					onChange: (event) => setConfirm(event.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60",
				children: pending ? "Updating…" : "Update password"
			})
		]
	});
}
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-paper text-paper-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking session…" })
	});
	if (user?.primaryEmail?.toLowerCase() !== "admin1234@codexviber.com") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogin, { signedInAs: user?.primaryEmail });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {});
}
//#endregion
export { AdminPage as component };
