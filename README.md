# The Resistance

A pass-and-play implementation of [The Resistance](<https://en.wikipedia.org/wiki/The_Resistance_(game)>) board game, with the rules that my friends and I know baked in. Built with SvelteKit, TypeScript, and Tailwind CSS. Deployed to Cloudflare Pages.

Play here: [https://resistance.sambenemerito.com](https://resistance.sambenemerito.com)

This is a toy app for playing the game with friends on a single device. No accounts, no server: just open it up and pass the phone around.

Supports 5–10 players with role reveal, team selection, mission voting, spy guessing, and optional turn timers.

It's also a PWA: install it to your home screen for offline play, no internet required after the first load.

Online multiplayer might happen someday, but there are no concrete plans for it.

## Dev

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```
