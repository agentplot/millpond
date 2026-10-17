// Lines into git, raw files on the host. One adapter run prints a line and
// writes a transcript; millpond banks the transcript on the host and commits
// the capture, with a pointer to it, into the inbox. The push carries the
// commit to GitHub, and the transcript never leaves the host.
//
// Timeline, percent of a 12 s loop:
//   4-28 the run prints and writes · 28-44 bank, record, point, commit
//   50-62 push · 62-96 hold
import { Diagram, type Layout } from './kit';

const T = 12;

function geometry(layout: Layout) {
  if (layout === 'wide') {
    return {
      W: 720,
      H: 360,
      host: { x: 10, y: 40, w: 556, h: 304 },
      hostLabel: { x: 24, y: 60 },
      adapter: { x: 24, y: 76, w: 172, h: 104 },
      lineRoute: [{ x: 196, y: 115 }, { x: 286, y: 115 }, { x: 286, y: 122 }],
      fileRoute: [{ x: 178, y: 130 }, { x: 222, y: 130 }, { x: 228, y: 254 }, { x: 316, y: 254 }],
      inbox: { x: 300, y: 68, w: 252, h: 136 },
      record: { x: 312, y: 118, w: 228, h: 66 },
      log: { x: 320, y: 102 },
      bank: { x: 300, y: 226, w: 252, h: 104 },
      file: { x: 316, y: 254, w: 40, h: 52 },
      linePath: 'M196,124 L300,124',
      filePath: 'M196,150 H232 Q240,150 240,158 V270 Q240,278 248,278 H300',
      lineLabel: { x: 206, y: 116 },
      fileLabel: { x: 206, y: 142 },
      pointer: 'M336,184 L336,254',
      pointerLabel: { x: 344, y: 224 },
      gh: { x: 590, y: 68, w: 118, h: 262 },
      push: 'M552,102 L590,102',
      pushLabel: { x: 571, y: 94 },
      never: 'M552,290 L590,290',
      neverX: { x: 566, y: 290 },
      neverLabel: { x: 556, y: 312 },
      ghRecord: { x: 600, y: 120, w: 98, h: 40 },
    };
  }
  return {
    W: 360,
    H: 492,
    host: { x: 6, y: 34, w: 348, h: 318 },
    hostLabel: { x: 16, y: 54 },
    adapter: { x: 16, y: 64, w: 328, h: 62 },
    lineRoute: [{ x: 26, y: 118 }, { x: 26, y: 204 }, { x: 24, y: 210 }],
    fileRoute: [{ x: 248, y: 96 }, { x: 248, y: 140 }, { x: 200, y: 196 }],
    inbox: { x: 16, y: 158, w: 164, h: 178 },
    record: { x: 24, y: 206, w: 148, h: 104 },
    log: { x: 32, y: 192 },
    bank: { x: 188, y: 158, w: 156, h: 178 },
    file: { x: 200, y: 196, w: 40, h: 52 },
    linePath: 'M92,126 L92,158',
    filePath: 'M268,126 L268,158',
    lineLabel: { x: 100, y: 146 },
    fileLabel: { x: 276, y: 146 },
    pointer: 'M160,294 C184,294 184,230 200,226',
    pointerLabel: { x: 206, y: 284 },
    gh: { x: 16, y: 384, w: 328, h: 96 },
    push: 'M92,336 L92,384',
    pushLabel: { x: 100, y: 372 },
    never: 'M268,336 L268,384',
    neverX: { x: 268, y: 352 },
    neverLabel: { x: 278, y: 372 },
    ghRecord: { x: 30, y: 420, w: 148, h: 44 },
  };
}

export function lines(layout: Layout) {
  const g = geometry(layout);
  const n = layout === 'narrow';
  const d = new Diagram(T);
  const add = (s: string) => d.add(s);
  const H = g.host;

  add(`<rect class="bg" width="${g.W}" height="${g.H}" rx="10"/>`);
  add(`<text class="hd" x="${n ? 16 : 24}" y="${n ? 24 : 28}">ONE RUN OF ONE ADAPTER</text>`);
  add(`<rect class="hostbox" x="${H.x}" y="${H.y}" width="${H.w}" height="${H.h}" rx="10"/>`);
  d.rule('.hostbox{fill:none;stroke:var(--dg-rule);stroke-width:1.5;stroke-dasharray:6 4}');
  add(`<text class="hd" x="${g.hostLabel.x}" y="${g.hostLabel.y}">THIS HOST</text>`);

  // The adapter.
  const A = g.adapter;
  add(`<rect class="box" x="${A.x}" y="${A.y}" width="${A.w}" height="${A.h}" rx="6"/>`);
  add(`<text class="t b sm" x="${A.x + 12}" y="${A.y + 22}">eddy <tspan class="m xs" font-weight="400">· its wispr part</tspan></text>`);
  add(`<text class="m mono xxs" x="${A.x + 12}" y="${A.y + (n ? 40 : 42)}">millpond run eddy-wispr</text>`);
  const sx = n ? A.x + A.w - 12 : A.x + 12;
  const sy = n ? A.y + 22 : A.y + 86;
  const anchor = n ? ' text-anchor="end"' : '';
  add(`<text class="ac xxs ${d.show('as0', 0, 26)}" x="${sx}" y="${sy}"${anchor}>listing since its cursor…</text>`);
  add(`<text class="t xxs ${d.show('as1', 26, 96)}" x="${sx}" y="${sy}"${anchor}>done · 1 capture</text>`);
  if (!n) add(`<text class="m mono xxs" x="${A.x + 12}" y="${A.y + 58}">--raw-dir run-41/</text>`);

  if (!n) {
    // The run's state stays on the host too.
    add(`<path class="edge" d="M110,180 V222" stroke-width="1.5"/>`);
    add(`<text class="m xxs" x="118" y="206">a cursor line</text>`);
    add(`<rect class="box2" x="24" y="222" width="172" height="86" rx="6"/>`);
    add(`<text class="hd" x="36" y="240">RUN STATE · NOT IN GIT</text>`);
    add(`<text class="m xxs" x="36" y="260">cursor</text>`);
    add(`<text class="t mono xxs ${d.show('cur0', 0, 26)}" x="84" y="260">…16T09:00Z</text>`);
    add(`<text class="ac mono xxs ${d.show('cur1', 26, 96)}" x="84" y="260">…16T15:00Z</text>`);
    add(`<text class="m xxs" x="36" y="278">last run</text>`);
    add(`<text class="t xxs ${d.show('lr0', 0, 26)}" x="84" y="278">ok · 0 taken</text>`);
    add(`<text class="ac xxs ${d.show('lr1', 26, 96)}" x="84" y="278">ok · 1 taken</text>`);
    add(`<text class="m xxs" x="36" y="296">for millpond run, per part</text>`);
  }

  // The two outputs.
  add(`<path class="edge" d="${g.linePath}"/>`);
  add(`<path class="edge" d="${g.filePath}"/>`);
  add(`<text class="m xxs" x="${g.lineLabel.x}" y="${g.lineLabel.y}">${n ? 'a line' : 'a line, on stdout'}</text>`);
  add(`<text class="m xxs" x="${g.fileLabel.x}" y="${g.fileLabel.y}">${n ? 'a file' : 'a file, in --raw-dir'}</text>`);

  // The inbox and the raw bank.
  const I = g.inbox;
  add(`<rect class="box2" x="${I.x}" y="${I.y}" width="${I.w}" height="${I.h}" rx="8"/>`);
  add(`<text class="hd" x="${I.x + 12}" y="${I.y + 16}">${n ? 'THE INBOX · GIT' : 'THE INBOX · A GIT CHECKOUT'}</text>`);
  const B = g.bank;
  add(`<rect class="box2" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8"/>`);
  add(`<text class="hd" x="${B.x + 12}" y="${B.y + 16}">${n ? 'THE RAW BANK' : 'THE RAW BANK · NEVER IN GIT'}</text>`);
  if (n) add(`<text class="m xxs" x="${B.x + 12}" y="${B.y + 30}">never in git</text>`);

  // The line, in flight: small, one per event.
  const R = g.record;
  const chipW = n ? 132 : 150;
  d.route('line', [...g.lineRoute.slice(0, -1), { x: R.x + 4, y: R.y + 4 }], 6, 22, 28);
  add(
    `<g class="line"><rect class="chip" x="${R.x + 4}" y="${R.y + 4}" width="${chipW}" height="18" rx="4"/>` +
      `<text class="chipt mono xxs" x="${R.x + 10}" y="${R.y + 17}">{"capture":{"key":…</text></g>`,
  );

  // The file, in flight: the transcript, whole.
  const F = g.file;
  const doc = (x: number, y: number, w: number, h: number, cls: string) =>
    `<path class="${cls}" d="M${x},${y} h${w - 12} l12,12 v${h - 12} h-${w} z"/><path class="${cls}" d="M${x + w - 12},${y} v12 h12"/>` +
    [0, 1, 2, 3].map((k) => `<line class="docl" x1="${x + 7}" y1="${y + 20 + k * 8}" x2="${x + w - 7}" y2="${y + 20 + k * 8}"/>`).join('');
  d.rule('.docl{stroke:var(--dg-muted);stroke-width:1.5;opacity:.6} .docf{fill:var(--dg-panel);stroke:var(--dg-fg);stroke-width:1.25}');
  d.route('file', [...g.fileRoute.slice(0, -1), { x: F.x, y: F.y }], 8, 28, 96);
  add(`<g class="file">${doc(F.x, F.y, F.w, F.h, 'docf')}</g>`);
  add(
    `<g class="${d.show('flab', 29, 96)}"><text class="t mono xs" x="${F.x + F.w + 10}" y="${F.y + 18}">transcript.txt</text>` +
      `<text class="m xxs" x="${F.x + F.w + 10}" y="${F.y + 34}">2.4 MB, as served</text>` +
      (n ? '' : `<text class="m xxs" x="${F.x + F.w + 10}" y="${F.y + 48}">a reader reads it here</text>`) +
      '</g>',
  );

  // The capture, written field by field.
  add(`<rect class="${d.show('rec', 27, 96)} box2" x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="5"/>`);
  const fields: [string, string][] = n
    ? [
        ['key', 'meeting/wispr/7c1e04'],
        ['event_at', '2026-10-16 15:00Z'],
        ['raw', 'host-a:raw/7c1e04'],
      ]
    : [
        ['key', 'meeting/wispr/7c1e04'],
        ['event_at', '2026-10-16T15:00Z'],
        ['raw', 'host-a:raw/7c1e04/…'],
      ];
  fields.forEach(([k, v], i) => {
    const cls = d.show(`fld${i}`, 28 + i * 2, 96);
    if (n) {
      add(`<text class="m xxs ${cls}" x="${R.x + 8}" y="${R.y + 16 + i * 30}">${k}</text>`);
      add(`<text class="${i === 2 ? 'ac' : 't'} mono xxs ${cls}" x="${R.x + 8}" y="${R.y + 29 + i * 30}">${v}</text>`);
    } else {
      add(`<text class="m mono xxs ${cls}" x="${R.x + 10}" y="${R.y + 18 + i * 18}">${k}</text>`);
      add(`<text class="${i === 2 ? 'ac' : 't'} mono xxs ${cls}" x="${R.x + 70}" y="${R.y + 18 + i * 18}">${v}</text>`);
    }
  });

  // The pointer from the capture to the banked file.
  d.kf('ptr', [
    [0, 'stroke-dashoffset:120;opacity:0'],
    [33.5, 'stroke-dashoffset:120;opacity:0'],
    [34, 'stroke-dashoffset:120;opacity:1'],
    [38, 'stroke-dashoffset:0;opacity:1'],
    [96, 'stroke-dashoffset:0;opacity:1'],
    [96.8, 'stroke-dashoffset:0;opacity:0'],
    [100, 'stroke-dashoffset:120;opacity:0'],
  ]);
  add(`<path class="ptrline ${d.anim('ptr')}" d="${g.pointer}"/>`);
  d.rule('.ptrline{fill:none;stroke:var(--dg-accent);stroke-width:1.5;stroke-dasharray:120}');
  add(`<text class="ac xxs ${d.show('ptrl', 38, 96)}" x="${g.pointerLabel.x}" y="${g.pointerLabel.y}">the pointer</text>`);

  // The inbox's log: one commit for the capture.
  const L = g.log;
  add(`<line class="edge" x1="${L.x}" y1="${L.y}" x2="${L.x + 46}" y2="${L.y}" stroke-width="1.5"/>`);
  add(`<circle class="dot" cx="${L.x + 6}" cy="${L.y}" r="4"/><circle class="dot" cx="${L.x + 26}" cy="${L.y}" r="4"/>`);
  add(`<circle class="commit ${d.show('cm', 40, 96)}" cx="${L.x + 46}" cy="${L.y}" r="5.5"/>`);
  d.rule('.commit{fill:var(--dg-accent)}');
  add(`<text class="ac xxs ${d.show('cml', 41, 96)}" x="${L.x + 58}" y="${L.y + 4}">${n ? 'a commit' : 'capture meeting/wispr/7c1e04'}</text>`);

  // GitHub, off the host.
  const G = g.gh;
  add(`<rect class="box2" x="${G.x}" y="${G.y}" width="${G.w}" height="${G.h}" rx="8"/>`);
  add(`<text class="hd" x="${G.x + 12}" y="${G.y + 16}">GITHUB</text>`);
  add(`<text class="m xxs" x="${G.x + 12}" y="${G.y + 32}">${n ? 'the inbox’s remote' : 'the remote'}</text>`);
  add(`<path class="edge" d="${g.push}" stroke-width="1.5"/>`);
  add(`<text class="m xxs" x="${g.pushLabel.x}" y="${g.pushLabel.y}"${n ? '' : ' text-anchor="middle"'}>push</text>`);
  // The commit travels across the host's edge.
  const pushFrom = { x: L.x + 46, y: L.y };
  const GR = g.ghRecord;
  d.fly('pk', pushFrom.x - (GR.x + 4), pushFrom.y - (GR.y + 4), 50, 51, 60, 61);
  add(`<circle class="commit pk" cx="${GR.x + 4}" cy="${GR.y + 4}" r="5.5"/>`);
  add(`<g class="${d.show('ghr', 60, 96)}"><rect class="accbox" x="${GR.x}" y="${GR.y}" width="${GR.w}" height="${GR.h}" rx="5"/>`);
  add(`<text class="t mono xxs" x="${GR.x + 8}" y="${GR.y + 17}">${n ? 'meeting/wispr/7c1e04' : 'the capture'}</text>`);
  add(`<text class="m xxs" x="${GR.x + 8}" y="${GR.y + 32}">0.6 KB, its pointer</text></g>`);
  // The transcript never crosses.
  add(`<path class="nev ${d.show('nev', 50, 96, 0.25)}" d="${g.never}"/>`);
  d.rule('.nev{fill:none;stroke:var(--dg-bad);stroke-width:1.5;stroke-dasharray:3 3}');
  const X = g.neverX;
  add(
    `<g class="${d.show('nevx', 52, 96, 0.25)}"><circle cx="${X.x}" cy="${X.y}" r="8" class="nevc"/>` +
      `<path class="nevp" d="M${X.x - 3.5},${X.y - 3.5} l7,7 M${X.x + 3.5},${X.y - 3.5} l-7,7"/></g>`,
  );
  d.rule('.nevc{fill:var(--dg-bg);stroke:var(--dg-bad);stroke-width:1.5} .nevp{stroke:var(--dg-bad);stroke-width:1.75;stroke-linecap:round}');
  add(`<text class="bad xxs ${d.show('nevl', 52, 96, 0.25)}" x="${g.neverLabel.x}" y="${g.neverLabel.y}"${n ? '' : ' text-anchor="middle"'}>${n ? 'never pushed' : 'never pushed'}</text>`);
  if (!n) {
    add(`<text class="m xxs ${d.show('ghn', 62, 96)}" x="${G.x + 12}" y="${G.y + 124}">the meeting’s words</text>`);
    add(`<text class="m xxs ${d.show('ghn2', 62, 96)}" x="${G.x + 12}" y="${G.y + 138}">never reach GitHub</text>`);
  } else {
    add(`<text class="m xxs ${d.show('ghn', 62, 96)}" x="${G.x + G.w - 12}" y="${G.y + 56}" text-anchor="end">the meeting’s words</text>`);
    add(`<text class="m xxs ${d.show('ghn2', 62, 96)}" x="${G.x + G.w - 12}" y="${G.y + 70}" text-anchor="end">never reach GitHub</text>`);
  }

  return d.render({
    id: n ? 'ln' : 'lw',
    width: g.W,
    height: g.H,
    title: 'Lines go into git, raw files stay on the host',
    desc:
      'One run of eddy’s wispr part prints one capture line on standard output and writes the meeting’s transcript, 2.4 MB, into its raw directory. ' +
      'millpond banks the transcript in the raw bank on this host, writes the capture into the inbox’s git checkout with a pointer of the form host:path, ' +
      'and commits it. The push carries the commit, 0.6 KB, to GitHub. The transcript is never pushed, so the meeting’s words never reach GitHub.',
    still: 92,
  });
}
