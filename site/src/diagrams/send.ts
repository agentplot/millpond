// One item, one worktree, one landing. millpond sends an item: it makes a
// worktree on a branch named for the item, writes the brief there and starts
// an agent. The agent submits through sluice, which tests the change as
// merged and lands it on main. millpond reads sluice's record of the branch
// and writes the landing against the item.
//
// Timeline, percent of a 14 s loop:
//   4-14 send · 16-42 the agent works · 44-62 sluice tests and lands
//   64-76 the landing comes back to the item · 76-96 hold
import { Diagram, type Layout } from './kit';

const T = 14;

function geometry(layout: Layout) {
  if (layout === 'wide') {
    return {
      W: 720,
      H: 348,
      inboxLabel: { x: 16, y: 30 },
      item: { x: 12, y: 44, w: 200, h: 176 },
      treeLabel: { x: 236, y: 30 },
      tree: { x: 232, y: 44, w: 240, h: 230 },
      sluiceLabel: { x: 496, y: 30 },
      sluice: { x: 492, y: 44, w: 216, h: 230 },
      back: 'M600,274 V300 Q600,312 588,312 H208 Q196,312 196,300 V220',
      backLabel: { x: 356, y: 330 },
      crew: { x: 16, y: 244 },
    };
  }
  return {
    W: 360,
    H: 756,
    inboxLabel: { x: 14, y: 28 },
    item: { x: 8, y: 40, w: 312, h: 168 },
    treeLabel: { x: 14, y: 240 },
    tree: { x: 8, y: 252, w: 312, h: 214 },
    sluiceLabel: { x: 14, y: 498 },
    sluice: { x: 8, y: 510, w: 312, h: 196 },
    back: 'M320,640 H334 Q344,640 344,630 V134 Q344,124 334,124 H320',
    backLabel: { x: 14, y: 726 },
    crew: null,
  };
}

export function send(layout: Layout) {
  const g = geometry(layout);
  const n = layout === 'narrow';
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);
  d.rule(
    '.sl{fill:var(--dg-ok)} .slbox{fill:var(--dg-panel);stroke:var(--dg-ok);stroke-width:1.5} .sltrack{fill:var(--dg-soft)}' +
      '.slbar{fill:var(--dg-ok);transform-box:fill-box;transform-origin:left center} .term{fill:var(--dg-bg);stroke:var(--dg-rule);stroke-width:1} .briefl{fill:var(--dg-muted);opacity:.45}' +
      '.backline{fill:none;stroke:var(--dg-ok);stroke-width:1.5;stroke-dasharray:6 4}',
  );

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);

  // ---- the item, in the inbox
  add(`<text class="hd" x="${g.inboxLabel.x}" y="${g.inboxLabel.y}">THE INBOX</text>`);
  const I = g.item;
  add(`<rect class="accbox" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="8"/>`);
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 22}">item 1 · 3 signals</text>`);
  add(`<text class="t b sm" x="${I.x + 14}" y="${I.y + 48}">bump mise to 2026.10.10</text>`);
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 70}">brief</text>`);
  [0, 1, 2].forEach((k) => add(`<rect class="briefl" x="${I.x + 14}" y="${I.y + 78 + k * 10}" width="${[150, 128, 96][k]}" height="5" rx="2.5"/>`));
  // Its sends: none, then the worktree, then the landing.
  add(`<text class="m xxs" x="${I.x + 14}" y="${I.y + 126}">sends</text>`);
  add(`<text class="m xxs ${d.show('snd0', 0, 9)}" x="${I.x + 14}" y="${I.y + 142}">none yet</text>`);
  add(`<text class="ac mono xxs ${d.show('snd1', 9, 96)}" x="${I.x + 14}" y="${I.y + 142}">item/1-bump-mise</text>`);
  add(`<text class="m xxs ${d.show('lnd0', 9, 72)}" x="${I.x + 14}" y="${I.y + 160}">landing: waiting on sluice</text>`);
  add(`<text class="ok b xxs ${d.show('lnd1', 72, 96)}" x="${I.x + 14}" y="${I.y + 160}">landed 9f2c1e4 on main</text>`);
  // The send key.
  const sk = { x: I.x + I.w - 62, y: I.y + 9 };
  d.kf('skey', [
    [0, 'fill:var(--dg-panel)'],
    [5.5, 'fill:var(--dg-panel)'],
    [6, 'fill:var(--dg-accent)'],
    [9, 'fill:var(--dg-accent)'],
    [9.8, 'fill:var(--dg-panel)'],
    [100, 'fill:var(--dg-panel)'],
  ]);
  add(`<rect class="skb ${d.anim('skey')}" x="${sk.x}" y="${sk.y}" width="50" height="20" rx="10"/>`);
  d.rule('.skb{stroke:var(--dg-accent);stroke-width:1.25}');
  add(`<text class="ac xxs b" x="${sk.x + 25}" y="${sk.y + 14}" text-anchor="middle">send</text>`);
  if (g.crew) {
    add(`<text class="m xxs" x="${g.crew.x}" y="${g.crew.y}">a crew inbox refuses a send;</text>`);
    add(`<text class="m xxs" x="${g.crew.x}" y="${g.crew.y + 14}">crew’s planner takes its items</text>`);
  }

  // ---- the worktree
  add(`<text class="hd" x="${g.treeLabel.x}" y="${g.treeLabel.y}">ONE WORKTREE</text>`);
  const W2 = g.tree;
  // The brief travels from the item into the new worktree.
  d.fly('brief', I.x + 14 - (W2.x + 14), I.y + 78 - (W2.y + 40), 8, 9, 13, 14.5);
  add(`<rect class="chip brief" x="${W2.x + 14}" y="${W2.y + 40}" width="80" height="14" rx="3"/>`);
  d.kf('treeb', [
    [0, 'stroke:var(--dg-rule)'],
    [61.5, 'stroke:var(--dg-rule)'],
    [62, 'stroke:var(--dg-ok)'],
    [100, 'stroke:var(--dg-ok)'],
  ]);
  add(`<g class="${d.levels('tree', [[0, 0], [10, 1], [78, 0.45], [96, 0]])}">`);
  add(`<rect class="box ${d.anim('treeb')}" x="${W2.x}" y="${W2.y}" width="${W2.w}" height="${W2.h}" rx="8"/>`);
  add(`<text class="t mono xs" x="${W2.x + 14}" y="${W2.y + 22}">item/1-bump-mise</text>`);
  add('</g>');
  add(`<text class="m xxs ${d.show('fm', 10, 78)}" x="${W2.x + W2.w - 14}" y="${W2.y + 22}" text-anchor="end">from main</text>`);
  add(`<text class="ok xxs ${d.show('rmv', 78, 96)}" x="${W2.x + W2.w - 14}" y="${W2.y + 22}" text-anchor="end">removed, landed</text>`);
  add(
    `<g class="${d.levels('bmd', [[0, 0], [14, 1], [78, 0.45], [96, 0]])}"><rect class="file" x="${W2.x + 14}" y="${W2.y + 34}" width="90" height="20" rx="3"/>` +
      `<text class="t mono xxs" x="${W2.x + 22}" y="${W2.y + 48}">BRIEF.md</text></g>`,
  );
  add(`<text class="m xxs ${d.levels('bml', [[0, 0], [14, 1], [78, 0.45], [96, 0]])}" x="${W2.x + 112}" y="${W2.y + 48}">written by millpond</text>`);
  // The agent's pane.
  const pane = { x: W2.x + 14, y: W2.y + 66, w: W2.w - 28, h: n ? 104 : 116 };
  add(`<g class="${d.levels('pane', [[0, 0], [16, 1], [78, 0.45], [96, 0]])}">`);
  add(`<rect class="term" x="${pane.x}" y="${pane.y}" width="${pane.w}" height="${pane.h}" rx="5"/>`);
  add(`<text class="m xxs" x="${pane.x + 10}" y="${pane.y + 16}">an agent, in a herdr pane</text>`);
  add('</g>');
  const lines: [string, string, number][] = [
    ['reads BRIEF.md', 't', 18],
    ['bumps packages/mise', 't', 24],
    ['tests pass here', 't', 30],
    ['wt submit main', 'ac', 38],
  ];
  lines.forEach(([t, c, at], k) =>
    add(`<text class="${c} mono xxs ${d.levels(`pl${k}`, [[0, 0], [at, 1], [78, 0.45], [96, 0]])}" x="${pane.x + 10}" y="${pane.y + 36 + k * 18}">› ${t}</text>`),
  );
  // The branch's commit.
  const by = W2.y + W2.h - 22;
  add(`<g class="${d.levels('brl', [[0, 0], [16, 1], [78, 0.45], [96, 0]])}"><line class="edge" x1="${W2.x + 14}" y1="${by}" x2="${W2.x + 120}" y2="${by}" stroke-width="1.5"/>`);
  add(`<circle class="dot" cx="${W2.x + 20}" cy="${by}" r="4"/></g>`);
  add(`<circle class="ac ${d.levels('bc', [[0, 0], [34, 1], [78, 0.45], [96, 0]])}" cx="${W2.x + 60}" cy="${by}" r="5.5"/>`);
  add(`<text class="m xxs ${d.levels('bcl', [[0, 0], [34, 1], [78, 0.45], [96, 0]])}" x="${W2.x + 72}" y="${by + 4}">the agent’s commit</text>`);

  // ---- sluice
  add(`<text class="hd" x="${g.sluiceLabel.x}" y="${g.sluiceLabel.y}">SLUICE</text>`);
  const S = g.sluice;
  add(`<rect class="box2" x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="8"/>`);
  add(`<text class="m xxs" x="${S.x + 14}" y="${S.y + 20}">the queue of main</text>`);
  // The submission joins the queue.
  const cand = { x: S.x + 14, y: S.y + 32, w: S.w - 28, h: 50 };
  d.fly('sub', pane.x + 10 - cand.x, pane.y + 78 - cand.y, 40, 41, 46, 47.5);
  add(`<rect class="chip sub" x="${cand.x}" y="${cand.y}" width="110" height="14" rx="3"/>`);
  add(`<g class="${d.show('cand', 46, 96)}"><rect class="slbox" x="${cand.x}" y="${cand.y}" width="${cand.w}" height="${cand.h}" rx="5"/>`);
  add(`<text class="t mono xxs" x="${cand.x + 10}" y="${cand.y + 18}">main + item/1-bump-mise</text>`);
  add(`<rect class="sltrack" x="${cand.x + 10}" y="${cand.y + 30}" width="${cand.w - 20}" height="8" rx="4"/>`);
  d.kf('slb', [
    [0, 'transform:scaleX(0)'],
    [47, 'transform:scaleX(0)'],
    [58, 'transform:scaleX(1)'],
    [96, 'transform:scaleX(1)'],
    [100, 'transform:scaleX(0)'],
  ]);
  add(`<rect class="slbar ${d.anim('slb')}" x="${cand.x + 10}" y="${cand.y + 30}" width="${cand.w - 20}" height="8" rx="4"/></g>`);
  const cs = { x: S.x + S.w - 14, y: S.y + 20 };
  add(`<text class="m xxs ${d.show('cs0', 47, 58)}" x="${cs.x}" y="${cs.y}" text-anchor="end">testing as merged…</text>`);
  add(`<text class="ok b xxs ${d.show('cs1', 58, 96)}" x="${cs.x}" y="${cs.y}" text-anchor="end">passed</text>`);
  // main: the merge that carries exactly what passed.
  const ly = S.y + (n ? 128 : 140);
  const lx0 = S.x + 24;
  const mx = S.x + S.w - 60;
  add(`<line class="edge" x1="${S.x + 14}" y1="${ly}" x2="${lx0 + 8}" y2="${ly}"/>`);
  add(`<line class="edge ${d.show('le', 60, 96)}" x1="${lx0}" y1="${ly}" x2="${mx}" y2="${ly}"/>`);
  add(`<circle class="dot" cx="${lx0}" cy="${ly}" r="5"/>`);
  add(
    `<g class="${d.show('mg', 60, 96)}"><circle class="merge" cx="${mx}" cy="${ly}" r="8"/><circle class="mergein" cx="${mx}" cy="${ly}" r="3.5"/>` +
      `<text class="ok b xxs" x="${mx}" y="${ly + 24}" text-anchor="middle">9f2c1e4</text></g>`,
  );
  const dx = mx - lx0;
  d.kf('head', [
    [0, 'transform:translate(0px,0px)'],
    [60, 'transform:translate(0px,0px)'],
    [62, `transform:translate(${dx}px,0px)`],
    [96, `transform:translate(${dx}px,0px)`],
    [98.5, 'transform:translate(0px,0px)'],
    [100, 'transform:translate(0px,0px)'],
  ]);
  add(
    `<g class="${d.anim('head')}"><rect class="pill" x="${lx0 - 22}" y="${ly - 34}" width="44" height="18" rx="9"/>` +
      `<text class="pillt mono xxs" x="${lx0}" y="${ly - 21}" text-anchor="middle">main</text></g>`,
  );
  add(`<text class="m xxs" x="${S.x + 14}" y="${S.y + S.h - 32}">sluice moves main only</text>`);
  add(`<text class="m xxs" x="${S.x + 14}" y="${S.y + S.h - 18}">to a merge that passed</text>`);

  // ---- the landing comes back to the item
  d.kf('back', [
    [0, 'stroke-dashoffset:900;opacity:0'],
    [63.5, 'stroke-dashoffset:900;opacity:0'],
    [64, 'stroke-dashoffset:900;opacity:1'],
    [72, 'stroke-dashoffset:0;opacity:1'],
    [96, 'stroke-dashoffset:0;opacity:1'],
    [96.8, 'stroke-dashoffset:0;opacity:0'],
    [100, 'stroke-dashoffset:900;opacity:0'],
  ]);
  add(`<path class="backl ${d.anim('back')}" d="${g.back}"/>`);
  d.rule('.backl{fill:none;stroke:var(--dg-ok);stroke-width:1.5;stroke-dasharray:900}');
  const bk = d.show('bkl', 66, 96);
  if (n) {
    add(`<text class="ok xxs ${bk}" x="${g.backLabel.x}" y="${g.backLabel.y}">millpond reads sluice’s record of the branch</text>`);
    add(`<text class="ok xxs ${bk}" x="${g.backLabel.x}" y="${g.backLabel.y + 15}">and writes the landing on the item</text>`);
  } else {
    add(
      `<text class="ok xxs ${bk}" x="${g.backLabel.x}" y="${g.backLabel.y}" text-anchor="middle">millpond reads sluice’s record of the branch and writes the landing on the item</text>`,
    );
  }

  return d.render({
    id: n ? 'dn' : 'dw',
    width: g.W,
    height: g.H,
    title: 'One item, one worktree, one landing',
    desc:
      'Item 1, bump mise to 2026.10.10, waits in the inbox with its brief. Sending it makes one worktree on the branch item/1-bump-mise, ' +
      'where millpond writes BRIEF.md and starts an agent in a herdr pane. The agent reads the brief, bumps the package, runs the tests and submits with wt submit main. ' +
      'sluice tests main plus the branch as merged, it passes, and sluice moves main to the merge 9f2c1e4. millpond reads sluice’s record of the branch and writes ' +
      'the landing on the item, and the worktree is removed. An inbox crew keeps refuses a send, since its items go to crew’s planner.',
    still: 92,
  });
}
