//#region node_modules/.nitro/vite/services/ssr/assets/cms-validate-Dk-8qJca.js
function cleanText(value, max) {
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/[<>]/g, "").trim().slice(0, max);
}
function isEmail(value) {
	return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isPhone(value) {
	return /^\+?[0-9][0-9 \-]{6,18}$/.test(value);
}
function isSafeHttpUrl(value) {
	if (!value || value.length > 500) return false;
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}
/** Empty is allowed. Otherwise a bounded PNG, JPEG, or WebP data URL. */
function isSafeImageDataUrl(value) {
	if (!value) return true;
	if (value.length > 12e5) return false;
	return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(value);
}
function cleanSocials(input) {
	const out = [];
	for (const item of input.slice(0, 5)) {
		const label = cleanText(item.label ?? "", 40);
		const url = (item.url ?? "").trim();
		if (!label && !url) continue;
		if (!label || !isSafeHttpUrl(url)) throw new Error("Social links need a label and an http(s) URL.");
		out.push({
			label,
			url
		});
	}
	return out;
}
function cleanApproach(input) {
	const out = input.slice(0, 4).map((step) => ({
		title: cleanText(step.title ?? "", 40),
		body: cleanText(step.body ?? "", 280)
	}));
	if (out.length < 1 || out.some((step) => !step.title || !step.body)) throw new Error("Each working step needs a title and a short description.");
	return out;
}
function optionalUrl(value, label) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (!isSafeHttpUrl(trimmed)) throw new Error(`${label} must be a full http(s) link, or left blank.`);
	return trimmed;
}
function parseContact(input) {
	const name = cleanText(input.name ?? "", 80);
	const email = (input.email ?? "").trim().toLowerCase();
	const subject = cleanText(input.subject ?? "", 140);
	const message = cleanText(input.message ?? "", 4e3);
	if (name.length < 2) throw new Error("Enter your name.");
	if (!isEmail(email)) throw new Error("Enter a valid email address.");
	if (subject.length < 2) throw new Error("Enter a subject.");
	if (message.length < 10) throw new Error("Tell us a little more about the project (at least a sentence).");
	return {
		name,
		email,
		subject,
		message
	};
}
//#endregion
export { isPhone as a, parseContact as c, isEmail as i, cleanSocials as n, isSafeImageDataUrl as o, cleanText as r, optionalUrl as s, cleanApproach as t };
