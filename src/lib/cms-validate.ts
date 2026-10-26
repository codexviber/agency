import type { ApproachStep, SocialLink } from "./cms-types";

export function cleanText(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

export function isEmail(value: string): boolean {
  return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string): boolean {
  return /^\+?[0-9][0-9 \-]{6,18}$/.test(value);
}

export function isSafeHttpUrl(value: string): boolean {
  if (!value || value.length > 500) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Empty is allowed. Otherwise a bounded PNG, JPEG, or WebP data URL. */
export function isSafeImageDataUrl(value: string): boolean {
  if (!value) return true;
  if (value.length > 1_200_000) return false;
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(value);
}

export function cleanSocials(input: SocialLink[]): SocialLink[] {
  const out: SocialLink[] = [];
  for (const item of input.slice(0, 5)) {
    const label = cleanText(item.label ?? "", 40);
    const url = (item.url ?? "").trim();
    if (!label && !url) continue;
    if (!label || !isSafeHttpUrl(url)) {
      throw new Error("Social links need a label and an http(s) URL.");
    }
    out.push({ label, url });
  }
  return out;
}

export function cleanApproach(input: ApproachStep[]): ApproachStep[] {
  const out = input.slice(0, 4).map((step) => ({
    title: cleanText(step.title ?? "", 40),
    body: cleanText(step.body ?? "", 280),
  }));
  if (out.length < 1 || out.some((step) => !step.title || !step.body)) {
    throw new Error("Each working step needs a title and a short description.");
  }
  return out;
}

export function optionalUrl(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!isSafeHttpUrl(trimmed)) {
    throw new Error(`${label} must be a full http(s) link, or left blank.`);
  }
  return trimmed;
}

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function parseContact(input: ContactInput): ContactInput {
  const name = cleanText(input.name ?? "", 80);
  const email = (input.email ?? "").trim().toLowerCase();
  const subject = cleanText(input.subject ?? "", 140);
  const message = cleanText(input.message ?? "", 4000);
  if (name.length < 2) throw new Error("Enter your name.");
  if (!isEmail(email)) throw new Error("Enter a valid email address.");
  if (subject.length < 2) throw new Error("Enter a subject.");
  if (message.length < 10) throw new Error("Tell us a little more about the project (at least a sentence).");
  return { name, email, subject, message };
}
