const MODULE = require('module');
const ORIG_LOAD = MODULE._load;

import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { resolve } from 'path';
import * as test from 'tape';
import * as perfTrace from '../src/perf-trace';
import * as shim from '../src/shim';

function filterRequireEvent(events: perfTrace.Event[], path: string) {
  return events.filter(event => event.name === `require ${path}`);
}

test('No monkey patching before createShim is called', t => {
  t.equal(MODULE._load, ORIG_LOAD);
  t.end();
});

let instrumentedLoad: typeof MODULE._load;

test('createShim should monkey patch', t => {
  shim.createShim();
  t.notEqual(MODULE._load, ORIG_LOAD);
  instrumentedLoad = MODULE._load;
  t.end();
});

test('subsequent calls to createShim do not add additional monkey wraps', t => {
  shim.createShim();
  t.equal(MODULE._load, instrumentedLoad);
  shim.createShim();
  t.equal(MODULE._load, instrumentedLoad);
  t.end();
});

test('trace recording should have appropriate events', t => {
  const path = './fixtures/modA';
  const t0 = perfTrace.now();
  require(path);
  const t1 = perfTrace.now();
  const matchingEvents = filterRequireEvent(
    perfTrace.getAndClearEvents(),
    path
  );
  t.equal(matchingEvents.length, 1);
  const event = matchingEvents[0];
  t.true(event.ts >= t0);
  t.true(event.ts <= t1);
  t.true(event.dur && event.dur <= t1 - t0);
  t.end();
});

test('trace recording should be accurate', t => {
  const path = './fixtures/modB';
  const t0 = perfTrace.now();
  require(path);
  const t1 = perfTrace.now();
  const matchingEvents = filterRequireEvent(
    perfTrace.getAndClearEvents(),
    path
  );
  t.equal(matchingEvents.length, 1);
  const event = matchingEvents[0];
  t.true(event.dur && event.dur >= 2000);
  t.end();
});

test('modules already in cached do not show up in trace', t => {
  require('./fixtures/modC');
  const events = perfTrace.getAndClearEvents();
  t.equal(events.length, 1);
  t.end();
});

test('preload traces the entire main execution and writes it to a file', t => {
  const script = './build/test/fixtures/modA.js';
  const tracePath = `${tmpdir()}/require-so-slow.trace`;
  const command = `TRACE_OUTFILE=${tracePath} node -r ./build/src/index.js ${script}`;
  execSync(command);
  t.true(existsSync(tracePath));
  const events: Array<{ name: string }> = JSON.parse(
    readFileSync(tracePath, 'utf8')
  );
  unlinkSync(tracePath);
  // Can't test that 'require /.../index.js' is the first event because nyc
  // hacks things into the node subprocess
  t.assert(events.find(e => e.name === `require ${resolve(script)}`));
  t.end();
});

test.skip('record a trace for a module that throws', t => {});

test.skip('record a trace for a non-existent module', t => {});
