
import * as perfTrace from './perf-trace';
const MODULE = require('module');

const orig = MODULE._load;
MODULE._load = function(request: string, parent: {}, isMain: boolean) {
  const args = arguments;
  let exports;
  perfTrace.wrap(`require ${request}`, () => {
    exports = orig.apply(this, args);
  });
  return exports;
};

export function write(path: string) {
  perfTrace.write(path);
}
