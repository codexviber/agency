# CodeXViber

Studio website for CodeXViber: public pages plus a private administrator dashboard.

## Stack

- TanStack Start, React, and Tailwind
- Better Auth email and password for the administrator
- PostgreSQL (the connected Neon database). There is no temporary local database.

## PostgreSQL setup

The application schema and queries are PostgreSQL-based. For a deployed website, create a PostgreSQL database and set its connection string as the server environment variable:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

At startup, the application runs the SQL migrations in `migrations/` when `DATABASE_URL` is set, including the Better Auth tables, agency content, services, projects, optional project video previews, inquiries, and login/contact rate limits. The app uses that PostgreSQL database for both authentication and website content. Do not commit the connection string to source control.

## Administrator

The address `admin1234@.com` is not a valid email, so the provisioned account is:

- Email: `admin1234@codexviber.com`
- Initial password: `admin1234`

The account is created the first time the site loads. It is not created again after that, so a changed password stays changed on the published database. Change it from Admin → Password before sharing the site widely.

Only that email can call administrator actions. Other sign-ins, including a signed-in viewer, cannot edit content.

## What is saved

- Agency copy, contact details, and social links
- Founder biographies and portfolio links (photographs stay the uploaded portraits)
- The six services
- Projects, including cover images stored in the database
- Contact form inquiries

Messages are stored for the administrator. They are not emailed anywhere.

## Security notes

- Passwords are hashed. The initial password exists only so the requested account can sign in the first time.
- Administrator routes check the signed-in account on the server.
- Contact and sign-in attempts are rate limited per connection.
- Project images must be PNG, JPG, or WebP and are size-limited.
- Links must be `http` or `https`.

Public sign-up is not offered in the interface. If another account is created through the auth API, it still cannot administer the site.

## Content

Sample projects are labeled “Studio concept” and are not claimed client work. Delete or unpublish them from the dashboard when real projects are ready.

Founder photographs:

- Aaditya — `public/founders/aaditya.png`
- Mukund — `public/founders/mukund.jpg`
- Logo — `public/brand/logo.png`
