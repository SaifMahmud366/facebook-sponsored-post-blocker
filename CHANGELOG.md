# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-09-17

### Changed
- Rewrote sponsored-post detection to match Facebook's current markup
- Now targets the `/ads/about` link, present only on sponsored posts
- Switched to `@run-at document-start` to catch the initial feed render
- Replaced reset-on-every-mutation debounce with a coalescing 200ms debounce

### Added
- `dataset.adBlocked` guard so hidden posts are skipped on later scans
- Support for `web.facebook.com`

### Removed
- Messenger support (current selector does not apply to Messenger's DOM)
- Pinned commit hash from download/update URLs

## [1.0.0] - 2025-05-21

### Added
- Initial release
- Hides sponsored posts on Facebook and Messenger
- MutationObserver with debouncing
