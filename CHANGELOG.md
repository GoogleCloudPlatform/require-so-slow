# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/require-so-slow?activeTab=versions

## [2.0.0](https://www.github.com/ofrobots/require-so-slow/compare/v1.2.0...v2.0.0) (2019-05-31)


### ⚠ BREAKING CHANGES

* Node.js is reaching EOL. Stop supporting it.
* The CLI format has changed.

* `--upload` will now upload traces to a public tracing service.
* Refactor the options parsing code a little bit.

### Bug Fixes

* **deps:** update dependency update-notifier to v3 ([#42](https://www.github.com/ofrobots/require-so-slow/issues/42)) ([c01d916](https://www.github.com/ofrobots/require-so-slow/commit/c01d916))
* audit fix ([#38](https://www.github.com/ofrobots/require-so-slow/issues/38)) ([10c53e7](https://www.github.com/ofrobots/require-so-slow/commit/10c53e7))
* **deps:** update dependency tmp to v0.1.0 ([#35](https://www.github.com/ofrobots/require-so-slow/issues/35)) ([0f2dcee](https://www.github.com/ofrobots/require-so-slow/commit/0f2dcee))
* include node-fetch as a dependency ([#23](https://www.github.com/ofrobots/require-so-slow/issues/23)) ([13d68f9](https://www.github.com/ofrobots/require-so-slow/commit/13d68f9))
* require relative to working dir ([#20](https://www.github.com/ofrobots/require-so-slow/issues/20)) ([aacde1f](https://www.github.com/ofrobots/require-so-slow/commit/aacde1f))
* upgrade all dependencies ([#16](https://www.github.com/ofrobots/require-so-slow/issues/16)) ([acd23a2](https://www.github.com/ofrobots/require-so-slow/commit/acd23a2))


### Build System

* drop support for Node 6 ([#41](https://www.github.com/ofrobots/require-so-slow/issues/41)) ([56c271c](https://www.github.com/ofrobots/require-so-slow/commit/56c271c))


### Features

* ability to upload traces ([#19](https://www.github.com/ofrobots/require-so-slow/issues/19)) ([4f0591e](https://www.github.com/ofrobots/require-so-slow/commit/4f0591e))
* add update-notifier ([#13](https://www.github.com/ofrobots/require-so-slow/issues/13)) ([bcd2aaf](https://www.github.com/ofrobots/require-so-slow/commit/bcd2aaf))
* npx support. ([#17](https://www.github.com/ofrobots/require-so-slow/issues/17)) ([b58d0b6](https://www.github.com/ofrobots/require-so-slow/commit/b58d0b6))
* provide a cli ([#2](https://www.github.com/ofrobots/require-so-slow/issues/2)) ([4b34bc6](https://www.github.com/ofrobots/require-so-slow/commit/4b34bc6))
* sandbox run into a tmp directory ([#21](https://www.github.com/ofrobots/require-so-slow/issues/21)) ([b1d027f](https://www.github.com/ofrobots/require-so-slow/commit/b1d027f))
