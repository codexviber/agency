import { hashPassword } from "better-auth/crypto";
import { getRequest } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { ADMIN_EMAIL } from "./admin-identity";
import {
  cleanApproach,
  cleanSocials,
  cleanText,
  isEmail,
  isPhone,
  isSafeImageDataUrl,
  optionalUrl,
  parseContact,
  type ContactInput,
} from "./cms-validate";
import type {
  AdminBundle,
  AgencySettings,
  ApproachStep,
  Inquiry,
  Person,
  Project,
  PublicSite,
  Service,
  SocialLink,
} from "./cms-types";
import { getSql, type Sql } from "./db";

type AgencyRow = {
  name: string;
  tagline: string;
  hero_intro: string;
  about_title: string;
  about_body: string;
  approach: string;
  email: string;
  phone: string;
  location: string;
  socials: string;
};

type PersonRow = {
  id: string;
  name: string;
  role: string;
  accent: string;
  bio: string;
  portfolio_url: string;
  photo_url: string;
  socials: string;
};

type ServiceRow = {
  id: number;
  title: string;
  description: string;
  icon: string;
  details_url: string;
  visible: boolean | string | number;
};

type ProjectRow = {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  demo_url: string;
  github_url: string;
  cover_data: string;
  video_url: string;
  published: boolean | string | number;
};

type InquiryRow = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

function flag(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function parseJsonArray(raw: string): unknown[] {
  try {
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function readSocials(raw: string): SocialLink[] {
  const out: SocialLink[] = [];
  for (const item of parseJsonArray(raw)) {
    if (!item || typeof item !== "object") continue;
    const record = item as { label?: unknown; url?: unknown };
    const label = cleanText(String(record.label ?? ""), 40);
    const url = String(record.url ?? "").trim();
    if (!label || !optionalUrlSafe(url)) continue;
    out.push({ label, url });
  }
  return out;
}

function optionalUrlSafe(value: string): boolean {
  try {
    optionalUrl(value, "Link");
    return Boolean(value);
  } catch {
    return false;
  }
}

function readApproach(raw: string): ApproachStep[] {
  const out: ApproachStep[] = [];
  for (const item of parseJsonArray(raw)) {
    if (!item || typeof item !== "object") continue;
    const record = item as { title?: unknown; body?: unknown };
    const title = cleanText(String(record.title ?? ""), 40);
    const body = cleanText(String(record.body ?? ""), 280);
    if (title && body) out.push({ title, body });
  }
  return out;
}

function mapAgency(row: AgencyRow): AgencySettings {
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
    socials: readSocials(row.socials),
  };
}

function mapPerson(row: PersonRow): Person {
  const accent = row.accent === "blue" ? "blue" : "red";
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    accent,
    bio: row.bio,
    portfolioUrl: row.portfolio_url,
    photoUrl: row.photo_url,
    socials: readSocials(row.socials),
  };
}

function mapService(row: ServiceRow): Service {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    icon: row.icon,
    detailsUrl: row.details_url,
    visible: flag(row.visible),
  };
}

function imageBytesLookReal(value: string): boolean {
  if (!value) return true;
  const payload = value.split(",")[1]?.replace(/\s/g, "") ?? "";
  const bytes = Buffer.from(payload, "base64");
  if (bytes.length < 32) return false;
  if (value.startsWith("data:image/png")) return bytes[0] === 0x89 && bytes[1] === 0x50;
  if (value.startsWith("data:image/jpeg")) return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (value.startsWith("data:image/webp")) return bytes.toString("ascii", 0, 4) === "RIFF";
  return false;
}

function mapProject(row: ProjectRow): Project {
  const cover = row.cover_data && isSafeImageDataUrl(row.cover_data) && imageBytesLookReal(row.cover_data)
    ? row.cover_data
    : "";
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
    published: flag(row.published),
  };
}

const globalAdmin = globalThis as typeof globalThis & {
  __codexAdminBootstrap__?: Promise<void>;
};

async function ensureAdminOnce(): Promise<void> {
  const sql = await getSql();
  const existing = await sql<{ id: string }>`
    select id from "user" where lower(email) = ${ADMIN_EMAIL} limit 1
  `;
  if (existing.length > 0) return;
  const id = randomBytes(16).toString("hex");
  const hash = await hashPassword("admin1234");
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
export function ensureAdmin(): Promise<void> {
  globalAdmin.__codexAdminBootstrap__ ??= ensureAdminOnce().catch((error) => {
    globalAdmin.__codexAdminBootstrap__ = undefined;
    throw error;
  });
  return globalAdmin.__codexAdminBootstrap__;
}

async function requireSettings(sql: Sql): Promise<AgencySettings> {
  const rows = await sql<AgencyRow>`
    select name, tagline, hero_intro, about_title, about_body, approach, email, phone, location, socials
    from agency_settings where id = 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Site content is not ready yet.");
  return mapAgency(row);
}

async function loadPeople(sql: Sql): Promise<Person[]> {
  const rows = await sql<PersonRow>`
    select id, name, role, accent, bio, portfolio_url, photo_url, socials
    from people order by sort_order asc
  `;
  return rows.map(mapPerson);
}

async function loadServices(sql: Sql): Promise<Service[]> {
  const rows = await sql<ServiceRow>`
    select id, title, description, icon, details_url, visible
    from services order by sort_order asc, id asc
  `;
  return rows.map(mapService);
}

async function loadProjects(sql: Sql, publishedOnly: boolean): Promise<Project[]> {
  const rows = publishedOnly
    ? await sql<ProjectRow>`
        select id, title, description, category, technologies, demo_url, github_url, cover_data, video_url, published
        from projects where published = true
        order by sort_order desc, id desc
      `
    : await sql<ProjectRow>`
        select id, title, description, category, technologies, demo_url, github_url, cover_data, video_url, published
        from projects
        order by sort_order desc, id desc
      `;
  return rows.map(mapProject);
}

export async function loadPublicSite(): Promise<PublicSite> {
  await ensureAdmin().catch((error) => {
    console.error("[cms] administrator bootstrap failed", error);
  });
  const sql = await getSql();
  const [agency, people, services, projects] = await Promise.all([
    requireSettings(sql),
    loadPeople(sql),
    loadServices(sql),
    loadProjects(sql, true),
  ]);
  return {
    agency,
    people,
    services: services.filter((service) => service.visible),
    projects,
  };
}

export async function requireAdmin(userId: string): Promise<void> {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`
    select email from "user" where id = ${userId} limit 1
  `;
  if ((rows[0]?.email ?? "").toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("You do not have administrator access.");
  }
}

export async function loadAdminBundle(): Promise<AdminBundle> {
  const sql = await getSql();
  const [agency, people, services, projects] = await Promise.all([
    requireSettings(sql),
    loadPeople(sql),
    loadServices(sql),
    loadProjects(sql, false),
  ]);
  const inquiries = await sql<InquiryRow>`
    select id, name, email, subject, message, status,
           to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
    from inquiries
    order by created_at desc, id desc
  `;
  const mappedInquiries: Inquiry[] = inquiries.map((row) => ({
    id: Number(row.id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status === "read" || row.status === "archived" ? row.status : "new",
    createdAt: row.created_at,
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
      services: services.filter((service) => service.visible).length,
    },
  };
}

function clientKey(prefix: string): string {
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

async function allowHit(bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const sql = await getSql();
  const now = Date.now();
  const rows = await sql<{ hits: number; window_start: string }>`
    select hits, extract(epoch from window_start) as window_start
    from rate_limits where bucket = ${bucket}
  `;
  const row = rows[0];
  if (!row) {
    await sql`insert into rate_limits (bucket, hits, window_start) values (${bucket}, 1, now())`;
    return true;
  }
  const start = Number(row.window_start) * 1000;
  if (!Number.isFinite(start) || now - start > windowMs) {
    await sql`update rate_limits set hits = 1, window_start = now() where bucket = ${bucket}`;
    return true;
  }
  if (Number(row.hits) >= limit) return false;
  await sql`update rate_limits set hits = hits + 1 where bucket = ${bucket}`;
  return true;
}

export async function guardAdminLogin(): Promise<{ ok: true }> {
  const allowed = await allowHit(clientKey("login"), 8, 10 * 60 * 1000);
  if (!allowed) throw new Error("Too many sign-in attempts. Wait a few minutes and try again.");
  return { ok: true };
}

export async function saveInquiry(input: ContactInput): Promise<{ ok: true }> {
  const allowed = await allowHit(clientKey("contact"), 5, 15 * 60 * 1000);
  if (!allowed) throw new Error("Too many messages from this connection. Please try again later.");
  const contact = parseContact(input);
  const sql = await getSql();
  await sql`
    insert into inquiries (name, email, subject, message)
    values (${contact.name}, ${contact.email}, ${contact.subject}, ${contact.message})
  `;
  return { ok: true };
}

export type AgencyInput = {
  tagline: string;
  heroIntro: string;
  aboutTitle: string;
  aboutBody: string;
  approach: ApproachStep[];
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
};

export async function saveAgency(input: AgencyInput): Promise<{ ok: true }> {
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
  const sql = await getSql();
  await sql`
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

export type PersonInput = {
  id: string;
  name: string;
  role: string;
  bio: string;
  portfolioUrl: string;
  socials: SocialLink[];
};

export async function savePerson(input: PersonInput): Promise<{ ok: true }> {
  if (input.id !== "founder" && input.id !== "cofounder") {
    throw new Error("Unknown profile.");
  }
  const name = cleanText(input.name, 60);
  const role = cleanText(input.role, 60);
  const bio = cleanText(input.bio, 600);
  if (name.length < 2 || role.length < 2 || bio.length < 10) {
    throw new Error("Name, role, and biography all need a proper value.");
  }
  const portfolioUrl = optionalUrl(input.portfolioUrl ?? "", "Portfolio link");
  const socials = cleanSocials(input.socials ?? []);
  const sql = await getSql();
  const updated = await sql`
    update people set
      name = ${name},
      role = ${role},
      bio = ${bio},
      portfolio_url = ${portfolioUrl},
      socials = ${JSON.stringify(socials)}
    where id = ${input.id}
    returning id
  `;
  if (updated.length === 0) throw new Error("Profile was not found.");
  return { ok: true };
}

export type ServiceInput = {
  id: number;
  title: string;
  description: string;
  detailsUrl: string;
  visible: boolean;
};

export async function saveService(input: ServiceInput): Promise<{ ok: true }> {
  const title = cleanText(input.title, 80);
  const description = cleanText(input.description, 400);
  if (title.length < 2 || description.length < 10) {
    throw new Error("Each service needs a title and a description.");
  }
  const detailsUrl = optionalUrl(input.detailsUrl ?? "", "Details link");
  const sql = await getSql();
  const updated = await sql`
    update services set
      title = ${title},
      description = ${description},
      details_url = ${detailsUrl},
      visible = ${Boolean(input.visible)}
    where id = ${input.id}
    returning id
  `;
  if (updated.length === 0) throw new Error("Service was not found.");
  return { ok: true };
}

export type ProjectInput = {
  id?: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  demoUrl: string;
  githubUrl: string;
  coverData: string;
  videoUrl: string;
  published: boolean;
};

function parseProject(input: ProjectInput) {
  const title = cleanText(input.title, 80);
  const description = cleanText(input.description, 600);
  const category = cleanText(input.category ?? "", 40);
  const technologies = cleanText(input.technologies ?? "", 160);
  if (title.length < 2 || description.length < 10) {
    throw new Error("A project needs a title and a description.");
  }
  const demoUrl = optionalUrl(input.demoUrl ?? "", "Project link");
  const githubUrl = optionalUrl(input.githubUrl ?? "", "Repository link");
  const coverData = (input.coverData ?? "").trim();
  if (coverData && (!isSafeImageDataUrl(coverData) || !imageBytesLookReal(coverData))) {
    throw new Error("Cover images must be a PNG, JPG, or WebP under about 1 MB.");
  }
  const videoUrl = optionalUrl(input.videoUrl ?? "", "Video preview link");
  return {
    title,
    description,
    category,
    technologies,
    demoUrl,
    githubUrl,
    coverData,
    videoUrl,
    published: Boolean(input.published),
  };
}

export async function createProject(input: ProjectInput): Promise<{ ok: true }> {
  const project = parseProject(input);
  const sql = await getSql();
  const orderRows = await sql<{ next: number }>`
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

export async function updateProject(input: ProjectInput & { id: number }): Promise<{ ok: true }> {
  const project = parseProject(input);
  const sql = await getSql();
  const updated = await sql`
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
  `;
  if (updated.length === 0) throw new Error("Project was not found.");
  return { ok: true };
}

export async function removeProject(id: number): Promise<{ ok: true }> {
  const sql = await getSql();
  await sql`delete from projects where id = ${id}`;
  return { ok: true };
}

export async function setInquiryStatus(id: number, status: Inquiry["status"]): Promise<{ ok: true }> {
  if (status !== "new" && status !== "read" && status !== "archived") {
    throw new Error("Unknown inquiry status.");
  }
  const sql = await getSql();
  const updated = await sql`
    update inquiries set status = ${status} where id = ${id} returning id
  `;
  if (updated.length === 0) throw new Error("Inquiry was not found.");
  return { ok: true };
}

export async function removeInquiry(id: number): Promise<{ ok: true }> {
  const sql = await getSql();
  await sql`delete from inquiries where id = ${id}`;
  return { ok: true };
}
