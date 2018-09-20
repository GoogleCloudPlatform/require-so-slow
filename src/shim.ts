import * as perfTrace from './perf-trace';
const MODULE = require('module');

const REQUIRE_SO_SLOW = Symbol('require-so-slow-monkey-patch');

export function createShim() {
  const orig = MODULE._load;
  if (orig[REQUIRE_SO_SLOW]) {
    return;
  }
  MODULE._load = function(request: string, parent: {}, isMain: boolean) {
    const args = arguments;
    let exports;
    perfTrace.wrap(`require ${request}`, () => {
      exports = orig.apply(this, args);
    });
    return exports;
  };
  MODULE._load[REQUIRE_SO_SLOW] = true;
}

export function write(path: string) {
  perfTrace.write(path);
}

export function getAndClearEvents(): perfTrace.Event[] {
  return perfTrace.getAndClearEvents();
}
