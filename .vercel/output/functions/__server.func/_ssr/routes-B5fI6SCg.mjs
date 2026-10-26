import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as submitInquiry } from "./cms.functions-CFr8DSCt.mjs";
import { t as LogoMark } from "./logo-mark-ovp-6csp.mjs";
import { i as isEmail } from "./cms-validate-Dk-8qJca.mjs";
import { a as Menu, c as CodeXml, i as Presentation, l as Bot, n as Wrench, o as Globe, s as Cpu, t as X } from "../_libs/lucide-react.mjs";
import { n as Route$3 } from "./router-B-E7RMrl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B5fI6SCg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BootScreen() {
	const [visible, setVisible] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let hideTimer = 0;
		const hide = () => setVisible(false);
		if (reduce) {
			hideTimer = window.setTimeout(hide, 180);
			return () => window.clearTimeout(hideTimer);
		}
		const started = performance.now();
		const finish = () => {
			const wait = Math.max(0, 900 - (performance.now() - started));
			hideTimer = window.setTimeout(hide, wait);
		};
		if (document.readyState === "complete") finish();
		else window.addEventListener("load", finish, { once: true });
		const cap = window.setTimeout(hide, 2600);
		return () => {
			window.clearTimeout(cap);
			window.clearTimeout(hideTimer);
			window.removeEventListener("load", finish);
		};
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-ink",
		role: "status",
		"aria-live": "polite",
		"aria-label": "Loading CodeXViber",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "mx-auto h-24 w-24" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-3xl tracking-tight text-fg",
					children: "CodeXViber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-6 h-0.5 w-40 overflow-hidden bg-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "loadbar h-full bg-fg" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-semibold tracking-widest text-muted uppercase",
					children: "Ideas to impact"
				})
			]
		})
	});
}
var ICONS = {
	Globe,
	Presentation,
	Bot,
	Cpu,
	Code2: CodeXml,
	Wrench
};
var NAV = [
	{
		href: "#about",
		label: "About"
	},
	{
		href: "#founders",
		label: "Founders"
	},
	{
		href: "#services",
		label: "Services"
	},
	{
		href: "#projects",
		label: "Projects"
	},
	{
		href: "#contact",
		label: "Contact"
	}
];
function errorText(error) {
	if (error instanceof Error && error.message) return error.message;
	return "Something went wrong. Please try again.";
}
function telHref(phone) {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
function PublicSite({ site }) {
	const { agency, people, services, projects } = site;
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [contactState, setContactState] = (0, import_react.useState)("idle");
	const [contactNote, setContactNote] = (0, import_react.useState)("");
	async function onContact(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const payload = {
			name: String(data.get("name") ?? ""),
			email: String(data.get("email") ?? ""),
			subject: String(data.get("subject") ?? ""),
			message: String(data.get("message") ?? "")
		};
		if (payload.name.trim().length < 2) {
			setContactState("error");
			setContactNote("Enter your name.");
			return;
		}
		if (!isEmail(payload.email.trim())) {
			setContactState("error");
			setContactNote("Enter a valid email address.");
			return;
		}
		if (payload.subject.trim().length < 2) {
			setContactState("error");
			setContactNote("Enter a subject.");
			return;
		}
		if (payload.message.trim().length < 10) {
			setContactState("error");
			setContactNote("Tell us a little more about the project.");
			return;
		}
		setContactState("sending");
		setContactNote("");
		try {
			if (!(await submitInquiry({ data: payload }))?.ok) throw new Error("The message was not saved.");
			form.reset();
			setContactState("sent");
			setContactNote("Message received. We will read it in the studio inbox.");
		} catch (error) {
			setContactState("error");
			setContactNote(errorText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-ink text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-40 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#top",
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-11 w-11" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-display text-xl leading-none tracking-tight",
								children: [
									"Code",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-blue",
										children: "X"
									}),
									"Viber"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 hidden text-xs text-muted sm:block",
								children: agency.tagline
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-6 md:flex",
							"aria-label": "Primary",
							children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: item.href,
								className: "text-sm text-muted hover:text-fg",
								children: item.label
							}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#contact",
								className: "inline-flex min-h-11 items-center rounded-full border border-blue px-4 text-sm font-semibold text-fg",
								children: "Start a project"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden",
							"aria-expanded": menuOpen,
							"aria-controls": "site-menu",
							onClick: () => setMenuOpen((open) => !open),
							children: [menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Menu"
							})]
						})
					]
				}), menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					id: "site-menu",
					className: "border-t border-line px-5 py-2 md:hidden",
					"aria-label": "Mobile",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "flex min-h-11 items-center text-base",
						onClick: () => setMenuOpen(false),
						children: item.label
					}, item.href))
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "top",
						className: "mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-widest text-cyan uppercase",
								children: "Digital studio"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 font-display text-5xl leading-none tracking-tight sm:text-7xl",
								children: agency.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-xl text-lg leading-relaxed text-muted",
								children: agency.heroIntro
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col gap-3 sm:flex-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#services",
										className: "inline-flex min-h-11 items-center justify-center rounded-full bg-blue px-5 font-semibold text-ink",
										children: "Services"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#projects",
										className: "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 font-semibold",
										children: "Projects"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#contact",
										className: "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 font-semibold",
										children: "Contact"
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto grid aspect-square w-full max-w-md place-items-center overflow-hidden rounded-3xl border border-line bg-ink-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-8 rounded-full border border-blue animate-orbit" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-16 rounded-full border border-cyan animate-orbit-rev" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "mx-auto h-28 w-28" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs font-semibold tracking-widest text-cyan uppercase",
										children: "CodeXViber"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "about",
						className: "border-y border-line bg-ink-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-widest text-cyan uppercase",
									children: "About the agency"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl tracking-tight",
									children: agency.aboutTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 leading-relaxed text-muted",
									children: agency.aboutBody
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "grid gap-4",
								children: agency.approach.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-2xl border border-line bg-panel p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-semibold text-blue",
											children: ["0", index + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-2 text-xl font-semibold",
											children: step.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 leading-relaxed text-muted",
											children: step.body
										})
									]
								}, step.title))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "founders",
						className: "mx-auto max-w-6xl px-5 py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-widest text-cyan uppercase",
								children: "The people behind the work"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-4xl tracking-tight",
								children: "Founders"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-2xl leading-relaxed text-muted",
								children: "Two different strengths, one shared aim: build digital work that is useful and clear."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid gap-5 lg:grid-cols-2",
								children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonCard, { person }, person.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "services",
						className: "border-y border-line bg-ink-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl px-5 py-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-widest text-cyan uppercase",
									children: "What we do"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl tracking-tight",
									children: "Services"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-2xl leading-relaxed text-muted",
									children: "Flexible digital services for creators, students, startups, and businesses."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
									children: services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, { service }, service.id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "projects",
						className: "bg-wine",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-6xl px-5 py-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-widest text-red uppercase",
									children: "Selected work"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl tracking-tight",
									children: "Projects"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-2xl leading-relaxed text-muted",
									children: "Published work appears here. Studio concepts are labeled as concepts — they are not presented as finished client jobs."
								}),
								projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-8 rounded-2xl border border-red/40 bg-ink p-6 text-muted",
									children: "No published projects yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
									children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, { project }, project.id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "contact",
						className: "border-t border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-widest text-muted uppercase",
									children: "Start a conversation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mt-3 font-display text-4xl tracking-tight",
									children: ["Contact ", agency.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 leading-relaxed text-muted",
									children: "Have a project idea, a collaboration, or a question? Send a message and tell us what you would like to build."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-6 space-y-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "font-semibold",
											href: `mailto:${agency.email}`,
											children: agency.email
										}) })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "font-semibold",
											href: telHref(agency.phone),
											children: agency.phone
										}) })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-semibold",
											children: agency.location
										})] })
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "grid gap-4",
								onSubmit: onContact,
								noValidate: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-2 text-sm font-medium",
										children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "name",
											autoComplete: "name",
											required: true,
											className: "min-h-12 rounded-xl border border-line bg-ink-2 px-4"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-2 text-sm font-medium",
										children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "email",
											type: "email",
											autoComplete: "email",
											required: true,
											className: "min-h-12 rounded-xl border border-line bg-ink-2 px-4"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-2 text-sm font-medium",
										children: ["Subject", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "subject",
											required: true,
											className: "min-h-12 rounded-xl border border-line bg-ink-2 px-4"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-2 text-sm font-medium",
										children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											name: "message",
											required: true,
											rows: 5,
											className: "rounded-xl border border-line bg-ink-2 px-4 py-3"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: contactState === "sending",
										className: "inline-flex min-h-12 items-center justify-center rounded-xl bg-fg px-5 font-semibold text-ink disabled:opacity-60",
										children: contactState === "sending" ? "Sending…" : "Send message"
									}),
									contactNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "status",
										className: contactState === "error" ? "text-sm text-red" : "text-sm text-cyan",
										children: contactNote
									}) : null
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-10 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg",
								children: agency.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: agency.tagline
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "grid content-start gap-2 text-sm",
							"aria-label": "Footer",
							children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: item.href,
								className: "text-muted hover:text-fg",
								children: item.label
							}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "font-semibold text-fg hover:text-cyan",
								children: "Login"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "block text-muted hover:text-fg",
									href: `mailto:${agency.email}`,
									children: agency.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-1 block text-muted hover:text-fg",
									href: telHref(agency.phone),
									children: agency.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted",
									children: agency.location
								}),
								agency.socials.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1",
									children: agency.socials.map((social) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-cyan hover:text-fg",
										href: social.url,
										rel: "noreferrer",
										target: "_blank",
										children: social.label
									}) }, social.url))
								}) : null
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-t border-line px-5 py-4 text-center text-xs text-muted",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						agency.name
					]
				})]
			})
		]
	});
}
function PersonCard({ person }) {
	const red = person.accent === "red";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: `rounded-2xl border bg-panel p-5 sm:p-6 ${red ? "border-red" : "border-blue"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: person.photoUrl,
				alt: `Portrait of ${person.name}, ${person.role} of CodeXViber`,
				width: 640,
				height: 800,
				loading: "lazy",
				className: `aspect-square w-full rounded-xl border object-cover sm:w-44 sm:shrink-0 ${red ? "border-red object-top" : "border-blue object-center"}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-3xl tracking-tight",
						children: person.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 text-sm font-semibold tracking-wide uppercase ${red ? "text-red" : "text-cyan"}`,
						children: person.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted",
						children: person.bio
					}),
					person.portfolioUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "mt-4 inline-flex min-h-11 items-center font-semibold text-fg",
						href: person.portfolioUrl,
						rel: "noreferrer",
						target: "_blank",
						children: "Portfolio"
					}) : null,
					person.socials.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-wrap gap-x-4 gap-y-1",
						children: person.socials.map((social) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-sm text-cyan",
							href: social.url,
							rel: "noreferrer",
							target: "_blank",
							children: social.label
						}) }, social.url))
					}) : null
				]
			})]
		})
	});
}
function ServiceCard({ service }) {
	const Icon = ICONS[service.icon] ?? CodeXml;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl border border-cyan bg-panel p-5 transition hover:-translate-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-11 w-11 place-items-center rounded-xl border border-cyan text-cyan",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-5 w-5",
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-xl font-semibold",
				children: service.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 leading-relaxed text-muted",
				children: service.description
			}),
			service.detailsUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-cyan",
				href: service.detailsUrl,
				rel: "noreferrer",
				target: "_blank",
				children: "Details"
			}) : null
		]
	});
}
function ProjectCard({ project }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-2xl border border-red bg-ink",
		children: [project.videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src: project.videoUrl,
			controls: true,
			muted: true,
			loop: true,
			playsInline: true,
			poster: project.coverData || void 0,
			className: "aspect-video w-full object-cover"
		}) : project.coverData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: project.coverData,
			alt: "",
			loading: "lazy",
			className: "aspect-video w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid aspect-video place-items-center bg-wine font-display text-5xl text-red",
			"aria-hidden": "true",
			children: project.title.slice(0, 1)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				project.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-wide text-red uppercase",
					children: project.category
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 text-xl font-semibold",
					children: project.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 leading-relaxed text-muted",
					children: project.description
				}),
				project.technologies ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: project.technologies
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-4",
					children: [project.demoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "inline-flex min-h-11 items-center text-sm font-semibold",
						href: project.demoUrl,
						rel: "noreferrer",
						target: "_blank",
						children: "View project"
					}) : null, project.githubUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "inline-flex min-h-11 items-center text-sm font-semibold text-muted",
						href: project.githubUrl,
						rel: "noreferrer",
						target: "_blank",
						children: "Repository"
					}) : null]
				})
			]
		})]
	});
}
function Home() {
	const site = Route$3.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicSite, { site });
}
//#endregion
export { Home as component };
