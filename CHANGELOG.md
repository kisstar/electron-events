# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-alpha.0](https://github.com/kisstar/electron-events/compare/v0.3.2...v1.0.0-alpha.0) (2024-11-03)


### Features

* **core:** adjust the export and repair once methods ([382321d](https://github.com/kisstar/electron-events/commit/382321da93e3fdbf4d97f3b178265c52d4658598))
* **core:** separate dependencies on IPC modules ([573f03f](https://github.com/kisstar/electron-events/commit/573f03f3db794053caed977988fb72e7016427bd))

### [0.3.2](https://github.com/kisstar/electron-events/compare/v0.3.1...v0.3.2) (2024-01-16)


### Bug Fixes

* error in cjs mode ([#6](https://github.com/kisstar/electron-events/issues/6)) ([12e71eb](https://github.com/kisstar/electron-events/commit/12e71eb1d3c1586ac66f2bfe811e0191db1a43c3))

### [0.3.1](https://github.com/kisstar/electron-events/compare/v0.3.0...v0.3.1) (2023-12-18)


### Bug Fixes

* **core:** global type declaration missing ([#4](https://github.com/kisstar/electron-events/issues/4)) ([0ad4d85](https://github.com/kisstar/electron-events/commit/0ad4d85fa91f6a7ffb9c6f5241f2232b07903f18))

## [0.3.0](https://github.com/kisstar/electron-events/compare/v0.2.0...v0.3.0) (2023-12-04)


### Features

* **core:** support providing types for data and event handlers ([#2](https://github.com/kisstar/electron-events/issues/2)) ([fa94650](https://github.com/kisstar/electron-events/commit/fa94650dabf64cbddabb1205996223311d01903a))

## [0.2.0](https://github.com/kisstar/electron-events/compare/v0.1.1...v0.2.0) (2023-07-09)


### Features

* **core:** wildcard contains sender ([d7b660d](https://github.com/kisstar/electron-events/commit/d7b660dcbb4b2f92edc47cb0fb683213c58c4228))

## 0.1.1 (2023-04-16)


### Features

* **core,docs:** determine the return value structure based on parameters ([39e6c42](https://github.com/kisstar/electron-events/commit/39e6c42ac55434a57adf3677364220cfd70b7b39))
* **core:** both main and renderer support responsive mode ([df18798](https://github.com/kisstar/electron-events/commit/df187988ba3fd0d7c98ae7c1939fcb0a5ce0673d))
* **core:** main process event module hosts window operations ([c1ae494](https://github.com/kisstar/electron-events/commit/c1ae4940069047c5a53737f510a5efa028f0cecf))
* **core:** rendererEvents support transfer to the rendering process ([84545ad](https://github.com/kisstar/electron-events/commit/84545ad0f631c47d2f244ef6e2c6ac193369b299))
* **core:** support event broadcast ([503b26e](https://github.com/kisstar/electron-events/commit/503b26efe618be6f2a9ee9a974c9641dbd7bf941))
* **core:** support listening and triggering events from all sources ([2d5ef99](https://github.com/kisstar/electron-events/commit/2d5ef99d6840462d6d1ac13ee5a68ac06e482ecd))
* **core:** support responsive events ([00e3dbf](https://github.com/kisstar/electron-events/commit/00e3dbfe9280aa56f408ca909ef6ea3cf0ac156a))
* **core:** wildcards do not match themselves ([68a5235](https://github.com/kisstar/electron-events/commit/68a52350f8b0b1c902c0da481ee38f02c0bdc727))
* **demo:** add a development case for broadcast events ([7064dbe](https://github.com/kisstar/electron-events/commit/7064dbecfeeebdcc9ee2a50c8262879ae3d04aec))
* **demo:** cases of supplementary development test ([ab203bf](https://github.com/kisstar/electron-events/commit/ab203bf676f91f12fd358338f2891438f1c71828))
* **demo:** create a hello world program ([c7c9d64](https://github.com/kisstar/electron-events/commit/c7c9d64d94038e14c23c78ee1f6b3e13c109aa2d))
* **demo:** create several windows for testing ([2ada4fe](https://github.com/kisstar/electron-events/commit/2ada4feae14d8933bc5fa068266d7e4bdd13dc4a))


### Bug Fixes

* **core:** cannot trigger its own event ([34cd33f](https://github.com/kisstar/electron-events/commit/34cd33ffffab98fb07aa3bd10737231e35acd3c0))
* **core:** import event module exception ([ae141ad](https://github.com/kisstar/electron-events/commit/ae141ad1ddf4fd6eaee7beeb077ddb2e38c03979))
* **core:** response event causes the page to appear white ([a5e2a37](https://github.com/kisstar/electron-events/commit/a5e2a377470d6d6e65abf25593ba3087793c7ef0))
