## v1.0.0-rc

- Updated to support changes in NativeScript 2.5 and 3.0; LiveSync should work as expected in 2.5+
- Refactored to execute node sass in separate process (via @PeterStaev #22)
- Added support for .sass files (in addition to .scss)
- BREAKING CHANGE: Imports now require relative paths, such as `@import ../../variables` (previous versions always assumed path relative to app root)
- NOTE: LiveSync in versions 2.4 and lower now triggers full app refresh (Recommended to use version 0.4.)
- Demo updated to use latest version and test .sass files + relative import paths

## v0.4.1

- Updated after-prepare step to remove node-sass directory from compiled app packages (https://github.com/toddanglin/nativescript-dev-sass/issues/3)

## v0.4.0

- Added demo project to Git repo
- Merged PR to fix support for empty SCSS files (https://github.com/toddanglin/nativescript-dev-sass/pull/12)
- Merged PR to improve handling of imports under symlink (https://github.com/toddanglin/nativescript-dev-sass/pull/13)
- Merged PR to clean-up/remove SCSS files from generated platform packages (https://github.com/toddanglin/nativescript-dev-sass/pull/9)

## v0.3.0

- Merged PR to support importing SCSS from node_modules (https://github.com/toddanglin/nativescript-dev-sass/pull/7)

## v0.2.0

- Improved support for importing SCSS partials (https://github.com/toddanglin/nativescript-dev-sass/pull/5)

## v0.1.0

- Initial release