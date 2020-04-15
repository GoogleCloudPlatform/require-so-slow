import {resolve} from 'path';
import * as shim from './shim';

export function write(path: string) {
  shim.write(path);
}

shim.createShim();

if (module.parent && module.parent.id === 'internal/preload') {
  const tracefile = resolve(
    process.env['TRACE_OUTFILE'] || 'require-so-slow.trace'
  );
  process.on('exit', () => {
    write(tracefile);
  });
}
