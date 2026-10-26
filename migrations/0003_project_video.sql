-- Optional video preview for portfolio projects.

alter table projects
  add column if not exists video_url text not null default '';
