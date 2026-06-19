# Musicloud

## General information

The idea behind this website is to create a lightweight alternative to soundcloud that would be self hosted as a sort of portfolio. It should have the following features:
* Interface to add / remove / update music
* Media with a lot of metadata such as:
  * Time of creation
  * Time of upload
  * BPM
  * Style
  * Setup (Guitar, amp, etc...)
  * Description
* A nice waveform interface for the sounds
* A research possibility
* A tagging system

## Coding stack

The idea would be to work with the following workflow:

* SvelteKit
* Auth.js (to handle login and upload of files)
* Tailwindcss (for the design)
* SQLite (for storage of metadata)
* Local storage (for the music storage)
* WaveSurfer.js (for the waveform of the sound)

## Deploy

Look here to deploy the website: [adapter-node](https://svelte.dev/docs/kit/adapter-node).
