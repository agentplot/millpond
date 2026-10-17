// Where millpond sends an item, and what comes back to it. An item that
// asks a question goes to a sounding: one session in a worktree of its own,
// which offers a finding beyond its question back as a capture and ends on a
// conclusion you accept. The accepted conclusion becomes the item's record,
// and the work it proposes becomes a new item. That item goes to one
// worktree, its agent submits through sluice, and millpond writes sluice's
// landing on the item.
//
// sounding is drawn in its own accent, --dg-sounding, which Diagram.astro
// sets from the family list of @agentplot/site-theme.
//
// Timeline, percent of a 20 s loop:
//   4-28 the question is worked · 28-36 its conclusion, accepted
//   36-48 the record and the new item · 50-80 the bump is worked and landed
//   82-88 the landing comes back · 88-96 hold
import { Diagram, type Layout } from './kit';

const T = 20;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function geometry(layout: Layout) {
  if (layout === 'wide') {
    const col = (x: number, y: number, w: number, h = 188): Box => ({ x, y, w, h });
    return {
      W: 720,
      H: 500,
      labels: {
        inbox: { x: 16, y: 30 },
        sounding: { x: 236, y: 30 },
        conclusion: { x: 496, y: 30 },
        tree: { x: 236, y: 268 },
        sluice: { x: 496, y: 268 },
      },
      q: col(12, 40, 200, 150),
      offer: col(12, 204, 200, 22),
      item: col(12, 278, 200, 150),
      sounding: col(232, 40, 240),
      conclusion: col(492, 40, 216),
      tree: col(232, 278, 240),
      sluice: col(492, 278, 216),
      record: 'M600,228 V244 Q600,250 594,250 H228 Q222,250 222,244 V130 Q222,124 216,124 H212',
      recordLabel: { x: 410, y: 244 },
      landing: 'M600,466 V480 Q600,488 592,488 H130 Q122,488 122,480 V428',
      landingLabel: { x: 360, y: 482 },
    };
  }
  const box = (y: number, h: number): Box => ({ x: 14, y, w: 332, h });
  return {
    W: 360,
    H: 1146,
    labels: {
      inbox: { x: 16, y: 26 },
      sounding: { x: 16, y: 400 },
      conclusion: { x: 16, y: 618 },
      tree: { x: 16, y: 794 },
      sluice: { x: 16, y: 972 },
    },
    q: box(36, 136),
    offer: box(186, 22),
    item: box(222, 150),
    sounding: box(410, 184),
    conclusion: box(628, 140),
    tree: box(804, 144),
    sluice: box(982, 148),
    record: 'M14,700 H10 Q6,700 6,694 V110 Q6,104 10,104 H14',
    recordLabel: null,
    landing: 'M346,1056 H350 Q354,1056 354,1050 V302 Q354,296 350,296 H346',
    landingLabel: null,
  };
}

export function send(layout: Layout) {
  const g = geometry(layout);
  const n = layout === 'narrow';
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);
  const S = 'var(--dg-sounding, var(--dg-muted))';
  d.rule(
    `.snd{fill:${S}} .sndbox{fill:var(--dg-panel);stroke:${S};stroke-width:1.5}` +
      `.sndsoft{fill:color-mix(in oklab, ${S} 14%, var(--dg-panel));stroke:${S};stroke-width:1.5}` +
      `.sndchip{fill:${S}} .sndt{fill:var(--dg-ink);font-weight:600}` +
      '.slbox{fill:var(--dg-panel);stroke:var(--dg-ok);stroke-width:1.5} .sltrack{fill:var(--dg-soft)}' +
      '.slbar{fill:var(--dg-ok);transform-box:fill-box;transform-origin:left center}' +
      '.term{fill:var(--dg-bg);stroke:var(--dg-rule);stroke-width:1} .briefl{fill:var(--dg-muted);opacity:.45}' +
      '.keyb{stroke-width:1.25}',
  );

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  const L = g.labels;
  add(`<text class="hd" x="${L.inbox.x}" y="${L.inbox.y}">THE INBOX</text>`);
  add(`<text class="hd" x="${L.sounding.x}" y="${L.sounding.y}">A SOUNDING · ONE QUESTION</text>`);
  add(`<text class="hd" x="${L.conclusion.x}" y="${L.conclusion.y}">ITS CONCLUSION · YOU DECIDE</text>`);
  add(`<text class="hd" x="${L.tree.x}" y="${L.tree.y}">ONE WORKTREE</text>`);
  add(`<text class="hd" x="${L.sluice.x}" y="${L.sluice.y}">SLUICE</text>`);

  // A send key on an item, lit when the item is sent.
  const key = (b: Box, name: string, at: number, colour: string) => {
    const k = { x: b.x + b.w - 62, y: b.y + 9 };
    d.kf(name, [
      [0, 'fill:var(--dg-panel)'],
      [at - 0.5, 'fill:var(--dg-panel)'],
      [at, `fill:${colour}`],
      [at + 3, `fill:${colour}`],
      [at + 3.8, 'fill:var(--dg-panel)'],
      [100, 'fill:var(--dg-panel)'],
    ]);
    add(`<rect class="keyb ${d.anim(name)}" x="${k.x}" y="${k.y}" width="50" height="20" rx="10" style="stroke:${colour}"/>`);
    add(`<text class="xxs b" x="${k.x + 25}" y="${k.y + 14}" text-anchor="middle" style="fill:${colour}">send</text>`);
  };

  // A pane of an agent's session, its lines appearing in turn.
  const pane = (b: Box, top: number, title: string, lines: [string, string, number][], until: number, prefix: string) => {
    const p = { x: b.x + 14, y: b.y + top, w: b.w - 28, h: 20 + lines.length * 18 };
    add(`<g class="${d.levels(`${prefix}pn`, [[0, 0], [lines[0][2] - 2, 1], [until, 0.45], [96, 0]])}">`);
    add(`<rect class="term" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="5"/>`);
    add(`<text class="m xxs" x="${p.x + 10}" y="${p.y + 15}">${title}</text></g>`);
    lines.forEach(([t, c, at], k) =>
      add(
        `<text class="${c} mono xxs ${d.levels(`${prefix}l${k}`, [[0, 0], [at, 1], [until, 0.45], [96, 0]])}" x="${p.x + 10}" y="${p.y + 33 + k * 18}">› ${t}</text>`,
      ),
    );
    return p;
  };

  // ---- the question item
  const Q = g.q;
  add(`<rect class="accbox" x="${Q.x}" y="${Q.y}" width="${Q.w}" height="${Q.h}" rx="8"/>`);
  add(`<text class="m xxs" x="${Q.x + 14}" y="${Q.y + 22}">item 4 · asks a question</text>`);
  add(`<text class="t b sm" x="${Q.x + 14}" y="${Q.y + 46}">take mise 3.0, a major?</text>`);
  add(`<text class="m xxs" x="${Q.x + 14}" y="${Q.y + 64}">sources: 2 signals, the 3.0 notes</text>`);
  add(`<text class="m xxs" x="${Q.x + 14}" y="${Q.y + 90}">sends</text>`);
  add(`<text class="m xxs ${d.show('qs0', 0, 7)}" x="${Q.x + 14}" y="${Q.y + 106}">none yet</text>`);
  add(`<text class="mono xxs snd ${d.show('qs1', 7, 96)}" x="${Q.x + 14}" y="${Q.y + 106}">sounding/mise-3</text>`);
  add(`<text class="m xxs ${d.show('qr0', 7, 41)}" x="${Q.x + 14}" y="${Q.y + 126}">record: waiting on a conclusion</text>`);
  add(`<text class="snd xxs b ${d.show('qr1', 41, 96)}" x="${Q.x + 14}" y="${Q.y + 126}">record: its accepted conclusion</text>`);
  key(Q, 'qkey', 4, S);

  // ---- the sounding
  const D = g.sounding;
  d.fly('qbrief', Q.x + 14 - (D.x + 14), Q.y + 64 - (D.y + 34), 6, 6.5, 9.5, 10.5);
  add(`<rect class="sndchip qbrief" x="${D.x + 14}" y="${D.y + 34}" width="90" height="14" rx="3"/>`);
  add(`<g class="${d.levels('dbox', [[0, 0], [9, 1], [36, 0.45], [96, 0]])}">`);
  add(`<rect class="sndbox" x="${D.x}" y="${D.y}" width="${D.w}" height="${D.h}" rx="8"/>`);
  add(`<text class="t mono xs" x="${D.x + 14}" y="${D.y + 22}">sounding/mise-3</text>`);
  add(`<text class="m xxs" x="${D.x + D.w - 14}" y="${D.y + 22}" text-anchor="end">its code never lands</text>`);
  add('</g>');
  add(
    `<g class="${d.levels('qmd', [[0, 0], [10.5, 1], [36, 0.45], [96, 0]])}"><rect class="file" x="${D.x + 14}" y="${D.y + 32}" width="98" height="20" rx="3"/>` +
      `<text class="t mono xxs" x="${D.x + 22}" y="${D.y + 46}">question.md</text>` +
      `<text class="m xxs" x="${D.x + 120}" y="${D.y + 46}">written by millpond</text></g>`,
  );
  const dp = pane(
    D,
    62,
    'one session, one question',
    [
      ['reads the notes, the signals', 't', 13],
      ['tries 3.0 in this worktree', 't', 16.5],
      ['sounding offer: a finding', 'snd', 20],
      ['sounding conclude', 'snd', 25],
    ],
    36,
    'd',
  );

  // A finding beyond the question comes back as a capture.
  const O = g.offer;
  d.fly('offer', dp.x + 10 - O.x, dp.y + 72 - O.y, 20, 20.5, 24, 24.6);
  add(`<rect class="sndchip offer" x="${O.x}" y="${O.y}" width="150" height="${O.h}" rx="4"/>`);
  add(`<g class="${d.show('offerb', 24, 96)}"><rect class="sndsoft" x="${O.x}" y="${O.y}" width="${O.w}" height="${O.h}" rx="4"/>`);
  add(`<text class="t mono xxs" x="${O.x + 8}" y="${O.y + 15}">sounding/mise-3/1</text>`);
  add(`<text class="m xxs" x="${O.x + O.w - 8}" y="${O.y + 15}" text-anchor="end">a capture</text></g>`);

  // ---- the conclusion, and your decision
  const C = g.conclusion;
  add(`<g class="${d.show('conc', 27, 96)}">`);
  add(`<rect class="sndsoft" x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8"/>`);
  add(`<text class="t mono xs" x="${C.x + 14}" y="${C.y + 22}">conclusion.md</text>`);
  const rows: [string, string][] = [
    ['answer', 'take 3.0 once CI has it'],
    ['proposes', 'bump mise to 3.0'],
    ['stays open', 'the lockfile’s format'],
  ];
  rows.forEach(([k, v], i) => {
    if (n) {
      add(`<text class="m xxs" x="${C.x + 14}" y="${C.y + 46 + i * 22}">${k}</text>`);
      add(`<text class="t xs" x="${C.x + 92}" y="${C.y + 46 + i * 22}">${v}</text>`);
    } else {
      add(`<text class="m xxs" x="${C.x + 14}" y="${C.y + 42 + i * 34}">${k}</text>`);
      add(`<text class="t xs" x="${C.x + 14}" y="${C.y + 57 + i * 34}">${v}</text>`);
    }
  });
  add('</g>');
  // accept · go on · drop, accept pressed.
  const by = C.y + C.h - 30;
  const bx = C.x + 14;
  d.kf('acc', [
    [0, 'fill:var(--dg-panel)'],
    [33.5, 'fill:var(--dg-panel)'],
    [34, `fill:${S}`],
    [96, `fill:${S}`],
    [96.8, 'fill:var(--dg-panel)'],
    [100, 'fill:var(--dg-panel)'],
  ]);
  d.kf('acct', [
    [0, `fill:${S}`],
    [33.5, `fill:${S}`],
    [34, 'fill:var(--dg-ink)'],
    [96, 'fill:var(--dg-ink)'],
    [96.8, `fill:${S}`],
    [100, `fill:${S}`],
  ]);
  add(`<g class="${d.show('btns', 29, 96)}">`);
  add(`<rect class="keyb ${d.anim('acc')}" x="${bx}" y="${by}" width="62" height="20" rx="10" style="stroke:${S}"/>`);
  add(`<text class="xxs b ${d.anim('acct')}" x="${bx + 31}" y="${by + 14}" text-anchor="middle">accept</text>`);
  add(`<rect class="tag" x="${bx + 70}" y="${by}" width="56" height="20" rx="10"/><text class="m xxs" x="${bx + 98}" y="${by + 14}" text-anchor="middle">go on</text>`);
  add(`<rect class="tag" x="${bx + 134}" y="${by}" width="48" height="20" rx="10"/><text class="m xxs" x="${bx + 158}" y="${by + 14}" text-anchor="middle">drop</text>`);
  add('</g>');

  // The accepted conclusion goes back as the item's record.
  d.kf('rec', [
    [0, 'stroke-dashoffset:1200;opacity:0'],
    [35.5, 'stroke-dashoffset:1200;opacity:0'],
    [36, 'stroke-dashoffset:1200;opacity:1'],
    [41, 'stroke-dashoffset:0;opacity:1'],
    [96, 'stroke-dashoffset:0;opacity:1'],
    [96.8, 'stroke-dashoffset:0;opacity:0'],
    [100, 'stroke-dashoffset:1200;opacity:0'],
  ]);
  add(`<path class="recl ${d.anim('rec')}" d="${g.record}"/>`);
  d.rule(`.recl{fill:none;stroke:${S};stroke-width:1.5;stroke-dasharray:1200}`);
  if (g.recordLabel)
    add(
      `<text class="snd xxs ${d.show('recll', 38, 96)}" x="${g.recordLabel.x}" y="${g.recordLabel.y}" text-anchor="middle">accept keeps the conclusion as item 4’s record</text>`,
    );

  // ---- the work it proposes, a new item
  const I = g.item;
  const proposesAt = n ? { x: C.x + 92, y: C.y + 58 } : { x: C.x + 14, y: C.y + 80 };
  d.fly('prop', proposesAt.x - (I.x + 14), proposesAt.y - (I.y + 34), 42, 42.5, 46, 47);
  add(`<rect class="sndchip prop" x="${I.x + 14}" y="${I.y + 34}" width="110" height="14" rx="3"/>`);
  add(`<g class="${d.show('item', 46, 96)}">`);
  add(`<rect class="accbox" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="8"/>`);
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 22}">item 5 · from item 4</text>`);
  add(`<text class="t b sm" x="${I.x + 14}" y="${I.y + 46}">bump mise to 3.0</text>`);
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 64}">brief</text>`);
  [0, 1].forEach((k) => add(`<rect class="briefl" x="${I.x + 14}" y="${I.y + 70 + k * 10}" width="${[150, 112][k]}" height="5" rx="2.5"/>`));
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 106}">sends</text>`);
  add('</g>');
  add(`<text class="m xxs ${d.show('is0', 46, 51)}" x="${I.x + 14}" y="${I.y + 122}">none yet</text>`);
  add(`<text class="ac mono xxs ${d.show('is1', 51, 96)}" x="${I.x + 14}" y="${I.y + 122}">item/5-bump-mise</text>`);
  add(`<text class="m xxs ${d.show('il0', 51, 87)}" x="${I.x + 14}" y="${I.y + 140}">landing: waiting on sluice</text>`);
  add(`<text class="ok b xxs ${d.show('il1', 87, 96)}" x="${I.x + 14}" y="${I.y + 140}">landed 4be81a0 on main</text>`);
  add(`<g class="${d.show('ikey', 46, 96)}">`);
  key(I, 'ikey2', 50, 'var(--dg-accent)');
  add('</g>');

  // ---- the worktree
  const W2 = g.tree;
  d.fly('ibrief', I.x + 14 - (W2.x + 14), I.y + 70 - (W2.y + 34), 52, 52.5, 55, 56);
  add(`<rect class="chip ibrief" x="${W2.x + 14}" y="${W2.y + 34}" width="90" height="14" rx="3"/>`);
  d.kf('treeb', [
    [0, 'stroke:var(--dg-rule)'],
    [79.5, 'stroke:var(--dg-rule)'],
    [80, 'stroke:var(--dg-ok)'],
    [100, 'stroke:var(--dg-ok)'],
  ]);
  add(`<g class="${d.levels('tree', [[0, 0], [55, 1], [88, 0.45], [96, 0]])}">`);
  add(`<rect class="box ${d.anim('treeb')}" x="${W2.x}" y="${W2.y}" width="${W2.w}" height="${W2.h}" rx="8"/>`);
  add(`<text class="t mono xs" x="${W2.x + 14}" y="${W2.y + 22}">item/5-bump-mise</text>`);
  add(
    `<rect class="file" x="${W2.x + 14}" y="${W2.y + 32}" width="90" height="20" rx="3"/><text class="t mono xxs" x="${W2.x + 22}" y="${W2.y + 46}">BRIEF.md</text>`,
  );
  add(`<text class="m xxs" x="${W2.x + 112}" y="${W2.y + 46}">written by millpond</text>`);
  add('</g>');
  add(`<text class="m xxs ${d.show('fm', 55, 88)}" x="${W2.x + W2.w - 14}" y="${W2.y + 22}" text-anchor="end">from main</text>`);
  add(`<text class="ok xxs ${d.show('rmv', 88, 96)}" x="${W2.x + W2.w - 14}" y="${W2.y + 22}" text-anchor="end">removed, landed</text>`);
  const wp = pane(
    W2,
    62,
    'an agent, in a herdr pane',
    [
      ['reads BRIEF.md', 't', 58],
      ['bumps packages/mise to 3.0', 't', 62],
      ['wt submit main', 'ac', 66],
    ],
    88,
    'w',
  );
  if (!n) {
    const cy = W2.y + W2.h - 20;
    add(`<g class="${d.levels('brl', [[0, 0], [55, 1], [88, 0.45], [96, 0]])}"><line class="edge" x1="${W2.x + 14}" y1="${cy}" x2="${W2.x + 120}" y2="${cy}" stroke-width="1.5"/><circle class="dot" cx="${W2.x + 20}" cy="${cy}" r="4"/></g>`);
    add(`<circle class="ac ${d.levels('bc', [[0, 0], [64, 1], [88, 0.45], [96, 0]])}" cx="${W2.x + 60}" cy="${cy}" r="5.5"/>`);
    add(`<text class="m xxs ${d.levels('bcl', [[0, 0], [64, 1], [88, 0.45], [96, 0]])}" x="${W2.x + 72}" y="${cy + 4}">the agent’s commit</text>`);
  }

  // ---- sluice
  const SL = g.sluice;
  add(`<rect class="box2" x="${SL.x}" y="${SL.y}" width="${SL.w}" height="${SL.h}" rx="8"/>`);
  add(`<text class="m xxs" x="${SL.x + 14}" y="${SL.y + 20}">the queue of main</text>`);
  const cand = { x: SL.x + 14, y: SL.y + 30, w: SL.w - 28, h: 46 };
  d.fly('sub', wp.x + 10 - cand.x, wp.y + 60 - cand.y, 67, 67.5, 70.5, 71.5);
  add(`<rect class="chip sub" x="${cand.x}" y="${cand.y}" width="110" height="14" rx="3"/>`);
  add(`<g class="${d.show('cand', 70.5, 96)}"><rect class="slbox" x="${cand.x}" y="${cand.y}" width="${cand.w}" height="${cand.h}" rx="5"/>`);
  add(`<text class="t mono xxs" x="${cand.x + 10}" y="${cand.y + 17}">main + item/5-bump-mise</text>`);
  add(`<rect class="sltrack" x="${cand.x + 10}" y="${cand.y + 28}" width="${cand.w - 20}" height="8" rx="4"/>`);
  d.kf('slb', [
    [0, 'transform:scaleX(0)'],
    [71, 'transform:scaleX(0)'],
    [78, 'transform:scaleX(1)'],
    [96, 'transform:scaleX(1)'],
    [100, 'transform:scaleX(0)'],
  ]);
  add(`<rect class="slbar ${d.anim('slb')}" x="${cand.x + 10}" y="${cand.y + 28}" width="${cand.w - 20}" height="8" rx="4"/></g>`);
  add(`<text class="m xxs ${d.show('cs0', 71, 78)}" x="${SL.x + SL.w - 14}" y="${SL.y + 20}" text-anchor="end">testing as merged…</text>`);
  add(`<text class="ok b xxs ${d.show('cs1', 78, 96)}" x="${SL.x + SL.w - 14}" y="${SL.y + 20}" text-anchor="end">passed</text>`);
  const ly = SL.y + (n ? 112 : 112);
  const lx0 = SL.x + 34;
  const mx = SL.x + SL.w - 60;
  add(`<line class="edge" x1="${SL.x + 14}" y1="${ly}" x2="${lx0 + 8}" y2="${ly}"/>`);
  add(`<line class="edge ${d.show('le', 80, 96)}" x1="${lx0}" y1="${ly}" x2="${mx}" y2="${ly}"/>`);
  add(`<circle class="dot" cx="${lx0}" cy="${ly}" r="5"/>`);
  add(
    `<g class="${d.show('mg', 80, 96)}"><circle class="merge" cx="${mx}" cy="${ly}" r="8"/><circle class="mergein" cx="${mx}" cy="${ly}" r="3.5"/>` +
      `<text class="ok b xxs" x="${mx}" y="${ly + 22}" text-anchor="middle">4be81a0</text></g>`,
  );
  const dx = mx - lx0;
  d.kf('head', [
    [0, 'transform:translate(0px,0px)'],
    [80, 'transform:translate(0px,0px)'],
    [82, `transform:translate(${dx}px,0px)`],
    [96, `transform:translate(${dx}px,0px)`],
    [98.5, 'transform:translate(0px,0px)'],
    [100, 'transform:translate(0px,0px)'],
  ]);
  add(
    `<g class="${d.anim('head')}"><rect class="pill" x="${lx0 - 22}" y="${ly - 32}" width="44" height="18" rx="9"/>` +
      `<text class="pillt mono xxs" x="${lx0}" y="${ly - 19}" text-anchor="middle">main</text></g>`,
  );
  if (!n) {
    add(`<text class="m xxs" x="${SL.x + 14}" y="${SL.y + SL.h - 30}">sluice moves main only</text>`);
    add(`<text class="m xxs" x="${SL.x + 14}" y="${SL.y + SL.h - 16}">to a merge that passed</text>`);
  }

  // The landing comes back to the item.
  d.kf('back', [
    [0, 'stroke-dashoffset:1200;opacity:0'],
    [81.5, 'stroke-dashoffset:1200;opacity:0'],
    [82, 'stroke-dashoffset:1200;opacity:1'],
    [87, 'stroke-dashoffset:0;opacity:1'],
    [96, 'stroke-dashoffset:0;opacity:1'],
    [96.8, 'stroke-dashoffset:0;opacity:0'],
    [100, 'stroke-dashoffset:1200;opacity:0'],
  ]);
  add(`<path class="backl ${d.anim('back')}" d="${g.landing}"/>`);
  d.rule('.backl{fill:none;stroke:var(--dg-ok);stroke-width:1.5;stroke-dasharray:1200}');
  if (g.landingLabel)
    add(
      `<text class="ok xxs ${d.show('bkl', 84, 96)}" x="${g.landingLabel.x}" y="${g.landingLabel.y}" text-anchor="middle">millpond reads sluice’s record of the branch and writes the landing on item 5</text>`,
    );

  return d.render({
    id: n ? 'dn' : 'dw',
    width: g.W,
    height: g.H,
    title: 'Where an item goes, and what comes back to it',
    desc:
      'Item 4 asks a question: take mise 3.0, a major release? millpond sends it to a sounding, one session in the worktree sounding/mise-3, with question.md ' +
      'written from the item’s signals and the release notes. The session tries 3.0, offers a finding beyond its question back to the inbox as the capture ' +
      'sounding/mise-3/1, and concludes: take 3.0 once CI has it, proposing a bump. You accept, the conclusion becomes item 4’s record, and the proposed bump ' +
      'becomes item 5. millpond sends item 5 to one worktree, where an agent works from BRIEF.md and submits; sluice tests main plus the branch as merged and ' +
      'lands the merge 4be81a0, and millpond writes the landing on item 5. The sounding’s own code never lands.',
    still: 92,
  });
}
