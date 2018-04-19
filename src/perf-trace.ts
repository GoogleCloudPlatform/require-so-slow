/**
 * @license
 * Copyright 2017 The Bazel Authors. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * perf_trace records traces in the Chrome Trace format (which is actually used
 * for more than just Chrome).  See:
 * https://github.com/catapult-project/catapult/blob/master/tracing/README.md
 */

import * as fs from 'fs';

export type Microseconds = number;

/** @return a high-res timestamp of the current time. */
export function now(): Microseconds {
  const [sec, nsec] = process.hrtime();
  return (sec * 1e6) + (nsec / 1e3);
}

/**
 * The type of entries in the Chrome Trace format:
 * https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit
 * Field names are chosen to match the JSON format.
 */
export interface Event {
  name: string;
  ph: 'B'|'E'|'X'|'C';
  pid: number;  // Required field in the trace viewer, but we don't use it.
  ts: Microseconds;
  dur?: Microseconds;
  args?: {};
}

let events: Event[] = [];

/** wrap wraps enter()/leave() calls around a block of code. */
export function wrap<T>(name: string, f: () => T): T {
  const start = now();
  try {
    return f();
  } finally {
    const end = now();
    events.push({name, ph: 'X', pid: 1, ts: start, dur: (end - start)});
  }
}

/**
 * counter records a snapshot of counts.  The counter name identifies a
 * single graph, while the counts object provides data for each count
 * of a line on the stacked bar graph.
 */
export function counter(name: string, counts: {[name: string]: number}) {
  events.push({name, ph: 'C', pid: 1, ts: now(), args: counts});
}

/** write writes the trace in Chrome Trace format to a given path. */
export function write(path: string) {
  fs.writeFileSync(path, JSON.stringify(events), {encoding: 'utf8'});
}

/** returns and clears the event buffer. */
export function getAndClearEvents(): Event[] {
  const buffer = events;
  events = [];
  return buffer;
}

/** Record the current heap usage to the performance trace. */
export function snapshotMemoryUsage() {
  const snapshot = process.memoryUsage();
  // The counter displays as a stacked bar graph, so compute metrics
  // that sum to the appropriate total.
  const unused = snapshot.heapTotal - snapshot.heapUsed;
  counter('memory', {'used': snapshot.heapUsed, 'unused': unused});
}