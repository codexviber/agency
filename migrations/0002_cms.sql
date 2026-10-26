-- CodeXViber public content, projects, and contact inquiries.

create table if not exists agency_settings (
  id int primary key default 1 check (id = 1),
  name text not null,
  tagline text not null,
  hero_intro text not null,
  about_title text not null,
  about_body text not null,
  approach text not null,
  email text not null,
  phone text not null,
  location text not null,
  socials text not null default '[]',
  updated_at timestamptz not null default now()
);

create table if not exists people (
  id text primary key,
  name text not null,
  role text not null,
  accent text not null,
  bio text not null,
  portfolio_url text not null default '',
  photo_url text not null,
  socials text not null default '[]',
  sort_order int not null
);

create table if not exists services (
  id serial primary key,
  title text not null,
  description text not null,
  icon text not null,
  details_url text not null default '',
  sort_order int not null,
  visible boolean not null default true
);

create table if not exists projects (
  id serial primary key,
  title text not null,
  description text not null,
  category text not null default '',
  technologies text not null default '',
  demo_url text not null default '',
  github_url text not null default '',
  cover_data text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_idx on projects (published, sort_order desc);

create table if not exists inquiries (
  id serial primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists inquiries_status_idx on inquiries (status, created_at desc);

create table if not exists rate_limits (
  bucket text primary key,
  hits int not null,
  window_start timestamptz not null
);

insert into agency_settings (
  id, name, tagline, hero_intro, about_title, about_body, approach, email, phone, location, socials
)
select
  1,
  'CodeXViber',
  'Ideas → Code → Impact',
  $intro$CodeXViber is a small studio that turns ideas into websites, presentations, AI tools, robotics experiments, and developer workflows.$intro$,
  'Useful technology, built carefully',
  $about$We work with creators, students, startups, and businesses that want something clear and usable. The work starts from the problem in front of us — a site, a talk, a prototype, or a tool — and stays focused on that. We do not invent awards, client lists, or numbers. If a project is a studio concept, we say so.$about$,
  $approach$[{"title":"Listen","body":"We start from the problem you actually have, not a generic package."},{"title":"Build","body":"We design and develop a clear result you can show, use, and improve."},{"title":"Hand over","body":"You leave with something you understand, and room to keep growing it."}]$approach$,
  'aaditya37codex@gmail.com',
  '+91 9201109621',
  'India',
  '[]'
where not exists (select 1 from agency_settings where id = 1);

insert into people (id, name, role, accent, bio, portfolio_url, photo_url, socials, sort_order)
select 'founder', 'Aaditya', 'Founder & Developer', 'red',
  'Developer and creator interested in technology, AI, and solving real problems through thoughtful digital products.',
  '', '/founders/aaditya.png', '[]', 1
where not exists (select 1 from people where id = 'founder');

insert into people (id, name, role, accent, bio, portfolio_url, photo_url, socials, sort_order)
select 'cofounder', 'Mukund', 'Co-founder', 'blue',
  'Creative thinker focused on design, development, and turning collaborative ideas into practical solutions.',
  '', '/founders/mukund.jpg', '[]', 2
where not exists (select 1 from people where id = 'cofounder');

insert into services (title, description, icon, details_url, sort_order, visible)
select 'Website Development', 'Modern, responsive websites shaped around your goals, from the first layout to a site people can use.', 'Globe', '', 1, true
where not exists (select 1 from services);

insert into services (title, description, icon, details_url, sort_order, visible)
select 'Presentation Design', 'Clear, polished presentations that help an idea land with the people in the room.', 'Presentation', '', 2, true
where not exists (select 1 from services where title = 'Presentation Design');

insert into services (title, description, icon, details_url, sort_order, visible)
select 'AI Agent Solutions', 'Useful automations and AI-powered workflows for tasks you repeat.', 'Bot', '', 3, true
where not exists (select 1 from services where title = 'AI Agent Solutions');

insert into services (title, description, icon, details_url, sort_order, visible)
select 'Robotics Projects', 'Prototype concepts, control ideas, and hands-on experiments.', 'Cpu', '', 4, true
where not exists (select 1 from services where title = 'Robotics Projects');

insert into services (title, description, icon, details_url, sort_order, visible)
select 'Coding & Development', 'Web apps, scripts, and custom digital tools built to be understood and extended.', 'Code2', '', 5, true
where not exists (select 1 from services where title = 'Coding & Development');

insert into services (title, description, icon, details_url, sort_order, visible)
select 'Editor & Developer Tools', 'Setup, extensions, and workflow improvements that make building smoother.', 'Wrench', '', 6, true
where not exists (select 1 from services where title = 'Editor & Developer Tools');

insert into projects (title, description, category, technologies, demo_url, github_url, cover_data, published, sort_order)
select 'Agency Website', 'A studio concept for a responsive agency site. This card is an example, not a claimed client delivery.', 'Studio concept', 'Web design, Frontend', '', '', '', true, 3
where not exists (select 1 from projects where title = 'Agency Website');

insert into projects (title, description, category, technologies, demo_url, github_url, cover_data, published, sort_order)
select 'AI Assistant Concept', 'A concept for a quieter, more useful digital workflow. Not a shipped client product.', 'Studio concept', 'AI workflow', '', '', '', true, 2
where not exists (select 1 from projects where title = 'AI Assistant Concept');

insert into projects (title, description, category, technologies, demo_url, github_url, cover_data, published, sort_order)
select 'Robotics Prototype', 'An experimental robotics and automation idea from the studio. Not a completed client build.', 'Studio concept', 'Robotics, Prototyping', '', '', '', true, 1
where not exists (select 1 from projects where title = 'Robotics Prototype');
