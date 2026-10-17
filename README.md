# millpond

**Designed, not built.** The design is settled in
[agentplot/blueprints](https://github.com/agentplot/blueprints); no code
exists yet.

millpond is the inbox for events that should change a repository's work:
a release of something it depends on, a decision in a meeting, a file
someone sends. Adapters report what happened, and millpond lands each
event once and keeps the raw material off git. A Claude session proposes
what to do with each signal, and one item of work goes to one worktree,
where [sluice](https://github.com/agentplot/sluice) lands it.

<p align="center"><img src="docs/diagrams/millpond.svg" alt="Three adapters print captures; millpond lands each once by key and banks the raw files off git; a curation batch joins three signals into an item; the item goes to one worktree and sluice lands it." width="900"></p>

- **The site:** https://agentplot.github.io/millpond
- **The design book:** https://agentplot.github.io/blueprints/millpond/
- **The statement**, millpond's invariants as numbered clauses, comes
  next, as `design/millpond/requirements.md` in agentplot/blueprints.

## What it does

- **Lands each event once.** An adapter keys every event it reports, and
  millpond takes a key once, from any host and any run.
- **Keeps raw material off git.** The inbox is a git repository of small
  records; a transcript or a full set of release notes stays on the host
  behind a pointer.
- **Works a backlog in batches.** A Claude session proposes one move for
  each of fifty signals through millpond's MCP tools; you change the rows
  you disagree with, and one commit writes the batch.
- **Sends one item to one worktree.** Curation joins signals into items.
  millpond starts an agent on an item's brief and records sluice's
  landing against the item. An item that asks a question goes to a
  sounding, and the conclusion you accept becomes the item's record.

millpond is one of a family. headwater reports releases, eddy lists
meetings, sounding works one question to a conclusion and sluice lands
changes. crew runs teams and calls millpond as
it calls sluice, and Flywheel is built later on the same crates and reads
the same inboxes.

## This repository

| path | what |
|---|---|
| `site/` | the site, Astro with Starlight; its diagrams are drawn at build time (`site/README.md`) |
| `docs/diagrams/` | the README's diagram, generated from the site's |
| `devenv.nix` | the shell: moon through proto, Vale, bun, and Playwright with its Chromium |
| `.config/kit.toml` | the kit standard's profile this repository follows |

```sh
devenv shell -- site-build   # the site, through moon
devenv shell -- prose        # the prose, through Vale
```

## License

MIT
