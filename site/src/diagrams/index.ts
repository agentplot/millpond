// Every diagram the site draws, by name, each a function of its layout.
import type { Layout } from './kit';
import { hero } from './hero';
import { lines } from './lines';
import { steps } from './steps';
import { backlog } from './backlog';
import { send } from './send';

export const diagrams: Record<string, (layout: Layout) => string> = {
  hero,
  lines,
  steps,
  backlog,
  send,
};
