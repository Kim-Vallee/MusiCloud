# Musicloud

## General information

The idea behind this website is to create a lightweight alternative to soundcloud that would be self hosted as a sort of portfolio. It should have the following features:
* Interface to add / remove / update music
* Media with a lot of metadata such as:
  * Time of creation
  * Time of upload
  * Title
  * Author
  * BPM
  * Style
  * Setup (Guitar, amp, etc...)
  * Description
  * Tags
* A nice waveform interface for the sounds
* A research possibility
* A tagging system

## Coding stack

### Requirements

The app requires NodeJS and ffprobe:

- [NodeJS](https://nodejs.org/en/download)
- [ffprobe (ffmpeg)](https://ffmpeg.org/download.html)

### Workflow

* SvelteKit
* Better auth (to handle login and upload of files) [tutorial installation](https://better-auth.com/docs/installation), (tutorial github)[https://better-auth.com/docs/authentication/github], (tutorial sveltekit)[https://better-auth.com/docs/integrations/svelte-kit]
* Tailwindcss (for the design)
* SQLite (for storage of metadata) [tutorial](https://theofficialurban.medium.com/working-with-sqlite-in-sveltekit-9687e6eaf063)
* Drizzle for the ORM (interface with the database) [tutorial](https://svelte.dev/docs/cli/drizzle) [tutorial2](https://fullstacksveltekit.com/blog/sveltekit-sqlite-drizzle)
* WaveSurfer.js (for the waveform of the sound)

### Handling the database

The database schemes are found in `src/lib/server/db/schema.ts` and once updated, the procedure to generate migrations is:
1. `npm run db:generate` to generate the migration files
2. `npm run db:migrate` to migrate to apply the migration

A fast forward, but not recommended option is to use `npm run db:push` which ignores the previously mentioned commands and directly applies the update, only useful in dev mode.

The general methods to access the db are in `src/lib/server/db/filename.ts` where filename corresponds to the object.

### Deploy

First set the `.env` file with the following parameters:
```
# Drizzle
DATABASE_URL=local.db

# Better-auth
BETTER_AUTH_SECRET=my_super_secret
BETTER_AUTH_URL=http://localhost:5173/

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

The better auth secret can be generated with the command `openssl rand -base64 32`. The better auth url should be changed according to the site as well.

Look here to deploy the website: [adapter-node](https://svelte.dev/docs/kit/adapter-node).
