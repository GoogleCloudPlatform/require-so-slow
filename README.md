
# require-so-slow

* Wondering why your applications is slow to start?
* `require` seems to take an eternity?
* Wonder no more!

This module produces a timeline of your `require`s and produces an output
that you can load in the Chrome [Timeline Viewer][].

[![Trace Viewer](doc/trace.png)](https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=https://storage.googleapis.com/devtools-trace-public-bucket/painstaking-economic-purple-impolite-deadpan-Wolverine)

Click on the image above to go see an interactive version.

## Command Line Usage

```shell
# Profiles the timeline of requiring `request@latest` and generates a trace
# output file you can load in Chrome Timeline viewer [1]
$ npx require-so-slow request

# You can specify specific versions or dist-tags.
$ npx require-so-slow got@9.0.0
$ npx require-so-slow got@rc

# You can specify what output filename to use:
$ npm require-so-slow -o lodash.trace.json lodash
```


## API

```js
const requireSoSlow = require('require-so-slow');

// load stuff, run stuff.
require('request');

// Write a trace file at some point.
requireSoSlow.write('require-trace.trace');
```

[Timeline Viewer]: https://chromedevtools.github.io/timeline-viewer/
