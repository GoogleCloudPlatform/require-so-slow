
# require-so-slow

* Wondering why your applications is slow to start?
* `require` seems to take an eternity?
* Wonder no more!

This module produces a timeline of your `require`s and produces an output
that you can load in the Chrome Trace Viewer.

```js
const requireSoSlow = require('require-so-slow');

// load stuff, run stuff.
require('request');

// Write a trace file at some point.
requireSoSlow.write('require-trace.trace');
```

You can open the trace file in [chrome://tracing](chrome://tracing) in Chrome.

![Trace Viewer](doc/trace.png?raw=true)

This projects uses the perf_trace.ts file from the https://github.com/bazelbuild/rules_typescript project to generate the chrome trace file. Going forward, Node 10+ will have an in-built mechanism to generate trace events from `perf_hooks`. Once that is readily available, this project can switch to that mechanism.