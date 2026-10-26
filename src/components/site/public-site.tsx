import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  Code2,
  Cpu,
  Globe,
  Menu,
  Presentation,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { submitInquiry } from "@/lib/cms.functions";
import type { Person, Project, PublicSite, Service } from "@/lib/cms-types";
import { isEmail } from "@/lib/cms-validate";
import { BootScreen } from "./boot-screen";
import { LogoMark } from "./logo-mark";

const ICONS: Record<string, LucideIcon> = {
  Globe,
  Presentation,
  Bot,
  Cpu,
  Code2,
  Wrench,
};

const NAV = [
  { href: "#about", label: "About" },
  { href: "#founders", label: "Founders" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function errorText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function PublicSite({ site }: { site: PublicSite }) {
  const { agency, people, services, projects } = site;
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactNote, setContactNote] = useState("");

  async function onContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
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
      const result = await submitInquiry({ data: payload });
      if (!result?.ok) throw new Error("The message was not saved.");
      form.reset();
      setContactState("sent");
      setContactNote("Message received. We will read it in the studio inbox.");
    } catch (error) {
      setContactState("error");
      setContactNote(errorText(error));
    }
  }

  return (
    <div className="min-h-screen bg-ink text-fg">
      <BootScreen />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-40 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <span>
              <span className="block font-display text-xl leading-none tracking-tight">
                Code<span className="text-blue">X</span>Viber
              </span>
              <span className="mt-1 hidden text-xs text-muted sm:block">{agency.tagline}</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-muted hover:text-fg">
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center rounded-full border border-blue px-4 text-sm font-semibold text-fg"
            >
              Start a project
            </a>
          </nav>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
        {menuOpen ? (
          <nav id="site-menu" className="border-t border-line px-5 py-2 md:hidden" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center text-base"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="main">
        <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-cyan uppercase">Digital studio</p>
            <h1 className="mt-4 font-display text-5xl leading-none tracking-tight sm:text-7xl">
              {agency.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{agency.heroIntro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#services" className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue px-5 font-semibold text-ink">
                Services
              </a>
              <a href="#projects" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 font-semibold">
                Projects
              </a>
              <a href="#contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 font-semibold">
                Contact
              </a>
            </div>
          </div>
          <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center overflow-hidden rounded-3xl border border-line bg-ink-2">
            <div className="absolute inset-8 rounded-full border border-blue animate-orbit" />
            <div className="absolute inset-16 rounded-full border border-cyan animate-orbit-rev" />
            <div className="relative z-10 text-center">
              <LogoMark className="mx-auto h-28 w-28" />
              <p className="mt-3 text-xs font-semibold tracking-widest text-cyan uppercase">CodeXViber</p>
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-line bg-ink-2">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-widest text-cyan uppercase">About the agency</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight">{agency.aboutTitle}</h2>
              <p className="mt-4 leading-relaxed text-muted">{agency.aboutBody}</p>
            </div>
            <ol className="grid gap-4">
              {agency.approach.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-line bg-panel p-5">
                  <p className="text-sm font-semibold text-blue">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="founders" className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-semibold tracking-widest text-cyan uppercase">The people behind the work</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">Founders</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Two different strengths, one shared aim: build digital work that is useful and clear.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>

        <section id="services" className="border-y border-line bg-ink-2">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-semibold tracking-widest text-cyan uppercase">What we do</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Services</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Flexible digital services for creators, students, startups, and businesses.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="bg-wine">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-semibold tracking-widest text-red uppercase">Selected work</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Projects</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Published work appears here. Studio concepts are labeled as concepts — they are not presented as finished client jobs.
            </p>
            {projects.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-red/40 bg-ink p-6 text-muted">
                No published projects yet.
              </p>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted uppercase">Start a conversation</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight">Contact {agency.name}</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Have a project idea, a collaboration, or a question? Send a message and tell us what you would like to build.
              </p>
              <dl className="mt-6 space-y-2 text-sm">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a className="font-semibold" href={`mailto:${agency.email}`}>{agency.email}</a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    <a className="font-semibold" href={telHref(agency.phone)}>{agency.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="font-semibold">{agency.location}</dd>
                </div>
              </dl>
            </div>
            <form className="grid gap-4" onSubmit={onContact} noValidate>
              <label className="grid gap-2 text-sm font-medium">
                Name
                <input name="name" autoComplete="name" required className="min-h-12 rounded-xl border border-line bg-ink-2 px-4" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input name="email" type="email" autoComplete="email" required className="min-h-12 rounded-xl border border-line bg-ink-2 px-4" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Subject
                <input name="subject" required className="min-h-12 rounded-xl border border-line bg-ink-2 px-4" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Message
                <textarea name="message" required rows={5} className="rounded-xl border border-line bg-ink-2 px-4 py-3" />
              </label>
              <button
                type="submit"
                disabled={contactState === "sending"}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-fg px-5 font-semibold text-ink disabled:opacity-60"
              >
                {contactState === "sending" ? "Sending…" : "Send message"}
              </button>
              {contactNote ? (
                <p role="status" className={contactState === "error" ? "text-sm text-red" : "text-sm text-cyan"}>
                  {contactNote}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10" />
              <span className="font-display text-lg">{agency.name}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{agency.tagline}</p>
          </div>
          <nav className="grid content-start gap-2 text-sm" aria-label="Footer">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-muted hover:text-fg">
                {item.label}
              </a>
            ))}
            <Link to="/admin" className="font-semibold text-fg hover:text-cyan">
              Login
            </Link>
          </nav>
          <div className="text-sm">
            <a className="block text-muted hover:text-fg" href={`mailto:${agency.email}`}>{agency.email}</a>
            <a className="mt-1 block text-muted hover:text-fg" href={telHref(agency.phone)}>{agency.phone}</a>
            <p className="mt-1 text-muted">{agency.location}</p>
            {agency.socials.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {agency.socials.map((social) => (
                  <li key={social.url}>
                    <a className="text-cyan hover:text-fg" href={social.url} rel="noreferrer" target="_blank">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <p className="border-t border-line px-5 py-4 text-center text-xs text-muted">
          © {new Date().getFullYear()} {agency.name}
        </p>
      </footer>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  const red = person.accent === "red";
  return (
    <article className={`rounded-2xl border bg-panel p-5 sm:p-6 ${red ? "border-red" : "border-blue"}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={person.photoUrl}
          alt={`Portrait of ${person.name}, ${person.role} of CodeXViber`}
          width={640}
          height={800}
          loading="lazy"
          className={`aspect-square w-full rounded-xl border object-cover sm:w-44 sm:shrink-0 ${
            red ? "border-red object-top" : "border-blue object-center"
          }`}
        />
        <div className="min-w-0">
          <h3 className="font-display text-3xl tracking-tight">{person.name}</h3>
          <p className={`mt-1 text-sm font-semibold tracking-wide uppercase ${red ? "text-red" : "text-cyan"}`}>
            {person.role}
          </p>
          <p className="mt-3 leading-relaxed text-muted">{person.bio}</p>
          {person.portfolioUrl ? (
            <a className="mt-4 inline-flex min-h-11 items-center font-semibold text-fg" href={person.portfolioUrl} rel="noreferrer" target="_blank">
              Portfolio
            </a>
          ) : null}
          {person.socials.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {person.socials.map((social) => (
                <li key={social.url}>
                  <a className="text-sm text-cyan" href={social.url} rel="noreferrer" target="_blank">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Code2;
  return (
    <article className="rounded-2xl border border-cyan bg-panel p-5 transition hover:-translate-y-1">
      <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan text-cyan">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{service.description}</p>
      {service.detailsUrl ? (
        <a className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-cyan" href={service.detailsUrl} rel="noreferrer" target="_blank">
          Details
        </a>
      ) : null}
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-red bg-ink">
      {project.videoUrl ? (
        <video
          src={project.videoUrl}
          controls
          muted
          loop
          playsInline
          poster={project.coverData || undefined}
          className="aspect-video w-full object-cover"
        />
      ) : project.coverData ? (
        <img
          src={project.coverData}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="grid aspect-video place-items-center bg-wine font-display text-5xl text-red" aria-hidden="true">
          {project.title.slice(0, 1)}
        </div>
      )}
      <div className="p-5">
        {project.category ? (
          <p className="text-xs font-semibold tracking-wide text-red uppercase">{project.category}</p>
        ) : null}
        <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{project.description}</p>
        {project.technologies ? <p className="mt-3 text-sm text-muted">{project.technologies}</p> : null}
        <div className="mt-3 flex flex-wrap gap-4">
          {project.demoUrl ? (
            <a className="inline-flex min-h-11 items-center text-sm font-semibold" href={project.demoUrl} rel="noreferrer" target="_blank">
              View project
            </a>
          ) : null}
          {project.githubUrl ? (
            <a className="inline-flex min-h-11 items-center text-sm font-semibold text-muted" href={project.githubUrl} rel="noreferrer" target="_blank">
              Repository
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
