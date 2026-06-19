# Musicloud

## General information

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

### General

The idea would be to work with the following workflow:

* SvelteKit
* Auth.js (to handle login and upload of files) [tutorial](https://authjs.dev/reference/sveltekit)
* Tailwindcss (for the design)
* SQLite (for storage of metadata) [tutorial](https://theofficialurban.medium.com/working-with-sqlite-in-sveltekit-9687e6eaf063)
* Drizzle for the ORM (interface with the database) [tutorial](https://svelte.dev/docs/cli/drizzle) [tutorial2](https://fullstacksveltekit.com/blog/sveltekit-sqlite-drizzle)
* Local storage (for the music storage)
* WaveSurfer.js (for the waveform of the sound)

### Handling the database

The database schemes are found in `src/lib/server/db/schema.ts` and once updated, the workflow is:
1. `npm run db:generate` to generate the migration files
2. `npm run db:migrate` to migrate to apply the migration

A fast forward, but not recommended option is to use `npm run db:push` which ignores the previously mentioned commands.

The general methods to access the db are in `src/lib/server/db/filename.ts` where filename corresponds to the object.

### Deploy

Look here to deploy the website: [adapter-node](https://svelte.dev/docs/kit/adapter-node).
