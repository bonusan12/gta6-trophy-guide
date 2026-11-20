// Leonida Trophy Atlas — the tracker for the 55 GTA VI trophies.
// Loads app/data/trophies.json (official names, descriptions and grades, plus
// our own cited guides), draws the checklist, and keeps progress in
// localStorage. Nothing is fetched over the network; export/import use local
// files only.
import { ROADMAP_STAGES, stageTitle } from './roadmap.js';

const EARNED_STORE = 'leonida-atlas-earned-v1';
const SPOILER_STORE = 'leonida-atlas-spoiler-v1';

const KIND_NAMES = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  side: 'Side quest',
  crime: 'Crime',
  platinum: 'Platinum',
  online: 'Online',
};

// Demo and deep-link presets come from the URL (?demo=1, ?filter=, ?open=, ?spoiler=).
const query = new URLSearchParams(location.search);
const demoPreset = query.get('demo') === '1';
const DEMO_EARNED = [2, 3, 4, 5, 6, 7, 8];

const state = {
  earned: new Set(),
  spoiler: localStorage.getItem(SPOILER_STORE) === '1',
  kind: 'all',
  grade: 'all',
  search: '',
  unearnedOnly: false,
};

function readStoredEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_STORE) ?? '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

state.earned = new Set(readStoredEarned().filter((id) => Number.isInteger(id)));
if (demoPreset) {
  for (const id of DEMO_EARNED) state.earned.add(id);
  document.getElementById('demoFlag').hidden = false;
}
if (query.get('spoiler') === 'on') state.spoiler = true;
if (query.get('spoiler') === 'off') state.spoiler = false;
if (['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(query.get('filter'))) {
  state.kind = query.get('filter');
}
if (['all', 'platinum', 'gold', 'silver', 'bronze'].includes(query.get('grade'))) {
  state.grade = query.get('grade');
}

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

const cardsEl = document.getElementById('cards');
const meterText = document.getElementById('meterText');
const meterPct = document.getElementById('meterPct');
const meterFill = document.getElementById('meterFill');
const meterGrades = document.getElementById('meterGrades');
const listCount = document.getElementById('listCount');
const noMatch = document.getElementById('noMatch');
const toolbarNote = document.getElementById('toolbarNote');
const searchBox = document.getElementById('searchBox');
const gradePick = document.getElementById('gradePick');
const spoilerToggle = document.getElementById('spoilerToggle');
const unearnedToggle = document.getElementById('unearnedToggle');

function persistEarned() {
  if (demoPreset) return; // the demo ticks are a screenshot preset, not the reader's progress
  localStorage.setItem(EARNED_STORE, JSON.stringify([...state.earned]));
}

function namesToIds(names) {
  const ids = new Set();
  for (const name of names) {
    const t = byName.get(name);
    if (t) ids.add(t.id);
  }
  return ids;
}

function hasEarned(t) {
  return state.earned.has(t.id);
}

function hiddenBySpoiler(t) {
  return state.spoiler && t.kind === 'story' && !hasEarned(t);
}

function passesFilters(t) {
  if (state.kind === 'story' && t.kind !== 'story') return false;
  if (state.kind === 'missable' && !t.missable) return false;
  if (state.kind === 'collectibles' && t.kind !== 'collectibles') return false;
  if (state.kind === 'activities' && t.kind !== 'activities') return false;
  if (state.kind === 'online') return false; // no online trophies: all 55 are offline
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.unearnedOnly && hasEarned(t)) return false;
  if (state.search) {
    const hay = `${t.name} ${t.description} ${t.guide} ${(t.steps ?? []).join(' ')}`.toLowerCase();
    if (!hay.includes(state.search)) return false;
  }
  return true;
}

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function sourceLinks(sources) {
  return (sources ?? [])
    .map((s) => (s.url ? `<a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a>` : esc(s.name)))
    .join(' · ');
}

function trophyCard(t) {
  const hidden = hiddenBySpoiler(t);
  const chips = [`<span class="grade-pill ${t.grade}">${t.grade}</span>`];
  chips.push(`<span class="kind-chip">${KIND_NAMES[t.kind] ?? t.kind}</span>`);
  if (t.missable) chips.push('<span class="missable-chip">⚠ Missable</span>');
  if (t.status === 'unconfirmed') chips.push('<span class="status-chip">Belum terkonfirmasi publik</span>');
  if (t.status === 'reported') chips.push('<span class="status-chip">Reported — being confirmed</span>');

  const name = hidden ? 'Hidden story trophy' : esc(t.name);
  const desc = hidden
    ? 'Hidden until earned — tick this trophy off once you earn it in-game to reveal its name and description.'
    : `Official: “${esc(t.description)}”`;

  let guideHtml = '';
  if (!hidden) {
    const steps = (t.steps ?? []).length
      ? `<ol class="guide-steps">${t.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`
      : '';
    guideHtml = `<details class="guide-box"${t.id === Number(query.get('open') ?? 0) ? ' open' : ''}>
      <summary>Guide — how to earn it</summary>
      <p>${esc(t.guide)}</p>
      ${steps}
      <p class="guide-src">Sources: ${sourceLinks(t.sources)}</p>
    </details>`;
  }

  return `<li class="card${hasEarned(t) ? ' got' : ''}${t.missable ? ' flagged' : ''}" id="card-${t.id}">
    <label class="tickbox">
      <input type="checkbox" data-trophy="${t.id}"${hasEarned(t) ? ' checked' : ''} aria-label="Earned: ${esc(t.name)}">
      <span class="tickmark">✓</span>
    </label>
    <div class="card-body">
      <div class="card-head">${chips.join('')}<h3>${name}</h3></div>
      <p class="official">${desc}</p>
      <p class="roadmap-tag">Roadmap: ${esc(stageTitle(t.stage))}</p>
      ${guideHtml}
    </div>
  </li>`;
}

function renderTimeline() {
  document.getElementById('timeline').innerHTML = ROADMAP_STAGES.map((stage) => {
    const inStage = trophies.filter((t) => t.stage === stage.stage);
    const done = inStage.filter(hasEarned).length;
    return `<li class="step">
      <h3>${esc(stage.title)}</h3>
      <p class="step-when">${esc(stage.time)} · ${done}/${inStage.length} trophies in this stage</p>
      <p>${esc(stage.body)}</p>
    </li>`;
  }).join('');
}

function renderSources() {
  document.getElementById('sourceList').innerHTML = (data.sources_overview ?? [])
    .map((s) => (s.url
      ? `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a></li>`
      : `<li>${esc(s.name)}</li>`))
    .join('');
}

function renderList() {
  const shown = trophies.filter(passesFilters);
  cardsEl.innerHTML = shown.map(trophyCard).join('');

  const done = trophies.filter(hasEarned).length;
  const pct = Math.round((done / trophies.length) * 100);
  meterText.textContent = `${done} of ${trophies.length} earned`;
  meterPct.textContent = `${pct}%`;
  meterFill.style.width = `${pct}%`;
  meterGrades.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const all = trophies.filter((t) => t.grade === g).length;
      const got = trophies.filter((t) => t.grade === g && hasEarned(t)).length;
      return `${got}/${all} ${g}`;
    })
    .join(' · ');
  listCount.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;

  if (state.kind === 'online') {
    noMatch.hidden = false;
    noMatch.textContent = 'No online trophies — all 55 are offline single-player. PowerPyx lists Online Trophies: 0, so this filter is empty by design.';
  } else if (shown.length === 0) {
    noMatch.hidden = false;
    noMatch.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
  } else {
    noMatch.hidden = true;
  }

  if (state.kind === 'missable') {
    toolbarNote.textContent = 'Missable filter: only Positive Mental Attitude is flagged — the Chapter 1 meditation. Every other trophy can be earned after the story.';
  } else if (state.spoiler) {
    toolbarNote.textContent = 'Spoiler-free mode is on: story trophies stay hidden until you tick them earned.';
  } else {
    toolbarNote.textContent = '';
  }

  const openId = Number(query.get('open') ?? 0);
  if (openId && byId.has(openId)) {
    document.getElementById(`card-${openId}`)?.scrollIntoView({ block: 'center' });
  }
}

function renderAll() {
  renderTimeline();
  renderList();
}

cardsEl.addEventListener('change', (event) => {
  const box = event.target.closest('input[data-trophy]');
  if (!box) return;
  const id = Number(box.dataset.trophy);
  if (box.checked) state.earned.add(id);
  else state.earned.delete(id);
  persistEarned();
  renderAll();
});

document.getElementById('kindRow').addEventListener('click', (event) => {
  const btn = event.target.closest('[data-kind]');
  if (!btn) return;
  state.kind = btn.dataset.kind;
  for (const b of document.querySelectorAll('#kindRow .kind-btn')) {
    b.classList.toggle('on', b.dataset.kind === state.kind);
  }
  renderList();
});

gradePick.value = state.grade;
gradePick.addEventListener('change', () => {
  state.grade = gradePick.value;
  renderList();
});
searchBox.addEventListener('input', () => {
  state.search = searchBox.value.trim().toLowerCase();
  renderList();
});
unearnedToggle.addEventListener('change', () => {
  state.unearnedOnly = unearnedToggle.checked;
  renderList();
});
spoilerToggle.checked = state.spoiler;
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  localStorage.setItem(SPOILER_STORE, state.spoiler ? '1' : '0');
  renderList();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    guide: 'Leonida Trophy Atlas',
    exported_at: new Date().toISOString(),
    earned: trophies.filter(hasEarned).map((t) => t.name),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importPick').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    state.earned = namesToIds(names);
    persistEarned();
    renderAll();
  } catch {
    toolbarNote.textContent = 'That file could not be imported — it needs an "earned" list of trophy names, or a plain list of names.';
  }
  event.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all ticked trophies?')) {
    state.earned = new Set();
    persistEarned();
    renderAll();
  }
});

for (const btn of document.querySelectorAll('#kindRow .kind-btn')) {
  btn.classList.toggle('on', btn.dataset.kind === state.kind);
}
renderSources();
renderAll();
