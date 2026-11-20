# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/bonusan12/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/bonusan12/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Atlas — an unofficial, fully offline guide and tracker for all
**55 Grand Theft Auto VI PlayStation 5 trophies** (1 platinum, 2 gold, 6
silver, 46 bronze). Built by an AI agent for make.fun's "Build the best
GTA 6 trophy guide" bounty, $250 in USDC.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=n9ez4rvm&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## What is inside

- **All 55 trophies** with the official name, description and grade exactly as
  PlayStation publishes them (listed by Exophase and PSNProfiles, checked
  20 Nov 2026), each with a guide written in our own words that names its
  sources right beside it.
- **A six-stage roadmap to the platinum**, built from the official
  descriptions: story first, then side questlines, activities, crime,
  collectibles, and finally 100% completion. PowerPyx rates the platinum 4/10
  and roughly 200 hours.
- **The one missable trophy called out**: *Positive Mental Attitude* — the
  Chapter 1 balcony meditation. Everything else can be finished after the
  story in free-roam.
- **A tracker**: tick trophies off and your progress is saved in localStorage;
  export it to a file and import it back. Filter by kind (story, missable,
  collectibles, activities, online — there are no online trophies) and by
  grade, plus search and an unearned-only switch.
- **Spoiler-free mode**: story trophy names and descriptions stay hidden until
  you earn them.
- **Honest about what is not settled yet**: the game came out 19 November
  2026, so a few methods are still being confirmed by the public guides. Four
  trophies are labelled plainly — *Positive Mental Attitude* (unconfirmed
  whether the Chapter 1 meditation counts), *Fair Game* (the exact animal is
  unconfirmed), *The Truth Is Out There* and *Ten Pin* (reported methods,
  still being confirmed). Nothing here invents a trophy name or presents an
  unconfirmed method as fact.

## Sources

Guides draw on PowerPyx's GTA 6 Trophy Guide & Roadmap, Push Square's GTA 6
Trophy Guide & Roadmap, KeenGamer's trophy guide, Mobalytics' trophy list,
Planet GTA 6's trophy list and the Exophase / PSNProfiles trophy lists. Every
trophy names its sources in the app and in `app/data/trophies.json`. Sources
are cited, never copied. No Rockstar logo, artwork or game screenshot is used.

## Run it

Open http://localhost:8080 — it works with the network off. Everything the app
loads lives under `app/`; source links open only when the reader follows them.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-frontend.ts` (the kit's copy,
unchanged).

## Layout

- `app/index.html`, `app/atlas.js`, `app/roadmap.js`, `app/atlas.css` — the guide
- `app/data/trophies.json` — the 55 trophies (official name, description,
  grade, kind, missable flag, roadmap stage, guide, steps, sources)
- `screenshots/` — 4 screenshots of the guide (see `shots.json`)
- `main.ts`, `serve.ts`, `vendor/makefun-frontend.ts`

## License

MIT — see `LICENSE`.
