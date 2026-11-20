// The platinum roadmap: six stages built from the official trophy descriptions.
// A trophy's "stage" in app/data/trophies.json matches one of these stage numbers,
// so the checklist and the roadmap never disagree. Difficulty and time figures
// are PowerPyx's (platinum rated 4/10, about 200 hours, one playthrough, no
// online trophies, free-roam after the story).
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — The story, and the one thing that can be missed',
    time: '60–80 hours',
    body: 'Play Chapters 1–4 through to the final mission (12 story trophies). Right after the mission Down to Earth, do the balcony meditation with Lucia at Jason\u2019s house — it is the only trophy that can be missed. While you play, scan vehicles and study animals whenever you see them; both feed the 100% checklist later.',
  },
  {
    stage: 2,
    title: 'Stage 2 — The side questlines (Andy, Kenton, Billy, Randy, Tyrone, Bret)',
    time: 'During & after the story',
    body: 'See each quest giver through to their final mission: Andy (Lucia only, from Chapter 3), Kenton (seven shipwreck dives), Billy (Thrillbilly Mud Club), Randy (16 sports cars), Tyrone (Jason only, shut down the labs) and Bret (Jason only, hunting). Then finish 8 qualifying Strangers & Freaks strands — Andy, Billy, Tyrone, Moses, Yasmani and Eddie do NOT count toward that trophy.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Activities & skills',
    time: 'Alongside the story',
    body: 'Sample all 9 activity types, win 20 different races and a drone race at every one of the 14 Top Fun locations, take gold in all 42 Shooting Range challenges, finish 250 stunts, complete an arcade game, beat Cal at fishing, and build both characters to maximum strength at the same time.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Crime: robberies, escapes & one-offs',
    time: 'Chapters 3–4 & free-roam',
    body: 'Bank vaults (5 for the trophy, all 8 for 100%), armored trucks, a jewelry store robbed without being seen, one illegal operation per gang for all 9 gangs, the VCIA plane theft, the Rhino tank, the blue Banshee through the showroom window, the Ocean Beach cocktail, the bowling alley valuables, the second Payday Loans robbery, the UFO report and the bike kicks — plus 500 criminal-profile actions and $250,000 of laundered marked bills.',
  },
  {
    stage: 5,
    title: 'Stage 5 — Collectibles & money cleanup',
    time: 'Free-roam',
    body: 'Meditate at all 18 spots, finish 3 card sets, WAiNK-scan 100 locations, discover 100 vehicles, unfog the whole map of Leonida, buy all 8 garages, register 10 vehicles with Scooter Bros, complete 50 challenges and spend $100,000 across the shops.',
  },
  {
    stage: 6,
    title: 'Stage 6 — 100% completion, then the platinum',
    time: 'About 100 hours of cleanup',
    body: 'Once the story is done, open the 100% checklist (Progress > Stats > 100% Completion) and work it down: any 100 optional missions, any 70 of 80 challenges, 200 of 277 vehicles scanned, 100 of 255 animals studied, and every robbery, underwater discovery, shooting range, drone race and Bret quest. A Long Road (gold) pops at 100% — and with the other 54 earned, Vice Got a Price! follows.',
  },
];

export function stageTitle(stage) {
  const found = ROADMAP_STAGES.find((s) => s.stage === stage);
  return found ? found.title : 'Roadmap';
}
