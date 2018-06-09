
const MODULE = require('module');
const ORIG_LOAD = MODULE._load;

import test from 'tape';
import * as shim from '../src/shim';
import * as perfTrace from '../src/perf-trace';

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
  const matchingEvents =
      filterRequireEvent(perfTrace.getAndClearEvents(), path);
  t.equal(matchingEvents.length, 1);
  const event = matchingEvents[0];
  t.true(event.ts >= t0);
  t.true(event.ts <= t1);
  t.true(event.dur && event.dur <= (t1 - t0));
  t.end();
});

test('trace recording should be accurate', t => {
  const path = './fixtures/modB';
  const t0 = perfTrace.now();
  require(path);
  const t1 = perfTrace.now();
  const matchingEvents =
      filterRequireEvent(perfTrace.getAndClearEvents(), path);
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

test.skip('record a trace for a module that throws', t => {});

test.skip('record a trace for a non-existent module', t => {});
