#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import * as shim from './shim';
import * as npa from 'npm-package-arg';
import * as up from 'update-notifier';
import * as meow from 'meow';
import fetch from 'node-fetch';
import * as tmp from 'tmp';

const MODULE = require('module');

const pkg = require('../../package.json');
up({ pkg }).notify();

const cli = meow(
  `
Usage:
  $ rss [flags] <module name or specifier>

Flags:
  -u, --upload             Upload the trace to a public trace hosting service.
  -o, --output <filename>  Write output to the specified file name.

Examples:
  $ rss googleapis
  $ rss googleapis@20
  $ rss googleapis@28.1.0
  $ rss -o file.trace googleapis
  $ rss --upload request
`,
  {
    autoHelp: true,
    autoVersion: true,
    flags: {
      upload: { type: 'boolean', alias: 'u' },
      output: { type: 'string', alias: 'o' },
    },
  }
);

if (cli.input.length !== 1) {
  cli.showHelp(1);
} else if (cli.flags.upload && cli.flags.output) {
  console.error(
    'Error: Only one of --upload/-u or --output/-o can be specified.'
  );
  cli.showHelp(2);
}

function requireFromDirectory(request: string, directory: string) {
  const fakeParent = { paths: [path.join(directory, 'node_modules')] };
  return MODULE._load(request, fakeParent, false);
}

function runInTmpDirectory(keep: boolean, fn: Function) {
  const dir = tmp.dirSync({ keep, unsafeCleanup: true });

  const origDir = process.cwd();
  process.chdir(dir.name);

  const result = fn(dir.name);

  process.chdir(origDir);
  if (!keep) {
    dir.removeCallback();
  }
  return result;
}

async function main() {
  const mod = cli.input[0];
  const parsed = npa(mod);

  // TODO: add flag to allow users to run in local directory.
  // TODO: add flag to keep the temp directory.
  runInTmpDirectory(false, () => {
    execSync(`npm init -y`);
    execSync(`npm install --no-save ${mod}`, { stdio: 'inherit' });

    shim.createShim();

    // Cannot use `require` here as it would consider *this file* to be the
    // parent and resolve relative to here.
    requireFromDirectory(parsed.name!, process.cwd());
  });

  if (cli.flags.upload) {
    if (!process.env.TRACE_SERVICE) {
      throw new Error(
        'Env. var. TRACE_SERVICE needs to be defined for upload to work.'
      );
    }
    // TODO: give warning to the user about the public upload.
    const events = shim.getAndClearEvents();
    const result = await fetch(process.env.TRACE_SERVICE, {
      method: 'POST',
      body: JSON.stringify(events),
      headers: { 'Content-Type': 'application/json' },
    });
    const json: { view: string } = await result.json();
    console.info(`✨ Trace data uploaded. View at ${json.view}.`);
    // TODO: xdg-open the url.
  } else {
    const outputPath = cli.flags.output
      ? cli.flags.output
      : `${parsed.escapedName}.trace`;
    const relativePath = path.relative(process.cwd(), outputPath);
    shim.write(outputPath);
    console.info(`✨ Trace data written to \`${relativePath}\` ✨`);
    console.info(
      `To view, drop file in: https://chromedevtools.github.io/timeline-viewer/`
    );
  }
}

main();
