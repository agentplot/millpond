// Working a backlog of hundreds. A Claude session lists the oldest fifty
// unmoved signals and proposes a move for each; the operator changes one row
// and accepts; one commit writes all fifty moves, the joined signals form
// items, and the count of what is left falls by fifty.
//
// Timeline, percent of a 16 s loop:
//   4-10 list · 12-36 propose · 40-47 change a row · 50-56 accept
//   58 one commit · 60-72 items form · 76-96 the next batch
import { Diagram, type Layout } from './kit';

const T = 16;

const ROWS = [
  { age: '41 d', src: 'release', gist: 'jq 1.8.1 is out', move: 'answered', to: '' },
  { age: '40 d', src: 'meeting', gist: 'move the backup window', move: 'join', to: 'item 2' },
  { age: '38 d', src: 'file', gist: 'an invoice, no ask', move: 'drop', to: '' },
  { age: '37 d', src: 'meeting', gist: 'the CI image is stale', move: 'drop', to: '' },
  { age: '35 d', src: 'release', gist: 'mise 2026.10.10 is out', move: 'join', to: 'item 1' },
  { age: '33 d', src: 'meeting', gist: 'who owns the runbook?', move: 'answered', to: '' },
  { age: '30 d', src: 'file', gist: 'a newsletter', move: 'drop', to: '' },
];
const CHANGED = 3; // the row the operator changes: drop becomes join, item 1

const ITEMS = [
  ['bump mise', 3],
  ['move the backup window', 4],
  ['fix the docs links', 6],
  ['rotate the deploy key', 2],
  ['answer the vendor’s audit', 12],
] as const;

function geometry(layout: Layout) {
  if (layout === 'wide') {
    return {
      W: 720,
      H: 420,
      count: { x: 16, y: 72 },
      table: { x: 12, y: 84, w: 466 },
      row: (i: number) => ({ x: 12, y: 126 + i * 30, w: 466, h: 26 }),
      more: { x: 24, y: 352 },
      tally: { x: 24, y: 384 },
      accept: { x: 394, y: 368, w: 80, h: 24 },
      right: { x: 496 },
      calls: { x: 496, y: 56 },
      logY: 152,
      itemsY: 206,
      item: (k: number) => ({ x: 496, y: 216 + k * 32, w: 212, h: 28 }),
      next: { x: 496, y: 396 },
    };
  }
  return {
    W: 360,
    H: 784,
    count: { x: 14, y: 70 },
    table: { x: 8, y: 96, w: 344 },
    row: (i: number) => ({ x: 8, y: 138 + i * 40, w: 344, h: 36 }),
    more: { x: 18, y: 432 },
    tally: { x: 18, y: 456 },
    accept: { x: 268, y: 440, w: 80, h: 24 },
    right: { x: 14 },
    calls: null,
    logY: 516,
    itemsY: 572,
    item: (k: number) => ({ x: 8, y: 582 + k * 32, w: 344, h: 26 }),
    next: { x: 14, y: 760 },
  };
}

export function backlog(layout: Layout) {
  const g = geometry(layout);
  const n = layout === 'narrow';
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);
  d.rule('.big{font-size:30px;font-weight:700;letter-spacing:-.02em} .hl{fill:var(--dg-accent-soft)} .cur{fill:var(--dg-fg);stroke:var(--dg-bg);stroke-width:1.5}');

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  add(`<text class="hd" x="${n ? 14 : 16}" y="${n ? 24 : 28}">AN INBOX’S BACKLOG, WORKED IN BATCHES</text>`);

  // The count of what waits, by source.
  const C = g.count;
  add(`<text class="t big ${d.show('n0', 0, 60)}" x="${C.x}" y="${C.y}">412</text>`);
  add(`<text class="ac big ${d.show('n1', 60, 96)}" x="${C.x}" y="${C.y}">362</text>`);
  add(`<text class="t xs" x="${C.x + 66}" y="${C.y - 14}">unmoved signals</text>`);
  add(`<text class="m xxs ${d.show('b0', 0, 60)}" x="${C.x + 66}" y="${C.y + 1}">releases 96 · meetings 251 · files 65</text>`);
  add(`<text class="m xxs ${d.show('b1', 60, 96)}" x="${C.x + 66}" y="${C.y + 1}">releases 85 · meetings 222 · files 55</text>`);

  // The batch.
  const Tb = g.table;
  add(`<text class="hd" x="${Tb.x + 4}" y="${Tb.y + 14}">BATCH 1 · THE OLDEST 50</text>`);
  const actor: [string, number, number][] = [
    ['a session lists them', 3, 11],
    ['a Claude session proposes', 11, 39],
    ['you change one row', 39, 50],
    ['you accept', 50, 57],
    ['one commit writes all 50', 57, 96],
  ];
  actor.forEach(([t, a, b], k) => add(`<text class="ac xxs b ${d.show(`act${k}`, a, b)}" x="${Tb.x + Tb.w - 4}" y="${Tb.y + 14}" text-anchor="end">${t}</text>`));
  if (!n) {
    const hy = Tb.y + 36;
    add(`<text class="m xxs" x="24" y="${hy}">age</text><text class="m xxs" x="64" y="${hy}">source</text>`);
    add(`<text class="m xxs" x="128" y="${hy}">signal</text><text class="m xxs" x="340" y="${hy}">proposed move</text>`);
  }

  ROWS.forEach((r, i) => {
    const R = g.row(i);
    const shownAt = 4 + i * 0.8;
    const rowCls = d.levels(`row${i}`, [[0, 0], [shownAt, 1], [58, 0.45], [96, 0]]);
    add(`<g class="${rowCls}">`);
    if (i === CHANGED) add(`<rect class="hl ${d.show('hl', 43, 96)}" x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="5"/>`);
    add(`<rect class="box2" x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="5" fill-opacity="${i === CHANGED ? 0.6 : 1}"/>`);
    if (n) {
      add(`<text class="m xxs" x="${R.x + 10}" y="${R.y + 14}">${r.age} · ${r.src}</text>`);
      add(`<text class="t xs" x="${R.x + 10}" y="${R.y + 29}">${r.gist}</text>`);
    } else {
      add(`<text class="m xxs" x="${R.x + 12}" y="${R.y + 17}">${r.age}</text>`);
      add(`<text class="m xxs" x="${R.x + 52}" y="${R.y + 17}">${r.src}</text>`);
      add(`<text class="t xs" x="${R.x + 116}" y="${R.y + 17}">${r.gist}</text>`);
    }
    add('</g>');
    // The proposed move, and for the changed row the operator's.
    const tagX = n ? R.x + R.w - 10 : R.x + 328;
    const tagY = n ? R.y + 5 : R.y + 5;
    const tag = (move: string, to: string, cls: string) => {
      const w = move === 'answered' ? 62 : 40;
      const x = n ? tagX - w : tagX;
      const join = move === 'join';
      const toX = n ? R.x + R.w - 10 : tagX + w + 8;
      const toY = n ? R.y + 31 : R.y + 17;
      return (
        `<g class="${cls}"><rect class="${join ? 'tagj' : 'tag'}" x="${x}" y="${tagY}" width="${w}" height="16" rx="8"/>` +
        `<text class="${join ? 'tagjt' : 'm'} xxs" x="${x + w / 2}" y="${tagY + 12}" text-anchor="middle">${move}</text>` +
        (to ? `<text class="ac xxs" x="${toX}" y="${toY}"${n ? ' text-anchor="end"' : ''}>→ ${to}</text>` : '') +
        '</g>'
      );
    };
    const at = 12 + i * 3;
    if (i === CHANGED) {
      add(tag(r.move, r.to, d.levels(`tg${i}`, [[0, 0], [at, 1], [44.5, 0]])));
      add(tag('join', 'item 1', d.levels(`tgc`, [[0, 0], [44.5, 1], [58, 0.45], [96, 0]])));
    } else {
      add(tag(r.move, r.to, d.levels(`tg${i}`, [[0, 0], [at, 1], [58, 0.45], [96, 0]])));
    }
  });
  add(`<text class="m xxs ${d.levels('more', [[0, 0], [33, 1], [58, 0.45], [77, 0]])}" x="${g.more.x}" y="${g.more.y}">and 43 more rows, each with its move</text>`);
  const ty = g.tally;
  add(`<text class="t xxs b ${d.show('ty0', 35, 45)}" x="${ty.x}" y="${ty.y}">drop 18 · answered 6 · join 26 into 5 items</text>`);
  add(`<text class="t xxs b ${d.show('ty1', 45, 96)}" x="${ty.x}" y="${ty.y}">drop 17 · answered 6 · join 27 into 5 items</text>`);
  add(`<text class="ac xxs ${d.show('ty2', 78, 96)}" x="${g.more.x}" y="${g.more.y}">batch 2 starts where batch 1 ended</text>`);

  // The accept button.
  const A = g.accept;
  d.kf('acc', [
    [0, 'fill:var(--dg-panel)'],
    [54.5, 'fill:var(--dg-panel)'],
    [55, 'fill:var(--dg-accent)'],
    [58, 'fill:var(--dg-accent)'],
    [58.8, 'fill:var(--dg-panel)'],
    [100, 'fill:var(--dg-panel)'],
  ]);
  add(`<g class="${d.show('accg', 36, 96)}"><rect class="accb ${d.anim('acc')}" x="${A.x}" y="${A.y}" width="${A.w}" height="${A.h}" rx="12"/>`);
  d.rule('.accb{stroke:var(--dg-accent);stroke-width:1.5}');
  add(`<text class="ac xs b" x="${A.x + A.w / 2}" y="${A.y + 16}" text-anchor="middle">accept</text></g>`);

  // The operator's pointer: to the row, a click, to accept, a click.
  const R4 = g.row(CHANGED);
  const rowTarget = n ? { x: R4.x + R4.w - 28, y: R4.y + 14 } : { x: R4.x + 350, y: R4.y + 16 };
  const accTarget = { x: A.x + A.w / 2 + 6, y: A.y + 14 };
  const start = { x: rowTarget.x + 40, y: rowTarget.y + 70 };
  const tr = (p: { x: number; y: number }, o: number, s = 1) => `transform:translate(${p.x}px,${p.y}px) scale(${s});opacity:${o}`;
  d.kf('cur', [
    [0, tr(start, 0)],
    [39, tr(start, 0)],
    [40, tr(start, 1)],
    [43, tr(rowTarget, 1)],
    [44, tr(rowTarget, 1, 0.8)],
    [45, tr(rowTarget, 1)],
    [50, tr(rowTarget, 1)],
    [53.5, tr(accTarget, 1)],
    [54.5, tr(accTarget, 1, 0.8)],
    [55.5, tr(accTarget, 1)],
    [58, tr(accTarget, 1)],
    [59, tr(accTarget, 0)],
    [100, tr(accTarget, 0)],
  ]);
  add(`<path class="cur ${d.anim('cur')}" d="M0,0 L0,15 L4,11.5 L7,18 L9.5,17 L6.5,10.5 L11.5,10.5 Z"/>`);
  d.rule('.cur{transform-box:view-box}');

  // The session's calls to millpond's tools.
  if (g.calls) {
    const K = g.calls;
    add(`<text class="hd" x="${K.x}" y="${K.y}">THE SESSION’S CALLS</text>`);
    const calls: [string, number][] = [
      ['signals(unmoved, oldest, 50)', 3],
      ['capture(…) for the 4 unclear', 11],
      ['moves(the batch of 50)', 57],
    ];
    calls.forEach(([c, t], i) =>
      add(`<text class="${i === 2 ? 'ac' : 't'} mono xxs ${d.show(`call${i}`, t, 96)}" x="${K.x}" y="${K.y + 20 + i * 17}">${c}</text>`),
    );
  }

  // One write: the inbox's log gains one commit.
  const X = g.right.x;
  add(`<text class="hd" x="${X}" y="${g.logY - 20}">ONE WRITE</text>`);
  const span = n ? 330 : 208;
  add(`<line class="edge" x1="${X}" y1="${g.logY}" x2="${X + span}" y2="${g.logY}" stroke-width="1.5"/>`);
  add(`<circle class="dot" cx="${X + 8}" cy="${g.logY}" r="4"/><circle class="dot" cx="${X + 28}" cy="${g.logY}" r="4"/>`);
  add(`<circle class="ac ${d.show('cm', 58, 96)}" cx="${X + 50}" cy="${g.logY}" r="6"/>`);
  add(`<text class="ac xxs ${d.show('cml', 58.5, 96)}" x="${X}" y="${g.logY + 22}">moves · batch 1 · 50 signals, one commit</text>`);

  // Items form from the joined signals.
  add(`<text class="hd" x="${X}" y="${g.itemsY}">ITEMS, PROPOSED</text>`);
  ITEMS.forEach(([name, k], i) => {
    const I = g.item(i);
    const at = 61 + i * 2;
    add(`<g class="${d.show(`it${i}`, at, 96)}"><rect class="accbox" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="5"/>`);
    add(`<text class="t xs b" x="${I.x + 10}" y="${I.y + I.h / 2 + 4}">${name}</text>`);
    add(`<text class="m xxs" x="${I.x + I.w - 10}" y="${I.y + I.h / 2 + 4}" text-anchor="end">${k} signals</text></g>`);
  });
  add(`<text class="m xxs ${d.show('nx', 78, 96)}" x="${g.next.x}" y="${g.next.y}">each item can go to a worktree of its own</text>`);

  return d.render({
    id: n ? 'bn' : 'bw',
    width: g.W,
    height: g.H,
    title: 'A backlog of hundreds, worked fifty at a time',
    desc:
      'The inbox holds 412 unmoved signals. A Claude session lists the oldest fifty and proposes a move for each: answered, join into an item, or drop, ' +
      'tallying drop 18, answered 6 and join 26 into 5 items. The operator changes one row, the stale CI image, from drop to join into item 1, and accepts. ' +
      'One commit writes all fifty moves, five proposed items form, bump mise among them, and 362 unmoved signals remain. The next batch starts where this one ended.',
    still: 92,
  });
}
