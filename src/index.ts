import * as shim from './shim';

export function write(path: string) {
  shim.write(path);
}

shim.createShim();
