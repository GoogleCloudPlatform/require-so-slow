import * as shim from './shim';

export function write(path: string) {
  shim.write(path);
}

shim.createShim();

if (module.parent && module.parent.id === 'internal/preload') {
  process.on('exit', () => {
    write('require-so-slow.trace');
  });
}
