// The start page's diagram: millpond's whole mechanism in one 20 s loop.
// Three adapters print a capture each; millpond lands each once by key and
// banks its raw material off git; a second tick prints the release again and
// it is passed over; the release is its own excerpt, the meeting and the file
// are read into signals; a curation batch gives every signal a move and
// joins three into an item; the item goes to one worktree and sluice lands it.
//
// Timeline, percent of the loop:
//   2-26 capture · 26-46 dedupe and read · 46-70 curate · 70-94 send and land
import { Diagram, esc, type Layout } from './kit';

const T = 20;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SOURCES = [
  { name: 'headwater', what: ['releases of what a repo pins', 'releases'], t0: 3 },
  { name: 'eddy', what: ['recorded meetings', 'meetings'], t0: 6 },
  { name: 'folder drop', what: ['any file in a watched folder', 'files'], t0: 9 },
];

const CAPTURES = [
  { key: 'release/mise/2026.10.10', raw: 'notes.md' },
  { key: 'meeting/wispr/7c1e04', raw: 'transcript.txt' },
  { key: 'folder/drop/9b2f…e81a', raw: 'request.eml' },
];

// Each signal: its source, its gist, its move, and when it appears.
const SIGNALS = [
  { src: 'release', gist: 'mise 2026.10.10 is out', move: 'join', at: 10 },
  { src: 'meeting', gist: 'standup moves to 9:30', move: 'drop', at: 34.5 },
  { src: 'meeting', gist: 'CI needs the new mise', move: 'join', at: 35.5 },
  { src: 'meeting', gist: 'the docs link is broken', move: 'answered', at: 36.5 },
  { src: 'file', gist: 'a newsletter, no ask', move: 'drop', at: 38.5 },
  { src: 'file', gist: 'please pin mise in CI', move: 'join', at: 39.5 },
];

function geometry(layout: Layout) {
  if (layout === 'wide') {
    const W = 900;
    return {
      W,
      H: 452,
      narrow: false,
      sources: SOURCES.map((_, i) => ({ x: 20, y: 76 + i * 76, w: 200, h: 62 })),
      chipFrom: (b: Box) => ({ x: b.x + b.w + 6, y: b.y + 20 }),
      panel: { x: 244, y: 44, w: 414, h: 300 },
      rows: CAPTURES.map((_, i) => ({ x: 252, y: 74 + i * 36, w: 398, h: 30 })),
      chipW: 186,
      sigLabelY: 200,
      sigs: SIGNALS.map((_, i) => ({ x: 252 + (i % 2) * 201, y: 208 + Math.floor(i / 2) * 40, w: 197, h: 34 })),
      bank: { x: 244, y: 352, w: 414, h: 46 },
      fileSlot: (i: number) => ({ x: 258 + i * 132, y: 375, w: 120, h: 16 }),
      workLabel: { x: 676, y: 62 },
      item: { x: 676, y: 74, w: 204, h: 74 },
      tree: { x: 676, y: 166, w: 204, h: 74 },
      line: { y: 318, x1: 684, x2: 872, before: 704, merge: 808 },
      notify: 'M816,318 C892,318 892,300 892,262 L892,128 C892,116 889,111 880,111',
      caps: (i: number) => ({ x: 20 + i * 222, y: 420 }),
    };
  }
  const W = 360;
  return {
    W,
    H: 912,
    narrow: true,
    sources: SOURCES.map((_, i) => ({ x: 8 + i * 116, y: 84, w: 112, h: 64 })),
    chipFrom: (b: Box) => ({ x: b.x + 6, y: b.y + b.h + 8 }),
    panel: { x: 8, y: 164, w: 344, h: 322 },
    rows: CAPTURES.map((_, i) => ({ x: 14, y: 192 + i * 34, w: 332, h: 28 })),
    chipW: 168,
    sigLabelY: 310,
    sigs: SIGNALS.map((_, i) => ({ x: 14, y: 318 + i * 27, w: 332, h: 24 })),
    bank: { x: 8, y: 496, w: 344, h: 44 },
    fileSlot: (i: number) => ({ x: 18 + i * 112, y: 518, w: 104, h: 16 }),
    workLabel: { x: 12, y: 566 },
    item: { x: 8, y: 576, w: 344, h: 62 },
    tree: { x: 8, y: 648, w: 344, h: 62 },
    line: { y: 786, x1: 16, x2: 344, before: 44, merge: 200 },
    notify: 'M212,786 C348,786 356,772 356,744 L356,620 C356,611 355,607 352,607',
    caps: (i: number) => ({ x: 8, y: 840 + i * 20 }),
  };
}

export function hero(layout: Layout, opts: { id?: string; standalone?: boolean } = {}) {
  const g = geometry(layout);
  const n = g.narrow;
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  if (n) {
    add(`<text class="h" x="12" y="30">millpond</text>`);
    add(`<text class="m xs" x="12" y="50">the inbox: what happened in, work out</text>`);
    add(`<text class="hd" x="12" y="76">ADAPTERS, EACH ON A TICK</text>`);
  } else {
    add(`<text class="h" x="20" y="32">millpond</text>`);
    add(`<text class="m sm" x="104" y="32">the inbox: what happened in, work out</text>`);
    add(`<text class="hd" x="20" y="62">ADAPTERS, EACH ON A TICK</text>`);
  }

  // ---- the inbox panel and the raw bank, drawn first so chips pass over them
  const P = g.panel;
  add(`<rect class="panel" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="8"/>`);
  add(`<text class="hd" x="${P.x + 10}" y="${P.y + 18}">${n ? 'MILLPOND · THE INBOX, IN GIT' : 'MILLPOND · THE INBOX, A GIT REPOSITORY'}</text>`);
  // The run's counts: what was taken, what was passed over.
  const cx = P.x + P.w - 10;
  const cy = n ? P.y + 18 : P.y + 18;
  const counts: [string, number, number][] = [
    ['0 taken', 0, 8],
    ['1 taken', 8, 11],
    ['2 taken', 11, 14],
    ['3 taken', 14, 31],
    ['3 taken · 1 passed over', 31, 96],
  ];
  counts.forEach(([t, a, b], i) => {
    add(`<text class="xxs ${i === 4 ? 'ac' : 'm'} ${d.show(`cnt${i}`, a, b)}" x="${cx}" y="${cy}" text-anchor="end">${t}</text>`);
  });
  if (n) {
    // The narrow panel's label and counts share a line; the label is short.
  }

  const B = g.bank;
  add(`<rect class="box2" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8" stroke-dasharray="4 3"/>`);
  add(`<text class="hd" x="${B.x + 10}" y="${B.y + 15}">${n ? 'RAW BANK · THIS HOST, NEVER IN GIT' : 'RAW BANK · ON THIS HOST, NEVER IN GIT'}</text>`);

  // ---- sources
  SOURCES.forEach((s, i) => {
    const b = g.sources[i];
    const t0 = s.t0;
    // The box lights while its adapter lists.
    const lit: [number, number][] = i === 0 ? [[t0 - 2, t0 + 1], [24, 27]] : [[t0 - 2, t0 + 1]];
    const fr: [number, string][] = [[0, 'stroke:var(--dg-rule)']];
    for (const [a, z] of lit) {
      fr.push([a - 0.8, 'stroke:var(--dg-rule)'], [a, 'stroke:var(--dg-accent)'], [z, 'stroke:var(--dg-accent)'], [z + 0.8, 'stroke:var(--dg-rule)']);
    }
    fr.push([100, 'stroke:var(--dg-rule)']);
    d.kf(`sb${i}`, fr);
    add(`<rect class="box ${d.anim(`sb${i}`)}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6"/>`);
    const tx = b.x + (n ? 8 : 14);
    add(`<text class="t b ${n ? 'xs' : 'sm'}" x="${tx}" y="${b.y + (n ? 20 : 22)}">${s.name}</text>`);
    add(`<text class="m ${n ? 'xxs' : 'xs'}" x="${tx}" y="${b.y + (n ? 36 : 39)}">${s.what[n ? 1 : 0]}</text>`);
    const sy = b.y + (n ? 53 : 55);
    const states: [string, number, number, string][] =
      i === 0
        ? [
            ['waiting for its tick', 0, t0 - 2, 'm'],
            ['listing…', t0 - 2, t0 + 1, 'ac'],
            [n ? 'printed 1' : 'printed 1 capture', t0 + 1, 24, 't'],
            [n ? 'listing again…' : 'next tick · listing…', 24, 27, 'ac'],
            [n ? 'printed it again' : 'printed the same release', 27, 96, 't'],
          ]
        : [
            ['waiting for its tick', 0, t0 - 2, 'm'],
            ['listing…', t0 - 2, t0 + 1, 'ac'],
            [n ? 'printed 1' : 'printed 1 capture', t0 + 1, 96, 't'],
          ];
    states.forEach(([txt, a, z, c], k) => {
      const label = n && txt === 'waiting for its tick' ? 'waiting' : txt;
      add(`<text class="xxs ${c} ${d.show(`ss${i}${k}`, a, z)}" x="${tx}" y="${sy}">${label}</text>`);
    });
  });

  // ---- capture rows: each chip flies from its adapter and becomes the row
  CAPTURES.forEach((c, i) => {
    const r = g.rows[i];
    const t0 = SOURCES[i].t0;
    const arrive = t0 + 5;
    add(`<rect class="box2 ${d.show(`row${i}`, arrive, 96)}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="5"/>`);
    const from = g.chipFrom(g.sources[i]);
    const chipX = r.x + 6;
    const chipY = r.y + (r.h - 20) / 2;
    d.fly(`chip${i}`, from.x - chipX, from.y - chipY, t0, t0, arrive, 96);
    add(
      `<g class="chip${i}"><rect class="chip" x="${chipX}" y="${chipY}" width="${g.chipW}" height="20" rx="4"/>` +
        `<text class="chipt mono ${n ? 'xxs' : 'xs'}" x="${chipX + 8}" y="${chipY + 14}">${esc(c.key)}</text></g>`,
    );
    // The raw file drops from the row into the bank, off git.
    const f = g.fileSlot(i);
    d.fly(`file${i}`, chipX + 40 - f.x, r.y + 4 - f.y, arrive, arrive, arrive + 4, 96);
    add(
      `<g class="file${i}"><rect class="file" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="3"/>` +
        `<text class="m mono xxs" x="${f.x + 7}" y="${f.y + 12}">${c.raw}</text></g>`,
    );
  });

  // Row statuses.
  const sx = (i: number) => g.rows[i].x + g.rows[i].w - 8;
  const sy = (i: number) => g.rows[i].y + g.rows[i].h / 2 + 4;
  const status = (i: number, k: number, txt: string, cls: string, a: number, b: number) =>
    add(`<text class="xxs ${cls} ${d.show(`st${i}${k}`, a, b)}" x="${sx(i)}" y="${sy(i)}" text-anchor="end">${txt}</text>`);
  status(0, 0, 'own excerpt · 1 signal', 't', 9, 31);
  status(0, 1, n ? 'held · passed over' : 'key already held · passed over', 'ac', 31, 39);
  status(0, 2, 'own excerpt · 1 signal', 't', 39, 96);
  status(1, 0, n ? 'unread' : 'unread · a reader is charged', 'm', 12, 34);
  status(1, 1, 'read · 3 signals', 't', 34, 96);
  status(2, 0, 'unread', 'm', 15, 38);
  status(2, 1, 'read · 2 signals', 't', 38, 96);

  // The second tick's copy of the release: same key, passed over.
  {
    const r = g.rows[0];
    const from = g.chipFrom(g.sources[0]);
    const chipX = r.x + 6;
    const chipY = r.y + (r.h - 20) / 2;
    const at = (x: number, y: number, o: number) => `transform:translate(${x}px,${y}px);opacity:${o}`;
    const fx = from.x - chipX;
    const fy = from.y - chipY;
    d.kf('dup', [
      [0, at(fx, fy, 0)],
      [26.5, at(fx, fy, 0)],
      [27, at(fx, fy, 1)],
      [31, at(0, 0, 1)],
      [37, at(0, 0, 1)],
      [39, at(0, 0, 0)],
      [100, at(0, 0, 0)],
    ]);
    // In flight it carries the key; landed, it sits on the held capture's
    // chip exactly, a ring around the same key, and goes.
    add(
      `<g class="${d.anim('dup')}"><rect class="ghost" x="${chipX - 3}" y="${chipY - 3}" width="${g.chipW + 6}" height="26" rx="6" stroke-dasharray="3 3"/>` +
        `<rect class="chip" x="${chipX}" y="${chipY}" width="${g.chipW}" height="20" rx="4"/>` +
        `<text class="chipt mono ${n ? 'xxs' : 'xs'}" x="${chipX + 8}" y="${chipY + 14}">${esc(CAPTURES[0].key)}</text></g>`,
    );
    d.kf('rowp', [
      [0, 'stroke:var(--dg-rule)'],
      [30.5, 'stroke:var(--dg-rule)'],
      [31, 'stroke:var(--dg-accent)'],
      [38, 'stroke:var(--dg-accent)'],
      [39, 'stroke:var(--dg-rule)'],
      [100, 'stroke:var(--dg-rule)'],
    ]);
    add(`<rect class="rowring ${d.anim('rowp')}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="5"/>`);
    d.rule('.rowring{fill:none;stroke-width:1.5}');
  }

  if (!n) {
    // Anything else hands lines in directly.
    add(`<rect class="box2" x="20" y="312" width="200" height="40" rx="6" stroke-dasharray="4 3"/>`);
    add(`<text class="m xxs" x="32" y="328">a deployer, a script, a person:</text>`);
    add(`<text class="t mono xxs" x="32" y="343">… | millpond land</text>`);
  }

  // ---- signals and the curation batch
  const labels: [string, number, number, string][] = [
    ['SIGNALS', 0, 47, 'hd'],
    [n ? 'BATCH · A SESSION PROPOSES' : 'BATCH · A SESSION PROPOSES A MOVE FOR EACH', 47, 58, 'hd ac'],
    [n ? 'ACCEPTED · ONE COMMIT' : 'YOU ACCEPT · ONE COMMIT WRITES THEM ALL', 58, 96, 'hd ac'],
  ];
  labels.forEach(([t, a, b, c], k) => add(`<text class="${c} ${d.show(`sl${k}`, a, b)}" x="${P.x + 10}" y="${g.sigLabelY}">${t}</text>`));
  {
    const first = g.sigs[0];
    const last = g.sigs[g.sigs.length - 1];
    const x = first.x - 4;
    const y = first.y - 4;
    const w = (n ? first.w : last.x + last.w - first.x) + 8;
    const h = last.y + last.h - first.y + 8;
    add(`<rect class="dash ${d.show('batch', 47, 58)}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`);
  }
  SIGNALS.forEach((s, i) => {
    const r = g.sigs[i];
    const moved = s.move === 'join' ? 0.4 : s.move === 'drop' ? 0.3 : 0.45;
    const cls = d.levels(`sig${i}`, [
      [0, 0],
      [s.at, 1],
      [58, moved],
      [96, 0],
    ]);
    add(`<g class="${cls}">`);
    add(`<rect class="box2" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="5"/>`);
    if (n) {
      add(`<text class="m xxs" x="${r.x + 8}" y="${r.y + 16}">${s.src}</text>`);
      add(`<text class="t xs" x="${r.x + 62}" y="${r.y + 16}">${s.gist}</text>`);
    } else {
      add(`<text class="m xxs" x="${r.x + 9}" y="${r.y + 13}">${s.src}</text>`);
      add(`<text class="t xs" x="${r.x + 9}" y="${r.y + 28}">${s.gist}</text>`);
    }
    add('</g>');
    // The move the session proposes.
    const tagAt = 49 + i;
    const tw = s.move === 'answered' ? 62 : 40;
    const tx = r.x + r.w - tw - 6;
    const ty = r.y + (n ? 4 : 5);
    const join = s.move === 'join';
    add(
      `<g class="${d.levels(`tag${i}`, [[0, 0], [tagAt, 1], [96, 0]])}">` +
        `<rect class="${join ? 'tagj' : 'tag'}" x="${tx}" y="${ty}" width="${tw}" height="16" rx="8"/>` +
        `<text class="${join ? 'tagjt' : 'm'} xxs" x="${tx + tw / 2}" y="${ty + 12}" text-anchor="middle">${s.move}</text></g>`,
    );
    if (s.move === 'drop') {
      const y = r.y + (n ? 12 : 24);
      const x2 = r.x + (n ? 62 : 9) + s.gist.length * 6.1;
      add(`<line class="strike ${d.show(`strike${i}`, 58, 96)}" x1="${r.x + (n ? 60 : 7)}" y1="${y}" x2="${x2}" y2="${y}"/>`);
    }
    // A joined signal travels into the item.
    if (join) {
      const it = g.item;
      const tx2 = it.x + 14 + [0, 1, 2][[0, 2, 5].indexOf(i)] * 18;
      const ty2 = it.y + it.h - 18;
      d.kf(`jn${i}`, [
        [0, 'transform:translate(0px,0px);opacity:0'],
        [59, 'transform:translate(0px,0px);opacity:0'],
        [59.5, 'transform:translate(0px,0px);opacity:1'],
        [64, `transform:translate(${tx2 - (r.x + 6)}px,${ty2 - (r.y + 6)}px);opacity:1`],
        [96, `transform:translate(${tx2 - (r.x + 6)}px,${ty2 - (r.y + 6)}px);opacity:1`],
        [96.8, `transform:translate(${tx2 - (r.x + 6)}px,${ty2 - (r.y + 6)}px);opacity:0`],
        [100, 'transform:translate(0px,0px);opacity:0'],
      ]);
      add(`<rect class="tagj ${d.anim(`jn${i}`)}" x="${r.x + 6}" y="${r.y + 6}" width="12" height="12" rx="3"/>`);
    }
  });

  // ---- the work: the item, its worktree, the branch
  add(`<text class="hd" x="${g.workLabel.x}" y="${g.workLabel.y}">THE WORK</text>`);
  const I = g.item;
  add(`<g class="${d.show('item', 61, 96)}">`);
  add(`<rect class="accbox" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="6"/>`);
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 17}">item 1 · 3 signals joined</text>`);
  add(`<text class="t b sm" x="${I.x + 14}" y="${I.y + (n ? 36 : 37)}">bump mise to 2026.10.10</text>`);
  add('</g>');
  const istx = n ? I.x + I.w - 12 : I.x + 14;
  const isty = n ? I.y + I.h - 12 : I.y + I.h - 9;
  const anchor = n ? ' text-anchor="end"' : '';
  add(`<text class="m xxs ${d.show('is0', 64, 72)}" x="${istx}" y="${isty}"${anchor}>proposed · brief written</text>`);
  add(`<text class="ac xxs ${d.show('is1', 72, 89)}" x="${istx}" y="${isty}"${anchor}>sent to one worktree</text>`);
  add(`<text class="ok xxs b ${d.show('is2', 89, 96)}" x="${istx}" y="${isty}"${anchor}>landed · 9f2c1e4</text>`);

  const W2 = g.tree;
  // The item's chip travels into the worktree.
  d.fly('send', I.x + 14 - (W2.x + 14), I.y + 30 - (W2.y + 10), 70.5, 70.5, 73.5, 74.5);
  add(`<rect class="chip send" x="${W2.x + 14}" y="${W2.y + 10}" width="90" height="12" rx="3"/>`);
  add(`<g class="${d.show('tree', 73, 96)}">`);
  d.kf('treeb', [
    [0, 'stroke:var(--dg-rule)'],
    [86.2, 'stroke:var(--dg-rule)'],
    [87, 'stroke:var(--dg-ok)'],
    [100, 'stroke:var(--dg-ok)'],
  ]);
  add(`<rect class="box ${d.anim('treeb')}" x="${W2.x}" y="${W2.y}" width="${W2.w}" height="${W2.h}" rx="6"/>`);
  add(`<text class="m xxs" x="${W2.x + 14}" y="${W2.y + 17}">worktree · an agent with the brief</text>`);
  add(`<text class="t mono xs" x="${W2.x + 14}" y="${W2.y + 35}">item/1-bump-mise</text>`);
  add(`<rect class="track" x="${W2.x + 14}" y="${W2.y + W2.h - 16}" width="${W2.w - 28}" height="6" rx="3"/>`);
  d.kf('tbar', [
    [0, 'transform:scaleX(0);fill:var(--dg-accent)'],
    [74, 'transform:scaleX(0);fill:var(--dg-accent)'],
    [84, 'transform:scaleX(1);fill:var(--dg-accent)'],
    [86.5, 'transform:scaleX(1);fill:var(--dg-accent)'],
    [87, 'transform:scaleX(1);fill:var(--dg-ok)'],
    [100, 'transform:scaleX(1);fill:var(--dg-ok)'],
  ]);
  add(`<rect class="bar ${d.anim('tbar')}" x="${W2.x + 14}" y="${W2.y + W2.h - 16}" width="${W2.w - 28}" height="6" rx="3"/>`);
  add('</g>');
  const wsx = W2.x + W2.w - 14;
  const wsy = W2.y + 35;
  add(`<text class="m xxs ${d.show('ws0', 74, 84)}" x="${wsx}" y="${wsy}" text-anchor="end">working…</text>`);
  add(`<text class="ac xxs ${d.show('ws1', 84, 87)}" x="${wsx}" y="${wsy}" text-anchor="end">wt submit main</text>`);
  add(`<text class="ok xxs b ${d.show('ws2', 87, 96)}" x="${wsx}" y="${wsy}" text-anchor="end">landed</text>`);

  // The branch: sluice moves main to the merge that carries the item's work.
  const L = g.line;
  add(`<line class="edge" x1="${L.x1}" y1="${L.y}" x2="${L.before + 8}" y2="${L.y}"/>`);
  add(`<line class="edge ${d.show('ledge', 87, 96)}" x1="${L.before}" y1="${L.y}" x2="${L.merge}" y2="${L.y}"/>`);
  add(`<circle class="dot" cx="${L.before}" cy="${L.y}" r="5.5"/>`);
  add(`<text class="m xxs" x="${L.before}" y="${L.y + 22}" text-anchor="middle">before</text>`);
  add(
    `<g class="${d.show('mrg', 87, 96)}"><circle class="merge" cx="${L.merge}" cy="${L.y}" r="8"/>` +
      `<circle class="mergein" cx="${L.merge}" cy="${L.y}" r="3.5"/>` +
      `<text class="ok xxs b" x="${L.merge}" y="${L.y + 22}" text-anchor="middle">landed by sluice</text></g>`,
  );
  const dx = L.merge - L.before;
  d.kf('head', [
    [0, 'transform:translate(0px,0px)'],
    [87, 'transform:translate(0px,0px)'],
    [89, `transform:translate(${dx}px,0px)`],
    [96, `transform:translate(${dx}px,0px)`],
    [98.5, 'transform:translate(0px,0px)'],
    [100, 'transform:translate(0px,0px)'],
  ]);
  add(
    `<g class="${d.anim('head')}"><rect class="pill" x="${L.before - 22}" y="${L.y - 34}" width="44" height="18" rx="9"/>` +
      `<text class="pillt mono xxs" x="${L.before}" y="${L.y - 21}" text-anchor="middle">main</text></g>`,
  );
  add(`<text class="hd" x="${L.x1}" y="${L.y - 46}">THE BRANCH</text>`);
  // millpond writes the landing against the item, from sluice's record.
  d.kf('notify', [
    [0, 'stroke-dashoffset:300;opacity:0'],
    [88.5, 'stroke-dashoffset:300;opacity:0'],
    [89, 'stroke-dashoffset:300;opacity:1'],
    [91.5, 'stroke-dashoffset:0;opacity:1'],
    [96, 'stroke-dashoffset:0;opacity:1'],
    [96.8, 'stroke-dashoffset:0;opacity:0'],
    [100, 'stroke-dashoffset:300;opacity:0'],
  ]);
  add(`<path class="okline ${d.anim('notify')}" d="${g.notify}"/>`);
  d.rule('.okline{fill:none;stroke:var(--dg-ok);stroke-width:1.5;stroke-dasharray:300}');

  // ---- captions
  const caps = n
    ? [
        ['Adapters print what happened.', 2, 26],
        ['Each event lands once, by key.', 26, 46],
        ['A session proposes; you accept.', 46, 70],
        ['One item, one worktree, landed.', 70, 94],
      ]
    : [
        ['Adapters print what happened,|one line per event.', 2, 26],
        ['Each event lands once, by key;|raw material stays off git.', 26, 46],
        ['A session proposes the moves;|you accept, and items form.', 46, 70],
        ['One item goes to one worktree,|and sluice lands the work.', 70, 94],
      ];
  caps.forEach(([txt, a, b], i) => {
    const c = g.caps(i);
    const cls = d.keep(d.show(`cap${i}`, a as number, b as number, 0.35));
    const lines = (txt as string).split('|');
    add(`<g class="${cls}"><circle class="badge" cx="${c.x + 11}" cy="${c.y - 4}" r="10"/>`);
    add(`<text class="badget" x="${c.x + 11}" y="${c.y}" text-anchor="middle">${i + 1}</text>`);
    lines.forEach((l, k) => add(`<text class="t ${n ? 'xs' : 'sm'}" x="${c.x + 28}" y="${c.y + k * 17}">${l}</text>`));
    add('</g>');
  });

  return d.render({
    id: opts.id ?? (n ? 'hn' : 'hw'),
    width: g.W,
    height: g.H,
    title: 'millpond: captures in, items out',
    desc:
      'Three adapters, headwater for releases, eddy for meetings and a folder drop for files, each print one capture line on their tick. ' +
      'millpond lands each capture once by its key and banks its raw file on the host, outside git. A second tick prints the same release, ' +
      'and millpond passes it over because the key is already held. The release is its own excerpt and becomes one signal; a reader turns the ' +
      'meeting into three signals and the file into two. A curation session proposes a move for each of the six signals; the operator accepts ' +
      'and one commit writes them all: two drops, one answered, and three joined into one item, bump mise. millpond sends the item to one ' +
      'worktree, an agent works from its brief and submits, sluice lands the merge on main, and millpond records the landing on the item.',
    still: 93,
    standalone: opts.standalone,
  });
}
