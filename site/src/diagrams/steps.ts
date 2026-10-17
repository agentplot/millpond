// The seven steps. One run hands millpond four lines, and each takes the
// same steps in order: a release that is its own excerpt goes through and
// becomes one signal, cut at a line; a bad key is refused at the check; a key
// already held is passed over at the lookup; a meeting is taken and marked
// unread. None of them stops the others, and the run's record counts them.
//
// Timeline, percent of a 14 s loop:
//   4-20 line A · 23-27 B · 30-37 C · 40-56 D · 60-78 the run's record
import { Diagram, esc, type Layout } from './kit';

const T = 14;

const STEPS = [
  ['check', 'the line'],
  ['look up', 'the key'],
  ['bank', 'raw files'],
  ['write the', 'capture'],
  ['write its', 'signal'],
  ['mark it', 'unread'],
];

type State = 'pass' | 'refuse' | 'held' | 'skip' | 'unread';

// Each line: its key, what it is, what became of it, and its cells in time.
const LINES: { key: string; what: string; outcome: string; tone: string; cells: [number, State, number][] }[] = [
  {
    key: 'release/mise/2026.10.10',
    what: 'carries its excerpt',
    outcome: 'taken · 1 signal, cut at a line',
    tone: 't',
    cells: [[0, 'pass', 4], [1, 'pass', 7], [2, 'pass', 10], [3, 'pass', 13], [4, 'pass', 16], [5, 'skip', 19]],
  },
  {
    key: 'release/../notes',
    what: 'a key with a .. segment',
    outcome: 'refused · named in the run',
    tone: 'bad',
    cells: [[0, 'refuse', 24], [1, 'skip', 26], [2, 'skip', 26], [3, 'skip', 26], [4, 'skip', 26], [5, 'skip', 26]],
  },
  {
    key: 'release/jq/1.8.1',
    what: 'a key the inbox holds',
    outcome: 'passed over · counted',
    tone: 'm',
    cells: [[0, 'pass', 31], [1, 'held', 34], [2, 'skip', 36], [3, 'skip', 36], [4, 'skip', 36], [5, 'skip', 36]],
  },
  {
    key: 'meeting/wispr/7c1e04',
    what: 'no excerpt',
    outcome: 'taken · unread, a reader is charged',
    tone: 't',
    cells: [[0, 'pass', 41], [1, 'pass', 44], [2, 'pass', 47], [3, 'pass', 50], [4, 'skip', 53], [5, 'unread', 53]],
  },
];
const DONE = [19, 26, 36, 55];

function geometry(layout: Layout) {
  if (layout === 'wide') {
    return {
      W: 720,
      H: 368,
      // cell centre for line i, step j
      cell: (i: number, j: number) => ({ x: 236 + j * 54, y: 102 + i * 50 }),
      row: (i: number) => ({ x: 12, y: 80 + i * 50, w: 528, h: 44 }),
      key: (i: number) => ({ x: 46, y: 98 + i * 50 }),
      head: (j: number) => ({ x: 236 + j * 54, y: 48 }),
      cut: { x: 12, y: 290, w: 528, h: 64 },
      run: { x: 552, y: 36, w: 158, h: 318 },
    };
  }
  return {
    W: 360,
    H: 640,
    cell: (i: number, j: number) => ({ x: 204 + i * 42, y: 190 + j * 34 }),
    row: (i: number) => ({ x: 10, y: 36 + i * 28, w: 340, h: 24 }),
    key: (i: number) => ({ x: 50, y: 56 + i * 28 }),
    head: (j: number) => ({ x: 16, y: 194 + j * 34 }),
    cut: { x: 10, y: 400, w: 340, h: 72 },
    run: { x: 10, y: 486, w: 340, h: 142 },
  };
}

export function steps(layout: Layout) {
  const g = geometry(layout);
  const n = layout === 'narrow';
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);
  d.rule(
    '.cell{fill:none;stroke:var(--dg-rule);stroke-width:1.25} .ck{fill:none;stroke:var(--dg-ink);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
      '.xk{fill:none;stroke:var(--dg-bad);stroke-width:2;stroke-linecap:round} .rf{fill:none;stroke:var(--dg-bad);stroke-width:1.5}' +
      '.hk{fill:none;stroke:var(--dg-muted);stroke-width:1.5} .sk{stroke:var(--dg-muted);stroke-width:1.5;stroke-linecap:round;opacity:.6}' +
      '.ur{fill:none;stroke:var(--dg-accent);stroke-width:1.5} .ring{fill:none;stroke:var(--dg-accent);stroke-width:2}',
  );

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  add(`<text class="hd" x="${n ? 14 : 24}" y="${n ? 24 : 28}">ONE RUN · FOUR LINES · THE SAME STEPS</text>`);

  const letters = ['A', 'B', 'C', 'D'];
  // Line rows (wide) or the legend of lines (narrow).
  LINES.forEach((l, i) => {
    const r = g.row(i);
    const k = g.key(i);
    add(`<rect class="box2" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="6"/>`);
    if (n) {
      add(`<circle class="badge" cx="${r.x + 16}" cy="${r.y + 12}" r="9"/><text class="badget" x="${r.x + 16}" y="${r.y + 16}" text-anchor="middle">${letters[i]}</text>`);
      add(`<text class="t mono xxs" x="${k.x - 6}" y="${k.y - 4}">${esc(l.key)}</text>`);
      add(`<text class="m xxs ${d.show(`wh${i}`, 0, DONE[i])}" x="${r.x + r.w - 8}" y="${k.y - 4}" text-anchor="end">${l.what.replace('a key ', '')}</text>`);
      add(`<text class="${l.tone} xxs ${d.show(`oc${i}`, DONE[i], 96)}" x="${r.x + r.w - 8}" y="${k.y - 4}" text-anchor="end">${l.outcome.split(' · ')[0]}</text>`);
    } else {
      add(`<circle class="badge" cx="${r.x + 17}" cy="${r.y + 22}" r="9"/><text class="badget" x="${r.x + 17}" y="${r.y + 26}" text-anchor="middle">${letters[i]}</text>`);
      add(`<text class="t mono xs" x="${k.x}" y="${k.y - 2}">${esc(l.key)}</text>`);
      add(`<text class="m xxs ${d.show(`wh${i}`, 0, DONE[i])}" x="${k.x}" y="${k.y + 14}">${l.what}</text>`);
      add(`<text class="${l.tone} xxs ${d.show(`oc${i}`, DONE[i], 96)}" x="${k.x}" y="${k.y + 14}">${l.outcome}</text>`);
    }
  });

  // Step headers.
  STEPS.forEach(([a, b], j) => {
    const h = g.head(j);
    if (n) {
      add(`<text class="t xs" x="${h.x}" y="${h.y}"><tspan class="ac b">${j + 1}</tspan>  ${a} ${b}</text>`);
    } else {
      add(`<text class="ac xs b" x="${h.x}" y="${h.y}" text-anchor="middle">${j + 1}</text>`);
      add(`<text class="m xxs" x="${h.x}" y="${h.y + 14}" text-anchor="middle">${a}</text>`);
      add(`<text class="m xxs" x="${h.x}" y="${h.y + 26}" text-anchor="middle">${b}</text>`);
    }
  });
  if (n) LINES.forEach((_, i) => {
    const c = g.cell(i, 0);
    add(`<text class="m xs b" x="${c.x}" y="${c.y - 24}" text-anchor="middle">${letters[i]}</text>`);
  });

  // Cells, and the ring that runs along each line as it is handled.
  LINES.forEach((l, i) => {
    for (let j = 0; j < STEPS.length; j++) {
      const c = g.cell(i, j);
      add(`<rect class="cell" x="${c.x - 11}" y="${c.y - 11}" width="22" height="22" rx="5"/>`);
    }
    l.cells.forEach(([j, st, t], m) => {
      const c = g.cell(i, j);
      const cls = d.show(`c${i}${j}`, t, 96);
      let mark = '';
      if (st === 'pass')
        mark = `<rect class="chip" x="${c.x - 11}" y="${c.y - 11}" width="22" height="22" rx="5"/><path class="ck" d="M${c.x - 5},${c.y} l3.5,3.5 l6.5,-7"/>`;
      if (st === 'refuse')
        mark = `<rect class="rf" x="${c.x - 11}" y="${c.y - 11}" width="22" height="22" rx="5"/><path class="xk" d="M${c.x - 4.5},${c.y - 4.5} l9,9 M${c.x + 4.5},${c.y - 4.5} l-9,9"/>`;
      if (st === 'held')
        mark = `<rect class="hk" x="${c.x - 11}" y="${c.y - 11}" width="22" height="22" rx="5"/><path class="hk" d="M${c.x - 5},${c.y - 2.5} h10 M${c.x - 5},${c.y + 2.5} h10"/>`;
      if (st === 'skip') mark = `<line class="sk" x1="${c.x - 4}" y1="${c.y}" x2="${c.x + 4}" y2="${c.y}"/>`;
      if (st === 'unread')
        mark = `<rect class="ur" x="${c.x - 11}" y="${c.y - 11}" width="22" height="22" rx="5"/><circle class="ac" cx="${c.x}" cy="${c.y}" r="4"/>`;
      add(`<g class="${cls}">${mark}</g>`);
      void m;
    });
    // The ring: at each handled cell in turn, then gone.
    const handled = l.cells.filter(([, st], k) => st !== 'skip' || k === l.cells.findIndex(([, s]) => s === 'skip'));
    const fr: [number, string][] = [];
    const c0 = g.cell(i, 0);
    const pos = (j: number) => {
      const c = g.cell(i, j);
      return `transform:translate(${c.x - c0.x}px,${c.y - c0.y}px)`;
    };
    const first = handled[0];
    fr.push([0, `${pos(first[0])};opacity:0`], [first[2] - 1.5, `${pos(first[0])};opacity:0`], [first[2] - 1, `${pos(first[0])};opacity:1`]);
    handled.forEach(([j, , t], k) => {
      if (k === 0) return;
      const prev = handled[k - 1];
      fr.push([t - 1.8, `${pos(prev[0])};opacity:1`], [t - 0.6, `${pos(j)};opacity:1`]);
    });
    const last = handled[handled.length - 1];
    fr.push([last[2] + 0.6, `${pos(last[0])};opacity:1`], [last[2] + 1.4, `${pos(last[0])};opacity:0`], [100, `${pos(last[0])};opacity:0`]);
    d.kf(`ring${i}`, fr);
    add(`<rect class="ring ${d.anim(`ring${i}`)}" x="${c0.x - 15}" y="${c0.y - 15}" width="30" height="30" rx="7"/>`);
  });

  // Step 5's cut: the release's notes, cut at a line under the limit.
  const C = g.cut;
  add(`<g class="${d.show('cut', 16, 96)}">`);
  add(`<rect class="box2" x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="6"/>`);
  add(`<text class="hd" x="${C.x + 12}" y="${C.y + 16}">${n ? 'A’S SIGNAL, CUT AT STEP 5' : 'LINE A’S SIGNAL · ITS EXCERPT, CUT AT STEP 5'}</text>`);
  add(`<text class="m mono xxs" x="${C.x + 12}" y="${C.y + 33}">${n ? '- fix: `mise use` keeps the lock' : '- fix: `mise use` keeps the lockfile when a tool is pinned'}</text>`);
  add(`<line class="dash" x1="${C.x + 12}" y1="${C.y + 41}" x2="${C.x + C.w - 12}" y2="${C.y + 41}"/>`);
  add(
    `<text class="ac mono xxs" x="${C.x + 12}" y="${C.y + 56}">${n ? '[41 more lines, 6.2 KB, in raw]' : '[the raw record holds 41 more lines, 6.2 KB, past this cut under 8 KiB]'}</text>`,
  );
  if (n) add(`<text class="m xxs" x="${C.x + 12}" y="${C.y + 68}">cut at a line under 8 KiB</text>`);
  add('</g>');

  // Step 7: the run's record.
  const R = g.run;
  add(`<rect class="box" x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="8"/>`);
  add(`<text class="t xs" x="${R.x + 12}" y="${R.y + 22}"><tspan class="ac b">7</tspan>  record the run</text>`);
  // Each entry: label, value, value's tone, when, and its place (wide y, narrow column and row).
  const rec: [string, string, string, number][] = [
    ['taken', '2', 't', 60],
    ['passed over', '1', 't', 62.5],
    ['refused', '1', 't', 65],
    ['ended', 'with done', 't', 67.5],
    ['cursor', 'advances', 't', 70],
  ];
  rec.forEach(([k, v, tone, t], i) => {
    const cls = d.show(`rr${i}`, t, 96);
    if (n) {
      const col = i < 3 ? 0 : 1;
      const row = i < 3 ? i : i - 3;
      const x = R.x + 12 + col * 150;
      const y = R.y + 48 + row * 22;
      add(`<text class="${cls} xs" x="${x}" y="${y}"><tspan class="m">${k}</tspan> <tspan class="${tone} b">${v}</tspan></text>`);
    } else {
      const y = R.y + 52 + i * 40 + (i > 2 ? 16 : 0);
      add(`<text class="m xxs ${cls}" x="${R.x + 12}" y="${y}">${k}</text>`);
      add(`<text class="${tone} sm b ${cls}" x="${R.x + 12}" y="${y + 17}">${v}</text>`);
    }
  });
  {
    const cls = d.show('rrb', 65.5, 96);
    if (n) add(`<text class="bad xxs ${cls}" x="${R.x + 162}" y="${R.y + 92}">line B, a .. in its key</text>`);
    else add(`<text class="bad xxs ${cls}" x="${R.x + 12}" y="${R.y + 52 + 80 + 32}">line B, a .. in its key</text>`);
  }
  const sy = n ? R.y + R.h - 14 : R.y + R.h - 30;
  add(`<g class="${d.show('rjs', 73, 96)}"><text class="m xxs" x="${R.x + 12}" y="${sy}">the doctor reads</text>`);
  add(`<text class="ac mono xxs" x="${R.x + (n ? 104 : 12)}" y="${n ? sy : sy + 14}">millpond status --json</text></g>`);

  return d.render({
    id: n ? 'sn' : 'sw',
    width: g.W,
    height: g.H,
    title: 'Every line takes the same seven steps',
    desc:
      'One run hands millpond four lines. Line A, a release that carries its own excerpt, passes the check, the key lookup, raw banking and the capture write, ' +
      'and step 5 writes its one signal, cutting the excerpt at a line under 8 KiB and closing it with what the raw record holds past the cut. ' +
      'Line B has a key with a .. segment and is refused at the check, named in the run. Line C has a key the inbox already holds and is passed over at the lookup. ' +
      'Line D, a meeting with no excerpt, is taken and marked unread, which charges a reader. Step 7 records the run: two taken, one passed over, one refused, ' +
      'the run ended with done, so its cursor advances, and the doctor reads the status from millpond status --json.',
    still: 92,
  });
}
