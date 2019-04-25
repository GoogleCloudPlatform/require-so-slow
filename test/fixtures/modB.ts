import { now } from '../../src/perf-trace';

// Take a long time.
const DELAY = 2000;
const endMicroseconds = now() + DELAY;
while (now() <= endMicroseconds) {
  /* spin */
}

export const name = 'modB';
