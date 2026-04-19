# My Second Brain App

Lightweight full-stack app inspired by Notion/Obsidian with PARA structure:
- Projects
- Areas
- Resources
- Archives

## Features

- Account registration and login
- Create/edit/delete notes
- PARA category for every note
- Search notes by title/content
- Automatic sync every few seconds
- "Report issue" form sent to developer inbox file
- Responsive UI for desktop and phone browsers

## Run

Portable Node.js is already included in `tools/node`.

1. Open `D:\05 dowloads\my_app`
2. Quick start (works from any internet):

```bat
go-online.cmd
```

This does everything in one step:
- installs dependencies if needed
- starts local server
- opens Cloudflare tunnel
- prints public `https://...trycloudflare.com` URL in terminal
- makes the same link available inside app UI (`Share website` -> `Copy link`)

Your friends can open the public link and register/login with their own accounts.

3. For manual setup, first install dependencies:

```bat
install.cmd
```

4. Start server (private mode, only this laptop):

```bat
start.cmd
```

5. Open [http://127.0.0.1:4000](http://127.0.0.1:4000)

To open from phone in same Wi-Fi, use:

```bat
start-lan.cmd
```

To open from any network (public internet URL), use:

```bat
start-public.cmd
```

This uses a Cloudflare tunnel and prints a public `https://...trycloudflare.com` URL in the terminal.

## Permanent link (without your PC running)

If you want one clean URL that works 24/7 (friends can open it even when your app is closed on laptop), deploy to Render:

1. Push this project to GitHub (new repo).
2. Open [https://render.com](https://render.com) -> New -> Blueprint.
3. Select your repo. Render will use `render.yaml` automatically.
4. Wait for deploy and open your permanent URL:

`https://my-second-brain.onrender.com` (or similar)

After this, share the Render URL with friends. They can register/login directly there.

## Privacy and security

- Default startup is private (`127.0.0.1`), LAN access is opt-in via `start-lan.cmd`
- Public internet access is opt-in via `start-public.cmd` (temporary tunnel URL)
- Passwords are stored as secure hashes (`bcrypt`)
- Optional encryption at rest for `server/data.json` and `server/issues.json`
- Basic anti-bruteforce rate limiting for auth and feedback APIs
- Security headers are enabled (no-store, nosniff, deny frame embedding, CSP, Permissions-Policy)
- Live updates use a **short-lived SSE token** (`POST /api/events-token` with Bearer; `EventSource` uses that token in the query string so the long-lived login JWT is not exposed there)
- Soft-deleted notes can be **restored** via `POST /api/notes/:id/restore`

Enable encryption at rest (recommended):

```bat
set APP_ENCRYPTION_KEY=your_long_secret_here
start.cmd
```

## Default behavior

- Data is stored in `server/data.json`
- Reported issues are stored in `server/issues.json`
- JWT secret can be changed via env:

```bash
set JWT_SECRET=my_super_secret
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `GET /api/sync?since=<unix_ms>`
- `POST /api/events-token` (Bearer) — short-lived token for `EventSource`
- `GET /api/events?token=<sse_jwt>` (SSE)
- `POST /api/notes/:id/restore`
- `POST /api/feedback`

