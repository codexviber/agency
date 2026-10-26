import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import {
  createProject,
  deleteInquiry,
  deleteProject,
  getAdminBundle,
  updateAgency,
  updateInquiry,
  updatePerson,
  updateProject,
  updateService,
} from "@/lib/cms.functions";
import type { AdminBundle, ApproachStep, Inquiry, Person, Project, Service, SocialLink } from "@/lib/cms-types";
import { LogoMark } from "./logo-mark";

type Tab = "overview" | "agency" | "people" | "services" | "projects" | "messages" | "password";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "agency", label: "Agency" },
  { id: "people", label: "People" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "messages", label: "Messages" },
  { id: "password", label: "Password" },
];

const fieldClass = "min-h-12 w-full rounded-xl border border-paper-line bg-white px-3 text-paper-fg";

function errorText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Try again.";
}

async function readCover(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Use a PNG, JPG, or WebP image.");
  }
  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that image.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const url = canvas.toDataURL("image/jpeg", 0.82);
  if (url.length > 1_100_000) throw new Error("That image is still too large. Try a smaller photo.");
  return url;
}

async function createAutoCover(title: string, description: string): Promise<string> {
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
    } else {
      line = candidate;
    }
  }
  if (line) context.fillText(line, 92, y);
  context.fillStyle = "#b6c0cf";
  context.font = "400 28px sans-serif";
  context.fillText(description.trim().slice(0, 72), 92, 650);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [bundle, setBundle] = useState<AdminBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminBundle()
      .then((next) => {
        if (!cancelled) {
          setBundle(next);
          setError("");
        }
      })
      .catch((caught) => {
        if (!cancelled) setError(errorText(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function saved(text: string) {
    setNotice(text);
    setError("");
    setReloadKey((value) => value + 1);
  }

  return (
    <div className="min-h-screen bg-paper text-paper-fg scheme-light">
      <header className="bg-ink text-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <span>
              <span className="block font-display text-xl leading-none">CodeXViber</span>
              <span className="text-xs text-muted">Admin</span>
            </span>
          </Link>
          <UserButton />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-4xl tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper-muted">
          Changes here are saved for the public site. Founder photographs stay locked to the real portraits.
        </p>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Admin sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTab(item.id);
                setNotice("");
              }}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
                tab === item.id ? "bg-ink text-fg" : "border border-paper-line bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {notice ? (
          <p role="status" className="mt-4 rounded-xl border border-paper-line bg-white px-4 py-3 text-sm">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red bg-white px-4 py-3 text-sm text-red">
            {error}
          </p>
        ) : null}
        {loading && !bundle ? <p className="mt-8 text-paper-muted">Loading the studio data…</p> : null}
        {bundle ? (
          <div className="mt-6">
            {tab === "overview" ? <Overview bundle={bundle} /> : null}
            {tab === "agency" ? (
              <AgencyForm
                bundle={bundle}
                onSaved={() => saved("Agency details saved.")}
                onError={setError}
              />
            ) : null}
            {tab === "people" ? (
              <PeopleForm
                people={bundle.people}
                onSaved={() => saved("Profile saved.")}
                onError={setError}
              />
            ) : null}
            {tab === "services" ? (
              <ServicesForm
                services={bundle.allServices}
                onSaved={() => saved("Service saved.")}
                onError={setError}
              />
            ) : null}
            {tab === "projects" ? (
              <ProjectsForm
                projects={bundle.allProjects}
                onSaved={(text) => saved(text)}
                onError={setError}
              />
            ) : null}
            {tab === "messages" ? (
              <Messages
                inquiries={bundle.inquiries}
                onSaved={(text) => saved(text)}
                onError={setError}
              />
            ) : null}
            {tab === "password" ? <PasswordForm onError={setError} onSaved={setNotice} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Overview({ bundle }: { bundle: AdminBundle }) {
  const cards = [
    ["Published projects", bundle.counts.publishedProjects],
    ["Draft projects", bundle.counts.draftProjects],
    ["New messages", bundle.counts.newInquiries],
    ["Visible services", bundle.counts.services],
  ] as const;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-paper-line bg-white p-5">
            <p className="text-sm text-paper-muted">{label}</p>
            <p className="mt-2 font-display text-4xl tabular-nums">{value}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm leading-relaxed text-paper-muted">
        The public site shows published projects only. Open the site in another tab to preview before you share it.
      </p>
      <Link to="/" className="mt-4 inline-flex min-h-11 items-center font-semibold">
        View public website
      </Link>
    </div>
  );
}

function SocialEditor({
  value,
  onChange,
}: {
  value: SocialLink[];
  onChange: (next: SocialLink[]) => void;
}) {
  const rows = value.length > 0 ? value : [{ label: "", url: "" }];
  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold">Social links</p>
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-2">
          <input
            aria-label="Social label"
            placeholder="Label"
            value={row.label}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...row, label: event.target.value };
              onChange(next);
            }}
            className={fieldClass}
          />
          <input
            aria-label="Social URL"
            placeholder="https://"
            value={row.url}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...row, url: event.target.value };
              onChange(next);
            }}
            className={fieldClass}
          />
        </div>
      ))}
      {rows.length < 5 ? (
        <button
          type="button"
          className="justify-self-start text-sm font-semibold"
          onClick={() => onChange([...rows, { label: "", url: "" }])}
        >
          Add a link
        </button>
      ) : null}
    </div>
  );
}

function AgencyForm({
  bundle,
  onSaved,
  onError,
}: {
  bundle: AdminBundle;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const [tagline, setTagline] = useState(bundle.agency.tagline);
  const [heroIntro, setHeroIntro] = useState(bundle.agency.heroIntro);
  const [aboutTitle, setAboutTitle] = useState(bundle.agency.aboutTitle);
  const [aboutBody, setAboutBody] = useState(bundle.agency.aboutBody);
  const [approach, setApproach] = useState<ApproachStep[]>(bundle.agency.approach);
  const [email, setEmail] = useState(bundle.agency.email);
  const [phone, setPhone] = useState(bundle.agency.phone);
  const [location, setLocation] = useState(bundle.agency.location);
  const [socials, setSocials] = useState<SocialLink[]>(bundle.agency.socials);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await updateAgency({
        data: { tagline, heroIntro, aboutTitle, aboutBody, approach, email, phone, location, socials },
      });
      onSaved();
    } catch (caught) {
      onError(errorText(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid max-w-3xl gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Tagline
        <input className={fieldClass} value={tagline} onChange={(event) => setTagline(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Introduction
        <textarea className={`${fieldClass} min-h-28 py-3`} value={heroIntro} onChange={(event) => setHeroIntro(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        About title
        <input className={fieldClass} value={aboutTitle} onChange={(event) => setAboutTitle(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        About text
        <textarea className={`${fieldClass} min-h-36 py-3`} value={aboutBody} onChange={(event) => setAboutBody(event.target.value)} />
      </label>
      {approach.map((step, index) => (
        <div key={index} className="grid gap-2 rounded-2xl border border-paper-line bg-white p-4">
          <label className="grid gap-2 text-sm font-medium">
            Step title
            <input
              className={fieldClass}
              value={step.title}
              onChange={(event) => {
                const next = [...approach];
                next[index] = { ...step, title: event.target.value };
                setApproach(next);
              }}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Step description
            <textarea
              className={`${fieldClass} min-h-24 py-3`}
              value={step.body}
              onChange={(event) => {
                const next = [...approach];
                next[index] = { ...step, body: event.target.value };
                setApproach(next);
              }}
            />
          </label>
        </div>
      ))}
      <label className="grid gap-2 text-sm font-medium">
        Public email
        <input className={fieldClass} value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Public phone
        <input className={fieldClass} value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Location
        <input className={fieldClass} value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>
      <SocialEditor value={socials} onChange={setSocials} />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60">
        {pending ? "Saving…" : "Save agency details"}
      </button>
    </form>
  );
}

function PeopleForm({
  people,
  onSaved,
  onError,
}: {
  people: Person[];
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="grid gap-6">
      {people.map((person) => (
        <PersonEditor key={person.id} person={person} onSaved={onSaved} onError={onError} />
      ))}
    </div>
  );
}

function PersonEditor({
  person,
  onSaved,
  onError,
}: {
  person: Person;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const [name, setName] = useState(person.name);
  const [role, setRole] = useState(person.role);
  const [bio, setBio] = useState(person.bio);
  const [portfolioUrl, setPortfolioUrl] = useState(person.portfolioUrl);
  const [socials, setSocials] = useState<SocialLink[]>(person.socials);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await updatePerson({ data: { id: person.id, name, role, bio, portfolioUrl, socials } });
      onSaved();
    } catch (caught) {
      onError(errorText(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-paper-line bg-white p-5" onSubmit={onSubmit}>
      <div className="flex items-center gap-4">
        <img
          src={person.photoUrl}
          alt=""
          className={`h-20 w-20 rounded-xl object-cover ${person.accent === "red" ? "object-top" : "object-center"}`}
        />
        <div>
          <h2 className="text-xl font-semibold">{person.name}</h2>
          <p className="text-sm text-paper-muted">Portrait is fixed so the right photo stays with the right person.</p>
        </div>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Name
        <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Role
        <input className={fieldClass} value={role} onChange={(event) => setRole(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Biography
        <textarea className={`${fieldClass} min-h-28 py-3`} value={bio} onChange={(event) => setBio(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Portfolio URL
        <input className={fieldClass} value={portfolioUrl} placeholder="https://" onChange={(event) => setPortfolioUrl(event.target.value)} />
      </label>
      <SocialEditor value={socials} onChange={setSocials} />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function ServicesForm({
  services,
  onSaved,
  onError,
}: {
  services: Service[];
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <ServiceEditor key={service.id} service={service} onSaved={onSaved} onError={onError} />
      ))}
    </div>
  );
}

function ServiceEditor({
  service,
  onSaved,
  onError,
}: {
  service: Service;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [detailsUrl, setDetailsUrl] = useState(service.detailsUrl);
  const [visible, setVisible] = useState(service.visible);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await updateService({ data: { id: service.id, title, description, detailsUrl, visible } });
      onSaved();
    } catch (caught) {
      onError(errorText(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-3 rounded-2xl border border-paper-line bg-white p-5" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Title
        <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Description
        <textarea className={`${fieldClass} min-h-24 py-3`} value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Details link
        <input className={fieldClass} value={detailsUrl} placeholder="Optional https://" onChange={(event) => setDetailsUrl(event.target.value)} />
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
        <input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} />
        Show on the public site
      </label>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60">
        {pending ? "Saving…" : "Save service"}
      </button>
    </form>
  );
}

type ProjectDraft = {
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

function blankProject(): ProjectDraft {
  return {
    title: "",
    description: "",
    category: "",
    technologies: "",
    demoUrl: "",
    githubUrl: "",
    coverData: "",
    videoUrl: "",
    published: false,
  };
}

function ProjectsForm({
  projects,
  onSaved,
  onError,
}: {
  projects: Project[];
  onSaved: (text: string) => void;
  onError: (message: string) => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>(blankProject);
  const [pending, setPending] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function edit(project: Project) {
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
      published: project.published,
    });
    setConfirmId(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const coverData = draft.coverData || (await createAutoCover(draft.title, draft.description));
      const payload = { ...draft, coverData };
      if (draft.id) {
        await updateProject({ data: { ...payload, id: draft.id } });
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

  async function remove(id: number) {
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid content-start gap-3">
        <button type="button" className="justify-self-start text-sm font-semibold" onClick={() => setDraft(blankProject())}>
          New project
        </button>
        {projects.map((project) => (
          <article key={project.id} className="rounded-2xl border border-paper-line bg-white p-4">
            <div className="flex gap-3">
              {project.coverData ? (
                <img src={project.coverData} alt="" className="h-16 w-24 rounded-lg object-cover" />
              ) : (
                <div className="grid h-16 w-24 place-items-center rounded-lg bg-paper font-display text-2xl">{project.title.slice(0, 1)}</div>
              )}
              <div className="min-w-0">
                <h2 className="font-semibold">{project.title}</h2>
                <p className="text-sm text-paper-muted">{project.published ? "Published" : "Draft"}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="min-h-11 rounded-full border border-paper-line px-4 text-sm" onClick={() => edit(project)}>
                Edit
              </button>
              {confirmId === project.id ? (
                <button type="button" className="min-h-11 rounded-full bg-ink px-4 text-sm text-fg" onClick={() => remove(project.id)}>
                  Confirm delete
                </button>
              ) : (
                <button type="button" className="min-h-11 rounded-full border border-paper-line px-4 text-sm" onClick={() => setConfirmId(project.id)}>
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <form className="grid content-start gap-3 rounded-2xl border border-paper-line bg-white p-5" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold">{draft.id ? "Edit project" : "Add project"}</h2>
        <p className="text-sm leading-relaxed text-paper-muted">
          Add the project name, what it is about, and a link. If you do not upload an image, a preview is generated automatically.
        </p>
        <label className="grid gap-2 text-sm font-medium">
          Project name
          <input className={fieldClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          About the project
          <textarea className={`${fieldClass} min-h-28 py-3`} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Category
          <input className={fieldClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Technologies
          <input className={fieldClass} value={draft.technologies} onChange={(event) => setDraft({ ...draft, technologies: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Project link
          <input className={fieldClass} value={draft.demoUrl} placeholder="https://" onChange={(event) => setDraft({ ...draft, demoUrl: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Optional video preview link
          <input className={fieldClass} value={draft.videoUrl} placeholder="https://example.com/project-preview.mp4" onChange={(event) => setDraft({ ...draft, videoUrl: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Repository URL
          <input className={fieldClass} value={draft.githubUrl} placeholder="https://" onChange={(event) => setDraft({ ...draft, githubUrl: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Cover image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="text-sm"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const coverData = await readCover(file);
                setDraft((current) => ({ ...current, coverData }));
              } catch (caught) {
                onError(errorText(caught));
              }
            }}
          />
        </label>
        {draft.coverData ? (
          <img src={draft.coverData} alt="Project cover preview" className="aspect-video w-full rounded-xl object-cover" />
        ) : null}
        <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
          />
          Published on the public site
        </label>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60">
          {pending ? "Saving…" : draft.id ? "Save project" : "Add project"}
        </button>
      </form>
    </div>
  );
}

function Messages({
  inquiries,
  onSaved,
  onError,
}: {
  inquiries: Inquiry[];
  onSaved: (text: string) => void;
  onError: (message: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | Inquiry["status"]>("all");
  const visible = inquiries.filter((item) => filter === "all" || item.status === filter);

  async function setStatus(id: number, status: Inquiry["status"]) {
    try {
      await updateInquiry({ data: { id, status } });
      onSaved("Message updated.");
    } catch (caught) {
      onError(errorText(caught));
    }
  }

  async function remove(id: number) {
    try {
      await deleteInquiry({ data: { id } });
      onSaved("Message deleted.");
    } catch (caught) {
      onError(errorText(caught));
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "read", "archived"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold capitalize ${
              filter === item ? "bg-ink text-fg" : "border border-paper-line bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? <p className="text-sm text-paper-muted">No messages in this view.</p> : null}
      {visible.map((item) => (
        <article key={item.id} className="rounded-2xl border border-paper-line bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">{item.subject}</h2>
            <p className="text-xs text-paper-muted uppercase">{item.status}</p>
          </div>
          <p className="mt-1 text-sm text-paper-muted">
            {item.name} · {item.email}
          </p>
          <p className="mt-3 leading-relaxed">{item.message}</p>
          <p className="mt-2 text-xs text-paper-muted">{item.createdAt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="min-h-11 rounded-full border border-paper-line px-4 text-sm" onClick={() => setStatus(item.id, "read")}>
              Mark read
            </button>
            <button type="button" className="min-h-11 rounded-full border border-paper-line px-4 text-sm" onClick={() => setStatus(item.id, "archived")}>
              Archive
            </button>
            <button type="button" className="min-h-11 rounded-full border border-paper-line px-4 text-sm" onClick={() => remove(item.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function PasswordForm({
  onSaved,
  onError,
}: {
  onSaved: (text: string) => void;
  onError: (message: string) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
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
      revokeOtherSessions: false,
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

  return (
    <form className="grid max-w-md gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Current password
        <input type="password" className={fieldClass} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        New password
        <input type="password" className={fieldClass} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Confirm new password
        <input type="password" className={fieldClass} value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </label>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-fg disabled:opacity-60">
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
