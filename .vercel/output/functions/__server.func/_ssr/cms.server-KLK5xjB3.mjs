import { o as getRequest } from "./ssr.mjs";
import { i as hashPassword$1, r as getSql } from "./db-CJ4dcepn.mjs";
import { t as ADMIN_EMAIL } from "./admin-identity-DDX3auus.mjs";
import { a as isPhone, c as parseContact, i as isEmail, n as cleanSocials, o as isSafeImageDataUrl, r as cleanText, s as optionalUrl, t as cleanApproach } from "./cms-validate-Dk-8qJca.mjs";
import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/cms.server-KLK5xjB3.js
function flag(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function parseJsonArray(raw) {
	try {
		const data = JSON.parse(raw);
		return Array.isArray(data) ? data : [];
	} catch {
		return [];
	}
}
function readSocials(raw) {
	const out = [];
	for (const item of parseJsonArray(raw)) {
		if (!item || typeof item !== "object") continue;
		const record = item;
		const label = cleanText(String(record.label ?? ""), 40);
		const url = String(record.url ?? "").trim();
		if (!label || !optionalUrlSafe(url)) continue;
		out.push({
			label,
			url
		});
	}
	return out;
}
function optionalUrlSafe(value) {
	try {
		optionalUrl(value, "Link");
		return Boolean(value);
	} catch {
		return false;
	}
}
function readApproach(raw) {
	const out = [];
	for (const item of parseJsonArray(raw)) {
		if (!item || typeof item !== "object") continue;
		const record = item;
		const title = cleanText(String(record.title ?? ""), 40);
		const body = cleanText(String(record.body ?? ""), 280);
		if (title && body) out.push({
			title,
			body
		});
	}
	return out;
}
function mapAgency(row) {
	return {
		name: row.name,
		tagline: row.tagline,
		heroIntro: row.hero_intro,
		aboutTitle: row.about_title,
		aboutBody: row.about_body,
		approach: readApproach(row.approach),
		email: row.email,
		phone: row.phone,
		location: row.location,
		socials: readSocials(row.socials)
	};
}
function mapPerson(row) {
	const accent = row.accent === "blue" ? "blue" : "red";
	return {
		id: row.id,
		name: row.name,
		role: row.role,
		accent,
		bio: row.bio,
		portfolioUrl: row.portfolio_url,
		photoUrl: row.photo_url,
		socials: readSocials(row.socials)
	};
}
function mapService(row) {
	return {
		id: Number(row.id),
		title: row.title,
		description: row.description,
		icon: row.icon,
		detailsUrl: row.details_url,
		visible: flag(row.visible)
	};
}
function imageBytesLookReal(value) {
	if (!value) return true;
	const payload = value.split(",")[1]?.replace(/\s/g, "") ?? "";
	const bytes = Buffer.from(payload, "base64");
	if (bytes.length < 32) return false;
	if (value.startsWith("data:image/png")) return bytes[0] === 137 && bytes[1] === 80;
	if (value.startsWith("data:image/jpeg")) return bytes[0] === 255 && bytes[1] === 216;
	if (value.startsWith("data:image/webp")) return bytes.toString("ascii", 0, 4) === "RIFF";
	return false;
}
function mapProject(row) {
	const cover = row.cover_data && isSafeImageDataUrl(row.cover_data) && imageBytesLookReal(row.cover_data) ? row.cover_data : "";
	return {
		id: Number(row.id),
		title: row.title,
		description: row.description,
		category: row.category,
		technologies: row.technologies,
		demoUrl: row.demo_url,
		githubUrl: row.github_url,
		coverData: cover,
		videoUrl: row.video_url ?? "",
		published: flag(row.published)
	};
}
var globalAdmin = globalThis;
async function ensureAdminOnce() {
	const sql = await getSql();
	if ((await sql`
    select id from "user" where lower(email) = ${"admin1234@codexviber.com"} limit 1
  `).length > 0) return;
	const id = randomBytes(16).toString("hex");
	const hash = await hashPassword$1("admin1234");
	await sql`
    insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
    values (${id}, ${"CodeXViber Admin"}, ${ADMIN_EMAIL}, ${true}, now(), now())
  `;
	await sql`
    insert into "account" (
      "id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt"
    )
    values (${randomBytes(16).toString("hex")}, ${id}, ${"credential"}, ${id}, ${hash}, now(), now())
  `;
}
/** Create the administrator once. Never resets a password that was already changed. */
function ensureAdmin() {
	globalAdmin.__codexAdminBootstrap__ ??= ensureAdminOnce().catch((error) => {
		globalAdmin.__codexAdminBootstrap__ = void 0;
		throw error;
	});
	return globalAdmin.__codexAdminBootstrap__;
}
async function requireSettings(sql) {
	const row = (await sql`
    select name, tagline, hero_intro, about_title, about_body, approach, email, phone, location, socials
    from agency_settings where id = 1
  `)[0];
	if (!row) throw new Error("Site content is not ready yet.");
	return mapAgency(row);
}
async function loadPeople(sql) {
	return (await sql`
    select id, name, role, accent, bio, portfolio_url, photo_url, socials
    from people order by sort_order asc
  `).map(mapPerson);
}
async function loadServices(sql) {
	return (await sql`
    select id, title, description, icon, details_url, visible
    from services order by sort_order asc, id asc
  `).map(mapService);
}
async function loadProjects(sql, publishedOnly) {
	return (publishedOnly ? await sql`
        select id, title, description, category, technologies, demo_url, github_url, cover_data, video_url, published
        from projects where published = true
        order by sort_order desc, id desc
      ` : await sql`
        select id, title, description, category, technologies, demo_url, github_url, cover_data, video_url, published
        from projects
        order by sort_order desc, id desc
      `).map(mapProject);
}
async function loadPublicSite() {
	await ensureAdmin().catch((error) => {
		console.error("[cms] administrator bootstrap failed", error);
	});
	const sql = await getSql();
	const [agency, people, services, projects] = await Promise.all([
		requireSettings(sql),
		loadPeople(sql),
		loadServices(sql),
		loadProjects(sql, true)
	]);
	return {
		agency,
		people,
		services: services.filter((service) => service.visible),
		projects
	};
}
async function requireAdmin(userId) {
	if (((await (await getSql())`
    select email from "user" where id = ${userId} limit 1
  `)[0]?.email ?? "").toLowerCase() !== "admin1234@codexviber.com") throw new Error("You do not have administrator access.");
}
async function loadAdminBundle() {
	const sql = await getSql();
	const [agency, people, services, projects] = await Promise.all([
		requireSettings(sql),
		loadPeople(sql),
		loadServices(sql),
		loadProjects(sql, false)
	]);
	const mappedInquiries = (await sql`
    select id, name, email, subject, message, status,
           to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
    from inquiries
    order by created_at desc, id desc
  `).map((row) => ({
		id: Number(row.id),
		name: row.name,
		email: row.email,
		subject: row.subject,
		message: row.message,
		status: row.status === "read" || row.status === "archived" ? row.status : "new",
		createdAt: row.created_at
	}));
	return {
		agency,
		people,
		services: services.filter((service) => service.visible),
		projects: projects.filter((project) => project.published),
		allServices: services,
		allProjects: projects,
		inquiries: mappedInquiries,
		counts: {
			publishedProjects: projects.filter((project) => project.published).length,
			draftProjects: projects.filter((project) => !project.published).length,
			newInquiries: mappedInquiries.filter((item) => item.status === "new").length,
			services: services.filter((service) => service.visible).length
		}
	};
}
function clientKey(prefix) {
	let ip = "local";
	try {
		const request = getRequest();
		const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
		const real = request?.headers.get("x-real-ip")?.trim();
		ip = (forwarded || real || "local").slice(0, 64).replace(/[^a-zA-Z0-9:.\-]/g, "") || "local";
	} catch {
		ip = "local";
	}
	return `${prefix}:${ip}`;
}
async function allowHit(bucket, limit, windowMs) {
	const sql = await getSql();
	const now = Date.now();
	const row = (await sql`
    select hits, extract(epoch from window_start) as window_start
    from rate_limits where bucket = ${bucket}
  `)[0];
	if (!row) {
		await sql`insert into rate_limits (bucket, hits, window_start) values (${bucket}, 1, now())`;
		return true;
	}
	const start = Number(row.window_start) * 1e3;
	if (!Number.isFinite(start) || now - start > windowMs) {
		await sql`update rate_limits set hits = 1, window_start = now() where bucket = ${bucket}`;
		return true;
	}
	if (Number(row.hits) >= limit) return false;
	await sql`update rate_limits set hits = hits + 1 where bucket = ${bucket}`;
	return true;
}
async function guardAdminLogin() {
	if (!await allowHit(clientKey("login"), 8, 6e5)) throw new Error("Too many sign-in attempts. Wait a few minutes and try again.");
	return { ok: true };
}
async function saveInquiry(input) {
	if (!await allowHit(clientKey("contact"), 5, 9e5)) throw new Error("Too many messages from this connection. Please try again later.");
	const contact = parseContact(input);
	await (await getSql())`
    insert into inquiries (name, email, subject, message)
    values (${contact.name}, ${contact.email}, ${contact.subject}, ${contact.message})
  `;
	return { ok: true };
}
async function saveAgency(input) {
	const tagline = cleanText(input.tagline, 80);
	const heroIntro = cleanText(input.heroIntro, 400);
	const aboutTitle = cleanText(input.aboutTitle, 80);
	const aboutBody = cleanText(input.aboutBody, 1200);
	const location = cleanText(input.location, 80);
	const email = input.email.trim().toLowerCase();
	const phone = input.phone.trim();
	if (tagline.length < 2) throw new Error("Enter a tagline.");
	if (heroIntro.length < 10) throw new Error("Enter a short introduction.");
	if (aboutTitle.length < 2 || aboutBody.length < 10) throw new Error("Complete the about section.");
	if (!isEmail(email)) throw new Error("Enter a valid public email address.");
	if (!isPhone(phone)) throw new Error("Enter a valid phone number.");
	if (location.length < 2) throw new Error("Enter a location.");
	const approach = cleanApproach(input.approach);
	const socials = cleanSocials(input.socials ?? []);
	await (await getSql())`
    update agency_settings set
      tagline = ${tagline},
      hero_intro = ${heroIntro},
      about_title = ${aboutTitle},
      about_body = ${aboutBody},
      approach = ${JSON.stringify(approach)},
      email = ${email},
      phone = ${phone},
      location = ${location},
      socials = ${JSON.stringify(socials)},
      updated_at = now()
    where id = 1
  `;
	return { ok: true };
}
async function savePerson(input) {
	if (input.id !== "founder" && input.id !== "cofounder") throw new Error("Unknown profile.");
	const name = cleanText(input.name, 60);
	const role = cleanText(input.role, 60);
	const bio = cleanText(input.bio, 600);
	if (name.length < 2 || role.length < 2 || bio.length < 10) throw new Error("Name, role, and biography all need a proper value.");
	const portfolioUrl = optionalUrl(input.portfolioUrl ?? "", "Portfolio link");
	const socials = cleanSocials(input.socials ?? []);
	if ((await (await getSql())`
    update people set
      name = ${name},
      role = ${role},
      bio = ${bio},
      portfolio_url = ${portfolioUrl},
      socials = ${JSON.stringify(socials)}
    where id = ${input.id}
    returning id
  `).length === 0) throw new Error("Profile was not found.");
	return { ok: true };
}
async function saveService(input) {
	const title = cleanText(input.title, 80);
	const description = cleanText(input.description, 400);
	if (title.length < 2 || description.length < 10) throw new Error("Each service needs a title and a description.");
	const detailsUrl = optionalUrl(input.detailsUrl ?? "", "Details link");
	if ((await (await getSql())`
    update services set
      title = ${title},
      description = ${description},
      details_url = ${detailsUrl},
      visible = ${Boolean(input.visible)}
    where id = ${input.id}
    returning id
  `).length === 0) throw new Error("Service was not found.");
	return { ok: true };
}
function parseProject(input) {
	const title = cleanText(input.title, 80);
	const description = cleanText(input.description, 600);
	const category = cleanText(input.category ?? "", 40);
	const technologies = cleanText(input.technologies ?? "", 160);
	if (title.length < 2 || description.length < 10) throw new Error("A project needs a title and a description.");
	const demoUrl = optionalUrl(input.demoUrl ?? "", "Project link");
	const githubUrl = optionalUrl(input.githubUrl ?? "", "Repository link");
	const coverData = (input.coverData ?? "").trim();
	if (coverData && (!isSafeImageDataUrl(coverData) || !imageBytesLookReal(coverData))) throw new Error("Cover images must be a PNG, JPG, or WebP under about 1 MB.");
	return {
		title,
		description,
		category,
		technologies,
		demoUrl,
		githubUrl,
		coverData,
		videoUrl: optionalUrl(input.videoUrl ?? "", "Video preview link"),
		published: Boolean(input.published)
	};
}
async function createProject(input) {
	const project = parseProject(input);
	const sql = await getSql();
	const orderRows = await sql`
    select coalesce(max(sort_order), 0) + 1 as next from projects
  `;
	await sql`
    insert into projects (
      title, description, category, technologies, demo_url, github_url, cover_data, video_url, published, sort_order
    ) values (
      ${project.title}, ${project.description}, ${project.category}, ${project.technologies},
      ${project.demoUrl}, ${project.githubUrl}, ${project.coverData}, ${project.videoUrl}, ${project.published},
      ${Number(orderRows[0]?.next ?? 1)}
    )
  `;
	return { ok: true };
}
async function updateProject(input) {
	const project = parseProject(input);
	if ((await (await getSql())`
    update projects set
      title = ${project.title},
      description = ${project.description},
      category = ${project.category},
      technologies = ${project.technologies},
      demo_url = ${project.demoUrl},
      github_url = ${project.githubUrl},
      cover_data = ${project.coverData},
      video_url = ${project.videoUrl},
      published = ${project.published},
      updated_at = now()
    where id = ${input.id}
    returning id
  `).length === 0) throw new Error("Project was not found.");
	return { ok: true };
}
async function removeProject(id) {
	await (await getSql())`delete from projects where id = ${id}`;
	return { ok: true };
}
async function setInquiryStatus(id, status) {
	if (status !== "new" && status !== "read" && status !== "archived") throw new Error("Unknown inquiry status.");
	if ((await (await getSql())`
    update inquiries set status = ${status} where id = ${id} returning id
  `).length === 0) throw new Error("Inquiry was not found.");
	return { ok: true };
}
async function removeInquiry(id) {
	await (await getSql())`delete from inquiries where id = ${id}`;
	return { ok: true };
}
//#endregion
export { createProject, guardAdminLogin, loadAdminBundle, loadPublicSite, removeInquiry, removeProject, requireAdmin, saveAgency, saveInquiry, savePerson, saveService, setInquiryStatus, updateProject };
