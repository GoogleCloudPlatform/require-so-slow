#!/usr/bin/env node

import {execSync} from 'child_process';
import * as path from 'path';
import * as shim from './shim';

// Parameters can be provided in the forms of:
// $ rss googleapis
// $ rss googleapis@20
// $ rss googleapis@28.1.0
// $ rss googleapis output.trace

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(`USAGE: rss some-npm-module [output]`);
  process.exit();
}

const mod = args[0];
const [modName, modVer] = mod.split('@');
const outputPath = args.length > 1 ? args[1] : `${mod}.trace`;
const relativePath = path.relative(process.cwd(), outputPath);

execSync(`npm install --no-save ${mod}`, {stdio: 'inherit'});

shim.createShim();
require(modName);
shim.write(outputPath);

console.info(`✨ Trace data written to \`${relativePath}\` ✨`);
